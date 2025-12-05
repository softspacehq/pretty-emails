import { useCallback, useEffect, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Block } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

const STORAGE_KEY = "pretty-emails-content";

function loadContent(): Block[] | undefined {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Failed to load content from localStorage:", e);
  }
  return undefined;
}

interface EditorProps {
  onContentChange: (markdown: string) => void;
}

export default function Editor({ onContentChange }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const editor = useCreateBlockNote({
    initialContent: loadContent(),
  });

  // Sync initial content to preview on mount
  useEffect(() => {
    const markdown = editor.blocksToMarkdownLossy();
    onContentChange(markdown);
  }, [editor, onContentChange]);

  const handleChange = useCallback(() => {
    const markdown = editor.blocksToMarkdownLossy();
    onContentChange(markdown);
    
    // Persist blocks to localStorage
    try {
      const blocks = editor.document;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch (e) {
      console.warn("Failed to save content to localStorage:", e);
    }
  }, [editor, onContentChange]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // Only focus if clicking on the container itself, not on the editor
    if (e.target === containerRef.current) {
      editor.focus();
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

