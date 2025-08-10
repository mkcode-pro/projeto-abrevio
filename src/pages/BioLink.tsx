import { useState, useEffect } from "react"
import { Instagram, MessageCircle, Youtube, Globe, ExternalLink, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data
const userData = {
  name: "João Silva",
  username: "@joaosilva",
  bio: "Transformando ideias em conteúdo que inspira",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  verified: true,
  totalViews: "2.5K"
}

const socialLinks = [
  {
    id: 1,
    title: "Instagram",
    subtitle: "Conteúdo diário e stories",
    url: "https://instagram.com/joaosilva",
    icon: Instagram,
    color: "from-purple-500 via-pink-500 to-red-500",
    clicks: 587
  },
  {
    id: 2,
    title: "WhatsApp Business",
    subtitle: "Fale comigo diretamente",
    url: "https://wa.me/5511999999999",
    icon: MessageCircle,
    color: "from-green-400 to-green-600",
    clicks: 1234
  },
  {
    id: 3,
    title: "YouTube",
    subtitle: "Vídeos e tutoriais",
    url: "https://youtube.com/joaosilva",
    icon: Youtube,
    color: "from-red-500 to-red-700",
    clicks: 298
  },
  {
    id: 4,
    title: "Site Pessoal",
    subtitle: "Portfolio e blog",
    url: "https://joaosilva.com",
    icon: Globe,
    color: "from-blue-500 to-indigo-600",
    clicks: 156
  }
]

const customLinks = [
  {
    id: 5,
    title: "Curso de Marketing Digital",
    subtitle: "Aprenda as melhores estratégias",
    url: "https://curso.joaosilva.com",
    emoji: "🎯",
    clicks: 342
  },
  {
    id: 6,
    title: "E-book Gratuito",
    subtitle: "Guia completo de redes sociais",
    url: "https://ebook.joaosilva.com",
    emoji: "📚",
    clicks: 198
  }
]

function LinkButton({ link, index, isSocial = false }: { 
  link: any, 
  index: number, 
  isSocial?: boolean 
}) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
    // Track click analytics here
    window.open(link.url, '_blank')
  }

  return (
    <div 
      className="animate-slide-up opacity-0"
      style={{ 
        animationDelay: `${(index + 2) * 100}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <Button
        onClick={handleClick}
        className={`
          w-full h-auto p-0 bg-transparent hover:bg-transparent
          transform transition-all duration-300 hover:scale-105
          ${isClicked ? 'scale-95' : ''}
        `}
        variant="ghost"
      >
        <div className="w-full glass-card border border-white/20 hover:border-neon-blue/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-neon">
          <div className="flex items-center gap-4">
            {/* Icon/Emoji */}
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-xl
              ${isSocial 
                ? `bg-gradient-to-r ${link.color}` 
                : 'bg-white/10 text-2xl'
              }
            `}>
              {isSocial ? (
                <link.icon className="w-6 h-6 text-white" />
              ) : (
                <span>{link.emoji}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-white text-base leading-tight">
                {link.title}
              </h3>
              <p className="text-sm text-white/70 mt-1">
                {link.subtitle}
              </p>
            </div>

            {/* Arrow */}
            <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </div>

          {/* Click counter */}
          <div className="mt-3 flex items-center justify-between text-xs text-white/50">
            <span>{link.clicks.toLocaleString()} cliques</span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-neon-blue rounded-full animate-pulse"></div>
              <span>Ativo</span>
            </div>
          </div>
        </div>
      </Button>
    </div>
  )
}

export default function BioLink() {
  const [mounted, setMounted] = useState(false)
  const [shareClicked, setShareClicked] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleShare = async () => {
    setShareClicked(true)
    setTimeout(() => setShareClicked(false), 200)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData.name} - Links`,
          text: userData.bio,
          url: window.location.href
        })
      } catch (err) {
        // Share cancelled or not supported
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // Could show toast here
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-6 py-8">
        {/* Header with share button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-xs text-white/60 font-medium">
            {userData.totalViews} visualizações
          </div>
          <Button
            onClick={handleShare}
            variant="ghost"
            size="icon"
            className={`
              text-white/60 hover:text-white hover:bg-white/10 rounded-full
              transform transition-all duration-200
              ${shareClicked ? 'scale-90' : ''}
            `}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div 
            className="animate-scale-in opacity-0 mb-4"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <Avatar className="w-24 h-24 mx-auto glass border-2 border-white/20 shadow-elegant">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-gradient-neon text-black text-xl font-bold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name and username */}
          <div 
            className="animate-fade-in opacity-0 mb-4"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
              {userData.verified && (
                <div className="w-5 h-5 bg-neon-blue rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-neon-blue font-medium">{userData.username}</p>
          </div>

          {/* Bio */}
          <div 
            className="animate-fade-in opacity-0 mb-8"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <p className="text-white/80 text-center leading-relaxed px-4">
              {userData.bio}
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Conecte-se comigo
          </h2>
          {socialLinks.map((link, index) => (
            <LinkButton key={link.id} link={link} index={index} isSocial={true} />
          ))}
        </div>

        {/* Custom Links */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🚀</span>
            Conteúdos Especiais
          </h2>
          {customLinks.map((link, index) => (
            <LinkButton 
              key={link.id} 
              link={link} 
              index={socialLinks.length + index} 
              isSocial={false} 
            />
          ))}
        </div>

        {/* Footer */}
        <div 
          className="text-center pt-8 border-t border-white/10 animate-fade-in opacity-0"
          style={{ 
            animationDelay: `${(socialLinks.length + customLinks.length + 3) * 100}ms`,
            animationFillMode: 'forwards'
          }}
        >
          <p className="text-white/40 text-sm mb-4">
            Criado com ❤️ no Brasil
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/60 text-xs">Powered by</span>
            <span className="text-neon-blue font-bold text-sm">Abrev.io</span>
          </div>
        </div>
      </div>
    </div>
  )
}