export interface EmailStyles {
  fontFamily: string;
  fontSize: number;
  maxWidth: number;
  lineHeight: number;
  textColor: string;
  backgroundColor: string;
  paragraphSpacing: number;
  marginTop: number;
  marginSides: number;
  marginBottom: number;
  headingWeight: number;
  bodyWeight: number;
}

export const defaultEmailStyles: EmailStyles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: 16,
  maxWidth: 560,
  lineHeight: 1.5,
  textColor: '#000000',
  backgroundColor: '#ffffff',
  paragraphSpacing: 18,
  marginTop: 20,
  marginSides: 20,
  marginBottom: 20,
  headingWeight: 600,
  bodyWeight: 400,
};

export const fontFamilyOptions = [
  { label: 'System', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", Times, serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

