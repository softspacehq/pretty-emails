import { EmailStyles } from "../types";

/**
 * Converts markdown content to simple, flat HTML with inline styles.
 * Mimics the structure of a manual copy-paste for best Gmail mobile compatibility.
 * No tables or max-width wrappers - just styled semantic elements.
 */
// Convert hex color to rgb() format for Gmail compatibility
function hexToRgb(hex: string): string {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		const r = parseInt(result[1], 16);
		const g = parseInt(result[2], 16);
		const b = parseInt(result[3], 16);
		return `rgb(${r},${g},${b})`;
	}
	return hex; // Return as-is if not valid hex
}

// Escape quotes in font-family for HTML attribute
function escapeFontFamily(fontFamily: string): string {
	return fontFamily.replace(/"/g, '&quot;');
}

export function renderEmailHtml(markdown: string, styles: EmailStyles): string {
	const {
		fontFamily,
		fontSize,
		lineHeight,
		textColor,
		paragraphSpacing,
		marginTop,
		marginSides,
		marginBottom,
		maxWidth,
		headingWeight,
		bodyWeight,
		imageCornerRadius,
		headingTopMargin,
	} = styles;

	// Format styles to match browser serialization (no spaces, rgb colors, escaped quotes)
	// This format is preserved better by Gmail
	const rgbColor = hexToRgb(textColor);
	const escapedFontFamily = escapeFontFamily(fontFamily);
	const baseStyle = `color:${rgbColor};font-family:${escapedFontFamily};font-size:${fontSize}px;line-height:${lineHeight};`;

	const htmlParts = markdownToFlatHtml(markdown, {
		baseStyle,
		rgbColor,
		fontSize,
		lineHeight,
		paragraphSpacing,
		headingWeight,
		bodyWeight,
		imageCornerRadius,
		headingTopMargin,
	});

	// Remove margin from last element (handles both px-only and rem+px formats)
	if (htmlParts.length > 0) {
		const lastIndex = htmlParts.length - 1;
		htmlParts[lastIndex] = htmlParts[lastIndex].replace(
			/margin:[\d.]+(?:rem)? 0 \d+px/,
			"margin:0"
		);
	}

	// Simple div wrapper with margins, max-width, and centered via margin:auto
	const wrapperStyle = `padding:${marginTop}px ${marginSides}px ${marginBottom}px;max-width:${maxWidth}px;margin:0 auto`;

	// Footer banner with subtle gray text
	const footerStyle = `margin-top:${Math.max(paragraphSpacing * 3, 40)}px;padding-top:16px;border-top:1px solid rgba(128,128,128,0.2);text-align:center;font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:rgb(128,128,128);line-height:1`;
	const footerLinkStyle = `color:rgb(128,128,128);text-decoration:underline;text-underline-offset:2px`;

	return `<div dir="ltr" style="${wrapperStyle}">
${htmlParts.join("\n")}
<div style="${footerStyle}">Crafted using <a href="https://www.pretty-emails.com" style="${footerLinkStyle}">Pretty Emails</a></div>
</div>`;
}

interface FlatHtmlStyles {
	baseStyle: string;
	rgbColor: string;
	fontSize: number;
	lineHeight: number;
	paragraphSpacing: number;
	headingWeight: number;
	bodyWeight: number;
	imageCornerRadius: number;
	headingTopMargin: number;
}

/**
 * Converts markdown to flat HTML with full inline styles on each element.
 * Produces simple structure similar to manual copy-paste for Gmail compatibility.
 */
function markdownToFlatHtml(markdown: string, styles: FlatHtmlStyles): string[] {
	const { baseStyle, rgbColor, fontSize, lineHeight, paragraphSpacing, headingWeight, bodyWeight, imageCornerRadius, headingTopMargin } = styles;

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
	let olStartNumber = 1;
	let blockquoteLines: string[] = [];
	let inCodeFence = false;
	let codeLines: string[] = [];
	let inTable = false;
	let tableRows: string[][] = [];
	let hasTableHeader = false;

	const flushBlockquote = () => {
		if (blockquoteLines.length > 0) {
			const blockquoteStyle = `margin:0 0 ${paragraphSpacing}px;padding:0 0 0 16px;border-left:4px solid ${rgbColor};${baseStyle}`;
			const content = blockquoteLines.map(line => processInlineFormatting(line)).join('<br>');
			htmlParts.push(`<blockquote style="${blockquoteStyle}">${content}</blockquote>`);
			blockquoteLines = [];
		}
	};

	const flushCodeFence = () => {
		if (codeLines.length > 0) {
			// Escape HTML in code content
			const escapedCode = codeLines
				.map(line => line
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
				)
				.join('\n');
			const preStyle = `margin:0 0 ${paragraphSpacing}px;padding:12px 16px;background-color:rgba(0,0,0,0.05);border-radius:6px;overflow-x:auto`;
			const codeStyle = `font-family:monospace;font-size:${Math.round(fontSize * 0.9)}px;line-height:1.5;color:${rgbColor};white-space:pre-wrap;word-break:break-word`;
			htmlParts.push(`<pre style="${preStyle}"><code style="${codeStyle}">${escapedCode}</code></pre>`);
			codeLines = [];
		}
	};

	const flushTable = () => {
		if (tableRows.length > 0) {
			const tableStyle = `margin:0 0 ${paragraphSpacing}px;border-collapse:collapse;width:100%;${baseStyle}`;
			const thStyle = `padding:8px 12px;border:1px solid rgba(0,0,0,0.15);text-align:left;font-weight:${headingWeight};background-color:rgba(0,0,0,0.03)`;
			const tdStyle = `padding:8px 12px;border:1px solid rgba(0,0,0,0.15);text-align:left`;

			let tableHtml = `<table style="${tableStyle}">`;

			tableRows.forEach((row, rowIndex) => {
				const isHeader = hasTableHeader && rowIndex === 0;
				const tag = isHeader ? 'th' : 'td';
				const cellStyle = isHeader ? thStyle : tdStyle;

				tableHtml += '<tr>';
				row.forEach(cell => {
					const content = processInlineFormatting(cell.trim());
					tableHtml += `<${tag} style="${cellStyle}">${content}</${tag}>`;
				});
				tableHtml += '</tr>';
			});

			tableHtml += '</table>';
			htmlParts.push(tableHtml);
			tableRows = [];
			inTable = false;
			hasTableHeader = false;
		}
	};

	const flushList = () => {
		if (listItems.length > 0) {
			const listStyle = `margin:0 0 ${paragraphSpacing}px;padding:0 0 0 24px;${baseStyle}`;
			const tag = listType;
			const startAttr = tag === "ol" ? ` start="${olStartNumber}"` : "";
			const listItemSpacing = Math.round(paragraphSpacing / 2);

			let listHtml = `<${tag}${startAttr} style="${listStyle}">`;
			listItems.forEach(item => {
				listHtml += `<li style="margin:0 0 ${listItemSpacing}px;padding:0;line-height:${lineHeight}">${item}</li>`;
			});
			listHtml += `</${tag}>`;
			htmlParts.push(listHtml);
			listItems = [];
			inList = false;
		}
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Check for code fence markers (``` or ```language)
		if (trimmedLine.startsWith("```")) {
			if (inCodeFence) {
				// Closing fence
				flushCodeFence();
				inCodeFence = false;
			} else {
				// Opening fence - flush other elements first
				flushList();
				flushBlockquote();
				inCodeFence = true;
			}
			continue;
		}

		// If inside code fence, collect lines without processing
		if (inCodeFence) {
			codeLines.push(line);
			continue;
		}

		// Skip empty lines and lines that are just backslashes (but not if in table - handle below)
		if (trimmedLine === "" || trimmedLine === "\\" || trimmedLine === "\\\\") {
			// If in a table, allow empty lines without breaking
			if (inTable) {
				continue;
			}
			flushBlockquote();
			continue;
		}

		// Check for table rows: | cell | cell | or |cell|cell|
		const tableRowMatch = trimmedLine.match(/^\|(.+)\|$/);
		if (tableRowMatch) {
			// Check if this is a separator row (|---|---|) - contains only |, -, :, and spaces
			const isSeparator = /^\|[-:\s|]+\|$/.test(trimmedLine) && trimmedLine.includes('-');

			if (isSeparator) {
				// Separator row indicates previous row was header
				if (tableRows.length === 1) {
					hasTableHeader = true;
				}
				// Skip the separator row itself
				continue;
			}

			// Start table if not already in one
			if (!inTable) {
				flushList();
				flushBlockquote();
				inTable = true;
			}

			// Parse cells (split by | but handle escaped pipes)
			const cells = tableRowMatch[1].split('|').map(cell => cell.trim());
			tableRows.push(cells);
			continue;
		}

		// If we were in a table but hit a non-table line, flush the table
		if (inTable) {
			flushTable();
		}

		// Check for headers
		const h1Match = trimmedLine.match(/^# (.+)$/);
		const h2Match = trimmedLine.match(/^## (.+)$/);
		const h3Match = trimmedLine.match(/^### (.+)$/);

		if (h1Match) {
			flushList();
			flushBlockquote();
			const content = processInlineFormatting(h1Match[1], true);
			const isFirst = htmlParts.length === 0;
			const topMargin = isFirst ? 0 : headingTopMargin;
			const bottomMargin = isFirst ? `${headingTopMargin}rem` : `${paragraphSpacing}px`;
			const h1Style = `margin:${topMargin}rem 0 ${bottomMargin};padding:0;${baseStyle}font-size:${Math.round(fontSize * 2.25)}px;line-height:${lineHeight * 0.9};font-weight:${headingWeight}`;
			htmlParts.push(`<h1 style="${h1Style}">${content}</h1>`);
			continue;
		}

		if (h2Match) {
			flushList();
			flushBlockquote();
			const content = processInlineFormatting(h2Match[1], true);
			const isFirst = htmlParts.length === 0;
			const topMargin = isFirst ? 0 : headingTopMargin;
			const bottomMargin = isFirst ? `${headingTopMargin}rem` : `${paragraphSpacing}px`;
			const h2Style = `margin:${topMargin}rem 0 ${bottomMargin};padding:0;${baseStyle}font-size:${Math.round(fontSize * 1.6)}px;line-height:${lineHeight * 0.9};font-weight:${headingWeight}`;
			htmlParts.push(`<h2 style="${h2Style}">${content}</h2>`);
			continue;
		}

		if (h3Match) {
			flushList();
			flushBlockquote();
			const content = processInlineFormatting(h3Match[1], true);
			const isFirst = htmlParts.length === 0;
			const topMargin = isFirst ? 0 : headingTopMargin;
			const bottomMargin = isFirst ? `${headingTopMargin}rem` : `${paragraphSpacing}px`;
			const h3Style = `margin:${topMargin}rem 0 ${bottomMargin};padding:0;${baseStyle}font-size:${Math.round(fontSize * 1.2)}px;line-height:${lineHeight * 0.9};font-weight:${headingWeight};`;
			htmlParts.push(`<h3 style="${h3Style}">${content}</h3>`);
			continue;
		}

		// Check for blockquote
		const blockquoteMatch = trimmedLine.match(/^> ?(.*)$/);
		if (blockquoteMatch) {
			flushList();
			blockquoteLines.push(blockquoteMatch[1]);
			continue;
		}

		// Check for unordered list items
		const ulMatch = trimmedLine.match(/^[-*+] (.+)$/);
		if (ulMatch) {
			flushBlockquote();
			if (!inList || listType !== "ul") {
				flushList();
				inList = true;
				listType = "ul";
			}
			listItems.push(processInlineFormatting(ulMatch[1]));
			continue;
		}

		// Check for ordered list items
		const olMatch = trimmedLine.match(/^(\d+)\. (.+)$/);
		if (olMatch) {
			flushBlockquote();
			const itemNumber = parseInt(olMatch[1], 10);
			if (!inList || listType !== "ol") {
				flushList();
				inList = true;
				listType = "ol";
				olStartNumber = itemNumber;
			}
			listItems.push(processInlineFormatting(olMatch[2]));
			continue;
		}

		// Check for horizontal rule
		if (trimmedLine.match(/^[-*_]{3,}$/)) {
			flushList();
			flushBlockquote();
			htmlParts.push(`<hr style="border:none;border-top:1px solid ${rgbColor};margin:${paragraphSpacing}px 0;opacity:0.3">`);
			continue;
		}

		// Check for line containing only images: ![alt](url) (one or more)
		// This regex matches lines that are entirely composed of image markdown
		const imageOnlyLineMatch = trimmedLine.match(/^(!\[[^\]]*\]\([^)]+\))+$/);
		if (imageOnlyLineMatch) {
			flushList();
			flushBlockquote();
			// Extract all images from the line
			const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
			let match;
			while ((match = imageRegex.exec(trimmedLine)) !== null) {
				const alt = match[1] || '';
				const src = match[2];
				// Wrap image in a div with rounded corners and overflow:hidden for Gmail compatibility
				// Gmail strips border-radius from images, but respects it on containing divs
				// line-height:0 prevents the inline-block baseline gap from cutting off the bottom
				const wrapperStyle = `margin:0 0 ${paragraphSpacing}px;padding:0;border-radius:${imageCornerRadius}px;overflow:hidden;display:inline-block;line-height:0`;
				const imgStyle = `max-width:100%;height:auto;display:block`;
				htmlParts.push(`<div style="${wrapperStyle}"><img src="${src}" alt="${alt}" style="${imgStyle}"></div>`);
			}
			continue;
		}

		// Regular paragraph
		flushList();
		flushBlockquote();
		const content = processInlineFormatting(trimmedLine);
		const pStyle = `margin:0 0 ${paragraphSpacing}px;padding:0;${baseStyle}font-weight:${bodyWeight}`;
		htmlParts.push(`<p style="${pStyle}">${content}</p>`);
	}

	flushList();
	flushBlockquote();
	flushCodeFence();
	flushTable();

	return htmlParts;
}

/**
 * Processes inline markdown formatting (bold, italic, links, etc.)
 * @param stripBold - If true, removes bold formatting (used for headings where weight is controlled separately)
 */
function processInlineFormatting(text: string, stripBold = false): string {
	let result = text;

	// Escape HTML entities first (but preserve already escaped ones)
	result = result
		.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	// Bold: **text** or __text__
	if (stripBold) {
		// Strip bold markers, keep the text
		result = result.replace(/\*\*(.+?)\*\*/g, "$1");
		result = result.replace(/__(.+?)__/g, "$1");
	} else {
		result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
		result = result.replace(/__(.+?)__/g, "<strong>$1</strong>");
	}

	// Italic: *text* or _text_
	result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
	result = result.replace(/_(.+?)_/g, "<em>$1</em>");

	// Strikethrough: ~~text~~
	result = result.replace(/~~(.+?)~~/g, "<s>$1</s>");

	// Inline code: `code`
	result = result.replace(
		/`(.+?)`/g,
		'<code style="background-color:rgba(0,0,0,0.05);padding:2px 6px;border-radius:3px;font-family:monospace;font-size:0.9em">$1</code>'
	);

	// Inline images: ![alt](url) - must be before links since syntax is similar
	result = result.replace(
		/!\[([^\]]*)\]\(([^)]+)\)/g,
		'<img src="$2" alt="$1" style="max-width:100%;height:auto">'
	);

	// Links: [text](url)
	result = result.replace(
		/\[(.+?)\]\((.+?)\)/g,
		'<a href="$2" style="color:inherit;text-decoration:underline">$1</a>'
	);

	return result;
}

/**
 * Returns just the inner body content for preview rendering
 */
export function renderEmailBodyHtml(markdown: string, styles: EmailStyles): string {
	const { fontFamily, textColor, fontSize, lineHeight, paragraphSpacing, headingWeight, bodyWeight, imageCornerRadius, headingTopMargin } = styles;

	const rgbColor = hexToRgb(textColor);
	const escapedFontFamily = escapeFontFamily(fontFamily);
	const baseStyle = `color:${rgbColor};font-family:${escapedFontFamily};font-size:${fontSize}px;line-height:${lineHeight};`;

	const htmlParts = markdownToFlatHtml(markdown, {
		baseStyle,
		rgbColor,
		fontSize,
		lineHeight,
		paragraphSpacing,
		headingWeight,
		bodyWeight,
		imageCornerRadius,
		headingTopMargin,
	});

	// Remove margin from last element (handles both px-only and rem+px formats)
	if (htmlParts.length > 0) {
		const lastIndex = htmlParts.length - 1;
		htmlParts[lastIndex] = htmlParts[lastIndex].replace(
			/margin:[\d.]+(?:rem)? 0 \d+px/,
			"margin:0"
		);
	}

	return htmlParts.join("\n");
}

