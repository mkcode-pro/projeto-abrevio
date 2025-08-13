import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/store/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, LogIn } from "lucide-react"
import { AuthLayout } from "@/components/layout/AuthLayout"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, isAuthenticated } = useAuth()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
  }

  return (
    <AuthLayout>
      <Card className="glass-card border-white/20 w-full max-w-[min(90vw,26rem)] animate-fade-in">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-neon neon-glow">
              <Link2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white">Bem-vindo de volta!</CardTitle>
          <CardDescription className="text-sm sm:text-base mt-1.5">Faça login para acessar seu painel.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                autoFocus
                {...register("email")}
                className="bg-white/5 border-white/20 text-white h-10 sm:h-11 text-sm sm:text-base"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <p id="email-error" className="text-xs sm:text-sm text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                autoComplete="current-password"
                {...register("password")}
                className="bg-white/5 border-white/20 text-white h-10 sm:h-11 text-sm sm:text-base"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && <p id="password-error" className="text-xs sm:text-sm text-red-400 mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={!isValid || loading} className="w-full bg-gradient-primary hover:opacity-90 btn-futuristic h-10 sm:h-11 text-sm sm:text-base mt-4 sm:mt-6">
              {loading ? "Entrando..." : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            <span className="text-white/70">Não tem uma conta? </span>
            <Link to="/signup" className="font-semibold text-neon-blue hover:underline focus:outline-none focus:ring-2 focus:ring-neon-blue/50 rounded px-1">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}