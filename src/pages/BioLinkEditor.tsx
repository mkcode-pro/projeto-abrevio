import { useState, useEffect } from "react";
import { Save, Eye, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileEditor } from "@/components/biolink-editor/ProfileEditor";
import { LinksManager } from "@/components/biolink-editor/LinksManager";
import { BioLinkPreview, UserData } from "@/components/biolink-editor/BioLinkPreview";
import { LinkData } from "@/components/biolink-editor/SortableLinkItem";
import { PageContainer } from "@/components/layout/PageContainer";
import { useBioLink } from "@/store/hooks/useBioLink";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/store/hooks/use-mobile";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { AppearanceEditor } from "@/components/biolink-editor/AppearanceEditor";
import { BioLinkTheme, defaultTheme } from "@/components/biolink-editor/ThemeLibrary";

export default function BioLinkEditor() {
  const { bioLinkData, isLoading, isError, error, saveChanges, isSaving } = useBioLink();
  const isMobile = useIsMobile();
  
  const [editedUserData, setEditedUserData] = useState<UserData | null>(null);
  const [editedLinks, setEditedLinks] = useState<LinkData[]>([]);
  const [editedTheme, setEditedTheme] = useState<BioLinkTheme>(defaultTheme);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (bioLinkData) {
      setEditedUserData(bioLinkData.userData);
      setEditedLinks(bioLinkData.links);
      setEditedTheme(bioLinkData.theme);
      setHasUnsavedChanges(false);
    }
  }, [bioLinkData]);

  const handleUserDataUpdate = (updates: Partial<UserData>) => {
    if (!editedUserData) return;
    setEditedUserData(prev => ({ ...prev!, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleLinksChange = (newLinks: LinkData[]) => {
    setEditedLinks(newLinks);
    setHasUnsavedChanges(true);
  };

  const handleThemeChange = (newTheme: BioLinkTheme) => {
    setEditedTheme(newTheme);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (editedUserData) {
      saveChanges(editedUserData, editedLinks, editedTheme);
      setHasUnsavedChanges(false);
    }
  };

  const handlePreview = () => {
    if (editedUserData?.username) {
      window.open(`/bio/${editedUserData.username}`, '_blank');
    }
  };

  if (isLoading) return <EditorSkeleton isMobile={isMobile} />;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card border-red-500/20 max-w-md text-center p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Erro ao carregar dados</h3>
          <p className="text-sm text-white/70 mb-4">{error?.message || "Ocorreu um erro inesperado."}</p>
          <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
        </Card>
      </div>
    );
  }

  if (!editedUserData) return <EditorSkeleton isMobile={isMobile} />;

  const headerActions = (
    <Button onClick={handleSave} size="sm" disabled={isSaving || !hasUnsavedChanges} className="bg-gradient-primary hover:opacity-90">
      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      <span className="ml-2">Salvar</span>
    </Button>
  );

  return (
    <>
      {isMobile && <MobileHeader title="Editor de Bio Link" showBackButton actions={headerActions} />}
      <div className={isMobile ? "pt-14" : ""}>
        <PageContainer size="xl" className="py-8 px-4 sm:px-6 lg:px-8">
          {!isMobile && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Editor de Bio Link</h1>
                <p className="text-white/60">Personalize sua página de links e acompanhe o desempenho</p>
                {hasUnsavedChanges && (
                  <p className="text-amber-400 text-sm mt-1 flex items-center gap-2 animate-fade-in">
                    <AlertTriangle className="w-4 h-4" />
                    Você tem alterações não salvas
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handlePreview} variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" disabled={!editedUserData.username}>
                  <Eye className="w-5 h-5 mr-2" />
                  Visualizar
                </Button>
                {headerActions}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <ProfileEditor userData={editedUserData} onUpdate={handleUserDataUpdate} />
              <AppearanceEditor theme={editedTheme} onThemeChange={handleThemeChange} />
              <LinksManager links={editedLinks} onLinksChange={handleLinksChange} />
            </div>
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <BioLinkPreview userData={editedUserData} links={editedLinks} theme={editedTheme} />
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </>
  );
}

const EditorSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <>
    {isMobile && <Skeleton className="h-14 w-full fixed top-0 left-0 z-50" />}
    <div className={isMobile ? "pt-14" : ""}>
      <PageContainer size="xl" className="py-8 px-4 sm:px-6 lg:px-8">
        {!isMobile && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-9 w-72 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[80vh] w-full" />
          </div>
        </div>
      </PageContainer>
    </div>
  </>
);