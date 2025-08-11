import { 
  Instagram, 
  MessageCircle, 
  Youtube, 
  Globe, 
  CreditCard,
  Camera,
  Music,
  Linkedin,
  Twitter,
  Facebook,
  Twitch,
  Video, // Usando Video icon para TikTok
} from "lucide-react"

export type LinkType = 'link' | 'pix';

export interface IconData {
  id: string
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  type: LinkType
}

export const iconLibrary: IconData[] = [
  { id: 'pix', name: 'PIX', icon: CreditCard, color: 'from-green-500 to-emerald-600', type: 'pix' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500', type: 'link' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'from-green-400 to-green-600', type: 'link' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-700', type: 'link' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'from-black to-gray-800', type: 'link' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-800', type: 'link' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'from-sky-400 to-sky-600', type: 'link' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-700', type: 'link' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, color: 'from-purple-600 to-purple-800', type: 'link' },
  { id: 'website', name: 'Site Pessoal', icon: Globe, color: 'from-blue-500 to-indigo-600', type: 'link' },
  { id: 'music', name: 'Música/Spotify', icon: Music, color: 'from-green-400 to-green-500', type: 'link' },
  { id: 'camera', name: 'Portfólio', icon: Camera, color: 'from-gray-500 to-gray-700', type: 'link' }
]

export const getIconById = (iconId: string) => {
  return iconLibrary.find(icon => icon.id === iconId)
}