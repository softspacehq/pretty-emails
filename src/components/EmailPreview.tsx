import { useMemo } from "react";
import { EmailStyles } from "../types";
import { renderEmailBodyHtml } from "../utils/emailRenderer";

interface EmailPreviewProps {
  markdown: string;
  styles: EmailStyles;
}

export default function EmailPreview({ markdown, styles }: EmailPreviewProps) {
  const { fontFamily, fontSize, lineHeight, maxWidth, textColor, backgroundColor } = styles;

  const bodyHtml = useMemo(() => {
    return renderEmailBodyHtml(markdown, styles);
  }, [markdown, styles]);

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding: "20px",
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

