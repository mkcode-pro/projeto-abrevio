export interface BioLinkTheme {
  id: string; // Mantido para compatibilidade, mas agora é mais um 'presetId'
  name: string;
  styles: {
    backgroundType: 'solid' | 'gradient';
    backgroundColor1: string;
    backgroundColor2: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    buttonBorder?: string;
    nameColor?: string;
    usernameColor?: string;
  };
}

export const defaultTheme: BioLinkTheme = {
  id: 'custom',
  name: 'Customizado',
  styles: {
    backgroundType: 'gradient',
    backgroundColor1: '#1a1a2e',
    backgroundColor2: '#0f3460',
    textColor: '#e0e0e0',
    buttonColor: 'rgba(255, 255, 255, 0.08)',
    buttonTextColor: '#ffffff',
    buttonBorder: '1px solid rgba(255, 255, 255, 0.15)',
    nameColor: '#ffffff',
    usernameColor: '#00B8FF',
  },
};