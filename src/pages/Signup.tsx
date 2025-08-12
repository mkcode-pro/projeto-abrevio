import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/store/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, UserPlus, Loader2, CheckCircle, XCircle, AlertCircle, Lightbulb } from "lucide-react"
import { useUsernameCheck, useClearUsernameCache } from "@/store/hooks/useUsernameCheck"
import { getUsernameQualityScore } from "@/lib/usernameValidator"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

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
  const clearCache = useClearUsernameCache()
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  })

  const usernameValue = watch('username');
  const usernameCheck = useUsernameCheck(usernameValue);
  const qualityScore = usernameValue ? getUsernameQualityScore(usernameValue) : null;

  const onSubmit = async (data: SignupFormValues) => {
    if (usernameCheck.status === 'taken' || usernameCheck.status === 'error') {
      toast.error("Nome de usuário indisponível ou inválido");
      return;
    }
    
    if (!usernameCheck.isValid) {
      toast.error("Por favor, escolha um username válido");
      return;
    }
    
    const result = await signup(data.email, data.password, data.username, data.name);
    if (result.success) {
      clearCache(data.username); // Limpar cache após registro bem-sucedido
      toast.success("Conta criada com sucesso!", {
        description: "Agora faça login para acessar sua conta."
      });
      navigate("/login");
    }
  }

  // Função para aplicar sugestão
  const applySuggestion = (suggestion: string) => {
    setValue('username', suggestion, { shouldValidate: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-3 sm:p-4 py-8">
      <Card className="glass-card border-white/20 w-full max-w-[min(90vw,26rem)] animate-fade-in">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-neon neon-glow">
              <Link2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white">Crie sua conta</CardTitle>
          <CardDescription className="text-sm sm:text-base mt-1.5">Comece a centralizar seus links gratuitamente.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Nome</Label>
              <Input 
                id="name" 
                placeholder="Seu nome" 
                autoComplete="name"
                autoFocus
                {...register("name")} 
                className="bg-white/5 border-white/20 text-white h-10 sm:h-11 text-sm sm:text-base" 
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p id="name-error" className="text-xs sm:text-sm text-red-400 mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="username" className="text-sm sm:text-base">Usuário</Label>
              <div className="relative">
                <Input 
                  id="username" 
                  placeholder="seu_usuario" 
                  autoComplete="username"
                  {...register("username")} 
                  className="bg-white/5 border-white/20 text-white pr-10 h-10 sm:h-11 text-sm sm:text-base" 
                  aria-invalid={!!errors.username || usernameCheck.status === 'taken'}
                  aria-describedby={errors.username || usernameCheck.error ? "username-error" : undefined}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {usernameCheck.status === 'checking' && <Loader2 className="h-4 w-4 text-white/50 animate-spin" />}
                  {usernameCheck.status === 'available' && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                  {usernameCheck.status === 'taken' && <XCircle className="h-4 w-4 text-red-400" />}
                  {usernameCheck.status === 'error' && <AlertCircle className="h-4 w-4 text-amber-400" />}
                </div>
              </div>
              
              {/* Mensagens de erro */}
              {errors.username && <p id="username-error" className="text-xs sm:text-sm text-red-400 mt-1">{errors.username.message}</p>}
              {usernameCheck.error && <p className="text-xs sm:text-sm text-red-400 mt-1">{usernameCheck.error}</p>}
              
              {/* Badge de qualidade */}
              {qualityScore && usernameCheck.status === 'available' && (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    style={{ borderColor: qualityScore.color, color: qualityScore.color }}
                    className="text-xs"
                  >
                    {qualityScore.badge === 'premium' && '⭐ Premium'}
                    {qualityScore.badge === 'good' && '✓ Bom'}
                    {qualityScore.badge === 'average' && 'Regular'}
                    {qualityScore.badge === 'poor' && 'Fraco'}
                  </Badge>
                  <span className="text-xs text-white/50">Qualidade: {qualityScore.score}%</span>
                </div>
              )}
              
              {/* Sugestões de username */}
              {usernameCheck.suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    Sugestões disponíveis:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {usernameCheck.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => applySuggestion(suggestion)}
                        className="px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                      >
                        @{suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
            <Button 
              type="submit" 
              disabled={!isValid || loading || !usernameCheck.isValid || usernameCheck.status === 'checking'} 
              className="w-full bg-gradient-primary hover:opacity-90 btn-futuristic"
            >
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