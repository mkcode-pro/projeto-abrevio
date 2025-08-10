import { Card, CardContent } from "@/components/ui/card";
import { 
  CreditCard, 
  Brain, 
  MapPin, 
  Shield, 
  Zap, 
  BarChart3,
  Smartphone,
  Globe
} from "lucide-react";

const benefits = [
  {
    icon: CreditCard,
    title: "PIX Nativo Integrado",
    description: "Receba doações e pagamentos direto no seu biolink. Sistema PIX 100% brasileiro, sem intermediários.",
    color: "text-green-400",
    highlight: true
  },
  {
    icon: Brain,
    title: "IA Integrada",
    description: "Inteligência artificial otimiza seus links automaticamente para máxima conversão e engajamento.",
    color: "text-purple-400",
    highlight: true
  },
  {
    icon: MapPin,
    title: "Interface 100% BR",
    description: "Design pensado para o brasileiro, com elementos culturais e UX que faz sentido para nosso público.",
    color: "text-yellow-400",
    highlight: true
  },
  {
    icon: BarChart3,
    title: "Analytics Avançados",
    description: "Dashboards completos com dados de cliques, origem do tráfego e performance em tempo real.",
    color: "text-blue-400"
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Proteção SSL, backups automáticos e conformidade com LGPD. Seus dados seguros sempre.",
    color: "text-red-400"
  },
  {
    icon: Zap,
    title: "Velocidade Extrema",
    description: "Carregamento ultra-rápido com CDN brasileiro. Seus links abrem instantaneamente.",
    color: "text-orange-400"
  },
  {
    icon: Smartphone,
    title: "Mobile Perfeito",
    description: "Experiência otimizada para dispositivos móveis, onde seus seguidores mais acessam.",
    color: "text-cyan-400"
  },
  {
    icon: Globe,
    title: "Domínio Personalizado",
    description: "Use seu próprio domínio nos links encurtados para fortalecer sua marca pessoal.",
    color: "text-indigo-400"
  }
];

const BenefitsSection = () => {
  return (
    <section id="recursos" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-neon-blue" />
            <span className="text-sm font-medium text-foreground">
              Por que escolher o Abrev.io?
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold font-poppins text-foreground mb-6">
            Feito especialmente para
            <span className="block bg-gradient-neon bg-clip-text text-transparent neon-text">
              criadores brasileiros
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Não somos apenas mais uma ferramenta de links. Somos a primeira plataforma 
            que entende as necessidades únicas do mercado brasileiro.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card 
                key={index} 
                className={`group glass-card border-white/10 hover:border-neon-blue/50 transition-all duration-500 hover:shadow-neon hover:-translate-y-2 animate-slide-up ${
                  benefit.highlight ? 'ring-1 ring-neon-blue/30' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-neon/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                      benefit.highlight ? 'neon-glow' : ''
                    }`}>
                      <IconComponent className={`w-7 h-7 ${benefit.color}`} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-neon-blue transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-foreground/70 leading-relaxed text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="glass-card p-8 lg:p-12 rounded-3xl border-white/10 animate-scale-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold font-poppins text-neon-blue mb-2 neon-text">
                150k+
              </div>
              <div className="text-foreground/70 font-medium">Criadores ativos</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold font-poppins text-neon-purple mb-2">
                5M+
              </div>
              <div className="text-foreground/70 font-medium">Links criados</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold font-poppins text-green-400 mb-2">
                R$ 12M
              </div>
              <div className="text-foreground/70 font-medium">Processado em PIX</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold font-poppins text-yellow-400 mb-2">
                99.9%
              </div>
              <div className="text-foreground/70 font-medium">Uptime garantido</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;