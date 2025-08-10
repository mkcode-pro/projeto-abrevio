import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title?: string;
  clicks: number;
  createdAt: Date;
  isActive: boolean;
  qrCode?: string;
}

const mockUrls: ShortenedUrl[] = [
  {
    id: "1",
    originalUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    shortCode: "yt-video",
    shortUrl: "abrev.io/yt-video",
    title: "Vídeo do YouTube",
    clicks: 1234,
    createdAt: new Date(2024, 0, 15),
    isActive: true
  },
  {
    id: "2", 
    originalUrl: "https://docs.google.com/document/d/1234567890",
    shortCode: "docs-link",
    shortUrl: "abrev.io/docs-link",
    title: "Documento Importante",
    clicks: 567,
    createdAt: new Date(2024, 0, 20),
    isActive: true
  },
  {
    id: "3",
    originalUrl: "https://example-long-url.com/very/long/path/to/content",
    shortCode: "example",
    shortUrl: "abrev.io/example",
    clicks: 89,
    createdAt: new Date(2024, 0, 25),
    isActive: false
  }
];

export function useUrlShortener() {
  const [urls, setUrls] = useState<ShortenedUrl[]>(mockUrls);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const shortenUrl = useCallback(async (
    originalUrl: string, 
    customCode?: string,
    title?: string
  ): Promise<ShortenedUrl | null> => {
    setLoading(true);
    try {
      // Validate URL
      new URL(originalUrl);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const shortCode = customCode || Math.random().toString(36).substring(2, 8);
      const newUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl,
        shortCode,
        shortUrl: `abrev.io/${shortCode}`,
        title,
        clicks: 0,
        createdAt: new Date(),
        isActive: true
      };

      setUrls(prev => [newUrl, ...prev]);
      
      toast({
        title: "URL encurtada!",
        description: `Link criado: ${newUrl.shortUrl}`,
      });

      return newUrl;
    } catch (error) {
      toast({
        title: "Erro ao encurtar URL",
        description: "Verifique se a URL é válida e tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateUrl = useCallback(async (
    id: string, 
    updates: Partial<Pick<ShortenedUrl, 'title' | 'isActive'>>
  ) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUrls(prev => prev.map(url => 
        url.id === id ? { ...url, ...updates } : url
      ));

      toast({
        title: "URL atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteUrl = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUrls(prev => prev.filter(url => url.id !== id));
      
      toast({
        title: "URL removida",
        description: "O link foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Ocorreu um erro ao remover o link.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const incrementClick = useCallback((id: string) => {
    setUrls(prev => prev.map(url => 
      url.id === id ? { ...url, clicks: url.clicks + 1 } : url
    ));
  }, []);

  const getAnalytics = useCallback(() => {
    const totalUrls = urls.length;
    const activeUrls = urls.filter(url => url.isActive).length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const thisMonthClicks = urls
      .filter(url => {
        const now = new Date();
        const urlDate = new Date(url.createdAt);
        return urlDate.getMonth() === now.getMonth() && 
               urlDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, url) => sum + url.clicks, 0);

    return {
      totalUrls,
      activeUrls,
      totalClicks,
      thisMonthClicks,
      topPerforming: urls
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5)
    };
  }, [urls]);

  return {
    urls,
    loading,
    shortenUrl,
    updateUrl,
    deleteUrl,
    incrementClick,
    analytics: getAnalytics()
  };
}