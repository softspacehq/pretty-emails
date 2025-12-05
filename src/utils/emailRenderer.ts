import { EmailStyles } from "../types";

/**
 * Converts markdown content to email-safe HTML with inline styles.
 * Uses table-based layout for maximum email client compatibility.
 */
export function renderEmailHtml(markdown: string, styles: EmailStyles): string {
	const {
		fontFamily,
		fontSize,
		maxWidth,
		lineHeight,
		textColor,
		backgroundColor,
		paragraphSpacing,
		marginTop,
		marginSides,
		marginBottom,
	} = styles;

	// Convert markdown to HTML elements
	const bodyContent = markdownToEmailHtml(markdown, {
		textColor,
		fontSize,
		lineHeight,
		paragraphSpacing,
		maxWidth,
	});

	return `<!DOCTYPE html>
<html>

<head>
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin: 0; padding: 0; background-color: ${backgroundColor};">
\t<table width="100%" cellpadding="0" cellspacing="0" border="0">
\t\t<tr>
\t\t\t<td align="center" style="padding: ${marginTop}px ${marginSides}px ${marginBottom}px ${marginSides}px;">
\t\t\t\t<!--[if mso]>
\t\t\t\t<table width="${maxWidth}" cellpadding="0" cellspacing="0" border="0"><tr><td>
\t\t\t\t<![endif]-->
\t\t\t\t<div style="max-width: ${maxWidth}px; margin: 0 auto;">
\t\t\t\t\t<table width="100%" cellpadding="0" cellspacing="0" border="0"
\t\t\t\t\t\tstyle="font-family: ${fontFamily}; font-size: ${fontSize}px; line-height: ${lineHeight}; color: ${textColor};">
\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t<td>
${bodyContent}
\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t</tr>
\t\t\t\t\t</table>
\t\t\t\t</div>
\t\t\t\t<!--[if mso]>
\t\t\t\t</td></tr></table>
\t\t\t\t<![endif]-->
\t\t\t</td>
\t\t</tr>
\t</table>
</body>

</html>`;
}

interface ContentStyles {
	textColor: string;
	fontSize: number;
	lineHeight: number;
	paragraphSpacing: number;
	maxWidth: number;
}

/**
 * Converts markdown to inline-styled HTML for email clients.
 */
function markdownToEmailHtml(markdown: string, styles: ContentStyles): string {
	const { textColor, fontSize, lineHeight, paragraphSpacing } = styles;

	// Base style applied to all text elements for Gmail compatibility
	const baseTextStyle = `font-size: ${fontSize}px; line-height: ${lineHeight};`;

	// Clean up BlockNote's markdown export quirks
	const cleanedMarkdown = markdown
		.replace(/\\$/gm, '')           // Remove trailing backslashes
		.replace(/\\\n/g, '\n')         // Remove escaped newlines
		.replace(/\\([*_~`])/g, '$1');  // Unescape markdown chars

	const lines = cleanedMarkdown.split("\n");
	const htmlParts: string[] = [];
	let inList = false;
	let listItems: string[] = [];
	let listType: "ul" | "ol" = "ul";

	const flushList = () => {
		if (listItems.length > 0) {
			const listStyle = `margin: 0 0 ${paragraphSpacing}px 0; padding-left: 24px; ${baseTextStyle}`;

			const tag = listType;
			htmlParts.push(`\t\t\t\t\t\t\t\t<${tag} style="${listStyle}">`);
			listItems.forEach(item => {
				htmlParts.push(`\t\t\t\t\t\t\t\t\t<li style="margin-bottom: 10px; ${baseTextStyle}">${item}</li>`);
			});
			htmlParts.push(`\t\t\t\t\t\t\t\t</${tag}>`);
			listItems = [];
			inList = false;
		}
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Skip empty lines and lines that are just backslashes
		if (trimmedLine === "" || trimmedLine === "\\" || trimmedLine === "\\\\") {
			flushList();
			continue;
		}

		// Check for headers
		const h1Match = trimmedLine.match(/^# (.+)$/);
		const h2Match = trimmedLine.match(/^## (.+)$/);
		const h3Match = trimmedLine.match(/^### (.+)$/);

		if (h1Match) {
			flushList();
			const content = processInlineFormatting(h1Match[1]);
			htmlParts.push(`\t\t\t\t\t\t\t\t<h1 style="margin: 0 0 ${paragraphSpacing}px 0; font-size: ${Math.round(fontSize * 1.75)}px; line-height: ${lineHeight * 0.9}; font-weight: normal;">${content}</h1>`);
			continue;
		}

		if (h2Match) {
			flushList();
			const content = processInlineFormatting(h2Match[1]);
			htmlParts.push(`\t\t\t\t\t\t\t\t<h2 style="margin: 0 0 ${paragraphSpacing}px 0; font-size: ${Math.round(fontSize * 1.5)}px; line-height: ${lineHeight * 0.9}; font-weight: normal;">${content}</h2>`);
			continue;
		}

		if (h3Match) {
			flushList();
			const content = processInlineFormatting(h3Match[1]);
			htmlParts.push(`\t\t\t\t\t\t\t\t<h3 style="margin: 0 0 ${paragraphSpacing}px 0; font-size: ${Math.round(fontSize * 1.2)}px; line-height: ${lineHeight * 0.9}; font-weight: normal;">${content}</h3>`);
			continue;
		}

		// Check for unordered list items
		const ulMatch = trimmedLine.match(/^[-*+] (.+)$/);
		if (ulMatch) {
			if (!inList || listType !== "ul") {
				flushList();
				inList = true;
				listType = "ul";
			}
			listItems.push(processInlineFormatting(ulMatch[1]));
			continue;
		}

		// Check for ordered list items
		const olMatch = trimmedLine.match(/^\d+\. (.+)$/);
		if (olMatch) {
			if (!inList || listType !== "ol") {
				flushList();
				inList = true;
				listType = "ol";
			}
			listItems.push(processInlineFormatting(olMatch[1]));
			continue;
		}

		// Check for horizontal rule
		if (trimmedLine.match(/^[-*_]{3,}$/)) {
			flushList();
			htmlParts.push(`\t\t\t\t\t\t\t\t<hr style="border: none; border-top: 1px solid ${textColor}; margin: ${paragraphSpacing}px 0; opacity: 0.3;">`);
			continue;
		}

		// Check for standalone image: ![alt](url)
		const imageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
		if (imageMatch) {
			flushList();
			const alt = imageMatch[1] || '';
			const src = imageMatch[2];
			htmlParts.push(`\t\t\t\t\t\t\t\t<p style="margin: 0 0 ${paragraphSpacing}px 0; ${baseTextStyle}"><img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; border-radius: 4px;"></p>`);
			continue;
		}

		// Regular paragraph
		flushList();
		const content = processInlineFormatting(trimmedLine);
		htmlParts.push(`\t\t\t\t\t\t\t\t<p style="margin: 0 0 ${paragraphSpacing}px 0; ${baseTextStyle}">${content}</p>`);
	}

	flushList();

	// Remove margin from last element
	if (htmlParts.length > 0) {
		const lastIndex = htmlParts.length - 1;
		htmlParts[lastIndex] = htmlParts[lastIndex].replace(
			/margin: 0 0 \d+px 0;/,
			"margin: 0;"
		);
	}

	return htmlParts.join("\n");
}

/**
 * Processes inline markdown formatting (bold, italic, links, etc.)
 */
function processInlineFormatting(text: string): string {
	let result = text;

	// Escape HTML entities first (but preserve already escaped ones)
	result = result
		.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	// Bold: **text** or __text__
	result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
	result = result.replace(/__(.+?)__/g, "<strong>$1</strong>");

	// Italic: *text* or _text_
	result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
	result = result.replace(/_(.+?)_/g, "<em>$1</em>");

	// Strikethrough: ~~text~~
	result = result.replace(/~~(.+?)~~/g, "<s>$1</s>");

	// Inline code: `code`
	result = result.replace(
		/`(.+?)`/g,
		'<code style="background-color: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 3px; font-family: monospace;">$1</code>'
	);

	// Links: [text](url)
	result = result.replace(
		/\[(.+?)\]\((.+?)\)/g,
		'<a href="$2" style="color: inherit; text-decoration: underline;">$1</a>'
	);

	return result;
}

/**
 * Returns just the inner body content for preview rendering
 */
export function renderEmailBodyHtml(markdown: string, styles: EmailStyles): string {
	const { textColor, fontSize, lineHeight, paragraphSpacing, maxWidth } = styles;

	return markdownToEmailHtml(markdown, {
		textColor,
		fontSize,
		lineHeight,
		paragraphSpacing,
		maxWidth,
	});
}

