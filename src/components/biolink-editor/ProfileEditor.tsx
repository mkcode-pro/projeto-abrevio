import { useRef } from "react"
import { Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { UserData } from './BioLinkPreview'

interface ProfileEditorProps {
  userData: UserData
  onUpdate: (updates: Partial<UserData>) => void
}

export function ProfileEditor({ userData, onUpdate }: ProfileEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onUpdate({ avatar: e.target?.result as string })
        toast.success("Avatar atualizado!")
      }
      reader.readAsDataURL(file)
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
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="bg-gradient-neon text-black font-bold">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Alterar Avatar
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-white text-sm">Nome</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-white text-sm">Username</Label>
            <Input
              id="username"
              value={userData.username}
              onChange={(e) => onUpdate({ username: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio" className="text-white text-sm">Bio</Label>
          <Textarea
            id="bio"
            value={userData.bio}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            className="bg-white/5 border-white/20 text-white resize-none"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}