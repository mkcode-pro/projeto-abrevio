import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Smartphone, ExternalLink, Heart, Share2, Sparkles, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-20 pb-12 md:pb-20 relative overflow-hidden">
      {/* Background minimalista */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-neon-blue/5"></div>
      <div className="absolute top-32 left-4 w-40 h-40 md:w-96 md:h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-4 w-32 h-32 md:w-80 md:h-80 bg-neon-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Mobile-First Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="text-center animate-fade-in mb-8 md:mb-12">
            {/* Badge Compacto */}
            <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-6 text-xs">
              <Sparkles className="h-3 w-3 text-neon-blue" />
              <span className="font-medium text-foreground">🇧🇷 Feito no Brasil</span>
            </div>

            {/* Título Mobile-Optimized */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-poppins mb-4 leading-tight">
              <span className="text-foreground">Todos seus</span>
              <br />
              <span className="bg-gradient-neon bg-clip-text text-transparent">links</span>
              <span className="text-foreground"> em</span>
              <br />
              <span className="text-neon-blue">um lugar</span>
            </h1>

            <p className="text-base md:text-lg text-foreground/70 mb-8 max-w-2xl mx-auto px-4">
              Biolink + Encurtador + IA + PIX.<br />
              <span className="text-neon-blue font-medium">Simples assim.</span>
            </p>

            {/* Quick Demo Mobile-First */}
            <div className="glass-card p-4 md:p-6 mb-8 max-w-lg mx-auto animate-slide-up">
              <div className="flex flex-col gap-3">
                <Input 
                  placeholder="instagram.com/seuperfil" 
                  className="glass border-white/20 h-11 text-sm focus:border-neon-blue focus:ring-neon-blue/20"
                />
                <Button className="h-11 bg-gradient-neon hover:shadow-neon btn-futuristic font-semibold">
                  <Zap className="w-4 h-4 mr-2" />
                  Criar Biolink
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-foreground/60">
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
            <div className="flex flex-col gap-3 max-w-sm mx-auto animate-scale-in">
              <Button 
                size="lg" 
                className="h-12 text-base bg-gradient-neon hover:shadow-neon btn-futuristic font-semibold"
              >
                Começar Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                className="h-12 text-base text-foreground hover:text-primary hover:bg-white/5 transition-all duration-200"
                onClick={() => window.open('/joaosilva', '_blank')}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Ver exemplo: @joaosilva
              </Button>
            </div>
          </div>

          {/* Mobile Preview - Compacto */}
          <div className="mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {/* Phone Mockup Menor */}
            <div className="relative mx-auto max-w-xs">
              {/* Phone frame mais fino */}
              <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-elegant">
                <div className="bg-gradient-to-b from-background to-background/80 rounded-xl overflow-hidden">
                  {/* Phone screen content compacto */}
                  <div className="relative h-96">
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-4 py-2 text-xs text-foreground/50">
                      <span>9:41</span>
                      <span className="text-neon-blue">abrev.io/joaosilva</span>
                    </div>
                    
                    {/* Biolink preview compacto */}
                    <div className="px-4 py-2 text-center">
                      {/* Profile */}
                      <div className="mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-neon mx-auto mb-2"></div>
                        <h3 className="font-bold text-sm text-foreground">@joaosilva</h3>
                        <p className="text-xs text-foreground/60">Creator 🇧🇷</p>
                      </div>
                      
                      {/* Links compactos */}
                      <div className="space-y-2">
                        <div className="glass-card p-3 rounded-lg flex items-center justify-between group hover:bg-neon-blue/5 transition-all">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-3 h-3 text-neon-blue" />
                            <span className="text-xs font-medium">YouTube</span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-foreground/40 group-hover:text-neon-blue transition-colors" />
                        </div>
                        
                        <div className="glass-card p-3 rounded-lg flex items-center justify-between group hover:bg-red-500/5 transition-all">
                          <div className="flex items-center gap-2">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span className="text-xs font-medium">Instagram</span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-foreground/40 group-hover:text-red-400 transition-colors" />
                        </div>
                        
                        <div className="glass-card p-3 rounded-lg flex items-center justify-between bg-neon-blue/10 border-neon-blue/20 pulse-neon">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-neon-blue" />
                            <span className="text-xs font-medium text-neon-blue">PIX R$ 10</span>
                          </div>
                          <span className="text-xs text-neon-blue font-bold">NEW</span>
                        </div>
                        
                        <div className="glass-card p-3 rounded-lg flex items-center justify-between group hover:bg-neon-purple/5 transition-all">
                          <div className="flex items-center gap-2">
                            <Share2 className="w-3 h-3 text-neon-purple" />
                            <span className="text-xs font-medium">WhatsApp</span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-foreground/40 group-hover:text-neon-purple transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating stats menores */}
              <div className="absolute -top-2 -right-2 glass-card p-2 rounded-lg float">
                <div className="text-xs text-center">
                  <div className="font-bold text-neon-blue text-xs">2.4k</div>
                  <div className="text-foreground/60 text-[10px]">views</div>
                </div>
              </div>
              
              <div className="absolute -bottom-2 -left-2 glass-card p-2 rounded-lg float" style={{ animationDelay: '1s' }}>
                <div className="text-xs text-center">
                  <div className="font-bold text-green-400 text-xs">R$ 890</div>
                  <div className="text-foreground/60 text-[10px]">PIX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;