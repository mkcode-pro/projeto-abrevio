import { Zap, Smartphone, BarChart3, Shield, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: Zap,
    title: "PIX Nativo",
    description: "Receba doações e pagamentos diretamente no seu biolink.",
    highlight: "🇧🇷 Exclusivo",
    color: "text-green-400",
    gradient: "from-green-500/10 to-green-600/5"
  },
  {
    icon: Sparkles,
    title: "IA Integrada", 
    description: "Sugestões automáticas de bio, links e otimizações.",
    highlight: "Novidade",
    color: "text-neon-purple",
    gradient: "from-purple-500/10 to-purple-600/5"
  },
  {
    icon: BarChart3,
    title: "Analytics Pro",
    description: "Dados em tempo real de cliques, conversões e receita.",
    highlight: "Gratuito",
    color: "text-neon-blue",
    gradient: "from-blue-500/10 to-blue-600/5"
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "100% otimizado para celular, onde estão seus seguidores.",
    highlight: "Perfeito",
    color: "text-orange-400",
    gradient: "from-orange-500/10 to-orange-600/5"
  },
  {
    icon: TrendingUp,
    title: "Conversão +3x",
    description: "Layout científico que converte visitantes em clientes.",
    highlight: "Comprovado",
    color: "text-emerald-400",
    gradient: "from-emerald-500/10 to-emerald-600/5"
  },
  {
    icon: Shield,
    title: "URLs Seguras",
    description: "Encurtador com proteção anti-spam e SSL grátis.",
    highlight: "Confiável",
    color: "text-blue-400",
    gradient: "from-sky-500/10 to-sky-600/5"
  }
];

const BenefitsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="recursos" className="py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-4 text-xs">
            <Sparkles className="h-3 w-3 text-neon-blue" />
            <span className="font-medium text-foreground">Por que escolher o Abrev.io</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            <span className="text-foreground">Tudo que você precisa</span>
            <br />
            <span className="bg-gradient-neon bg-clip-text text-transparent">em uma plataforma</span>
          </h2>
          
          <p className="text-foreground/70 md:text-lg">
            Não perca tempo com várias ferramentas. 
            <span className="text-neon-blue font-medium"> Uma solução completa.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="glass-card p-6 rounded-2xl hover:shadow-elegant transition-all duration-300 group animate-fade-in hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${benefit.gradient}`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <span className="text-xs glass-card px-2 py-1 rounded-full text-neon-blue font-medium">
                  {benefit.highlight}
                </span>
              </div>

              <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-neon-blue transition-colors">
                {benefit.title}
              </h3>
              
              <p className="text-sm text-foreground/70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="glass-card p-8 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-xl text-foreground mb-2">
              Pronto para começar?
            </h3>
            <p className="text-sm text-foreground/70 mb-6">
              Crie seu biolink em <span className="text-neon-blue font-medium">menos de 2 minutos</span>
            </p>
            
            <div className="space-y-3">
              <Button 
                size="lg"
                className="w-full h-12 bg-gradient-neon hover:shadow-neon btn-futuristic font-semibold"
                onClick={() => navigate('/signup')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Começar Grátis Agora
              </Button>
              
              <p className="text-xs text-foreground/50">
                ✓ Sem cartão de crédito ✓ Setup instantâneo ✓ Suporte 24h
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;