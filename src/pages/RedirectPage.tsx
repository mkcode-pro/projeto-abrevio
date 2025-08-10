import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function RedirectPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError('Código de link inválido');
        setLoading(false);
        return;
      }

      try {
        // Buscar URL original
        const { data: url, error: fetchError } = await supabase
          .from('shortened_urls')
          .select('*')
          .eq('short_code', shortCode)
          .eq('is_active', true)
          .single();

        if (fetchError || !url) {
          setError('Link não encontrado ou inativo');
          setLoading(false);
          return;
        }

        // Incrementar contador de cliques
        const { error: updateError } = await supabase
          .from('shortened_urls')
          .update({ click_count: (url.click_count || 0) + 1 })
          .eq('id', url.id);

        if (updateError) {
          console.error('Erro ao incrementar contador:', updateError);
        }

        // Registrar clique para analytics
        await supabase
          .from('url_clicks')
          .insert({
            shortened_url_id: url.id,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          });

        setRedirectUrl(url.original_url);
        setLoading(false);

        // Countdown para redirecionamento
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              window.location.href = url.original_url;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        console.error('Erro no redirecionamento:', err);
        setError('Erro interno do servidor');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Card className="glass-card border-neon-blue/20 max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-neon-blue mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-white mb-2">Redirecionando...</h2>
            <p className="text-white/70">Processando seu link</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Card className="glass-card border-red-500/20 max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Link não encontrado</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <Button onClick={() => window.location.href = '/'} className="bg-gradient-neon">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <Card className="glass-card border-neon-blue/20 max-w-md">
        <CardContent className="p-8 text-center">
          <ExternalLink className="w-12 h-12 text-neon-blue mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Redirecionando em {countdown}s</h2>
          <p className="text-white/70 mb-6">Você será redirecionado automaticamente</p>
          <div className="space-y-3">
            <Button 
              onClick={handleManualRedirect}
              className="w-full bg-gradient-neon hover:shadow-neon"
            >
              Ir Agora
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/'}
              className="w-full text-white/70 hover:text-white"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}