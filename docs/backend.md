# Backend - Supabase Integration

## 🗄️ Visão Geral

O backend do Abrev.io utiliza Supabase como Backend-as-a-Service (BaaS), fornecendo banco de dados PostgreSQL, autenticação, storage e edge functions.

## Database Schema

### Tabelas Principais

#### profiles
```sql
-- Perfis de usuários (complemento ao auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY,           -- Referência ao auth.users.id
  email TEXT NOT NULL,
  name TEXT,
  username TEXT,
  avatar_url TEXT,
  plan plan_type DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### bio_links
```sql
-- Páginas de biolink dos usuários
CREATE TABLE bio_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,        -- Referência ao profiles.id
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme JSONB DEFAULT '{"backgroundColor": "#ffffff", "primaryColor": "#3b82f6", "textColor": "#1f2937"}',
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### bio_link_items
```sql
-- Links individuais dentro de um biolink
CREATE TABLE bio_link_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bio_link_id UUID NOT NULL,    -- FK para bio_links
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'link',
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### shortened_urls
```sql
-- URLs encurtadas
CREATE TABLE shortened_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,        -- FK para profiles
  original_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  title TEXT,
  qr_code_url TEXT,
  click_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### social_links
```sql
-- Links de redes sociais
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bio_link_id UUID NOT NULL,    -- FK para bio_links
  platform TEXT NOT NULL,      -- 'instagram', 'whatsapp', etc
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### url_clicks
```sql
-- Analytics de cliques
CREATE TABLE url_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shortened_url_id UUID,       -- FK para shortened_urls (nullable)
  bio_link_item_id UUID,       -- FK para bio_link_items (nullable)
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### user_roles
```sql
-- Sistema de papéis
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,       -- FK para auth.users
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);
```

## Row Level Security (RLS)

### Políticas de Segurança

#### profiles
```sql
-- Usuários podem ver e editar apenas próprio perfil
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

#### bio_links
```sql
-- Públicos podem ver biolinks ativos
CREATE POLICY "Public can view active bio links" 
ON bio_links FOR SELECT 
USING (is_active = true);

-- Usuários podem gerenciar próprios biolinks
CREATE POLICY "Users can manage own bio links" 
ON bio_links FOR ALL 
USING (auth.uid() = user_id);
```

#### bio_link_items
```sql
-- Público pode ver itens ativos de biolinks ativos
CREATE POLICY "Public can view active bio link items" 
ON bio_link_items FOR SELECT 
USING (
  is_active = true AND 
  EXISTS (
    SELECT 1 FROM bio_links 
    WHERE bio_links.id = bio_link_items.bio_link_id 
    AND bio_links.is_active = true
  )
);

-- Usuários podem gerenciar itens dos próprios biolinks
CREATE POLICY "Users can manage own bio link items" 
ON bio_link_items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM bio_links 
    WHERE bio_links.id = bio_link_items.bio_link_id 
    AND bio_links.user_id = auth.uid()
  )
);
```

#### shortened_urls
```sql
-- Usuários podem gerenciar próprias URLs
CREATE POLICY "Users can manage own shortened URLs" 
ON shortened_urls FOR ALL 
USING (auth.uid() = user_id);
```

#### url_clicks
```sql
-- Público pode inserir cliques (para analytics)
CREATE POLICY "Public can insert clicks" 
ON url_clicks FOR INSERT 
WITH CHECK (true);

-- Usuários podem ver cliques dos próprios links
CREATE POLICY "Users can view clicks on own URLs" 
ON url_clicks FOR SELECT 
USING (
  (shortened_url_id IS NOT NULL AND 
   EXISTS (SELECT 1 FROM shortened_urls WHERE shortened_urls.id = url_clicks.shortened_url_id AND shortened_urls.user_id = auth.uid()))
  OR
  (bio_link_item_id IS NOT NULL AND 
   EXISTS (SELECT 1 FROM bio_link_items bli JOIN bio_links bl ON bli.bio_link_id = bl.id WHERE bli.id = url_clicks.bio_link_item_id AND bl.user_id = auth.uid()))
);
```

## Functions e Triggers

### Funções de Utilidade

#### has_role function
```sql
-- Função para verificar papel do usuário (evita recursão em RLS)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

#### update_updated_at function
```sql
-- Função para atualizar timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Triggers

#### Updated At Triggers
```sql
-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bio_links_updated_at
  BEFORE UPDATE ON bio_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Similar para outras tabelas...
```

## Authentication

### Auth Configuration
```typescript
// Configuração do cliente Supabase
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)
```

### Auth Flows

#### Login/Signup
```typescript
// Email/Password
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// OAuth (futuro)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})
```

#### Session Management
```typescript
// Verificar sessão atual
const { data: { session } } = await supabase.auth.getSession()

// Listen para mudanças de auth
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Usuário logou
  } else if (event === 'SIGNED_OUT') {
    // Usuário deslogou
  }
})
```

## Storage

### Buckets Configuration
```sql
-- Bucket para avatars (público)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Bucket para arquivos privados (futuro)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('private', 'private', false);
```

### Storage Policies
```sql
-- Políticas para avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Edge Functions (Futuras)

### Casos de Uso Planejados
- **QR Code Generation** - Gerar QR codes para links
- **Analytics Processing** - Processar dados de cliques
- **Email Notifications** - Enviar emails transacionais
- **Image Processing** - Redimensionar avatars

### Exemplo de Edge Function
```typescript
// supabase/functions/qr-generator/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { url } = await req.json()
  
  // Gerar QR Code
  const qrCodeUrl = await generateQR(url)
  
  return new Response(
    JSON.stringify({ qr_code_url: qrCodeUrl }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

## Database Migrations

### Migration Files Structure
```
supabase/
├── migrations/
│   ├── 20240101000000_initial_schema.sql
│   ├── 20240102000000_add_rls_policies.sql
│   ├── 20240103000000_add_storage_policies.sql
│   └── ...
├── config.toml
└── seed.sql
```

### Best Practices
- **Versionamento sequencial** de migrations
- **Rollback strategy** para cada migration
- **Data integrity** verificada após cada mudança
- **RLS policies** aplicadas imediatamente

## Performance

### Indexing Strategy
```sql
-- Índices para performance
CREATE INDEX idx_bio_links_username ON bio_links(username);
CREATE INDEX idx_bio_links_user_id ON bio_links(user_id);
CREATE INDEX idx_shortened_urls_short_code ON shortened_urls(short_code);
CREATE INDEX idx_url_clicks_clicked_at ON url_clicks(clicked_at);
```

### Query Optimization
- **Select specific columns** ao invés de SELECT *
- **Limit/offset** para paginação
- **Composite indexes** para queries complexas
- **Real-time subscriptions** apenas quando necessário

## Monitoring

### Built-in Monitoring
- **Supabase Dashboard** - Métricas em tempo real
- **Auth logs** - Login/logout events
- **Database logs** - Slow queries e erros
- **API usage** - Rate limiting e quotas

### Custom Analytics
```sql
-- View para analytics consolidados
CREATE VIEW user_analytics AS
SELECT 
  u.id as user_id,
  COUNT(bl.id) as bio_links_count,
  COUNT(su.id) as shortened_urls_count,
  SUM(bl.view_count) as total_views,
  SUM(su.click_count) as total_clicks
FROM profiles u
LEFT JOIN bio_links bl ON bl.user_id = u.id
LEFT JOIN shortened_urls su ON su.user_id = u.id
GROUP BY u.id;
```