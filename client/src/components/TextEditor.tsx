import { FC, useEffect, useRef } from "react"
import "quill/dist/quill.snow.css"
import Quill from "quill"

interface TextEditorProps { }

export const TextEditor: FC<TextEditorProps> = () => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const editor = document.createElement("div")
    editorRef.current?.append(editor)
    new Quill(editor, {
      theme: "snow"
    })

    const currentEditor = editorRef.current

    return () => {
      if (currentEditor) {
        currentEditor.innerHTML = ""
      }
    }
  }, [])

  return (
    <div id="editor" ref={editorRef}>
      <h1>TextEditor</h1>
    </div>
  )
}
