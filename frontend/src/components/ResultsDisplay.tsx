import React from 'react';
import { AnalysisResponse } from '../api';

interface ResultsDisplayProps {
  results: AnalysisResponse | null;
  loading: boolean;
}

const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel.toLowerCase()) {
    case 'critical':
      return '#c0392b';
    case 'high':
      return '#e67e22';
    case 'medium':
      return '#f1c40f';
    case 'low':
      return '#27ae60';
    case 'informational':
      return '#3498db';
    default:
      return '#7f8c8d';
  }
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="results-placeholder">
        <p>Analyzing code for vulnerabilities...</p>
      </div>
    );
  }
  
  if (!results) {
    return (
      <div className="results-placeholder">
        <p>Run an analysis to see the results here</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="summary-section">
        <h2>Security Assessment</h2>
        <div 
          className="risk-badge"
          style={{ backgroundColor: getRiskLevelColor(results.summary.risk_level) }}
        >
          {results.summary.risk_level}
        </div>
        <p className="assessment">{results.summary.assessment}</p>
      </div>

      <div className="vulnerabilities-section">
        <h3>Vulnerabilities Found ({results.vulnerabilities.length})</h3>
        {results.vulnerabilities.length === 0 ? (
          <div className="no-vulnerabilities">
            <p>✅ No security vulnerabilities detected</p>
          </div>
        ) : (
          <div className="vulnerabilities-list">
            {results.vulnerabilities.map((vuln, index) => (
              <div key={index} className="vulnerability-item">
                <div className="vuln-header">
                  <span className="vuln-type">{vuln.vulnerability_type}</span>
                  <span 
                    className="vuln-risk"
                    style={{ color: getRiskLevelColor(vuln.risk_level) }}
                  >
                    {vuln.risk_level}
                  </span>
                  <span className="vuln-line">Line {vuln.line_number}</span>
                </div>
                <div className="vuln-description">
                  <p>{vuln.description}</p>
                </div>
                <div className="vuln-recommendation">
                  <h4>Recommendation:</h4>
                  <pre><code>{vuln.recommendation}</code></pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;