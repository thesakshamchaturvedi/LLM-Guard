import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeCode, AnalysisResponse } from './api';

function App() {
  const [code, setCode] = useState('// Paste your code here to analyze for vulnerabilities');
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeCode(code, language);
      setResults(response);
    } catch (err) {
      setError('Failed to analyze code. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      <Header />
      <main className="main-content">
        <div style={{ 
          display: 'flex', 
          minHeight: 'calc(100vh - 60px)',
          padding: '24px',
          gap: '24px',
          maxWidth: '1800px',
          margin: '0 auto',
        }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '800px'
          }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select programming language"
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #30363d',
                backgroundColor: '#161b22',
                color: '#c9d1d9',
                fontSize: '14px',
                width: 'fit-content',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
                ':hover': {
                  borderColor: '#6e7681'
                }
              }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="dockerfile">Dockerfile</option>
              <option value="yaml">YAML</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="swift">Swift</option>
              <option value="kotlin">Kotlin</option>
              <option value="typescript">TypeScript</option>
            </select>
            <CodeInput
              code={code}
              language={language}
              onCodeChange={setCode}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || code.trim() === ''}
              style={{
                height: '40px',
                border: 'none',
                backgroundColor: '#238636',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '6px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (loading || code.trim() === '') ? 0.6 : 1,
                ':hover': {
                  backgroundColor: '#2ea043'
                }
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Code'}
            </button>
            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: '#3d1c1c',
                color: '#ff6b6b',
                borderRadius: '6px',
                fontSize: '14px',
                border: '1px solid #5c2626'
              }}>
                {error}
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex' }}>
            <ResultsDisplay results={results} loading={loading}/>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;