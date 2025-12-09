import { EmailStyles, fontFamilyOptions } from "../types";

interface StyleControlsProps {
	styles: EmailStyles;
	onStyleChange: <K extends keyof EmailStyles>(key: K, value: EmailStyles[K]) => void;
}

export default function StyleControls({ styles, onStyleChange }: StyleControlsProps) {
	return (
		<>
			{/* Typography Section */}
			<div className="control-section">
				<div className="control-section-title">Typography</div>

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
						step={20}
						value={styles.bodyWeight}
						onChange={(e) => onStyleChange("bodyWeight", Number(e.target.value))}
					/>
				</div>

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
						step={20}
						value={styles.headingWeight}
						onChange={(e) => onStyleChange("headingWeight", Number(e.target.value))}
					/>
				</div>
			</div>

			{/* Layout Section */}
			<div className="control-section">
				<div className="control-section-title">Layout</div>

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

				<div className="control-group">
					<label className="control-label">
						Top Padding
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

				<div className="control-group">
					<label className="control-label">
						Side Padding
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

				<div className="control-group">
					<label className="control-label">
						Bottom Padding
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

				<div className="control-group">
					<label className="control-label">
						Heading Margin
						<span className="range-value">{styles.headingTopMargin.toFixed(1)}rem</span>
					</label>
					<input
						type="range"
						className="control-input control-range"
						min={0}
						max={3}
						step={0.1}
						value={styles.headingTopMargin}
						onChange={(e) => onStyleChange("headingTopMargin", Number(e.target.value))}
					/>
				</div>
			</div>

			{/* Media Section */}
			<div className="control-section">
				<div className="control-section-title">Media</div>

				<div className="control-group">
					<label className="control-label">
						Image Corner Radius
						<span className="range-value">{styles.imageCornerRadius}px</span>
					</label>
					<input
						type="range"
						className="control-input control-range"
						min={0}
						max={24}
						step={1}
						value={styles.imageCornerRadius}
						onChange={(e) => onStyleChange("imageCornerRadius", Number(e.target.value))}
					/>
				</div>
			</div>
		</>
	);
}

