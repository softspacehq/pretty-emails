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
	});

	// Remove margin from last element
	if (htmlParts.length > 0) {
		const lastIndex = htmlParts.length - 1;
		htmlParts[lastIndex] = htmlParts[lastIndex].replace(
			/margin:0 0 \d+px/,
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
}

/**
 * Converts markdown to flat HTML with full inline styles on each element.
 * Produces simple structure similar to manual copy-paste for Gmail compatibility.
 */
function markdownToFlatHtml(markdown: string, styles: FlatHtmlStyles): string[] {
	const { baseStyle, rgbColor, fontSize, lineHeight, paragraphSpacing, headingWeight, bodyWeight, imageCornerRadius } = styles;

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

	const flushBlockquote = () => {
		if (blockquoteLines.length > 0) {
			const blockquoteStyle = `margin:0 0 ${paragraphSpacing}px;padding:0 0 0 16px;border-left:4px solid ${rgbColor};${baseStyle}`;
			const content = blockquoteLines.map(line => processInlineFormatting(line)).join('<br>');
			htmlParts.push(`<blockquote style="${blockquoteStyle}">${content}</blockquote>`);
			blockquoteLines = [];
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

		// Skip empty lines and lines that are just backslashes
		if (trimmedLine === "" || trimmedLine === "\\" || trimmedLine === "\\\\") {
			flushBlockquote();
			continue;
		}

		// Check for headers
		const h1Match = trimmedLine.match(/^# (.+)$/);
		const h2Match = trimmedLine.match(/^## (.+)$/);
		const h3Match = trimmedLine.match(/^### (.+)$/);

		if (h1Match) {
			flushList();
			flushBlockquote();
			const content = processInlineFormatting(h1Match[1], true);
			const h1Style = `margin:0 0 ${paragraphSpacing}px;padding:0;${baseStyle}font-size:${Math.round(fontSize * 1.75)}px;line-height:${lineHeight * 0.9};font-weight:${headingWeight}`;
			htmlParts.push(`<h1 style="${h1Style}">${content}</h1>`);
			continue;
		}

		if (h2Match) {
			flushList();
			flushBlockquote();
			const content = processInlineFormatting(h2Match[1], true);
			const h2Style = `margin:0 0 ${paragraphSpacing}px;padding:0;${baseStyle}font-size:${Math.round(fontSize * 1.5)}px;line-height:${lineHeight * 0.9};font-weight:${headingWeight}`;
			htmlParts.push(`<h2 style="${h2Style}">${content}</h2>`);
			continue;
		}

		if (h3Match) {
			flushList();
			flushBlockquote();
			const content = processInlineFormatting(h3Match[1], true);
			const h3Style = `margin:0 0 ${paragraphSpacing}px;padding:0;${baseStyle}font-size:${Math.round(fontSize * 1.2)}px;line-height:${lineHeight * 0.9};font-weight:${headingWeight}`;
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
		'<code style="background-color:rgba(0,0,0,0.05);padding:2px 6px;border-radius:3px;font-family:monospace">$1</code>'
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
	const { fontFamily, textColor, fontSize, lineHeight, paragraphSpacing, headingWeight, bodyWeight, imageCornerRadius } = styles;

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
	});

	// Remove margin from last element
	if (htmlParts.length > 0) {
		const lastIndex = htmlParts.length - 1;
		htmlParts[lastIndex] = htmlParts[lastIndex].replace(
			/margin:0 0 \d+px/,
			"margin:0"
		);
	}

	return htmlParts.join("\n");
}

