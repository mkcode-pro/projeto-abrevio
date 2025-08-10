import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface BioLinkData {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  theme: "light" | "dark" | "neon";
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    isActive: boolean;
    clicks: number;
  }>;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    isActive: boolean;
  }>;
  analytics: {
    totalViews: number;
    totalClicks: number;
    thisMonth: number;
  };
}

const mockBioLinkData: BioLinkData = {
  id: "1",
  username: "joaosilva",
  displayName: "João Silva",
  bio: "Transformando ideias em conteúdo que inspira",
  avatar: undefined,
  theme: "dark",
  links: [
    {
      id: "1",
      title: "Meu Instagram",
      url: "https://instagram.com/joaosilva",
      icon: "Instagram",
      isActive: true,
      clicks: 587
    },
    {
      id: "2", 
      title: "WhatsApp",
      url: "https://wa.me/5511999999999",
      icon: "MessageCircle",
      isActive: true,
      clicks: 1234
    },
    {
      id: "3",
      title: "YouTube",
      url: "https://youtube.com/joaosilva",
      icon: "Youtube",
      isActive: true,
      clicks: 432
    },
    {
      id: "4",
      title: "Site Pessoal",
      url: "https://joaosilva.com",
      icon: "Globe",
      isActive: true,
      clicks: 287
    }
  ],
  socialLinks: [
    {
      id: "1",
      platform: "Instagram",
      url: "https://instagram.com/joaosilva",
      isActive: true
    },
    {
      id: "2",
      platform: "YouTube", 
      url: "https://youtube.com/joaosilva",
      isActive: true
    }
  ],
  analytics: {
    totalViews: 2540,
    totalClicks: 2540,
    thisMonth: 1847
  }
};

export function useBioLink() {
  const [bioLinkData, setBioLinkData] = useState<BioLinkData>(mockBioLinkData);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const updateBioLink = useCallback((updates: Partial<BioLinkData>) => {
    setBioLinkData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const addLink = useCallback((link: Omit<BioLinkData['links'][0], 'id' | 'clicks'>) => {
    const newLink = {
      ...link,
      id: Date.now().toString(),
      clicks: 0
    };
    setBioLinkData(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateLink = useCallback((linkId: string, updates: Partial<BioLinkData['links'][0]>) => {
    setBioLinkData(prev => ({
      ...prev,
      links: prev.links.map(link => 
        link.id === linkId ? { ...link, ...updates } : link
      )
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removeLink = useCallback((linkId: string) => {
    setBioLinkData(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== linkId)
    }));
    setHasUnsavedChanges(true);
  }, []);

  const reorderLinks = useCallback((fromIndex: number, toIndex: number) => {
    setBioLinkData(prev => {
      const newLinks = [...prev.links];
      const [movedLink] = newLinks.splice(fromIndex, 1);
      newLinks.splice(toIndex, 0, movedLink);
      return { ...prev, links: newLinks };
    });
    setHasUnsavedChanges(true);
  }, []);

  const saveBioLink = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasUnsavedChanges(false);
      toast({
        title: "Bio Link salvo",
        description: "Suas alterações foram salvas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas alterações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const resetChanges = useCallback(() => {
    setBioLinkData(mockBioLinkData);
    setHasUnsavedChanges(false);
  }, []);

  return {
    bioLinkData,
    loading,
    hasUnsavedChanges,
    updateBioLink,
    addLink,
    updateLink,
    removeLink,
    reorderLinks,
    saveBioLink,
    resetChanges
  };
}