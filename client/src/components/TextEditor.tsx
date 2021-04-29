import { FC, useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";

interface TextEditorProps {}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [],
  [{ font: [] }],
  [],
  [{ list: "ordered" }, { list: "bullet" }],
  [],
  ["bold", "italic", "underline", "strike"],
  [],
  [{ color: [] }, { background: [] }],
  [],
  [{ script: "sub" }, { script: "super" }],
  [],
  [{ align: [] }],
  [],
  ["image", "video", "blockquote", "link", "formula", "code-block"],
  [],
  [],
  ["clean"],
];

export const TextEditor: FC<TextEditorProps> = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = document.createElement("div");
    editorRef.current?.append(editor);
    new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });

    const currentEditor = editorRef.current;

    return () => {
      if (currentEditor) {
        currentEditor.innerHTML = "";
      }
    };
  }, []);

  return <div className="editor" ref={editorRef}></div>;
};
