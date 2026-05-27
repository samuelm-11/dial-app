'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { buildContractPdfPath } from '@/features/contracts/helpers';
import { renderContractTemplate } from '@/features/contracts/templates/render-template';
import {
  contractFormSchema,
  contractTemplateSchema,
  contractTemplateUpdateSchema,
  contractUpdateSchema,
  contractUploadSchema,
  generateContractSchema
} from '@/features/contracts/schemas';
import type {
  CreateContractInput,
  CreateContractTemplateInput,
  GenerateContractInput,
  UpdateContractInput,
  UpdateContractTemplateInput
} from '@/types/contract';
import { getClientById } from '@/features/clients/queries';

const CONTRACTS_BUCKET = 'contracts';

export async function createContract(input: CreateContractInput) {
  const payload = contractFormSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const insertPayload = {
    client_id: payload.clientId,
    title: payload.title,
    start_date: payload.startDate,
    end_date: payload.endDate,
    auto_renewal: payload.autoRenewal,
    contract_template_id: payload.templateId ?? null,
    generated_content: payload.generatedContent ?? null
  };

  const { error } = await supabase.from('contracts').insert(insertPayload as never);

  if (error) {
    throw new Error(`Erreur création contrat: ${error.message}`);
  }

  revalidatePath('/contracts');
  revalidatePath('/contracts/generer');
  revalidatePath(`/clients/${payload.clientId}`);
}

export async function createContractTemplate(input: CreateContractTemplateInput) {
  const payload = contractTemplateSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.from('contract_templates').insert({
    name: payload.name,
    description: payload.description || null,
    content: payload.content,
    is_active: payload.isActive
  } as never);

  if (error) {
    throw new Error(`Erreur création modèle contrat: ${error.message}`);
  }

  revalidatePath('/contracts');
  revalidatePath('/contracts/modeles');
}

export async function updateContractTemplate(templateId: string, input: UpdateContractTemplateInput) {
  const payload = contractTemplateUpdateSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase
    .from('contract_templates')
    .update({
      name: payload.name,
      description: payload.description || null,
      content: payload.content,
      is_active: payload.isActive
    } as never)
    .eq('id', templateId);

  if (error) {
    throw new Error(`Erreur mise à jour modèle contrat: ${error.message}`);
  }

  revalidatePath('/contracts');
  revalidatePath('/contracts/modeles');
}

export async function generateContractFromTemplate(input: GenerateContractInput) {
  const payload = generateContractSchema.parse(input);
  const [client, supabase] = await Promise.all([getClientById(payload.clientId), createSupabaseServerActionClient()]);

  if (!client) {
    throw new Error('Client introuvable.');
  }

  const { data: template, error: templateError } = await supabase
    .from('contract_templates')
    .select('id, content')
    .eq('id', payload.templateId)
    .eq('is_active', true)
    .maybeSingle();

  if (templateError || !template) {
    throw new Error(`Modèle de contrat indisponible${templateError ? `: ${templateError.message}` : '.'}`);
  }

  await createContract({
    clientId: payload.clientId,
    title: payload.title,
    startDate: payload.startDate,
    endDate: payload.endDate,
    autoRenewal: payload.autoRenewal,
    templateId: payload.templateId,
    generatedContent: renderContractTemplate(String(template.content ?? ''), {
      client,
      startDate: payload.startDate,
      endDate: payload.endDate,
      details: {
        serviceLevel: payload.serviceLevel,
        monthlyFee: payload.monthlyFee,
        billingFrequency: payload.billingFrequency,
        paymentTerms: payload.paymentTerms,
        contractDuration: payload.contractDuration,
        specialConditions: payload.specialConditions
      }
    })
  });
}

export async function updateContract(clientId: string, contractId: string, input: UpdateContractInput) {
  const payload = contractUpdateSchema.parse(input);
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase
    .from('contracts')
    .update({
      title: payload.title,
      start_date: payload.startDate,
      end_date: payload.endDate,
      auto_renewal: payload.autoRenewal
    } as never)
    .eq('id', contractId)
    .eq('client_id', clientId);

  if (error) {
    throw new Error(`Erreur mise à jour contrat: ${error.message}`);
  }

  revalidatePath('/contracts');
  revalidatePath(`/clients/${clientId}`);
}

export async function uploadContractPdf(clientId: string, contractId: string, file: File) {
  const parsedFile = contractUploadSchema.parse({
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type
  });

  const supabase = await createSupabaseServerActionClient();
  const filePath = buildContractPdfPath(clientId, contractId, parsedFile.fileName);

  const { error: uploadError } = await supabase.storage.from(CONTRACTS_BUCKET).upload(filePath, file, {
    contentType: parsedFile.mimeType,
    cacheControl: '3600',
    upsert: false
  });

  if (uploadError) {
    throw new Error(`Erreur upload contrat PDF: ${uploadError.message}`);
  }

  const { error: updateError } = await supabase
    .from('contracts')
    .update({ private_pdf_path: filePath } as never)
    .eq('id', contractId)
    .eq('client_id', clientId);

  if (updateError) {
    throw new Error(`Erreur enregistrement PDF contrat: ${updateError.message}`);
  }

  revalidatePath('/contracts');
  revalidatePath(`/clients/${clientId}`);

  return filePath;
}

export async function replaceContractPdf(clientId: string, contractId: string, file: File) {
  const supabase = await createSupabaseServerActionClient();

  const { data: currentContract } = await supabase
    .from('contracts')
    .select('private_pdf_path')
    .eq('id', contractId)
    .eq('client_id', clientId)
    .maybeSingle();

  const filePath = await uploadContractPdf(clientId, contractId, file);

  if (currentContract?.private_pdf_path) {
    await supabase.storage.from(CONTRACTS_BUCKET).remove([currentContract.private_pdf_path]);
  }

  return filePath;
}

export async function getContractFileUrl(contractPdfPath: string) {
  const supabase = await createSupabaseServerActionClient();

  const { data, error } = await supabase.storage.from(CONTRACTS_BUCKET).createSignedUrl(contractPdfPath, 60 * 5);

  if (error || !data?.signedUrl) {
    throw new Error(`Erreur URL sécurisée contrat: ${error?.message ?? 'URL indisponible'}`);
  }

  return data.signedUrl;
}

export async function deleteContractPdf(_clientId: string, _contractId: string) {
  return {
    ok: false,
    message: 'Placeholder propre: suppression PDF contrat planifiée à une étape ultérieure.'
  };
}
