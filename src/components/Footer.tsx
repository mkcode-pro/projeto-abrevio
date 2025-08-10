import { Link2, Instagram, Twitter, Youtube, Linkedin, Facebook, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="contato" className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-neon"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative p-2 rounded-xl bg-gradient-neon neon-glow">
                <Link2 className="h-6 w-6 text-primary-foreground" />
                <div className="absolute inset-0 rounded-xl bg-gradient-neon opacity-30 blur-lg"></div>
              </div>
              <span className="text-3xl font-bold font-poppins neon-text">Abrev.io</span>
            </div>
            
            <p className="text-foreground/70 mb-8 max-w-md leading-relaxed">
              A primeira plataforma brasileira de biolinks com PIX nativo, IA integrada 
              e interface pensada para criadores de conteúdo do Brasil.
            </p>
            
            <div className="flex gap-4 mb-8">
              <a 
                href="https://instagram.com/abrev.io" 
                className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-foreground/70 group-hover:text-pink-400 transition-colors" />
              </a>
              <a 
                href="https://twitter.com/abrev_io" 
                className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-foreground/70 group-hover:text-blue-400 transition-colors" />
              </a>
              <a 
                href="https://youtube.com/@abrevio" 
                className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 group"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-foreground/70 group-hover:text-red-400 transition-colors" />
              </a>
              <a 
                href="https://linkedin.com/company/abrevio" 
                className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-foreground/70 group-hover:text-blue-500 transition-colors" />
              </a>
              <a 
                href="https://tiktok.com/@abrev.io" 
                className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:border-neon-blue/50 hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300 group"
                aria-label="TikTok"
              >
                <Video className="w-5 h-5 text-foreground/70 group-hover:text-neon-blue transition-colors" />
              </a>
            </div>
            
            {/* Newsletter */}
            <div className="glass-card p-6 rounded-2xl border-white/10">
              <h4 className="font-semibold text-foreground mb-3">
                🚀 Fique por dentro das novidades
              </h4>
              <p className="text-sm text-foreground/60 mb-4">
                Receba dicas exclusivas e updates sobre novas funcionalidades
              </p>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  placeholder="Seu melhor email"
                  className="flex-1 px-4 py-2 rounded-xl glass border-white/20 text-sm focus:border-neon-blue focus:outline-none"
                />
                <Button className="bg-gradient-neon hover:shadow-neon btn-futuristic">
                  Inscrever
                </Button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-foreground mb-6 text-lg">Produto</h3>
            <ul className="space-y-4">
              <li>
                <a href="#biolink" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Biolink Profissional
                </a>
              </li>
              <li>
                <a href="#encurtador" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Encurtador de URLs
                </a>
              </li>
              <li>
                <a href="#analytics" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Analytics Avançados
                </a>
              </li>
              <li>
                <a href="#pix" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  PIX Integrado
                </a>
              </li>
              <li>
                <a href="#ia" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  IA Otimização
                </a>
              </li>
              <li>
                <a href="#api" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  API Developers
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-foreground mb-6 text-lg">Suporte</h3>
            <ul className="space-y-4">
              <li>
                <a href="#ajuda" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#tutoriais" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Tutoriais e Guias
                </a>
              </li>
              <li>
                <a href="#comunidade" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Comunidade
                </a>
              </li>
              <li>
                <a href="#contato" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Fale Conosco
                </a>
              </li>
              <li>
                <a href="#status" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Status da Plataforma
                </a>
              </li>
              <li>
                <a href="#blog" className="text-foreground/70 hover:text-neon-blue transition-colors duration-300 hover:neon-text">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <p className="text-foreground/50 text-sm">
                © 2024 Abrev.io - Feito com ❤️ no Brasil
              </p>
              <div className="flex items-center gap-2 text-xs text-foreground/40">
                <span>🇧🇷</span>
                <span>Orgulhosamente brasileiro</span>
                <span>•</span>
                <span>CNPJ: 00.000.000/0001-00</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              <a href="#termos" className="text-foreground/50 hover:text-neon-blue text-sm transition-colors duration-300">
                Termos de Uso
              </a>
              <a href="#privacidade" className="text-foreground/50 hover:text-neon-blue text-sm transition-colors duration-300">
                Política de Privacidade
              </a>
              <a href="#lgpd" className="text-foreground/50 hover:text-neon-blue text-sm transition-colors duration-300">
                LGPD
              </a>
              <a href="#cookies" className="text-foreground/50 hover:text-neon-blue text-sm transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;