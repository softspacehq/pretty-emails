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
				<label className="control-label">
					Font Size
					<span className="range-value">{styles.fontSize}px</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={12}
					max={24}
					step={1}
					value={styles.fontSize}
					onChange={(e) => onStyleChange("fontSize", Number(e.target.value))}
				/>
			</div>

			{/* Max Width */}
			<div className="control-group">
				<label className="control-label">
					Max Width
					<span className="range-value">{styles.maxWidth}px</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={300}
					max={1200}
					step={10}
					value={styles.maxWidth}
					onChange={(e) => onStyleChange("maxWidth", Number(e.target.value))}
				/>
			</div>

			{/* Line Height */}
			<div className="control-group">
				<label className="control-label">
					Line Height
					<span className="range-value">{styles.lineHeight.toFixed(1)}</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={1.0}
					max={2.5}
					step={0.1}
					value={styles.lineHeight}
					onChange={(e) => onStyleChange("lineHeight", Number(e.target.value))}
				/>
			</div>

			{/* Heading Weight */}
			<div className="control-group">
				<label className="control-label">
					Heading Weight
					<span className="range-value">{styles.headingWeight}</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={100}
					max={900}
					step={100}
					value={styles.headingWeight}
					onChange={(e) => onStyleChange("headingWeight", Number(e.target.value))}
				/>
			</div>

			{/* Body Weight */}
			<div className="control-group">
				<label className="control-label">
					Body Weight
					<span className="range-value">{styles.bodyWeight}</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={100}
					max={900}
					step={100}
					value={styles.bodyWeight}
					onChange={(e) => onStyleChange("bodyWeight", Number(e.target.value))}
				/>
			</div>

			{/* Paragraph Spacing */}
			<div className="control-group">
				<label className="control-label">
					Paragraph Spacing
					<span className="range-value">{styles.paragraphSpacing}px</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={0}
					max={40}
					step={2}
					value={styles.paragraphSpacing}
					onChange={(e) => onStyleChange("paragraphSpacing", Number(e.target.value))}
				/>
			</div>

			{/* Top Margin */}
			<div className="control-group">
				<label className="control-label">
					Top Margin
					<span className="range-value">{styles.marginTop}px</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={0}
					max={200}
					step={4}
					value={styles.marginTop}
					onChange={(e) => onStyleChange("marginTop", Number(e.target.value))}
				/>
			</div>

			{/* Sides Margin */}
			<div className="control-group">
				<label className="control-label">
					Sides Margin
					<span className="range-value">{styles.marginSides}px</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={0}
					max={200}
					step={4}
					value={styles.marginSides}
					onChange={(e) => onStyleChange("marginSides", Number(e.target.value))}
				/>
			</div>

			{/* Bottom Margin */}
			<div className="control-group">
				<label className="control-label">
					Bottom Margin
					<span className="range-value">{styles.marginBottom}px</span>
				</label>
				<input
					type="range"
					className="control-input control-range"
					min={0}
					max={200}
					step={4}
					value={styles.marginBottom}
					onChange={(e) => onStyleChange("marginBottom", Number(e.target.value))}
				/>
			</div>
		</>
	);
}

