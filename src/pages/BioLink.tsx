import { useState, useEffect, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ExternalLink, Share2, Link2 as LinkIcon, AlertTriangle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getIconById } from "@/components/biolink-editor/IconLibrary"
import { Skeleton } from "@/components/ui/skeleton"
import { PixModal } from "@/components/biolink/PixModal"
import { BioLinkTheme, defaultTheme } from "@/components/biolink-editor/ThemeLibrary"

const fetchPublicBioLink = async (username: string) => {
  const { data, error } = await supabase
    .from('bio_links')
    .select(`
      display_name,
      username,
      bio,
      avatar_url,
      view_count,
      theme,
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

function LinkButton({ link, index, theme }: { link: any, index: number, theme: BioLinkTheme }) {
  const [isClicked, setIsClicked] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  
  const iconData = getIconById(link.icon);
  const IconComponent = iconData?.icon || LinkIcon;
  const isPix = iconData?.type === 'pix';

  let pixData = null;
  if (isPix) {
    try {
      pixData = JSON.parse(link.url);
    } catch (e) {
      return null;
    }
  }

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    
    if (isPix) {
      setShowPixModal(true);
    } else {
      window.open(link.url, '_blank');
    }
  };

  return (
    <>
      <div 
        className="animate-slide-up opacity-0"
        style={{ animationDelay: `${(index + 2) * 100}ms`, animationFillMode: 'forwards' }}
      >
        <Button
          onClick={handleClick}
          className={`w-full h-auto p-0 bg-transparent hover:bg-transparent transform transition-all duration-300 hover:scale-105 ${isClicked ? 'scale-95' : ''}`}
          variant="ghost"
          style={{
            backgroundColor: theme.styles.buttonColor,
            border: theme.styles.buttonBorder,
            borderRadius: '1rem'
          }}
        >
          <div className="w-full p-4">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${iconData?.color || 'from-gray-500 to-gray-700'}`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-base leading-tight" style={{ color: theme.styles.buttonTextColor }}>{link.title}</h3>
              </div>
              {isPix ? (
                <CreditCard className="w-5 h-5" style={{ color: theme.styles.buttonTextColor }} />
              ) : (
                <ExternalLink className="w-5 h-5" style={{ color: theme.styles.buttonTextColor }} />
              )}
            </div>
          </div>
        </Button>
      </div>
      {isPix && pixData && (
        <PixModal open={showPixModal} onOpenChange={setShowPixModal} pixData={pixData} />
      )}
    </>
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

  const theme = useMemo(() => {
    const themeData = bioLink?.theme as any;
    if (themeData && typeof themeData === 'object') {
      return { ...defaultTheme, ...themeData, styles: { ...defaultTheme.styles, ...themeData.styles } };
    }
    return defaultTheme;
  }, [bioLink]);

  const backgroundStyle = useMemo(() => {
    if (theme.styles.backgroundType === 'gradient') {
      return { background: `linear-gradient(to bottom right, ${theme.styles.backgroundColor1}, ${theme.styles.backgroundColor2})` };
    }
    return { backgroundColor: theme.styles.backgroundColor1 };
  }, [theme]);

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
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={backgroundStyle}>
      {isLoading && <BioLinkSkeleton />}
      {!isLoading && (isError || !bioLink) && <NotFoundContent />}
      {!isLoading && !isError && bioLink && (
        <div className="relative z-10 max-w-md mx-auto px-6 py-8 w-full">
          <div className="flex justify-between items-center mb-8">
            <div className="text-xs font-medium" style={{ color: theme.styles.textColor }}>
              {bioLink.view_count || 0} visualizações
            </div>
            <Button onClick={handleShare} variant="ghost" size="icon" className={`hover:bg-white/10 rounded-full transform transition-all duration-200 ${shareClicked ? 'scale-90' : ''}`} style={{ color: theme.styles.textColor }}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-center mb-8">
            <div className="animate-scale-in opacity-0 mb-4" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              <Avatar className="w-24 h-24 mx-auto border-2" style={{ borderColor: theme.styles.buttonColor }}>
                <AvatarImage src={bioLink.avatar_url || undefined} alt={bioLink.display_name || ''} />
                <AvatarFallback className="text-xl font-bold" style={{ backgroundColor: theme.styles.buttonColor, color: theme.styles.buttonTextColor }}>
                  {(bioLink.display_name || 'A').split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="animate-fade-in opacity-0 mb-4" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <h1 className="text-2xl font-bold" style={{ color: theme.styles.nameColor }}>{bioLink.display_name}</h1>
              <p className="font-medium" style={{ color: theme.styles.usernameColor }}>@{bioLink.username}</p>
            </div>
            {bioLink.bio && (
              <div className="animate-fade-in opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                <p className="text-center leading-relaxed px-4" style={{ color: theme.styles.textColor }}>{bioLink.bio}</p>
              </div>
            )}
          </div>
          <div className="space-y-4 mb-8">
            {(bioLink.bio_link_items as any[]).sort((a, b) => a.position - b.position).map((link, index) => (
              <LinkButton key={link.id || index} link={link} index={index} theme={theme} />
            ))}
          </div>
          <div className="text-center pt-8 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Button asChild variant="ghost" className="hover:text-neon-blue" style={{ color: theme.styles.textColor }}>
              <Link to="/">
                Criado com <span className="font-bold mx-1" style={{ color: theme.styles.usernameColor }}>Abrev.io</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}