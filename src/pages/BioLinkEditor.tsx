import { useState, useEffect } from "react";
import { Save, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileEditor } from "@/components/biolink-editor/ProfileEditor";
import { LinksManager } from "@/components/biolink-editor/LinksManager";
import { BioLinkPreview, UserData } from "@/components/biolink-editor/BioLinkPreview";
import { LinkData } from "@/components/biolink-editor/SortableLinkItem";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useBioLink } from "@/hooks/useBioLink";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BioLinkEditor() {
  const { bioLinkData, isLoading, isError, error, saveChanges, isSaving } = useBioLink();
  
  // Estado local para guardar as edições do usuário
  const [editedUserData, setEditedUserData] = useState<UserData | null>(null);
  const [editedLinks, setEditedLinks] = useState<LinkData[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Inicializa o estado local com os dados do servidor quando eles chegam
  useEffect(() => {
    if (bioLinkData) {
      setEditedUserData(bioLinkData.userData);
      setEditedLinks(bioLinkData.links);
      setHasUnsavedChanges(false);
    }
  }, [bioLinkData]);

  // Atualiza o estado local do perfil quando o usuário digita
  const handleUserDataUpdate = (updates: Partial<UserData>) => {
    if (!editedUserData) return;
    setEditedUserData(prev => ({ ...prev!, ...updates }));
    setHasUnsavedChanges(true);
  };

  // Atualiza o estado local dos links quando o usuário os altera
  const handleLinksChange = (newLinks: LinkData[]) => {
    setEditedLinks(newLinks);
    setHasUnsavedChanges(true);
  };

  // Salva as alterações usando o estado local
  const handleSave = () => {
    if (editedUserData) {
      saveChanges(editedUserData, editedLinks);
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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card border-red-500/20 max-w-md text-center p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Erro ao carregar dados</h3>
          <p className="text-sm text-white/70 mb-4">{error?.message || "Ocorreu um erro inesperado."}</p>
          <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
        </Card>
      </div>
    );
  }

  // Garante que temos dados para exibir antes de renderizar o editor
  if (!editedUserData) return <EditorSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <ResponsiveContainer size="xl" padding="lg" className="py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Editor de Bio Link</h1>
            <p className="text-white/60">Personalize sua página de links e acompanhe o desempenho</p>
            {hasUnsavedChanges && <p className="text-amber-400 text-sm mt-1">⚠️ Você tem alterações não salvas</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handlePreview} variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" disabled={!editedUserData.username}>
              <Eye className="w-5 h-5 mr-2" />
              Visualizar
            </Button>
            <Button onClick={handleSave} size="lg" disabled={isSaving || !hasUnsavedChanges} className="bg-gradient-neon hover:shadow-neon btn-futuristic">
              {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <ProfileEditor userData={editedUserData} onUpdate={handleUserDataUpdate} />
            <LinksManager links={editedLinks} onLinksChange={handleLinksChange} />
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <BioLinkPreview userData={editedUserData} links={editedLinks} />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}

const EditorSkeleton = () => (
  <div className="min-h-screen bg-gradient-hero">
    <ResponsiveContainer size="xl" padding="lg" className="py-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[80vh] w-full" />
        </div>
      </div>
    </ResponsiveContainer>
  </div>
);