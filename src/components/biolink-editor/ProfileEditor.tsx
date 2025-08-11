import { useRef } from "react"
import { Upload, Loader2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { UserData } from './BioLinkPreview'
import { useFileUpload } from "@/store/hooks/useFileUpload"
import { toast } from "sonner"
import { logger } from "@/lib/logger"

interface ProfileEditorProps {
  userData: UserData
  onUpdate: (updates: Partial<UserData>) => void
}

export function ProfileEditor({ userData, onUpdate }: ProfileEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFile, uploading, progress, preview } = useFileUpload({ 
    bucket: 'avatars',
    optimize: true // Otimização automática ativada
  })

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        logger.info('Iniciando upload da foto de perfil');
        const publicUrl = await uploadFile(file)
        
        if (publicUrl) {
          logger.info('Upload da foto concluído', { url: publicUrl });
          onUpdate({ avatar: publicUrl })
          toast.success("Foto carregada com sucesso!", {
            duration: 3000,
            description: "Clique em 'Salvar' para confirmar as alterações"
          })
        } else {
          toast.error("Não foi possível fazer o upload da foto")
        }
      } catch (error) {
        logger.error('Erro no upload da foto', error);
        toast.error("Erro ao enviar foto", {
          description: "Por favor, tente novamente"
        })
      }
    }
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 glass border border-white/20">
            <AvatarImage src={preview || userData.avatar} alt={userData.name} />
            <AvatarFallback className="bg-gradient-neon text-black font-bold">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? 'Enviando...' : 'Alterar Foto'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {/* Barra de progresso do upload */}
            {uploading && (
              <div className="mt-2 space-y-1">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-white/60">
                  {progress < 30 ? 'Preparando imagem...' : 
                   progress < 50 ? 'Limpando fotos antigas...' :
                   progress < 80 ? 'Enviando nova foto...' : 
                   'Finalizando...'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-white text-sm">Nome</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => {
                logger.debug('Nome alterado', { name: e.target.value });
                onUpdate({ name: e.target.value });
              }}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-white text-sm">Username</Label>
            <Input
              id="username"
              value={userData.username}
              onChange={(e) => {
                logger.debug('Username alterado', { username: e.target.value });
                onUpdate({ username: e.target.value });
              }}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Seu username"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio" className="text-white text-sm">Bio</Label>
          <Textarea
            id="bio"
            value={userData.bio}
            onChange={(e) => {
              logger.debug('Bio alterada', { bio: e.target.value });
              onUpdate({ bio: e.target.value });
            }}
            className="bg-white/5 border-white/20 text-white resize-none"
            rows={3}
            placeholder="Escreva uma bio interessante..."
          />
        </div>
      </CardContent>
    </Card>
  )
}