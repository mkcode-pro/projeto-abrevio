import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, UserPlus, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres").regex(/^[a-z0-9_.]+$/, "Use apenas letras minúsculas, números, '.' ou '_'"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function Signup() {
  const navigate = useNavigate()
  const { register: signup, loading } = useAuth()
  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  })

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const usernameValue = watch('username');
  const debouncedUsername = useDebounce(usernameValue, 500);

  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setUsernameStatus('idle');
        return;
      }
      setUsernameStatus('checking');
      const { data, error } = await supabase.rpc('username_exists', { p_username: debouncedUsername });
      
      if (error) {
        console.error("Erro ao verificar username:", error);
        setUsernameStatus('idle'); // Reset in case of error
        return;
      }
      
      setUsernameStatus(data ? 'taken' : 'available');
    };

    checkUsername();
  }, [debouncedUsername]);

  const onSubmit = async (data: SignupFormValues) => {
    if (usernameStatus === 'taken') {
      toast.error("Nome de usuário indisponível");
      return;
    }
    
    const success = await signup(data.email, data.password, data.username, data.name);
    if (success) {
      toast.success("Conta criada com sucesso!", {
        description: "Agora faça login para acessar sua conta."
      });
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="glass-card border-white/20 w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-neon neon-glow">
              <Link2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Crie sua conta</CardTitle>
          <CardDescription>Comece a centralizar seus links gratuitamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" {...register("name")} className="bg-white/5 border-white/20 text-white" />
              {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <Input id="username" placeholder="seu_usuario" {...register("username")} className="bg-white/5 border-white/20 text-white pr-8" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 text-white/50 animate-spin" />}
                  {usernameStatus === 'available' && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                  {usernameStatus === 'taken' && <XCircle className="h-4 w-4 text-red-400" />}
                </div>
              </div>
              {errors.username && <p className="text-sm text-red-400">{errors.username.message}</p>}
              {usernameStatus === 'taken' && <p className="text-sm text-red-400">Este nome de usuário já está em uso.</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} className="bg-white/5 border-white/20 text-white" />
              {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Crie uma senha forte" {...register("password")} className="bg-white/5 border-white/20 text-white" />
              {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={!isValid || loading || usernameStatus !== 'available'} className="w-full bg-gradient-primary hover:opacity-90 btn-futuristic">
              {loading ? "Criando conta..." : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta Grátis
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-white/70">Já tem uma conta? </span>
            <Link to="/login" className="font-semibold text-neon-blue hover:underline">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}