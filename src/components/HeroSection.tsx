import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Smartphone, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-4rem)] py-12 md:py-20 relative overflow-hidden flex items-center">
      {/* Background minimalista */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-neon-blue/5"></div>
      <div className="absolute top-20 sm:top-32 -left-10 sm:left-4 w-32 h-32 sm:w-40 sm:h-40 md:w-96 md:h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 sm:bottom-20 -right-10 sm:right-4 w-24 h-24 sm:w-32 sm:h-32 md:w-80 md:h-80 bg-neon-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Mobile-First Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="text-center animate-fade-in mb-8 md:mb-12">
            {/* Badge Compacto */}
            <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-4 sm:mb-6 text-xs">
              <Sparkles className="h-3 w-3 text-neon-blue" />
              <span className="font-medium text-foreground">🇧🇷 Feito no Brasil</span>
            </div>

            {/* Título Mobile-Optimized */}
            <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-4 sm:mb-6 leading-[1.2] px-2 sm:px-0">
              <span className="text-foreground">Todos seus </span>
              <span className="bg-gradient-neon bg-clip-text text-transparent">links</span>
              <span className="text-foreground"> em um só lugar</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-foreground/70 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-4">
              Biolink + Encurtador + IA + PIX.
              <span className="text-neon-blue font-medium"> Simples assim.</span>
            </p>

            {/* Quick Demo Mobile-First */}
            <div className="glass-card p-3 sm:p-4 md:p-6 mb-6 sm:mb-8 max-w-[min(90vw,28rem)] mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col gap-2 sm:gap-3">
                <Input 
                  placeholder="seu-username" 
                  className="glass border-white/20 h-10 sm:h-11 text-sm focus:border-neon-blue focus:ring-neon-blue/20 text-center"
                />
                <Button className="h-10 sm:h-11 bg-gradient-neon hover:shadow-neon btn-futuristic font-semibold text-sm sm:text-base" onClick={() => navigate('/signup')}>
                  <Zap className="w-4 h-4 mr-2" />
                  Criar Biolink Grátis
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4 text-[0.65rem] sm:text-xs text-foreground/60">
                <span className="flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  PIX
                </span>
                <span className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Analytics
                </span>
                <span className="flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" />
                  IA
                </span>
              </div>
            </div>

            {/* CTA Buttons Mobile-Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-scale-in justify-center" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                className="h-11 sm:h-12 text-sm sm:text-base bg-gradient-neon hover:shadow-neon btn-futuristic font-semibold w-full sm:w-auto"
                onClick={() => navigate('/signup')}
              >
                Começar Agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                className="h-11 sm:h-12 text-sm sm:text-base text-foreground hover:text-primary hover:bg-white/5 transition-all duration-200 w-full sm:w-auto"
                onClick={() => window.open('/joaosilva', '_blank')}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Ver exemplo: @joaosilva
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;