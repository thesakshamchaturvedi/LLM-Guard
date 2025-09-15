import Editor from '@monaco-editor/react';

export interface CodeInputProps {
  code: string;
  language: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
}

const CodeInput = ({ code, language, setCode }: CodeInputProps) => {
  const editorOptions = {
    selectOnLineNumbers: true,
    minimap: { enabled: false },
    guides: {
      indentation: true,
    },
    automaticLayout: true,
  };

  return (
    <Editor
      height="40vh"
      language={language}
      value={code}
      onChange={(value) => setCode(value || '')}
      options={editorOptions}
      theme="vs-dark"
    />
  );
};

export default CodeInput;
