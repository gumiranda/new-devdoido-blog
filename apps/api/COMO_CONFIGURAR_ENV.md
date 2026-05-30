# 🔧 Como configurar o `.env` (guia para leigos)

Este guia ensina, **passo a passo**, como preencher o arquivo de configuração (`.env`) da API. Você **não precisa saber programar**. É só criar contas em alguns sites, copiar umas "senhas" (chaves) e colar aqui.

---

## 📌 Antes de começar — 3 regras de ouro

1. **O arquivo se chama `.env`** e fica dentro da pasta `apps/api/`. Ele já existe.
2. **NUNCA mostre esse arquivo para ninguém nem suba pro GitHub.** Ele tem senhas. (O projeto já ignora ele automaticamente.)
3. **Cada linha tem o formato `NOME=valor`.** Sem espaços, sem aspas. Exemplo:
   ```
   ANTHROPIC_API_KEY=sk-ant-abc123...
   ```

### Como abrir e editar o `.env`
- No VS Code: abra a pasta do projeto, entre em `apps/api`, clique no arquivo `.env`.
- Se não aparecer (arquivos que começam com ponto ficam escondidos), no VS Code use **Ctrl+P** (ou ⌘P no Mac), digite `.env` e abra.
- Editou? **Salve** (Ctrl+S / ⌘S). Pronto.

> 💡 Sempre que mudar o `.env`, **reinicie o servidor** (pare com Ctrl+C no terminal e rode `bun run dev` de novo). Ele só lê o arquivo quando liga.

---

## 🎯 Você não precisa preencher tudo de uma vez

As chaves estão divididas em **níveis**. Faça na ordem. O app já **funciona** com o Nível 1. Os outros vão **ligando funcionalidades** conforme você preenche.

| Nível | Liga o quê? | Obrigatório? |
|-------|-------------|--------------|
| 1 — Essencial | App sobe, login funciona | ✅ Sim |
| 2 — IA | Gerar artigo + moderar conteúdo | Recomendado |
| 3 — YouTube | Importar canais e vídeos | Opcional |
| 4 — Transcrição | Vídeo → texto | Opcional |
| 5 — Pagamentos | Cobrar Pix / cartão | Opcional |
| 6 — Email | Avisar usuário | Opcional |
| 7 — Imagens | Upload de capa de artigo | Opcional |
| 8 — Indexação Google | Ver se artigo está no Google | Opcional |

---

## 🟢 Nível 1 — Essencial (sem isto o app não liga)

### `DATABASE_URL` — o banco de dados
**O que é:** onde ficam guardados os artigos, usuários, etc. Usamos o **Neon** (Postgres grátis).

**Passo a passo:**
1. Acesse **https://neon.tech** e clique em **Sign up** (entre com Google ou GitHub).
2. Clique em **Create Project**. Dê um nome (ex: `devdoido`). Escolha a região mais perto (ex: South America).
3. Na tela do projeto, procure o botão **Connect** (ou a caixa **Connection string**).
4. Copie o texto que começa com `postgresql://...` — esse é o seu `DATABASE_URL`.
   - ⚠️ Pegue a versão **"Pooled connection"** (tem `-pooler` no meio do endereço).
5. Cole no `.env`:
   ```
   DATABASE_URL=postgresql://usuario:senha@ep-xxx-pooler.regiao.aws.neon.tech/banco?sslmode=require
   ```

### `BETTER_AUTH_SECRET` — senha interna do login
**O que é:** uma senha secreta gigante que o sistema usa pra proteger as sessões de login. Você **inventa uma aleatória**.

**Como gerar (escolha 1 opção):**
- No terminal (Mac/Linux), rode:
  ```
  openssl rand -base64 32
  ```
  Copie o resultado.
- OU acesse **https://generate-secret.vercel.app/32** e copie o valor.

Cole no `.env`:
```
BETTER_AUTH_SECRET=cole-aqui-o-valor-aleatorio-gerado
```

### `ENCRYPTION_KEY` — chave que protege tokens do Google
**O que é:** outra senha aleatória, usada pra **criptografar** os tokens do YouTube antes de salvar no banco. Gera igual à de cima:
```
openssl rand -base64 32
```
Cole:
```
ENCRYPTION_KEY=cole-aqui-outro-valor-aleatorio
```
> ⚠️ **Importante:** depois de definir essa chave e conectar contas do Google, **não troque ela**. Se trocar, os tokens salvos viram lixo e os usuários precisam reconectar.

### As que já vêm prontas (só confira)
```
BETTER_AUTH_URL=http://localhost:3000
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:4321
```
- `BETTER_AUTH_URL` = endereço da API (deixe assim no seu computador).
- `CORS_ORIGIN` = endereço do site (a "landing"). Em desenvolvimento é `http://localhost:4321`. Quando publicar o site, troque pelo domínio real (ex: `https://devdoido.com.br`).

✅ **Com isso o app já sobe.** Teste: `bun run dev` e abra `http://localhost:3000/api/health` — deve aparecer `{"ok":true}`.

---

## 🤖 Nível 2 — IA (gerar e moderar artigos)

### `ANTHROPIC_API_KEY` — escreve os artigos (Claude)
1. Acesse **https://console.anthropic.com** e crie conta.
2. Adicione créditos em **Billing** (a IA é paga por uso; comece com US$ 5).
3. Vá em **API Keys** → **Create Key** → copie (começa com `sk-ant-`).
```
ANTHROPIC_API_KEY=sk-ant-cole-aqui
```

### `OPENAI_API_KEY` — checa se o conteúdo é seguro (moderação)
1. Acesse **https://platform.openai.com** e crie conta.
2. Vá em **https://platform.openai.com/api-keys** → **Create new secret key** → copie (começa com `sk-`).
3. (A moderação da OpenAI é **gratuita**, mas a conta pede um cartão.)
```
OPENAI_API_KEY=sk-cole-aqui
```

---

## 📺 Nível 3 — YouTube (importar canais e vídeos)

Aqui é o passo mais trabalhoso. Você cria um "app" no Google pra ter permissão de ler o YouTube.

### `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
1. Acesse **https://console.cloud.google.com** (entre com sua conta Google).
2. No topo, clique em **Select a project → New Project**. Dê um nome (ex: `devdoido`) e crie.
3. Ative a API do YouTube:
   - Menu (☰) → **APIs e serviços → Biblioteca**.
   - Busque **"YouTube Data API v3"** → clique → **Ativar**.
4. Configure a tela de consentimento (só na 1ª vez):
   - **APIs e serviços → Tela de permissão OAuth**.
   - Escolha **Externo** → preencha nome do app e seu email → salve.
5. Crie as credenciais:
   - **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth**.
   - Tipo: **Aplicativo da Web**.
   - Em **URIs de redirecionamento autorizados**, adicione exatamente:
     ```
     http://localhost:3000/api/v1/google/callback
     ```
   - Clique em **Criar**.
6. Aparecem **Client ID** e **Client Secret** — copie os dois.
```
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-cole-aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/google/callback
```
> Quando publicar de verdade, troque `http://localhost:3000` pelo domínio real da API e adicione esse novo endereço também nas URIs autorizadas do Google.

---

## 🎙️ Nível 4 — Transcrição (vídeo vira texto)

### `GLADIA_API_KEY`
1. Acesse **https://app.gladia.io** e crie conta.
2. No painel, procure **API Keys** → copie a chave.
```
GLADIA_API_KEY=cole-aqui
```

### `GLADIA_WEBHOOK_SECRET`
**O que é:** uma senha que VOCÊ inventa pra confirmar que o aviso "transcrição pronta" veio mesmo da Gladia. Gere uma aleatória (igual ao `BETTER_AUTH_SECRET`) e cole:
```
GLADIA_WEBHOOK_SECRET=valor-aleatorio-que-voce-gerou
```
(Use o mesmo valor quando configurar o webhook no painel da Gladia, se ele pedir.)

---

## 💳 Nível 5 — Pagamentos

### Pix — `ABACATEPAY_API_KEY` e `ABACATEPAY_WEBHOOK_SECRET`
1. Acesse **https://www.abacatepay.com** e crie conta.
2. No painel, vá em **Integrar / API** → copie a **API Key**.
```
ABACATEPAY_API_KEY=cole-aqui
```
3. O `ABACATEPAY_WEBHOOK_SECRET` é uma senha que você inventa (aleatória) e também cadastra no painel deles, na configuração de **Webhook**:
```
ABACATEPAY_WEBHOOK_SECRET=valor-aleatorio
```

### Cartão — `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`
1. Acesse **https://dashboard.stripe.com** e crie conta.
2. Comece em **modo de teste** (botão "Test mode" ligado).
3. Vá em **Desenvolvedores → Chaves de API** → copie a **Secret key** (começa com `sk_test_`).
```
STRIPE_SECRET_KEY=sk_test_cole-aqui
```
4. O `STRIPE_WEBHOOK_SECRET` aparece quando você cria um webhook em **Desenvolvedores → Webhooks → Adicionar endpoint** (a Stripe te dá um valor começando com `whsec_`):
```
STRIPE_WEBHOOK_SECRET=whsec_cole-aqui
```

---

## 📧 Nível 6 — Email (avisos para o usuário)

### `RESEND_API_KEY`
1. Acesse **https://resend.com** e crie conta.
2. Vá em **API Keys → Create API Key** → copie (começa com `re_`).
```
RESEND_API_KEY=re_cole-aqui
```

---

## 🖼️ Nível 7 — Imagens (upload de capa)

Usamos um "HD na nuvem" compatível com S3. O mais barato/fácil é o **Cloudflare R2** (tem camada grátis).

### `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
1. Acesse **https://dash.cloudflare.com** e crie conta.
2. Menu lateral → **R2** → **Create bucket**. Dê um nome (ex: `devdoido-imagens`).
3. Em **R2 → Manage R2 API Tokens → Create API Token**:
   - Permissão: **Object Read & Write**.
   - Copie **Access Key ID** e **Secret Access Key**.
   - Anote o **Endpoint** (algo como `https://<conta>.r2.cloudflarestorage.com`).
4. Preencha:
   ```
   S3_ENDPOINT=https://sua-conta.r2.cloudflarestorage.com
   S3_REGION=auto
   S3_BUCKET=devdoido-imagens
   S3_ACCESS_KEY_ID=cole-aqui
   S3_SECRET_ACCESS_KEY=cole-aqui
   ```

---

## 🔎 Nível 8 — Indexação no Google (Search Console)

Liga o painel que mostra se cada artigo já apareceu no Google.

### `GOOGLE_SEARCH_CONSOLE_PROPERTY` e `GOOGLE_APPLICATION_CREDENTIALS`
1. Acesse **https://search.google.com/search-console** e adicione seu site (a "propriedade").
2. O `GOOGLE_SEARCH_CONSOLE_PROPERTY` é o endereço do site cadastrado lá:
   ```
   GOOGLE_SEARCH_CONSOLE_PROPERTY=https://devdoido.com.br/
   ```
3. O `GOOGLE_APPLICATION_CREDENTIALS` é o **caminho de um arquivo `.json`** (conta de serviço) que você baixa no Google Cloud:
   - No **console.cloud.google.com** (mesmo projeto do Nível 3) → **APIs e serviços → Credenciais → Criar credenciais → Conta de serviço**.
   - Crie, abra a conta de serviço → **Chaves → Adicionar chave → JSON** → baixa um arquivo.
   - Salve esse arquivo numa pasta segura e aponte o caminho:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/caminho/para/o/arquivo-baixado.json
   ```
   - No Search Console, dê acesso ao email dessa conta de serviço (em **Configurações → Usuários e permissões**).

---

## ✅ Checklist final

- [ ] Nível 1 preenchido (banco + 2 senhas geradas)
- [ ] Salvei o `.env`
- [ ] Rodei `bun run dev` na pasta `apps/api`
- [ ] Abri `http://localhost:3000/api/health` e vi `{"ok":true}`
- [ ] (Opcional) Preenchi os níveis das funcionalidades que vou usar

### Como testar se uma chave funciona
- **App liga?** → `bun run dev`. Se reclamar de "Missing required env var", faltou algo do Nível 1.
- **Banco conecta?** → `bun run db:seed` (popula dados de exemplo). Se der erro de conexão, revise o `DATABASE_URL`.
- **Cada integração** só é chamada quando você usa a funcionalidade dela. Se a chave estiver vazia, a funcionalidade fica **desligada** (não quebra o resto).

---

## 🆘 Problemas comuns

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| `Missing required env var: DATABASE_URL` | Faltou o banco | Preencha o Nível 1 |
| App não vê a chave nova | Servidor não reiniciou | Ctrl+C e `bun run dev` de novo |
| Login não funciona no site | `CORS_ORIGIN` errado | Coloque o endereço exato do site |
| Google diz "redirect_uri_mismatch" | URI diferente | O endereço no Google tem que ser **idêntico** ao `GOOGLE_REDIRECT_URI` |
| Transcrição não acontece | Sem `GLADIA_API_KEY` | Preencha o Nível 4 |

---

## 📋 Tabela resumo (cola rápida)

| Variável | Onde pegar | Grátis? | Nível |
|----------|-----------|---------|-------|
| `DATABASE_URL` | neon.tech | ✅ | 1 |
| `BETTER_AUTH_SECRET` | você gera (`openssl rand -base64 32`) | ✅ | 1 |
| `ENCRYPTION_KEY` | você gera (`openssl rand -base64 32`) | ✅ | 1 |
| `ANTHROPIC_API_KEY` | console.anthropic.com | 💰 pago por uso | 2 |
| `OPENAI_API_KEY` | platform.openai.com/api-keys | ✅ (moderação) | 2 |
| `GOOGLE_CLIENT_ID/SECRET` | console.cloud.google.com | ✅ | 3 |
| `GLADIA_API_KEY` | app.gladia.io | ✅ teste / 💰 | 4 |
| `ABACATEPAY_API_KEY` | abacatepay.com | ✅ cadastro | 5 |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com | ✅ teste | 5 |
| `RESEND_API_KEY` | resend.com | ✅ | 6 |
| `S3_*` | dash.cloudflare.com (R2) | ✅ camada grátis | 7 |
| `GOOGLE_SEARCH_CONSOLE_PROPERTY` | search.google.com/search-console | ✅ | 8 |

> Onde diz "você gera": é só rodar o comando no terminal e colar o resultado. Onde diz um site: criar conta, achar a área de "API Keys", copiar e colar.
