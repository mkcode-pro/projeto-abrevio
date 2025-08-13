import { Star, Quote, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Marina Silva",
    role: "Influencer • 127k seguidores",
    content: "Desde que uso o Abrev.io, meus cliques aumentaram 340%. O PIX nativo é um game changer!",
    metric: "+340% cliques",
    avatar: "MS",
    verified: true
  },
  {
    name: "Carlos Tech",
    role: "YouTuber • 89k inscritos", 
    content: "Interface linda, super fácil de usar. Meus seguidores adoraram o layout novo!",
    metric: "R$ 12k/mês PIX",
    avatar: "CT",
    verified: true
  },
  {
    name: "Loja Trendy",
    role: "E-commerce • São Paulo",
    content: "Analytics incríveis e conversão 5x melhor. Recomendo para todos os empreendedores!",
    metric: "+500% vendas",
    avatar: "LT",
    verified: false
  }
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Compacto */}
        <div className="text-center mb-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-4 text-xs">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="font-medium text-foreground">4.9/5 • +2.000 usuários</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-3">
            <span className="text-foreground">Resultados que</span>
            <br />
            <span className="bg-gradient-neon bg-clip-text text-transparent">falam por si</span>
          </h2>
        </div>

        {/* Testimonials Mobile-First */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="glass-card p-4 rounded-xl hover:shadow-elegant transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-neon flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {testimonial.avatar}
                    </span>
                  </div>
                  
                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        {testimonial.name}
                      </h4>
                      {testimonial.verified && (
                        <div className="w-3 h-3 rounded-full bg-neon-blue flex items-center justify-center">
                          <span className="text-[8px] text-white">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-foreground/60">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Quote Icon */}
                <Quote className="w-4 h-4 text-neon-blue/40" />
              </div>

              {/* Content */}
              <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Metric */}
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold text-green-400">
                  {testimonial.metric}
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="glass-card p-4 rounded-xl max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-bold text-lg md:text-xl text-neon-blue">2.547</div>
              <div className="text-xs text-foreground/60">Usuários Ativos</div>
            </div>
            <div>
              <div className="font-bold text-lg md:text-xl text-green-400">R$ 847k</div>
              <div className="text-xs text-foreground/60">Via PIX/mês</div>
            </div>
            <div>
              <div className="font-bold text-lg md:text-xl text-neon-purple">340%</div>
              <div className="text-xs text-foreground/60">+ Cliques médio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;