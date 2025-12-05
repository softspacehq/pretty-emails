import { useMemo } from "react";
import { EmailStyles } from "../types";
import { renderEmailBodyHtml } from "../utils/emailRenderer";

interface EmailPreviewProps {
  markdown: string;
  html?: string;
  styles: EmailStyles;
}

export default function EmailPreview({ markdown, html, styles }: EmailPreviewProps) {
  const { fontFamily, fontSize, lineHeight, maxWidth, textColor, backgroundColor, marginTop, marginSides, marginBottom } = styles;

  const bodyHtml = useMemo(() => {
    return renderEmailBodyHtml(markdown, styles, html);
  }, [markdown, styles, html]);

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding: `${marginTop}px ${marginSides}px ${marginBottom}px ${marginSides}px`,
    minHeight: "100%",
  };

  const innerStyle: React.CSSProperties = {
    maxWidth: `${maxWidth}px`,
    margin: "0 auto",
    fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight,
    color: textColor,
  };

  return (
    <div style={containerStyle} className="email-preview-inner">
      <div style={innerStyle} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  );
}

