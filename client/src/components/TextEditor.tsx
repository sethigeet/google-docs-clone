import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import "quill/dist/quill.snow.css";
import Quill, { TextChangeHandler } from "quill";

import { io } from "socket.io-client";

interface TextEditorProps {}

const SAVE_INTERVAL_MS = 5000;

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
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const { id: documentId } = useParams<{ id: string }>();

  useEffect(() => {
    const editor = document.createElement("div");
    editorRef.current?.append(editor);
    const quillEditor = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    quillEditor.disable();
    quillEditor.setText("Loading...");

    setQuill(quillEditor);

    const currentEditor = editorRef.current;

    return () => {
      if (currentEditor) {
        currentEditor.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler: TextChangeHandler = (delta, oldDelta, source) => {
      if (source !== "user") return;

      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    socket.once("load-document", (data) => {
      quill.setContents(data);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler = (data: Parameters<Quill["updateContents"]>[0]) => {
      quill.updateContents(data);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    const connection = io("http://localhost:3001", {
      path: "/socket",
    });
    setSocket(connection);

    return () => {
      connection.disconnect();
    };
  }, []);

  return <div className="editor" ref={editorRef}></div>;
};
