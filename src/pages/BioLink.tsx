import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ExternalLink, Share2, Link2 as LinkIcon, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getIconById } from "@/components/biolink-editor/IconLibrary"
import { Skeleton } from "@/components/ui/skeleton"

const fetchPublicBioLink = async (username: string) => {
  const { data, error } = await supabase
    .from('bio_links')
    .select(`
      display_name,
      username,
      bio,
      avatar_url,
      view_count,
      bio_link_items ( title, url, icon, position )
    `)
    .eq('username', username)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(error.message);
  }
  return data;
};

function LinkButton({ link, index }: { link: any, index: number }) {
  const [isClicked, setIsClicked] = useState(false);
  const iconData = getIconById(link.icon);
  const IconComponent = iconData?.icon || LinkIcon;

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    window.open(link.url, '_blank');
  };

  return (
    <div 
      className="animate-slide-up opacity-0"
      style={{ animationDelay: `${(index + 2) * 100}ms`, animationFillMode: 'forwards' }}
    >
      <Button
        onClick={handleClick}
        className={`w-full h-auto p-0 bg-transparent hover:bg-transparent transform transition-all duration-300 hover:scale-105 ${isClicked ? 'scale-95' : ''}`}
        variant="ghost"
      >
        <div className="w-full glass-card border border-white/20 hover:border-neon-blue/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-neon">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${iconData?.color || 'from-gray-500 to-gray-700'}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-white text-base leading-tight">{link.title}</h3>
            </div>
            <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </div>
        </div>
      </Button>
    </div>
  );
}

const BioLinkSkeleton = () => (
  <div className="relative z-10 max-w-md mx-auto px-6 py-8">
    <div className="flex justify-between items-center mb-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <div className="text-center mb-8">
      <Skeleton className="w-24 h-24 mx-auto rounded-full mb-4" />
      <Skeleton className="h-7 w-40 mx-auto mb-2" />
      <Skeleton className="h-5 w-32 mx-auto mb-4" />
      <Skeleton className="h-4 w-full max-w-xs mx-auto" />
      <Skeleton className="h-4 w-full max-w-sm mx-auto mt-2" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  </div>
);

const NotFoundContent = () => (
  <div className="relative z-10 max-w-md mx-auto px-6 py-8 text-center">
    <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
    <h1 className="text-3xl font-bold text-white mb-2">Perfil não encontrado</h1>
    <p className="text-white/70 mb-6">O link que você tentou acessar não existe ou foi desativado.</p>
    <Button asChild className="bg-gradient-neon hover:shadow-neon">
      <Link to="/">Voltar para Abrev.io</Link>
    </Button>
  </div>
);

export default function BioLink() {
  const { username } = useParams<{ username: string }>();
  const { data: bioLink, isLoading, isError } = useQuery({
    queryKey: ['publicBioLink', username],
    queryFn: () => fetchPublicBioLink(username!),
    enabled: !!username,
  });

  const [shareClicked, setShareClicked] = useState(false);

  const handleShare = async () => {
    setShareClicked(true);
    setTimeout(() => setShareClicked(false), 200);
    if (navigator.share && bioLink) {
      navigator.share({
        title: `${bioLink.display_name} - Links`,
        text: bioLink.bio || '',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {isLoading && <BioLinkSkeleton />}
      {!isLoading && (isError || !bioLink) && <NotFoundContent />}
      {!isLoading && !isError && bioLink && (
        <div className="relative z-10 max-w-md mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="text-xs text-white/60 font-medium">
              {bioLink.view_count || 0} visualizações
            </div>
            <Button onClick={handleShare} variant="ghost" size="icon" className={`text-white/60 hover:text-white hover:bg-white/10 rounded-full transform transition-all duration-200 ${shareClicked ? 'scale-90' : ''}`}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-center mb-8">
            <div className="animate-scale-in opacity-0 mb-4" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              <Avatar className="w-24 h-24 mx-auto glass border-2 border-white/20 shadow-elegant">
                <AvatarImage src={bioLink.avatar_url || undefined} alt={bioLink.display_name || ''} />
                <AvatarFallback className="bg-gradient-neon text-black text-xl font-bold">
                  {(bioLink.display_name || 'A').split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="animate-fade-in opacity-0 mb-4" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <h1 className="text-2xl font-bold text-white">{bioLink.display_name}</h1>
              <p className="text-neon-blue font-medium">@{bioLink.username}</p>
            </div>
            {bioLink.bio && (
              <div className="animate-fade-in opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                <p className="text-white/80 text-center leading-relaxed px-4">{bioLink.bio}</p>
              </div>
            )}
          </div>
          <div className="space-y-4 mb-8">
            {(bioLink.bio_link_items as any[]).sort((a, b) => a.position - b.position).map((link, index) => (
              <LinkButton key={link.id || index} link={link} index={index} />
            ))}
          </div>
          <div className="text-center pt-8 border-t border-white/10 animate-fade-in opacity-0" style={{ animationDelay: `${((bioLink.bio_link_items as any[]).length + 3) * 100}ms`, animationFillMode: 'forwards' }}>
            <Button asChild variant="ghost" className="text-white/60 hover:text-neon-blue">
              <Link to="/">
                Criado com <span className="text-neon-blue font-bold mx-1">Abrev.io</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}