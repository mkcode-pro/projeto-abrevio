# 📸 Como Configurar o Upload de Fotos

## ⚠️ IMPORTANTE: O upload precisa de uma configuração no Supabase!

### O que você precisa fazer (É SIMPLES!):

## Passo 1: Entrar no Supabase
1. Acesse: https://supabase.com
2. Faça login com sua conta
3. Clique no seu projeto **abrev-io**

## Passo 2: Criar o Espaço para Guardar as Fotos
1. No menu lateral esquerdo, procure por **Storage** (Armazenamento)
2. Clique em **Storage**
3. Clique no botão **"New bucket"** (Novo bucket)
4. Preencha assim:
   - **Nome:** avatars
   - **Public bucket:** Marque esta opção ✅
   - **File size limit:** 5MB
   - **Allowed MIME types:** image/*
5. Clique em **Create** (Criar)

## Passo 3: Configurar as Permissões
Depois de criar o bucket, precisamos permitir que os usuários façam upload:

1. Ainda na página do Storage
2. Clique em **Policies** (Políticas)
3. Clique em **New Policy** (Nova Política)
4. Escolha **For full customization** (Personalização completa)
5. Cole este texto exatamente:

```
Nome da política: Allow authenticated uploads

Permissão: INSERT

Target roles: authenticated

WITH CHECK expression:
auth.uid()::text = (storage.foldername(name))[1]
```

6. Clique em **Review** e depois **Save policy**

## Passo 4: Adicionar Política de Visualização
1. Clique em **New Policy** novamente
2. Escolha **For full customization**
3. Cole este texto:

```
Nome da política: Public Access

Permissão: SELECT

Target roles: anon, authenticated

Deixe WITH CHECK vazio
```

4. Clique em **Review** e depois **Save policy**

## ✅ PRONTO!
Agora o upload deve funcionar! 

### Para testar:
1. Volte para o site
2. Faça login
3. Vá no Editor de Bio Link
4. Tente fazer upload de uma foto

### Se ainda der erro:
- Abra o console do navegador (F12)
- Tire um print do erro
- Me envie que eu resolvo!

## 🆘 Alternativa Rápida
Se você quiser, posso criar um botão no próprio site que configura isso automaticamente. Me avise se preferir assim!