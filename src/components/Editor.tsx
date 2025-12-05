import { useCallback, useEffect, useRef } from "react";
import { useCreateBlockNote, FormattingToolbarController, BasicTextStyleButton, TextAlignButton, NestBlockButton, UnnestBlockButton, CreateLinkButton, BlockTypeSelect } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Block } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

const STORAGE_KEY = "pretty-emails-content";
const MAX_IMAGE_WIDTH = 800;
const JPEG_QUALITY = 0.8;

async function uploadFile(file: File): Promise<string> {
	// For non-images, just return base64
	if (!file.type.startsWith("image/")) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("Failed to read file"));
			reader.readAsDataURL(file);
		});
	}

	// Compress images using canvas
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			// Calculate new dimensions
			let { width, height } = img;
			if (width > MAX_IMAGE_WIDTH) {
				height = Math.round((height * MAX_IMAGE_WIDTH) / width);
				width = MAX_IMAGE_WIDTH;
			}

			// Draw to canvas and export as compressed JPEG
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Failed to get canvas context"));
				return;
			}
			ctx.drawImage(img, 0, 0, width, height);

			// Use JPEG for photos, PNG for images with transparency
			const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
			const quality = outputType === "image/jpeg" ? JPEG_QUALITY : undefined;
			resolve(canvas.toDataURL(outputType, quality));
		};
		img.onerror = () => reject(new Error("Failed to load image"));
		img.src = URL.createObjectURL(file);
	});
}

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
	const updateTimeoutRef = useRef<number | null>(null);

	const editor = useCreateBlockNote({
		initialContent: loadContent(),
		uploadFile,
	});

	// Sync initial content to preview on mount
	useEffect(() => {
		const markdown = editor.blocksToMarkdownLossy();
		onContentChange(markdown);
	}, [editor, onContentChange]);

	const handleChange = useCallback(() => {
		// Debounce all processing to keep typing responsive
		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current);
		}
		updateTimeoutRef.current = setTimeout(() => {
			const markdown = editor.blocksToMarkdownLossy();
			onContentChange(markdown);

			// Persist blocks to localStorage
			try {
				const blocks = editor.document;
				localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
			} catch (e) {
				console.warn("Failed to save content to localStorage:", e);
			}
		}, 150);
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
				formattingToolbar={false}
			>
				<FormattingToolbarController
					formattingToolbar={() => (
						<div className="bn-toolbar bn-formatting-toolbar">
							<BlockTypeSelect />
							<BasicTextStyleButton basicTextStyle="bold" />
							<BasicTextStyleButton basicTextStyle="italic" />
							<BasicTextStyleButton basicTextStyle="underline" />
							<BasicTextStyleButton basicTextStyle="strike" />
							<TextAlignButton textAlignment="left" />
							<TextAlignButton textAlignment="center" />
							<TextAlignButton textAlignment="right" />
							<NestBlockButton />
							<UnnestBlockButton />
							<CreateLinkButton />
						</div>
					)}
				/>
			</BlockNoteView>
		</div>
	);
}

