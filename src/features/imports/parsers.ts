import { normalizeText } from '@/features/imports/helpers';

type ParsedFile = {
  headers: string[];
  rows: Array<Record<string, string | null>>;
  sheetName?: string;
  warning?: string;
};

function parseCsv(text: string): ParsedFile {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter((line) => line.trim().length > 0);
  if (!lines.length) {
    throw new Error('Fichier CSV vide.');
  }

  const parseLine = (line: string) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ';' && !inQuotes) {
        values.push(current);
        current = '';
      } else if (char === ',' && !inQuotes && !line.includes(';')) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values.map((v) => v.trim());
  };

  const headers = parseLine(lines[0]).map((header, index) => normalizeText(header) || `column_${index + 1}`);

  const rows = lines.slice(1).map((line) => {
    const values = parseLine(line);
    return headers.reduce<Record<string, string | null>>((acc, header, index) => {
      acc[header] = values[index] ? values[index] : null;
      return acc;
    }, {});
  });

  return { headers, rows };
}

function getUint16(data: Uint8Array, offset: number) {
  return data[offset] | (data[offset + 1] << 8);
}

function getUint32(data: Uint8Array, offset: number) {
  return data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24);
}

async function inflateRaw(data: Uint8Array) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Support XLSX indisponible dans cet environnement.');
  }

  const ds = new DecompressionStream('deflate-raw');
  const buffer = new Uint8Array(data.byteLength);
  buffer.set(data);
  const response = new Response(buffer.buffer);
  if (!response.body) {
    throw new Error('Flux XLSX indisponible.');
  }

  const stream = response.body.pipeThrough(ds);
  const decompressed = await new Response(stream).arrayBuffer();
  return new Uint8Array(decompressed);
}

async function readZipEntries(arrayBuffer: ArrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let eocdOffset = -1;

  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i -= 1) {
    if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Archive XLSX invalide (EOCD introuvable).');
  }

  const centralDirectoryOffset = getUint32(bytes, eocdOffset + 16);
  const totalEntries = getUint16(bytes, eocdOffset + 10);
  const entries = new Map<string, { method: number; compressedSize: number; localHeaderOffset: number }>();

  let offset = centralDirectoryOffset;
  for (let i = 0; i < totalEntries; i += 1) {
    if (!(bytes[offset] === 0x50 && bytes[offset + 1] === 0x4b && bytes[offset + 2] === 0x01 && bytes[offset + 3] === 0x02)) {
      break;
    }

    const method = getUint16(bytes, offset + 10);
    const compressedSize = getUint32(bytes, offset + 20);
    const fileNameLength = getUint16(bytes, offset + 28);
    const extraLength = getUint16(bytes, offset + 30);
    const commentLength = getUint16(bytes, offset + 32);
    const localHeaderOffset = getUint32(bytes, offset + 42);

    const fileName = new TextDecoder().decode(bytes.slice(offset + 46, offset + 46 + fileNameLength));
    entries.set(fileName, { method, compressedSize, localHeaderOffset });

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  const readEntry = async (name: string) => {
    const entry = entries.get(name);
    if (!entry) return null;

    const headerOffset = entry.localHeaderOffset;
    const fileNameLength = getUint16(bytes, headerOffset + 26);
    const extraLength = getUint16(bytes, headerOffset + 28);
    const dataStart = headerOffset + 30 + fileNameLength + extraLength;
    const compressed = bytes.slice(dataStart, dataStart + entry.compressedSize);

    if (entry.method === 0) return compressed;
    if (entry.method === 8) return inflateRaw(compressed);

    throw new Error(`Méthode de compression XLSX non supportée: ${entry.method}`);
  };

  return { readEntry };
}

function getCellValue(cellRef: string, rowIndex: number) {
  const match = cellRef.match(/^([A-Z]+)/);
  if (!match) return `col_${rowIndex}`;
  return match[1];
}

function columnLettersToIndex(columnLetters: string) {
  return columnLetters.split('').reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0) - 1;
}

function parseSheetXml(sheetXml: string, sharedStrings: string[]) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(sheetXml, 'application/xml');

  const rowNodes = Array.from(doc.querySelectorAll('sheetData > row'));
  const matrix: string[][] = rowNodes.map((rowNode) => {
    const cells = Array.from(rowNode.querySelectorAll('c'));
    const rowValues: string[] = [];

    cells.forEach((cell) => {
      const ref = cell.getAttribute('r') ?? 'A1';
      const colIndex = columnLettersToIndex(getCellValue(ref, 0));
      const t = cell.getAttribute('t');
      const raw = cell.querySelector('v')?.textContent ?? '';

      let value = raw;
      if (t === 's') {
        value = sharedStrings[Number(raw)] ?? '';
      }
      rowValues[colIndex] = value;
    });

    return rowValues;
  });

  const headers = (matrix[0] ?? []).map((header, index) => normalizeText(header) || `column_${index + 1}`);
  const rows = matrix.slice(1).map((values) =>
    headers.reduce<Record<string, string | null>>((acc, header, index) => {
      acc[header] = values[index] ? normalizeText(values[index]) : null;
      return acc;
    }, {})
  );

  return { headers, rows };
}

async function parseXlsx(file: File): Promise<ParsedFile> {
  const zip = await readZipEntries(await file.arrayBuffer());
  const workbookXmlRaw = await zip.readEntry('xl/workbook.xml');
  const relsXmlRaw = await zip.readEntry('xl/_rels/workbook.xml.rels');

  if (!workbookXmlRaw || !relsXmlRaw) {
    throw new Error('Structure XLSX invalide.');
  }

  const workbookXml = new TextDecoder().decode(workbookXmlRaw);
  const relsXml = new TextDecoder().decode(relsXmlRaw);
  const parser = new DOMParser();

  const workbookDoc = parser.parseFromString(workbookXml, 'application/xml');
  const relsDoc = parser.parseFromString(relsXml, 'application/xml');

  const sheets = Array.from(workbookDoc.querySelectorAll('sheet'));
  if (!sheets.length) {
    throw new Error('Aucune feuille trouvée dans le fichier XLSX.');
  }

  const firstSheet = sheets[0];
  const firstSheetRid = firstSheet.getAttribute('r:id');
  const firstSheetName = firstSheet.getAttribute('name') ?? 'Sheet1';

  const relation = Array.from(relsDoc.querySelectorAll('Relationship')).find((node) => node.getAttribute('Id') === firstSheetRid);
  const target = relation?.getAttribute('Target');

  if (!target) {
    throw new Error('Impossible de résoudre la feuille XLSX.');
  }

  const normalizedTarget = target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.?\/?/, '')}`;
  const sheetXmlRaw = await zip.readEntry(normalizedTarget);
  if (!sheetXmlRaw) {
    throw new Error('Contenu de feuille XLSX introuvable.');
  }

  const sharedStringsRaw = await zip.readEntry('xl/sharedStrings.xml');
  const sharedStrings: string[] = [];

  if (sharedStringsRaw) {
    const sharedDoc = parser.parseFromString(new TextDecoder().decode(sharedStringsRaw), 'application/xml');
    Array.from(sharedDoc.querySelectorAll('si')).forEach((node) => {
      const text = Array.from(node.querySelectorAll('t'))
        .map((t) => t.textContent ?? '')
        .join('');
      sharedStrings.push(text);
    });
  }

  const sheetXml = new TextDecoder().decode(sheetXmlRaw);
  const parsed = parseSheetXml(sheetXml, sharedStrings);

  return {
    ...parsed,
    sheetName: firstSheetName,
    warning: sheets.length > 1 ? `Plusieurs feuilles détectées (${sheets.length}), seule la feuille "${firstSheetName}" est importée.` : undefined
  };
}

export async function parseImportFile(file: File): Promise<ParsedFile> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.csv')) {
    return parseCsv(await file.text());
  }

  if (lower.endsWith('.xlsx')) {
    return parseXlsx(file);
  }

  throw new Error('Format non supporté. Utilisez .csv ou .xlsx');
}
