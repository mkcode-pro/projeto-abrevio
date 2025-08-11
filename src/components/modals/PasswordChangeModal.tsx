import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useToast } from "@/store/hooks/use-toast";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string()
    .min(8, "Nova senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Nova senha deve conter ao menos uma letra minúscula, maiúscula e um número"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Confirmação de senha não confere",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordChangeModal({ open, onOpenChange }: PasswordChangeModalProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange"
  });

  const newPassword = watch("newPassword");

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha foi atualizada com segurança.",
      });
      
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: "Não foi possível alterar sua senha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = [
      { label: "Muito fraca", color: "text-red-400" },
      { label: "Fraca", color: "text-orange-400" },
      { label: "Regular", color: "text-yellow-400" },
      { label: "Forte", color: "text-blue-400" },
      { label: "Muito forte", color: "text-emerald-400" }
    ];
    
    return { score, ...levels[Math.min(score, 4)] };
  };

  const passwordStrength = getPasswordStrength(newPassword || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-accent/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Alterar Senha
          </DialogTitle>
          <DialogDescription>
            Digite sua senha atual e escolha uma nova senha segura
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Senha Atual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                {...register("currentPassword")}
                className="bg-background/50 border-accent/20 pr-10"
                placeholder="Digite sua senha atual"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova senha</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword")}
                className="bg-background/50 border-accent/20 pr-10"
                placeholder="Digite sua nova senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {newPassword && (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/30 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 1 ? "bg-red-400" :
                      passwordStrength.score <= 2 ? "bg-orange-400" :
                      passwordStrength.score <= 3 ? "bg-yellow-400" :
                      passwordStrength.score <= 4 ? "bg-blue-400" : "bg-emerald-400"
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword")}
                className="bg-background/50 border-accent/20 pr-10"
                placeholder="Confirme sua nova senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Requisitos de Senha */}
          <div className="bg-card/30 rounded-lg p-3 text-sm">
            <p className="font-medium mb-2">Requisitos da senha:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-3 w-3 ${(newPassword?.length || 0) >= 8 ? "text-emerald-400" : "text-muted-foreground"}`} />
                <span className={(newPassword?.length || 0) >= 8 ? "text-emerald-400" : "text-muted-foreground"}>
                  Pelo menos 8 caracteres
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-3 w-3 ${/[A-Z]/.test(newPassword || "") ? "text-emerald-400" : "text-muted-foreground"}`} />
                <span className={/[A-Z]/.test(newPassword || "") ? "text-emerald-400" : "text-muted-foreground"}>
                  Uma letra maiúscula
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-3 w-3 ${/[a-z]/.test(newPassword || "") ? "text-emerald-400" : "text-muted-foreground"}`} />
                <span className={/[a-z]/.test(newPassword || "") ? "text-emerald-400" : "text-muted-foreground"}>
                  Uma letra minúscula
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-3 w-3 ${/\d/.test(newPassword || "") ? "text-emerald-400" : "text-muted-foreground"}`} />
                <span className={/\d/.test(newPassword || "") ? "text-emerald-400" : "text-muted-foreground"}>
                  Um número
                </span>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Alterando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Alterar Senha
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}