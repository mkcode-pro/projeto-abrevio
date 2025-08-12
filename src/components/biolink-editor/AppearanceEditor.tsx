import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { ColorPicker } from './ColorPicker';
import { BioLinkTheme } from './ThemeLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppearanceEditorProps {
  theme: BioLinkTheme;
  onThemeChange: (theme: BioLinkTheme) => void;
}

export function AppearanceEditor({ theme, onThemeChange }: AppearanceEditorProps) {
  const handleColorChange = (key: keyof BioLinkTheme['styles'], value: string) => {
    onThemeChange({
      ...theme,
      styles: {
        ...theme.styles,
        [key]: value,
      },
    });
  };

  const handleBackgroundTypeChange = (type: 'solid' | 'gradient') => {
    onThemeChange({
      ...theme,
      styles: {
        ...theme.styles,
        backgroundType: type,
      },
    });
  };

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-neon-blue" />
          Aparência
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Background Section */}
        <div>
          <Label className="text-white text-sm font-medium mb-3 block">Fundo da Página</Label>
          <Tabs value={theme.styles.backgroundType || 'solid'} onValueChange={(value) => handleBackgroundTypeChange(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-card p-1 h-auto">
              <TabsTrigger value="solid">Cor Sólida</TabsTrigger>
              <TabsTrigger value="gradient">Gradiente</TabsTrigger>
            </TabsList>
            <TabsContent value="solid" className="pt-4">
              <div className="flex items-center gap-4">
                <ColorPicker color={theme.styles.backgroundColor1 || '#000000'} onChange={(c) => handleColorChange('backgroundColor1', c)} />
                <p className="text-white/80 text-sm">Escolha a cor de fundo</p>
              </div>
            </TabsContent>
            <TabsContent value="gradient" className="pt-4 space-y-3">
              <div className="flex items-center gap-4">
                <ColorPicker color={theme.styles.backgroundColor1 || '#000000'} onChange={(c) => handleColorChange('backgroundColor1', c)} />
                <p className="text-white/80 text-sm">Cor inicial do gradiente</p>
              </div>
              <div className="flex items-center gap-4">
                <ColorPicker color={theme.styles.backgroundColor2 || '#1a1a2e'} onChange={(c) => handleColorChange('backgroundColor2', c)} />
                <p className="text-white/80 text-sm">Cor final do gradiente</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Buttons and Text Section */}
        <div>
          <Label className="text-white text-sm font-medium mb-3 block">Botões e Textos</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <ColorPicker color={theme.styles.buttonColor || '#ffffff'} onChange={(c) => handleColorChange('buttonColor', c)} />
              <Label className="text-white/80 text-sm">Fundo do Botão</Label>
            </div>
            <div className="flex items-center gap-3">
              <ColorPicker color={theme.styles.buttonTextColor || '#000000'} onChange={(c) => handleColorChange('buttonTextColor', c)} />
              <Label className="text-white/80 text-sm">Texto do Botão</Label>
            </div>
            <div className="flex items-center gap-3">
              <ColorPicker color={theme.styles.nameColor || '#ffffff'} onChange={(c) => handleColorChange('nameColor', c)} />
              <Label className="text-white/80 text-sm">Cor do Nome</Label>
            </div>
            <div className="flex items-center gap-3">
              <ColorPicker color={theme.styles.textColor || '#e0e0e0'} onChange={(c) => handleColorChange('textColor', c)} />
              <Label className="text-white/80 text-sm">Cor da Bio</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}