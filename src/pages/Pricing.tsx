import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutModal } from "@/components/modals/CheckoutModal";
import { 
  Check, 
  ArrowLeft, 
  Zap, 
  Crown, 
  Star,
  BarChart3,
  Link,
  Palette,
  Shield,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContainer } from "@/components/layout/PageContainer";

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  const plans = {
    free: {
      name: "Free",
      description: "Perfeito para começar",
      price: { monthly: 0, yearly: 0 },
      badge: null,
      icon: Zap,
      color: "from-gray-500 to-gray-600",
      features: [
        "1 página de biolink",
        "5 links personalizados",
        "Estatísticas básicas",
        "Temas pré-definidos",
        "Suporte da comunidade"
      ],
      limitations: [
        "Sem domínio personalizado",
        "Marca Abrev.io visível",
        "Analytics limitados"
      ]
    },
    pro: {
      name: "Pro",
      description: "Para criadores profissionais",
      price: { monthly: 19.90, yearly: 199.90 },
      badge: "Mais Popular",
      icon: Crown,
      color: "from-neon-blue to-neon-purple",
      features: [
        "Páginas de biolink ilimitadas",
        "Links ilimitados",
        "Analytics avançados",
        "Temas personalizados",
        "Domínio personalizado",
        "Remoção da marca",
        "Integração PIX",
        "QR Code personalizado",
        "Suporte prioritário",
        "Backup automático"
      ],
      limitations: []
    }
  };

  const benefits = [
    {
      icon: BarChart3,
      title: "Analytics Profissionais",
      description: "Acompanhe cliques, visualizações e engajamento em tempo real"
    },
    {
      icon: Link,
      title: "Links Ilimitados",
      description: "Adicione quantos links quiser sem limitações"
    },
    {
      icon: Palette,
      title: "Personalização Total",
      description: "Temas customizados e sua identidade visual única"
    },
    {
      icon: Shield,
      title: "Domínio Próprio",
      description: "Use seu próprio domínio para máxima credibilidade"
    }
  ];

  const handleSubscribe = (plan: string) => {
    if (plan === "pro") {
      setSelectedPlan(billingCycle);
      setCheckoutModalOpen(true);
    }
  };

  return (
    <PageLayout variant="public">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <PageContainer size="xl" className="relative z-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-accent/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold neon-text">Planos & Preços</h1>
              <p className="text-muted-foreground text-lg">
                Escolha o plano ideal para elevar sua presença digital
              </p>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="glass-card p-2 rounded-full">
            <div className="flex gap-2">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full ${
                  billingCycle === "monthly" 
                    ? "bg-gradient-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensal
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-full relative ${
                  billingCycle === "yearly" 
                    ? "bg-gradient-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anual
                <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-xs">
                  2 meses grátis
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="glass-card border-border/50 relative">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${plans.free.color}`}>
                  <plans.free.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">{plans.free.name}</CardTitle>
              <CardDescription className="text-lg">{plans.free.description}</CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold">
                  R$ {plans.free.price[billingCycle].toFixed(2).replace('.', ',')}
                </div>
                <div className="text-muted-foreground">
                  {billingCycle === "yearly" ? "por ano" : "por mês"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-emerald-400">✓ Recursos inclusos:</h4>
                <ul className="space-y-2">
                  {plans.free.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-muted-foreground">Limitações:</h4>
                <ul className="space-y-2">
                  {plans.free.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full border border-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleSubscribe("free")}
              >
                Começar Grátis
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="glass-card border-primary/50 relative ring-2 ring-primary/30 scale-105 neon-glow animate-pulse-neon">
            {plans.pro.badge && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1 animate-pulse-neon">
                  <Star className="h-3 w-3 mr-1" />
                  {plans.pro.badge}
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${plans.pro.color} neon-glow`}>
                  <plans.pro.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-primary">{plans.pro.name}</CardTitle>
              <CardDescription className="text-lg">{plans.pro.description}</CardDescription>
              <div className="pt-4">
                <div className="text-4xl font-bold text-primary">
                  R$ {plans.pro.price[billingCycle].toFixed(2).replace('.', ',')}
                </div>
                <div className="text-muted-foreground">
                  {billingCycle === "yearly" ? "por ano" : "por mês"}
                </div>
                {billingCycle === "yearly" && (
                  <div className="text-sm text-emerald-400 mt-1 font-semibold animate-pulse">
                    💰 Economize R$ 39,80 por ano!
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-emerald-400">✓ Todos os recursos Pro:</h4>
                <ul className="space-y-2">
                  {plans.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button 
                className="w-full bg-gradient-primary hover:opacity-90 btn-futuristic text-lg py-6"
                onClick={() => handleSubscribe("pro")}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Assinar Agora
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 neon-text">
            Por que escolher o Abrev.io Pro?
          </h2>
          <p className="text-xl text-muted-foreground">
            Recursos profissionais para criadores e empresas sérias
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="glass-card border-accent/20 hover:border-primary/50 transition-all hover-scale">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Preview */}
        <Card className="glass-card border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Dúvidas Frequentes</CardTitle>
            <CardDescription>
              Respostas para as principais perguntas sobre nossos planos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h4>
                <p className="text-sm text-muted-foreground">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem custos adicionais.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">O que acontece com meus dados se eu cancelar?</h4>
                <p className="text-sm text-muted-foreground">
                  Seus dados ficam seguros por 30 dias. Você pode reativar sua conta a qualquer momento.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Existe desconto para estudantes?</h4>
                <p className="text-sm text-muted-foreground">
                  Sim! Entre em contato conosco com seu comprovante de matrícula para desconto especial.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Posso mudar de plano depois?</h4>
                <p className="text-sm text-muted-foreground">
                  Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContainer>

      {/* Checkout Modal */}
      <CheckoutModal 
        open={checkoutModalOpen}
        onOpenChange={setCheckoutModalOpen}
        plan={selectedPlan}
      />
    </PageLayout>
  );
}