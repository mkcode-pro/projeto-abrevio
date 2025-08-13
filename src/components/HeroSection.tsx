import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Smartphone, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center py-12 md:py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-neon-blue/5 -z-10"></div>
      <div className="absolute top-32 -left-10 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 -right-10 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-6 text-xs animate-fade-in">
            <Sparkles className="h-3 w-3 text-neon-blue" />
            <span className="font-medium text-foreground">🇧🇷 Feito no Brasil</span>
          </div>

          {/* Title */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins mb-6 leading-tight animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-foreground">Todos seus </span>
            <span className="bg-gradient-neon bg-clip-text text-transparent">links</span>
            <span className="text-foreground"> em um só lugar</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-base md:text-lg text-foreground/70 mb-8 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Biolink + Encurtador + IA + PIX.
            <span className="text-neon-blue font-medium"> Simples assim.</span>
          </p>

          {/* Quick Demo */}
          <div 
            className="glass-card p-4 md:p-6 mb-8 max-w-sm mx-auto animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex flex-col gap-3">
              <Input 
                placeholder="seu-username" 
                className="glass border-white/20 h-11 text-sm focus:border-primary focus:ring-primary/20 text-center"
              />
              <Button className="h-11 bg-gradient-primary hover:shadow-elegant btn-futuristic font-semibold" onClick={() => navigate('/signup')}>
                <Zap className="w-4 h-4 mr-2" />
                Criar Biolink Grátis
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-foreground/60">
              <span className="flex items-center justify-center gap-1"><Sparkles className="w-3 h-3" />PIX</span>
              <span className="flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" />Analytics</span>
              <span className="flex items-center justify-center gap-1"><Zap className="w-3 h-3" />IA</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <Button 
              size="lg" 
              className="h-12 bg-gradient-primary hover:shadow-elegant btn-futuristic font-semibold"
              onClick={() => navigate('/signup')}
            >
              Começar Agora
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="ghost" 
              className="h-12 text-foreground hover:text-primary hover:bg-white/5"
              onClick={() => window.open('/bio/joaosilva', '_blank')}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Ver exemplo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;