import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Verified } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Mendes",
    role: "YouTuber",
    channel: "@carlostech",
    followers: "250k seguidores",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "O Abrev.io mudou minha vida! O PIX integrado me fez ganhar 3x mais em doações. A IA realmente otimiza meus links automaticamente.",
    rating: 5,
    highlight: true
  },
  {
    name: "Mariana Silva",
    role: "Influenciadora Digital",
    channel: "@mari_lifestyle",
    followers: "180k seguidores",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    content: "Finalmente uma plataforma que entende o brasileiro! A interface é linda e super fácil de usar. Meus seguidores adoraram o novo biolink.",
    rating: 5
  },
  {
    name: "Rafael Costa",
    role: "Podcaster",
    channel: "TechCast Brasil",
    followers: "120k ouvintes",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "Os analytics são impressionantes! Consigo entender exatamente de onde vem minha audiência e otimizar meu conteúdo baseado nos dados.",
    rating: 5
  },
  {
    name: "Beatriz Ferreira",
    role: "Artista Digital",
    channel: "@bea_arts",
    followers: "95k seguidores",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "Migrei do Linktree e não me arrependo! O carregamento é muito mais rápido e o design é bem mais bonito. Recomendo demais!",
    rating: 5,
    highlight: true
  },
  {
    name: "João Pedro",
    role: "Gamer & Streamer",
    channel: "@jpgamer",
    followers: "340k seguidores",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    content: "O suporte em português faz toda diferença! Sempre que preciso, eles me ajudam rapidinho. Plataforma feita por brasileiros para brasileiros.",
    rating: 5
  },
  {
    name: "Amanda Oliveira",
    role: "Coach de Negócios",
    channel: "@amanda_coach",
    followers: "75k seguidores",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    content: "O PIX integrado facilitou muito minha vida! Agora consigo receber pagamentos direto pelo biolink sem complicação. Excelente ferramenta!",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl float"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-foreground">
              Depoimentos Reais
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold font-poppins text-foreground mb-6">
            Criadores brasileiros que
            <span className="block bg-gradient-neon bg-clip-text text-transparent neon-text">
              confiam no Abrev.io
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Mais de 150 mil criadores já transformaram seus links em oportunidades reais. 
            Veja o que eles têm a dizer sobre nossa plataforma.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`group glass-card border-white/10 hover:border-neon-blue/50 transition-all duration-500 hover:shadow-neon hover:-translate-y-2 animate-slide-up ${
                testimonial.highlight ? 'ring-1 ring-neon-blue/30' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-neon-blue opacity-50" />
                </div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-foreground/80 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-neon-blue/30">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <Verified className="w-4 h-4 text-neon-blue" />
                    </div>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                    <p className="text-xs text-neon-blue">{testimonial.channel} • {testimonial.followers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 text-center animate-scale-in">
          <div className="glass-card p-8 rounded-2xl border-white/10 inline-block">
            <div className="flex items-center gap-8 flex-wrap justify-center">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold text-foreground">4.9</span>
                <span className="text-foreground/60">de 5 estrelas</span>
              </div>
              
              <div className="h-8 w-px bg-white/20"></div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">98%</div>
                <div className="text-sm text-foreground/60">Satisfação</div>
              </div>
              
              <div className="h-8 w-px bg-white/20"></div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple">24h</div>
                <div className="text-sm text-foreground/60">Suporte médio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;