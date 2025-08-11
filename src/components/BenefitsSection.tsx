import { Zap, Smartphone, BarChart3, Shield, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Zap,
    title: "PIX Nativo",
    description: "Receba doações e pagamentos diretamente no seu biolink",
    highlight: "🇧🇷 Exclusivo",
    color: "text-green-400"
  },
  {
    icon: Sparkles,
    title: "IA Integrada", 
    description: "Sugestões automáticas de bio, links e otimizações",
    highlight: "Novidade",
    color: "text-neon-purple"
  },
  {
    icon: BarChart3,
    title: "Analytics Pro",
    description: "Dados em tempo real de cliques, conversões e receita",
    highlight: "Gratuito",
    color: "text-neon-blue"
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "100% otimizado para celular, onde estão seus seguidores",
    highlight: "Perfeito",
    color: "text-orange-400"
  },
  {
    icon: TrendingUp,
    title: "Conversão +3x",
    description: "Layout científico que converte visitantes em clientes",
    highlight: "Comprovado",
    color: "text-emerald-400"
  },
  {
    icon: Shield,
    title: "URLs Seguras",
    description: "Encurtador com proteção anti-spam e SSL grátis",
    highlight: "Confiável",
    color: "text-blue-400"
  }
];

const MobileOptimizedBenefits = () => {
  return (
    <section id="recursos" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-4 text-xs">
            <Sparkles className="h-3 w-3 text-neon-blue" />
            <span className="font-medium text-foreground">Por que escolher o Abrev.io</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold font-poppins mb-4">
            <span className="text-foreground">Tudo que você precisa</span>
            <br />
            <span className="bg-gradient-neon bg-clip-text text-transparent">em uma plataforma</span>
          </h2>
          
          <p className="text-foreground/70 text-sm md:text-base">
            Não perca tempo com várias ferramentas. 
            <span className="text-neon-blue font-medium"> Uma solução completa.</span>
          </p>
        </div>

        {/* Benefits Grid Mobile-First */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="glass-card p-4 md:p-6 rounded-xl hover:shadow-elegant transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon & Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br from-${benefit.color.split('-')[1]}-500/10 to-${benefit.color.split('-')[1]}-600/5`}>
                  <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
                </div>
                <span className="text-xs glass-card px-2 py-1 rounded-full text-neon-blue font-medium">
                  {benefit.highlight}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-bold text-base md:text-lg text-foreground mb-2 group-hover:text-neon-blue transition-colors">
                {benefit.title}
              </h3>
              
              <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-card p-6 md:p-8 rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-lg md:text-xl text-foreground mb-2">
              Pronto para começar?
            </h3>
            <p className="text-sm text-foreground/70 mb-6">
              Crie seu biolink em <span className="text-neon-blue font-medium">menos de 2 minutos</span>
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full h-11 bg-gradient-neon hover:shadow-neon btn-futuristic font-semibold"
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

export default MobileOptimizedBenefits;