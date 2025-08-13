import { Button } from "@/components/ui/button";
import { Link2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Recursos", href: "#recursos" },
    { label: "Preços", action: () => navigate("/pricing") },
    { label: "Cases", href: "#depoimentos" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-white/10 bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-neon">
            <Link2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-poppins text-foreground">
            Abrev.io
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={link.action}
              className="text-sm text-foreground/70 hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-foreground/70 hover:text-primary hover:bg-white/5"
            onClick={() => navigate("/login")}
          >
            Entrar
          </Button>
          <Button
            className="bg-gradient-primary hover:shadow-elegant btn-futuristic font-semibold"
            onClick={() => navigate("/signup")}
          >
            Começar Grátis
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-foreground/70 hover:text-primary hover:bg-white/5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="glass-card border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col gap-4 mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    if (link.action) link.action();
                    setIsMenuOpen(false);
                  }}
                  className="text-foreground/80 hover:text-primary transition-colors py-2 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
              >
                Entrar
              </Button>
              <Button
                className="w-full bg-gradient-primary hover:shadow-elegant btn-futuristic font-semibold"
                onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}
              >
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}