import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, ArrowLeft, User, Palette, Shield, Lock, Save, Upload, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PasswordChangeModal } from "@/components/modals/PasswordChangeModal";
import { UnsavedChangesModal } from "@/components/modals/UnsavedChangesModal";
import { useAuth } from "@/contexts/AuthContext";
import { useBioLink } from "@/hooks/useBioLink";
import { Skeleton } from "@/components/ui/skeleton";

const userDataSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50, "Nome deve ter no máximo 50 caracteres"),
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres").max(30, "Username deve ter no máximo 30 caracteres").regex(/^[a-zA-Z0-9_]+$/, "Username pode conter apenas letras, números e underscore"),
  email: z.string().email("Email inválido").max(100, "Email deve ter no máximo 100 caracteres"),
  bio: z.string().max(200, "Bio deve ter no máximo 200 caracteres"),
});

type UserDataForm = z.infer<typeof userDataSchema>;

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, updateProfile: updateAuthProfile, loading: authLoading } = useAuth();
  const { bioLinkData, updateProfile: updateBioLinkProfile, isLoading: bioLinkLoading } = useBioLink();
  const { uploadFile, uploading } = useFileUpload({ bucket: 'avatars' });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [unsavedChangesModalOpen, setUnsavedChangesModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<UserDataForm>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange"
  });

  useEffect(() => {
    if (user && bioLinkData) {
      reset({
        name: bioLinkData.userData.name || user.name,
        username: bioLinkData.userData.username || user.username,
        email: user.email,
        bio: bioLinkData.userData.bio || "",
      });
    }
  }, [user, bioLinkData, reset]);

  const handleSave = async (data: UserDataForm) => {
    if (!user || !bioLinkData) return;
    setSaving(true);

    try {
      const authUpdates = { name: data.name, username: data.username };
      const bioLinkUpdates = { name: data.name, username: data.username, bio: data.bio };

      await Promise.all([
        updateAuthProfile(authUpdates),
        updateBioLinkProfile(bioLinkUpdates)
      ]);

      reset(data);
      toast.success("Configurações salvas com sucesso.");
    } catch (error) {
      toast.error("Erro ao salvar", { description: "Não foi possível salvar as configurações. Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const publicUrl = await uploadFile(file);
      if (publicUrl) {
        await Promise.all([
          updateAuthProfile({ avatar: publicUrl }),
          updateBioLinkProfile({ avatar: publicUrl })
        ]);
      }
    }
  };

  const handleNavigation = (navigateFn: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => navigateFn);
      setUnsavedChangesModalOpen(true);
    } else {
      navigateFn();
    }
  };

  const isLoading = authLoading || bioLinkLoading;
  const formData = watch();

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  const displayAvatar = bioLinkData?.userData.avatar || user?.avatar;
  const displayName = bioLinkData?.userData.name || user?.name || "";
  const displayUsername = bioLinkData?.userData.username || user?.username || "";

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative z-10 container mx-auto px-4 py-8 pb-28 md:pb-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => handleNavigation(() => navigate("/dashboard"))} className="hover:bg-accent/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold neon-text">Configurações</h1>
              <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
              {isDirty && (
                <div className="flex items-center gap-2 mt-1">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-amber-400">Alterações não salvas</span>
                </div>
              )}
            </div>
          </div>
          <Button onClick={handleSubmit(handleSave)} disabled={saving || !isDirty} className="w-full sm:w-auto bg-gradient-primary hover:opacity-90">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-8">
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />Dados Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais e foto de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-2 ring-primary/20">
                    <AvatarImage src={displayAvatar} alt="Avatar" />
                    <AvatarFallback className="text-xl bg-gradient-primary text-primary-foreground">{displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <Button type="button" size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{displayName}</h3>
                  <p className="text-muted-foreground">@{displayUsername}</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    {uploading ? "Enviando..." : "Alterar foto"}
                  </Button>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              <Separator className="bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" {...register("name")} className="bg-background/50 border-accent/20" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input id="username" {...register("username")} className="bg-background/50 border-accent/20" />
                  {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" {...register("email")} className="bg-background/50 border-accent/20" disabled />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...register("bio")} placeholder="Descreva um pouco sobre você..." className="bg-background/50 border-accent/20 min-h-[100px]" />
                  {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                  <p className="text-xs text-muted-foreground">{(formData.bio?.length || 0)}/200 caracteres</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Aparência</CardTitle>
              <CardDescription>Escolha o tema que mais combina com você</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["light", "dark", "neon"] as const).map((themeOption) => (
                  <div key={themeOption} className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${theme === themeOption ? "border-primary bg-primary/10 neon-glow" : "border-border bg-card/50"}`} onClick={() => setTheme(themeOption)}>
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-10 rounded-md transition-all ${themeOption === "light" ? "bg-white border border-gray-200" : themeOption === "dark" ? "bg-gray-900 border border-gray-700" : "bg-gradient-neon"}`} />
                      <div className="text-center">
                        <p className="font-medium capitalize flex items-center gap-2">
                          {themeOption === "light" ? "Claro" : themeOption === "dark" ? "Escuro" : "Neon"}
                          {theme === themeOption && <CheckCircle className="h-4 w-4 text-primary" />}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" />Segurança</CardTitle>
              <CardDescription>Mantenha sua conta segura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50 hover:border-primary/30 transition-colors">
                <div>
                  <h4 className="font-medium">Alterar senha</h4>
                  <p className="text-sm text-muted-foreground">Recomendamos trocar sua senha regularmente</p>
                </div>
                <Button type="button" variant="outline" onClick={() => setPasswordModalOpen(true)} className="hover:bg-primary/10 hover:border-primary">
                  <Lock className="h-4 w-4 mr-2" />Alterar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      <PasswordChangeModal open={passwordModalOpen} onOpenChange={setPasswordModalOpen} />
      <UnsavedChangesModal open={unsavedChangesModalOpen} onOpenChange={setUnsavedChangesModalOpen} onConfirm={() => { pendingNavigation?.(); setUnsavedChangesModalOpen(false); }} onSave={() => { handleSubmit(handleSave)(); setUnsavedChangesModalOpen(false); }} />
    </div>
  );
}

const SettingsSkeleton = () => (
  <div className="min-h-screen bg-background relative overflow-x-hidden">
    <div className="absolute inset-0 grid-pattern opacity-20" />
    <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  </div>
);