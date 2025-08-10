import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, User, Palette, Lock, Save, Loader2, CheckCircle, XCircle, AlertTriangle, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PasswordChangeModal } from "@/components/modals/PasswordChangeModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { ConfirmLogoutModal } from "@/components/modals/ConfirmLogoutModal";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";

const userDataSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
});

type UserDataForm = z.infer<typeof userDataSchema>;

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateProfile, loading: authLoading, deleteAccount, logout } = useAuth();
  const { uploadFile, uploading } = useFileUpload({ bucket: 'avatars' });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm<UserDataForm>({
    resolver: zodResolver(userDataSchema),
  });

  const usernameValue = watch('username');
  const debouncedUsername = useDebounce(usernameValue, 500);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        email: user.email,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    const checkUsername = async () => {
      if (!user || !debouncedUsername || debouncedUsername === user.username || debouncedUsername.length < 3) {
        setUsernameStatus('idle');
        return;
      }
      setUsernameStatus('checking');
      const { data } = await supabase.from('profiles').select('username').eq('username', debouncedUsername).single();
      setUsernameStatus(data ? 'taken' : 'available');
    };
    checkUsername();
  }, [debouncedUsername, user]);

  const handleSave = async (data: UserDataForm) => {
    if (usernameStatus === 'taken') {
      toast.error("Nome de usuário indisponível");
      return;
    }
    await updateProfile({ name: data.name, username: data.username });
    reset(data);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const publicUrl = await uploadFile(file);
      if (publicUrl) {
        await updateProfile({ avatar: publicUrl });
      }
    }
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setDeleteModalOpen(false);
    navigate('/');
  };

  const handleLogout = async () => {
    await logout();
    setLogoutModalOpen(false);
    navigate('/');
  };

  if (authLoading || !user) return <SettingsSkeleton />;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative z-10 container mx-auto px-4 py-8 pb-28 md:pb-8 max-w-4xl">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold neon-text">Configurações</h1>
            <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
          </div>
          <Button onClick={handleSubmit(handleSave)} disabled={!isDirty || authLoading || usernameStatus === 'taken'} className="bg-gradient-primary hover:opacity-90">
            {authLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-8">
          <Card className="glass-card border-accent/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />Dados Pessoais</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-2 ring-primary/20">
                    <AvatarImage src={user.avatar} alt="Avatar" />
                    <AvatarFallback className="text-xl bg-gradient-primary text-primary-foreground">{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <Button type="button" size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </Button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <div className="flex-1"><h3 className="font-semibold text-lg">{user.name}</h3><p className="text-muted-foreground">@{user.username}</p></div>
              </div>
              <Separator className="bg-border/50" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" {...register("name")} className="bg-background/50" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <div className="relative">
                    <Input id="username" {...register("username")} className="bg-background/50 pr-8" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 text-white/50 animate-spin" />}
                      {usernameStatus === 'available' && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                      {usernameStatus === 'taken' && <XCircle className="h-4 w-4 text-red-400" />}
                    </div>
                  </div>
                  {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                  {usernameStatus === 'taken' && <p className="text-sm text-red-400">Este nome de usuário já está em uso.</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" {...register("email")} className="bg-background/50" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Aparência</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["light", "dark", "neon"] as const).map((themeOption) => (
                  <div key={themeOption} className={`p-4 rounded-lg border-2 cursor-pointer ${theme === themeOption ? "border-primary" : "border-border"}`} onClick={() => setTheme(themeOption)}>
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-10 rounded-md ${themeOption === "light" ? "bg-white" : themeOption === "dark" ? "bg-gray-900" : "bg-gradient-neon"}`} />
                      <p className="font-medium capitalize flex items-center gap-2">{themeOption} {theme === themeOption && <CheckCircle className="h-4 w-4 text-primary" />}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" />Segurança</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-card/30">
                <div><h4 className="font-medium">Alterar senha</h4><p className="text-sm text-muted-foreground">Recomendamos trocar sua senha regularmente</p></div>
                <Button type="button" variant="outline" onClick={() => setPasswordModalOpen(true)}>Alterar</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-card/30">
                <div><h4 className="font-medium">Sair da conta</h4><p className="text-sm text-muted-foreground">Desconectar sua sessão em todos os dispositivos</p></div>
                <Button type="button" variant="outline" onClick={() => setLogoutModalOpen(true)}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-destructive/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />Zona de Perigo</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                <div><h4 className="font-medium text-destructive">Deletar conta</h4><p className="text-sm text-destructive/80">Esta ação é permanente e removerá todos os seus dados.</p></div>
                <Button type="button" variant="destructive" onClick={() => setDeleteModalOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Deletar</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      <PasswordChangeModal open={passwordModalOpen} onOpenChange={setPasswordModalOpen} />
      <ConfirmDeleteModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={handleDeleteAccount} title="Deletar sua conta permanentemente?" itemName="sua conta e todos os dados associados" />
      <ConfirmLogoutModal open={logoutModalOpen} onOpenChange={setLogoutModalOpen} onConfirm={handleLogout} />
    </div>
  );
}

const SettingsSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl">
    <div className="flex items-center justify-between mb-8"><Skeleton className="h-10 w-64" /><Skeleton className="h-10 w-24" /></div>
    <div className="space-y-8"><Skeleton className="h-80 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-32 w-full" /></div>
  </div>
);