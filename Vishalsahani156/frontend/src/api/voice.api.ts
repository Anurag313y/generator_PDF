import api from './axios';
import type { PdfFormData } from '../types';

export type VoiceAnalyzeResponse = {
  success: boolean;
  data: {
    transcript: string;
    extracted: Partial<PdfFormData>;
    extraNotes?: string;
    unmatchedText?: string;
    confidence?: Record<string, number>;
  };
};

export async function analyzeVoiceApi(formData: FormData) {
  const res = await api.post<VoiceAnalyzeResponse>('/voice/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

