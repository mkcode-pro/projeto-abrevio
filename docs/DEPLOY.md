# 📚 Guia de Deploy - Abrev.io

## 🎯 Visão Geral
Este documento descreve o processo completo para fazer deploy do Abrev.io em um servidor VPS.

## 📋 Pré-requisitos

### No Servidor VPS:
- Ubuntu 20.04+ ou Debian 11+
- Node.js 20+
- Nginx ou Apache
- PM2 (para gerenciamento de processo)
- Git
- SSL (Let's Encrypt)

### Configurações Necessárias:
- Conta Supabase configurada
- Conta Stripe (para pagamentos)
- Domínio configurado apontando para o VPS

## 🚀 Passo a Passo do Deploy

### 1. Preparar o Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx

# Instalar Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Configurar Aplicação

```bash
# Criar diretório da aplicação
sudo mkdir -p /var/www/abrev.io
sudo chown -R $USER:$USER /var/www/abrev.io

# Clonar repositório
cd /var/www/abrev.io
git clone https://github.com/seu-usuario/abrev-io.git .

# Instalar dependências
npm ci --production

# Copiar e configurar .env
cp .env.production.example .env.production
nano .env.production  # Editar com suas configurações

# Build de produção
npm run build
```

### 3. Configurar Nginx

Criar arquivo `/etc/nginx/sites-available/abrev.io`:

```nginx
server {
    listen 80;
    server_name abrev.io www.abrev.io;
    
    root /var/www/abrev.io/dist;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

Ativar site:
```bash
sudo ln -s /etc/nginx/sites-available/abrev.io /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Configurar SSL

```bash
sudo certbot --nginx -d abrev.io -d www.abrev.io
```

### 5. Configurar PM2 (Se usar SSR)

```bash
# Criar ecosystem file
pm2 ecosystem

# Editar ecosystem.config.js
module.exports = {
  apps: [{
    name: 'abrev-io',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/abrev.io',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configurar Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 🔧 Manutenção

### Atualizar Aplicação
```bash
cd /var/www/abrev.io
git pull origin main
npm ci --production
npm run build
# Se usar PM2: pm2 restart abrev-io
```

### Monitorar Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PM2 logs (se aplicável)
pm2 logs abrev-io
```

### Backup
```bash
# Backup do código
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/abrev.io

# Backup do banco (Supabase faz automaticamente)
```

## 🚨 Troubleshooting

### Erro 502 Bad Gateway
- Verificar se a aplicação está rodando
- Verificar logs do Nginx
- Verificar configuração de proxy

### Erro 404 em rotas
- Verificar configuração do Nginx (try_files)
- Certificar que o build foi feito corretamente

### Problemas de Performance
- Ativar cache no Nginx
- Usar CDN (Cloudflare)
- Otimizar imagens

## 📊 Monitoramento

### Ferramentas Recomendadas:
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Plausible
- **Erros**: Sentry
- **Performance**: Google PageSpeed, GTmetrix

## 🔐 Segurança

### Checklist de Segurança:
- [ ] SSL configurado e renovação automática
- [ ] Firewall configurado
- [ ] Headers de segurança
- [ ] Rate limiting configurado
- [ ] Backups automáticos
- [ ] Monitoramento de uptime
- [ ] Logs centralizados
- [ ] Dependências atualizadas

## 📝 Variáveis de Ambiente

### Produção (.env.production):
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave
VITE_APP_URL=https://abrev.io
NODE_ENV=production
```

## 🆘 Suporte

Em caso de problemas:
1. Verificar logs
2. Consultar documentação
3. Abrir issue no GitHub
4. Contatar suporte técnico

---

**Última atualização:** Janeiro 2025
**Versão:** 1.0.0