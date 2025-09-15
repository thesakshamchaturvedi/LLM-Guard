const API_URL = "http://localhost:8000";

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
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code_snippet: code,
      language: language,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response.' }));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
};
