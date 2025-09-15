import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeInputProps {
  code: string;
  language: string;
  onCodeChange: (value: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, language, onCodeChange }) => {
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
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={(value) => onCodeChange(value || '')}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
          minimap: { enabled: false },
          wordWrap: 'on',
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineHeight: 21,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          renderLineHighlight: 'all',
          lineNumbers: 'on',
          lineDecorationsWidth: 0,
          renderIndentGuides: true,
          smoothScrolling: true,
        }}
      />
    </div>
  );
};

export default CodeInput;