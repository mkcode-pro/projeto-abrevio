# 🚀 Guia de Deploy da Abrev.io

## Pré-requisitos

- Node.js 18+ ou Bun
- VPS com Ubuntu 22.04+
- Domínio próprio configurado
- Supabase account (para backend)

## 1. Configuração do Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y nginx certbot python3-certbot-nginx git

# Instalar Node.js (via nvm recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Ou instalar Bun (mais rápido)
curl -fsSL https://bun.sh/install | bash
```

## 2. Configuração do Projeto

```bash
# Clonar repositório
git clone <your-repo-url> abrev.io
cd abrev.io

# Instalar dependências
bun install  # ou npm install

# Build para produção
bun run build  # ou npm run build
```

## 3. Configuração do Supabase

1. Criar projeto no [Supabase](https://supabase.com)
2. Executar migrations do database (fornecidas separadamente)
3. Configurar RLS (Row Level Security) policies
4. Obter URL e anon key do projeto

## 4. Variáveis de Ambiente

Criar arquivo `.env.production`:

```bash
# URLs
VITE_APP_URL=https://seudominio.com
VITE_API_URL=https://api.seudominio.com

# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# Configurações opcionais
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
```

## 5. Configuração do Nginx

```nginx
# /etc/nginx/sites-available/abrev.io
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    root /var/www/abrev.io/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
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
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

## 6. SSL Certificate

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/abrev.io /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

## 7. Deploy Automatizado

Script de deploy (`deploy.sh`):

```bash
#!/bin/bash
set -e

echo "🚀 Iniciando deploy da Abrev.io..."

# Pull latest changes
git pull origin main

# Install dependencies
bun install

# Build
bun run build

# Backup current version
sudo cp -r /var/www/abrev.io/dist /var/www/abrev.io/dist.backup.$(date +%Y%m%d%H%M%S)

# Deploy new version
sudo rm -rf /var/www/abrev.io/dist
sudo cp -r dist /var/www/abrev.io/

# Set permissions
sudo chown -R www-data:www-data /var/www/abrev.io/dist
sudo chmod -R 755 /var/www/abrev.io/dist

# Reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deploy concluído com sucesso!"
```

## 8. Monitoramento

### PM2 para gerenciamento (se usando Node.js server)
```bash
npm install -g pm2
pm2 start npm --name "abrev.io" -- start
pm2 startup
pm2 save
```

### Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Aplicação logs (se usando PM2)
pm2 logs abrev.io
```

## 9. Backup e Restore

### Backup do Supabase
```bash
# Backup do banco de dados
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup_$(date +%Y%m%d).sql
```

### Backup dos arquivos
```bash
# Backup completo
tar -czf abrev_backup_$(date +%Y%m%d).tar.gz /var/www/abrev.io
```

## 10. Performance e Otimização

### Configurações adicionais do Nginx
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
}

# Compression otimizada
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

### CDN (Cloudflare recomendado)
- Configurar proxy através do Cloudflare
- Ativar cache automático
- Configurar Page Rules para otimização

## 11. Manutenção

### Updates regulares
```bash
# System updates
sudo apt update && sudo apt upgrade -y

# SSL renewal (automático)
sudo certbot renew --dry-run

# Verificar status dos serviços
sudo systemctl status nginx
```

### Monitoring básico
```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
top

# Nginx status
sudo systemctl status nginx
```

## 12. Troubleshooting

### Problemas comuns

1. **Build error**: Verificar Node.js version e dependencies
2. **Nginx 502**: Verificar se a aplicação está rodando
3. **SSL issues**: Verificar certificado com `sudo certbot certificates`
4. **Permission denied**: Verificar ownership com `ls -la /var/www/abrev.io`

### Logs úteis
```bash
# Verificar logs do Nginx
sudo tail -n 50 /var/log/nginx/error.log

# Verificar espaço em disco
df -h

# Verificar processos
ps aux | grep nginx
```

---

## 📞 Suporte

Para suporte técnico específico da implementação, consulte:
- Documentação do Supabase
- Logs da aplicação
- Status do servidor

**Importante**: Este projeto está configurado com dados mock. A integração real com Supabase deve ser feita conforme suas necessidades específicas.