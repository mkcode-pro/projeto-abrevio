import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Smartphone, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-64px)] pt-20 pb-12 md:pb-20 relative overflow-hidden flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-neon-blue/5"></div>
      <div className="absolute top-32 -left-10 sm:left-4 w-40 h-40 md:w-96 md:h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 -right-10 sm:right-4 w-32 h-32 md:w-80 md:h-80 bg-neon-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-6 text-xs">
              <Sparkles className="h-3 w-3 text-neon-blue" />
              <span className="font-medium text-foreground">🇧🇷 Feito no Brasil com IA</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins mb-6 leading-tight">
              <span className="text-foreground">Todos os seus </span>
              <span className="bg-gradient-neon bg-clip-text text-transparent">links</span>
              <span className="text-foreground"> em um só lugar</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              A plataforma definitiva para criar seu biolink, encurtar URLs e receber pagamentos com PIX.
              <span className="text-neon-blue font-medium"> Simples, rápido e poderoso.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-scale-in justify-center" style={{ animationDelay: '0.2s' }}>
              <Button 
                size="lg" 
                className="h-12 text-base bg-gradient-neon hover:shadow-neon btn-futuristic font-semibold w-full sm:w-auto"
                onClick={() => navigate('/signup')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Começar Grátis Agora
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="h-12 text-base text-foreground hover:text-primary hover:bg-white/5 transition-all duration-200 w-full sm:w-auto"
                onClick={() => window.open('/joaosilva', '_blank')}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Ver Exemplo
              </Button>
            </div>
            
            <p className="text-xs text-foreground/50 mt-6">
              ✓ Sem cartão de crédito ✓ Setup instantâneo ✓ Suporte 24h
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;