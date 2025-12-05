export interface EmailStyles {
  fontFamily: string;
  fontSize: number;
  maxWidth: number;
  lineHeight: number;
  textColor: string;
  backgroundColor: string;
  paragraphSpacing: number;
}

export const defaultEmailStyles: EmailStyles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: 16,
  maxWidth: 560,
  lineHeight: 1.5,
  textColor: '#1a1a1a',
  backgroundColor: '#ffffff',
  paragraphSpacing: 18,
};

export const fontFamilyOptions = [
  { label: 'System', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", Times, serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

