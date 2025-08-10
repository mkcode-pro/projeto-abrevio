import { Eye, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getIconById } from './IconLibrary'
import { LinkData } from './SortableLinkItem'

export interface UserData {
  name: string
  username: string
  bio: string
  avatar: string
}

interface BioLinkPreviewProps {
  userData: UserData
  links: LinkData[]
}

export function BioLinkPreview({ userData, links }: BioLinkPreviewProps) {
  return (
    <div className="glass-card border border-white/20 rounded-2xl p-6 h-full overflow-auto">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Eye className="w-4 h-4 text-neon-blue" />
        Preview da Página
      </h3>
      
      <div className="bg-gradient-to-br from-background via-background to-purple-900/20 rounded-xl p-6 min-h-96">
        {/* Profile Section */}
        <div className="text-center mb-6">
          <Avatar className="w-16 h-16 mx-auto mb-3 glass border border-white/20">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="bg-gradient-neon text-black font-bold">
              {userData.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-white font-bold text-lg">{userData.name}</h2>
          <p className="text-neon-blue text-sm">@{userData.username}</p>
          <p className="text-white/80 text-sm mt-2">{userData.bio}</p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => {
            const iconData = getIconById(link.iconId)
            const IconComponent = iconData?.icon || Globe
            
            return (
              <div 
                key={link.id}
                className="glass border border-white/20 rounded-xl p-3 transition-all hover:border-neon-blue/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${iconData?.color || 'from-gray-500 to-gray-700'}`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{link.title}</h4>
                    {link.subtitle && (
                      <p className="text-white/60 text-xs">{link.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}