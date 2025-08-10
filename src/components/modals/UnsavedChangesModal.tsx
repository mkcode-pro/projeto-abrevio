import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface UnsavedChangesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onSave?: () => void;
}

export function UnsavedChangesModal({
  open,
  onOpenChange,
  onConfirm,
  onSave
}: UnsavedChangesModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card border-amber-500/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            Alterações não salvas
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Você possui alterações não salvas. O que deseja fazer?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="bg-card/50 hover:bg-card order-3 sm:order-1">
            Continuar editando
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 order-2"
          >
            Sair sem salvar
          </AlertDialogAction>
          {onSave && (
            <AlertDialogAction
              onClick={onSave}
              className="bg-gradient-primary hover:opacity-90 order-1 sm:order-3"
            >
              Salvar e sair
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}