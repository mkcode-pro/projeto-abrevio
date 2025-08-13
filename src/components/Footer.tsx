import { Link2, Instagram, Twitter, Youtube, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const OptimizedFooter = () => {
  return (
    <footer className="bg-gradient-to-t from-background/95 to-background border-t border-white/5 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative p-2 rounded-lg bg-gradient-neon">
                <Link2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-poppins text-foreground">
                Abrev.io
              </span>
            </div>
            
            <p className="text-sm text-foreground/70 mb-6 max-w-md">
              A plataforma brasileira que transforma sua presença digital. 
              <span className="text-neon-blue font-medium"> Biolinks + Encurtador + IA.</span>
            </p>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 text-foreground/60 hover:text-neon-blue hover:bg-white/10 rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-foreground/60 hover:text-neon-blue hover:bg-white/10 rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-foreground/60 hover:text-neon-blue hover:bg-white/10 rounded-full">
                <Youtube className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-foreground/60 hover:text-neon-blue hover:bg-white/10 rounded-full">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Produto</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-foreground/60 hover:text-neon-blue transition-colors">Recursos</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-neon-blue transition-colors">Preços</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-neon-blue transition-colors">Templates</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-neon-blue transition-colors">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-foreground/60 hover:text-neon-blue transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-neon-blue transition-colors">Contato</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-neon-blue transition-colors">API Docs</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-neon-blue transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-sm text-foreground/50 text-center md:text-left">
            © 2024 Abrev.io. Feito com <Heart className="inline w-4 h-4 text-red-400 mx-1" /> no Brasil.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-foreground/50">
            <a href="#" className="hover:text-neon-blue transition-colors">Privacidade</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Termos</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OptimizedFooter;