import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, language, setLanguage }) => {
  const editorOptions = {
    selectOnLineNumbers: true,
    minimap: { enabled: false },
    guides: {
      indentation: true,
    },
    automaticLayout: true,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        width: '100%',
        backgroundColor: '#161b22',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        border: '1px solid #30363d',
      }}
    >
      <div className="language-selector">
        <label htmlFor="language">Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="yaml">YAML</option>
          <option value="dockerfile">Dockerfile</option>
        </select>
      </div>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        options={editorOptions}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeInput;
