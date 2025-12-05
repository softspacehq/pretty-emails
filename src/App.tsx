import { useState, useCallback, useEffect, useRef } from "react";
import Editor from "./components/Editor";
import EmailPreview from "./components/EmailPreview";
import StyleControls from "./components/StyleControls";
import { EmailStyles, defaultEmailStyles } from "./types";
import { renderEmailHtml } from "./utils/emailRenderer";

const STORAGE_KEYS = {
	styles: "pretty-emails-styles",
	content: "pretty-emails-content",
};

function loadStyles(): EmailStyles {
	try {
		const saved = localStorage.getItem(STORAGE_KEYS.styles);
		if (saved) {
			return { ...defaultEmailStyles, ...JSON.parse(saved) };
		}
	} catch (e) {
		console.warn("Failed to load styles from localStorage:", e);
	}
	return defaultEmailStyles;
}

function App() {
	const [markdown, setMarkdown] = useState("");
	const [styles, setStyles] = useState<EmailStyles>(loadStyles);
	const [copied, setCopied] = useState(false);
	const [editorKey, setEditorKey] = useState(0);
	const copyTimeoutRef = useRef<number | null>(null);

	// Persist styles to localStorage
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEYS.styles, JSON.stringify(styles));
		} catch (e) {
			console.warn("Failed to save styles to localStorage:", e);
		}
	}, [styles]);

	const handleStyleChange = useCallback(
		<K extends keyof EmailStyles>(key: K, value: EmailStyles[K]) => {
			setStyles((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	const handleClear = useCallback(() => {
		localStorage.removeItem(STORAGE_KEYS.content);
		setMarkdown("");
		setEditorKey((k) => k + 1); // Force editor remount
	}, []);

	const handleCopy = useCallback(async () => {
		const html = renderEmailHtml(markdown, styles);

		// Clear existing timeout to extend the timer on repeated clicks
		if (copyTimeoutRef.current) {
			clearTimeout(copyTimeoutRef.current);
		}

		try {
			// Copy as both HTML and plain text for maximum compatibility
			await navigator.clipboard.write([
				new ClipboardItem({
					"text/html": new Blob([html], { type: "text/html" }),
					"text/plain": new Blob([html], { type: "text/plain" }),
				}),
			]);

			setCopied(true);
			copyTimeoutRef.current = setTimeout(() => setCopied(false), 3000);
		} catch {
			// Fallback to text-only copy
			await navigator.clipboard.writeText(html);
			setCopied(true);
			copyTimeoutRef.current = setTimeout(() => setCopied(false), 3000);
		}
	}, [markdown, styles]);

	return (
		<>
			<footer className="app-footer">
				<span className="footer-left">PRETTY EMAILS</span>
				<span className="footer-center">Content stored locally only</span>
				<span className="footer-right">
					WITH ❤️ FROM{" "}
					<a href="https://www.soft.space" target="_blank" rel="noopener noreferrer">
						SOFTSPACE INC.
					</a>
				</span>
			</footer>
			<div className="app">
				{/* Left Pane: Editor */}
				<div className="pane editor-pane">
					<div className="pane-header">
						<h2>Compose</h2>
						<button className="clear-button" onClick={handleClear}>
							Clear
						</button>
					</div>
					<div className="pane-content">
						<Editor key={editorKey} onContentChange={setMarkdown} />
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
							{copied ? "Ready to paste" : "Copy for Gmail"}
						</button>
					</div>
					<div className="pane-content">
						<div className="email-preview-container">
							<EmailPreview markdown={markdown} styles={styles} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;

