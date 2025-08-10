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
  Video, // Using Video icon for TikTok
} from "lucide-react"

export interface IconData {
  id: string
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
}

export const iconLibrary: IconData[] = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'from-green-400 to-green-600' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-700' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'from-black to-gray-800' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-800' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'from-sky-400 to-sky-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-700' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, color: 'from-purple-600 to-purple-800' },
  { id: 'website', name: 'Site Pessoal', icon: Globe, color: 'from-blue-500 to-indigo-600' },
  { id: 'pix', name: 'PIX', icon: CreditCard, color: 'from-green-500 to-emerald-600' },
  { id: 'music', name: 'Música/Spotify', icon: Music, color: 'from-green-400 to-green-500' },
  { id: 'camera', name: 'Portfólio', icon: Camera, color: 'from-gray-500 to-gray-700' }
]

export const getIconById = (iconId: string) => {
  return iconLibrary.find(icon => icon.id === iconId)
}