import { useState, useCallback } from "react";
import Editor from "./components/Editor";
import EmailPreview from "./components/EmailPreview";
import StyleControls from "./components/StyleControls";
import { EmailStyles, defaultEmailStyles } from "./types";
import { renderEmailHtml } from "./utils/emailRenderer";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [styles, setStyles] = useState<EmailStyles>(defaultEmailStyles);
  const [copied, setCopied] = useState(false);

  const handleStyleChange = useCallback(
    <K extends keyof EmailStyles>(key: K, value: EmailStyles[K]) => {
      setStyles((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleCopy = useCallback(async () => {
    const html = renderEmailHtml(markdown, styles);
    
    try {
      // Copy as both HTML and plain text for maximum compatibility
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback to text-only copy
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [markdown, styles]);

  return (
    <div className="app">
      {/* Left Pane: Editor */}
      <div className="pane editor-pane">
        <div className="pane-header">
          <h2>Compose</h2>
        </div>
        <div className="pane-content">
          <Editor onContentChange={setMarkdown} />
        </div>
      </div>

      {/* Middle Pane: Style Controls */}
      <div className="pane controls-pane">
        <div className="pane-header">
          <h2>Style</h2>
        </div>
        <div className="pane-content">
          <StyleControls styles={styles} onStyleChange={handleStyleChange} />
        </div>
      </div>

      {/* Right Pane: Preview */}
      <div className="pane preview-pane">
        <div className="pane-header">
          <h2>Preview</h2>
          <button
            className={`copy-button ${copied ? "copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy HTML"}
          </button>
        </div>
        <div className="pane-content">
          <div className="email-preview-container">
            <EmailPreview markdown={markdown} styles={styles} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

