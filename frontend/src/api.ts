import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Vulnerability {
  line_number: number;
  vulnerability_type: string;
  risk_level: string;
  description: string;
  recommendation: string;
}

export interface AnalysisSummary {
  risk_level: string;
  assessment: string;
}

export interface AnalysisResponse {
  summary: AnalysisSummary;
  vulnerabilities: Vulnerability[];
}

export const analyzeCode = async (code: string, language: string): Promise<AnalysisResponse> => {
  try {
    const response = await apiClient.post('/analyze', {
      code_snippet: code,
      language: language,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to analyze code');
  }
};
