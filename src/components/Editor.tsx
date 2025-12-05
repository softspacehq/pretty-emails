import { useCallback, useEffect, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

interface EditorProps {
  onContentChange: (markdown: string) => void;
}

export default function Editor({ onContentChange }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hey [Name]," }],
      },
      {
        type: "paragraph",
        content: [],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Start writing your email here..." }],
      },
    ],
  });

  // Sync initial content to preview on mount
  useEffect(() => {
    const markdown = editor.blocksToMarkdownLossy();
    onContentChange(markdown);
  }, [editor, onContentChange]);

  const handleChange = useCallback(() => {
    const markdown = editor.blocksToMarkdownLossy();
    onContentChange(markdown);
  }, [editor, onContentChange]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // Only focus if clicking on the container itself, not on the editor
    if (e.target === containerRef.current) {
      editor.focus("end");
    }
  }, [editor]);

  return (
    <div 
      ref={containerRef}
      className="editor-container"
      onClick={handleContainerClick}
    >
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme="dark"
      />
    </div>
  );
}

