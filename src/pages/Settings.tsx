import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, ArrowLeft, User, Palette, Shield, Lock, Save, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PasswordChangeModal } from "@/components/modals/PasswordChangeModal";
import { UnsavedChangesModal } from "@/components/modals/UnsavedChangesModal";

// Validation schemas
const userDataSchema = z.object({
  name: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  username: z.string()
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .max(30, "Username deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Username pode conter apenas letras, números e underscore"),
  email: z.string()
    .email("Email inválido")
    .max(100, "Email deve ter no máximo 100 caracteres"),
  bio: z.string()
    .max(200, "Bio deve ter no máximo 200 caracteres")
});

type UserDataForm = z.infer<typeof userDataSchema>;

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [unsavedChangesModalOpen, setUnsavedChangesModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Form state
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Initial data
  const initialUserData = {
    name: "João Silva",
    username: "joaosilva",
    email: "joao@exemplo.com",
    bio: "Criador de conteúdo digital",
  };
  
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=150&width=150");
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showStats: false,
    allowMessages: true,
  });

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    getValues
  } = useForm<UserDataForm>({
    resolver: zodResolver(userDataSchema),
    defaultValues: initialUserData,
    mode: "onChange"
  });

  // File upload hook
  const { uploading, preview, handleFileSelect, clearPreview } = useFileUpload({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    onSuccess: (file, url) => {
      setAvatarUrl(url);
      setHasUnsavedChanges(true);
    }
  });

  // Watch form changes
  const formData = watch();
  
  useEffect(() => {
    const hasFormChanges = isDirty || preview !== null;
    setHasUnsavedChanges(hasFormChanges);
  }, [isDirty, preview]);

  const handleSaveClick = async () => {
    setSaving(true);
    
    try {
      // Get current form values
      const currentData = getValues();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save user data to localStorage (in production, this would be an API call)
      localStorage.setItem('user-profile', JSON.stringify(currentData));
      
      // Save avatar if changed
      if (preview) {
        localStorage.setItem('user-avatar', avatarUrl);
        clearPreview();
      }
      
      toast({
        title: "Configurações salvas",
        description: "Suas alterações foram salvas com sucesso.",
      });
      
      setHasUnsavedChanges(false);
      reset(currentData);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNavigation = (navigateFn: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => navigateFn);
      setUnsavedChangesModalOpen(true);
    } else {
      navigateFn();
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "neon") => {
    setTheme(newTheme);
    setHasUnsavedChanges(true);
  };

  const onSubmit = (data: UserDataForm) => {
    // Form submission handled by handleSave
  };

  // Get current form values for display
  const currentValues = getValues();
  const displayAvatar = preview || avatarUrl;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 pb-28 md:pb-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation(() => navigate("/dashboard"))}
              className="hover:bg-accent/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold neon-text">Configurações</h1>
              <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 mt-1">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-amber-400">Alterações não salvas</span>
                </div>
              )}
            </div>
          </div>
          <Button 
            type="button"
            onClick={handleSaveClick} 
            disabled={saving || !hasUnsavedChanges}
            className="w-full sm:w-auto bg-gradient-primary hover:opacity-90"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Salvando...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados Pessoais */}
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e foto de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-2 ring-primary/20">
                    <AvatarImage src={displayAvatar} alt="Avatar" />
                    <AvatarFallback className="text-xl bg-gradient-primary text-primary-foreground">
                      {currentValues.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    </div>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                    onClick={handleAvatarClick}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{currentValues.name}</h3>
                  <p className="text-muted-foreground">@{currentValues.username}</p>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={handleAvatarClick}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
                        Enviando...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Alterar foto
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Separator className="bg-border/50" />

              {/* Formulário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className="bg-background/50 border-accent/20"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    {...register("username")}
                    className="bg-background/50 border-accent/20"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="bg-background/50 border-accent/20"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Descreva um pouco sobre você..."
                    className="bg-background/50 border-accent/20 min-h-[100px]"
                  />
                  {errors.bio && (
                    <p className="text-sm text-destructive">{errors.bio.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {(formData.bio?.length || 0)}/200 caracteres
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tema */}
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Aparência
              </CardTitle>
              <CardDescription>
                Escolha o tema que mais combina com você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["light", "dark", "neon"] as const).map((themeOption) => (
                  <div
                    key={themeOption}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                      theme === themeOption
                        ? "border-primary bg-primary/10 neon-glow"
                        : "border-border bg-card/50"
                    }`}
                    onClick={() => handleThemeChange(themeOption)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      {/* Preview do tema */}
                      <div className={`w-16 h-10 rounded-md transition-all ${
                        themeOption === "light" ? "bg-white border border-gray-200" :
                        themeOption === "dark" ? "bg-gray-900 border border-gray-700" :
                        "bg-gradient-neon"
                      }`}>
                        {themeOption === "neon" && (
                          <div className="w-full h-full rounded-md bg-gradient-neon opacity-80" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium capitalize flex items-center gap-2">
                          {themeOption === "light" ? "Claro" : 
                           themeOption === "dark" ? "Escuro" : "Neon"}
                          {theme === themeOption && <CheckCircle className="h-4 w-4 text-primary" />}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {themeOption === "light" ? "Visual limpo e claro" :
                           themeOption === "dark" ? "Modo escuro elegante" :
                           "Efeitos neon futuristas"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacidade
              </CardTitle>
              <CardDescription>
                Controle quem pode ver seu perfil e informações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-public">Perfil público</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que qualquer pessoa encontre seu perfil
                  </p>
                </div>
                <Switch
                  id="profile-public"
                  checked={privacy.profilePublic}
                  onCheckedChange={(checked) => {
                    setPrivacy({ ...privacy, profilePublic: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-stats">Mostrar estatísticas</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe número de visualizações e cliques no seu perfil
                  </p>
                </div>
                <Switch
                  id="show-stats"
                  checked={privacy.showStats}
                  onCheckedChange={(checked) => {
                    setPrivacy({ ...privacy, showStats: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-messages">Permitir mensagens</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que visitantes entrem em contato com você
                  </p>
                </div>
                <Switch
                  id="allow-messages"
                  checked={privacy.allowMessages}
                  onCheckedChange={(checked) => {
                    setPrivacy({ ...privacy, allowMessages: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Segurança
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50 hover:border-primary/30 transition-colors">
                <div>
                  <h4 className="font-medium">Alterar senha</h4>
                  <p className="text-sm text-muted-foreground">
                    Recomendamos trocar sua senha regularmente
                  </p>
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setPasswordModalOpen(true)}
                  className="hover:bg-primary/10 hover:border-primary"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Alterar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50">
                <div>
                  <h4 className="font-medium">Autenticação em duas etapas</h4>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Em breve
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Modals */}
      <PasswordChangeModal 
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
      />

      <UnsavedChangesModal
        open={unsavedChangesModalOpen}
        onOpenChange={setUnsavedChangesModalOpen}
        onConfirm={() => {
          setHasUnsavedChanges(false);
          pendingNavigation?.();
          setUnsavedChangesModalOpen(false);
          setPendingNavigation(null);
        }}
        onSave={() => {
          handleSaveClick().then(() => {
            pendingNavigation?.();
            setUnsavedChangesModalOpen(false);
            setPendingNavigation(null);
          });
        }}
      />
    </div>
  );
}