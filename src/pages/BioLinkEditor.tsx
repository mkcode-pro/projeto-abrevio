import { useState, useEffect } from "react";
import { Save, Eye, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileEditor } from "@/components/biolink-editor/ProfileEditor";
import { LinksManager } from "@/components/biolink-editor/LinksManager";
import { BioLinkPreview, UserData } from "@/components/biolink-editor/BioLinkPreview";
import { LinkData } from "@/components/biolink-editor/SortableLinkItem";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContainer } from "@/components/layout/PageContainer";
import { useBioLink } from "@/store/hooks/useBioLink";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { AppearanceEditor } from "@/components/biolink-editor/AppearanceEditor";
import { BioLinkTheme, defaultTheme } from "@/components/biolink-editor/ThemeLibrary";

export default function BioLinkEditor() {
  const { bioLinkData, isLoading, isError, error, saveChanges, isSaving } = useBioLink();
  
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

  if (isLoading) return <EditorSkeleton />;

  if (isError) {
    return (
      <PageLayout variant="dashboard" title="Erro">
        <div className="flex items-center justify-center h-full">
          <Card className="glass-card border-red-500/20 max-w-md text-center p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Erro ao carregar dados</h3>
            <p className="text-sm text-white/70 mb-4">{error?.message || "Ocorreu um erro inesperado."}</p>
            <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!editedUserData) return <EditorSkeleton />;

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button onClick={handlePreview} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hidden sm:flex" disabled={!editedUserData.username}>
        <Eye className="w-4 h-4 mr-2" />
        Visualizar
      </Button>
      <Button onClick={handleSave} size="sm" disabled={isSaving || !hasUnsavedChanges} className="bg-gradient-primary hover:opacity-90">
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        <span className="ml-2">Salvar</span>
      </Button>
    </div>
  );

  return (
    <PageLayout variant="dashboard" title="Editor de Bio Link" showBackButton headerActions={headerActions}>
      <PageContainer size="xl" className="px-0">
        {hasUnsavedChanges && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm rounded-lg p-3 flex items-center gap-3 mb-6 animate-fade-in">
            <AlertTriangle className="w-4 h-4" />
            Você tem alterações não salvas. Não se esqueça de salvar!
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <ProfileEditor userData={editedUserData} onUpdate={handleUserDataUpdate} />
            <AppearanceEditor theme={editedTheme} onThemeChange={handleThemeChange} />
            <LinksManager links={editedLinks} onLinksChange={handleLinksChange} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
              <BioLinkPreview userData={editedUserData} links={editedLinks} theme={editedTheme} />
            </div>
          </div>
        </div>
      </PageContainer>
    </PageLayout>
  );
}

const EditorSkeleton = () => (
  <PageLayout variant="dashboard" title="Carregando Editor...">
    <PageContainer size="xl" className="px-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <Skeleton className="h-[80vh] w-full rounded-2xl" />
        </div>
      </div>
    </PageContainer>
  </PageLayout>
);