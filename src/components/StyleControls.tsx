import { EmailStyles, fontFamilyOptions } from "../types";

interface StyleControlsProps {
  styles: EmailStyles;
  onStyleChange: <K extends keyof EmailStyles>(key: K, value: EmailStyles[K]) => void;
}

export default function StyleControls({ styles, onStyleChange }: StyleControlsProps) {
  return (
    <>
      {/* Font Family */}
      <div className="control-group">
        <label className="control-label">Font Family</label>
        <select
          className="control-input control-select"
          value={styles.fontFamily}
          onChange={(e) => onStyleChange("fontFamily", e.target.value)}
        >
          {fontFamilyOptions.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="control-group">
        <label className="control-label">Font Size</label>
        <input
          type="range"
          className="control-input control-range"
          min={12}
          max={24}
          step={1}
          value={styles.fontSize}
          onChange={(e) => onStyleChange("fontSize", Number(e.target.value))}
        />
        <div className="range-value">{styles.fontSize}px</div>
      </div>

      {/* Max Width */}
      <div className="control-group">
        <label className="control-label">Max Width</label>
        <input
          type="range"
          className="control-input control-range"
          min={400}
          max={900}
          step={20}
          value={styles.maxWidth}
          onChange={(e) => onStyleChange("maxWidth", Number(e.target.value))}
        />
        <div className="range-value">{styles.maxWidth}px</div>
      </div>

      {/* Line Height */}
      <div className="control-group">
        <label className="control-label">Line Height</label>
        <input
          type="range"
          className="control-input control-range"
          min={1.0}
          max={2.5}
          step={0.1}
          value={styles.lineHeight}
          onChange={(e) => onStyleChange("lineHeight", Number(e.target.value))}
        />
        <div className="range-value">{styles.lineHeight.toFixed(1)}</div>
      </div>

      {/* Text Color */}
      <div className="control-group">
        <label className="control-label">Text Color</label>
        <div className="color-input-wrapper">
          <div className="color-swatch">
            <input
              type="color"
              value={styles.textColor}
              onChange={(e) => onStyleChange("textColor", e.target.value)}
            />
          </div>
          <input
            type="text"
            className="control-input color-hex-input"
            value={styles.textColor}
            onChange={(e) => onStyleChange("textColor", e.target.value)}
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="control-group">
        <label className="control-label">Background</label>
        <div className="color-input-wrapper">
          <div className="color-swatch">
            <input
              type="color"
              value={styles.backgroundColor}
              onChange={(e) => onStyleChange("backgroundColor", e.target.value)}
            />
          </div>
          <input
            type="text"
            className="control-input color-hex-input"
            value={styles.backgroundColor}
            onChange={(e) => onStyleChange("backgroundColor", e.target.value)}
          />
        </div>
      </div>

      {/* Paragraph Spacing */}
      <div className="control-group">
        <label className="control-label">Paragraph Spacing</label>
        <input
          type="range"
          className="control-input control-range"
          min={0}
          max={40}
          step={2}
          value={styles.paragraphSpacing}
          onChange={(e) => onStyleChange("paragraphSpacing", Number(e.target.value))}
        />
        <div className="range-value">{styles.paragraphSpacing}px</div>
      </div>

      {/* Top Margin */}
      <div className="control-group">
        <label className="control-label">Top Margin</label>
        <input
          type="range"
          className="control-input control-range"
          min={0}
          max={100}
          step={4}
          value={styles.marginTop}
          onChange={(e) => onStyleChange("marginTop", Number(e.target.value))}
        />
        <div className="range-value">{styles.marginTop}px</div>
      </div>

      {/* Sides Margin */}
      <div className="control-group">
        <label className="control-label">Sides Margin</label>
        <input
          type="range"
          className="control-input control-range"
          min={0}
          max={100}
          step={4}
          value={styles.marginSides}
          onChange={(e) => onStyleChange("marginSides", Number(e.target.value))}
        />
        <div className="range-value">{styles.marginSides}px</div>
      </div>

      {/* Bottom Margin */}
      <div className="control-group">
        <label className="control-label">Bottom Margin</label>
        <input
          type="range"
          className="control-input control-range"
          min={0}
          max={100}
          step={4}
          value={styles.marginBottom}
          onChange={(e) => onStyleChange("marginBottom", Number(e.target.value))}
        />
        <div className="range-value">{styles.marginBottom}px</div>
      </div>
    </>
  );
}

