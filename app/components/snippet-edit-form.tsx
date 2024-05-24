import type { Snippet } from "@prisma/client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { Form } from "@remix-run/react";

interface SnippetEditFormProps {
  snippet: Snippet;
}

export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
  const [code, setCode] = useState(snippet.code);

  const handleEditorChange = (value: string = "") => {
    setCode(value);
  };

  return (
    <div>
      <Editor
        height="40vh"
        theme="vs-dark"
        language="javascript"
        defaultValue={snippet.code}
        options={{ minimap: { enabled: false } }}
        onChange={handleEditorChange}
      />
      <Form method="post">
        <input type="hidden" name="code" value={code} />
        <input type="hidden" name="id" value={snippet.id} />
        <button type="submit" className="p-2 my-2 border rounded float-right">
          Save
        </button>
      </Form>
    </div>
  );
}
