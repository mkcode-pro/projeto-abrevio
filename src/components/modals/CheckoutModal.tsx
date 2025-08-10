import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  Sparkles, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Clock
} from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: "monthly" | "yearly";
}

export function CheckoutModal({ open, onOpenChange, plan }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const planDetails = {
    monthly: { price: 19.90, billing: "por mês", total: 19.90 },
    yearly: { price: 199.90, billing: "por ano", total: 199.90, savings: 39.80 }
  };

  const details = planDetails[plan];

  const handleCheckout = async () => {
    setLoading(true);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSuccess(true);
    
    // Auto fechar após sucesso
    setTimeout(() => {
      setSuccess(false);
      onOpenChange(false);
    }, 3000);
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card border-emerald-500/20 max-w-md">
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-emerald-500/10">
                <CheckCircle className="h-12 w-12 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Assinatura Ativada! 🎉</h3>
            <p className="text-muted-foreground mb-4">
              Bem-vindo ao Abrev.io Pro! Sua conta foi atualizada com sucesso.
            </p>
            <Badge className="bg-gradient-primary text-primary-foreground">
              Conta Pro Ativa
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-primary/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-primary" />
            Finalizar Assinatura Pro
          </DialogTitle>
          <DialogDescription>
            Você está assinando o plano {plan === "yearly" ? "anual" : "mensal"} do Abrev.io Pro
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Plano */}
          <Card className="glass border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Abrev.io Pro</span>
                </div>
                <Badge className="bg-gradient-primary text-primary-foreground">
                  {plan === "yearly" ? "Anual" : "Mensal"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-semibold">R$ {details.price.toFixed(2).replace('.', ',')} {details.billing}</span>
              </div>
              
              {plan === "yearly" && (
                <>
                  <div className="flex items-center justify-between mb-2 text-emerald-400">
                    <span>Economia anual</span>
                    <span className="font-semibold">-R$ {('savings' in details ? details.savings : 0).toFixed(2).replace('.', ',')}</span>
                  </div>
                  <Separator className="my-2" />
                </>
              )}
              
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">R$ {details.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Benefícios Inclusos */}
          <Card className="glass border-accent/20">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Incluído na assinatura
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Links e páginas ilimitadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Analytics avançados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Domínio personalizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Suporte prioritário</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Pagamento seguro com criptografia SSL</span>
          </div>

          {/* Política de Cancelamento */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Cancele a qualquer momento • Sem multa</span>
          </div>

          {/* Botão de Checkout */}
          <Button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6 btn-futuristic"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Processando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Assinar Agora
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ao continuar, você concorda com nossos <span className="text-primary cursor-pointer">Termos de Serviço</span> e <span className="text-primary cursor-pointer">Política de Privacidade</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}