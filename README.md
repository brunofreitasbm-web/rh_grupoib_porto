# Controle de Estagiário — Porto Terapia

Sistema de controle de **frequência e ponto de estagiários** com validação por **GPS**
(raio de 1 km de cada unidade), gestão de estagiários, cálculo de horas
(diário/semanal) e painel da supervisão. Duas unidades: **Antônio Barreto** e **Generalíssimo**.

- **PIN da supervisão:** `1234`
- **Regras trabalhistas:** Lei do Estágio nº 11.788/2008 (6h/dia • 30h/semana)

---

## 1. O que instalar antes (uma vez só)

1. **Node.js** — baixe a versão LTS em https://nodejs.org e instale (Avançar, Avançar).
   - Para conferir, abra o **Prompt de Comando** e digite: `node -v` (deve mostrar um número de versão).

## 2. Criar o banco de dados (Supabase) — gratuito

1. Acesse https://supabase.com e clique em **"Start your project"** para criar uma conta e um novo projeto.
2. No painel do projeto, vá em **SQL Editor** → **"New query"**, cole o conteúdo do arquivo
   **`supabase_schema.sql`** (está nesta pasta) e clique em **"Run"**. Isso cria as tabelas,
   políticas de segurança (RLS) e dados iniciais necessários.
3. **Pegar a configuração:** vá em **Project Settings → Data API** (ou **API**) e copie a
   **Project URL** e a chave **`anon` / `public`**.
4. Copie o arquivo **`.env.example`** desta pasta para um novo arquivo chamado **`.env`**
   e cole os valores copiados em `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. Salve.

## 3. Rodar no seu computador (para testar)

Abra o **Prompt de Comando** dentro desta pasta e rode:

```bash
npm install
npm run dev
```

Vai aparecer um endereço como `http://localhost:5173` — abra no navegador.
> Dica: aparece também um endereço "Network" (ex.: `http://192.168.0.10:5173`).
> Enquanto seu PC estiver ligado e na mesma rede Wi-Fi, os estagiários podem abrir
> esse endereço pelo celular para bater o ponto (o GPS só funciona assim ou publicado — passo 4).

## 4. Publicar na Vercel (para usar de qualquer celular)

> **Importante:** o GPS do navegador só funciona em endereços **`https://`** (seguros).
> A Vercel já entrega `https://` de graça.

1. Suba esta pasta para um repositório no GitHub.
2. Em https://vercel.com: **"Add New..." → "Project"** e escolha o repositório.
3. A Vercel lê o arquivo **`vercel.json`** já incluído (build `npm run build`, saída `dist`, cabeçalhos de segurança e SPA fallback) — só confirmar.
4. Em **Settings → Environment Variables**, cadastre as mesmas chaves do seu `.env` local
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`/`VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_WORKSPACE_ID`
   e, se usar, `VITE_GEMINI_API_KEY`) antes do primeiro deploy.
5. Cada `git push` na branch principal gera um novo deploy automaticamente.
   - Para trocar o domínio: **Settings → Domains**.

### Dois sites, dois bancos (Porto Terapia e Grupo IB)

O mesmo código gera dois sites independentes. Cada deploy da Vercel tem o seu **próprio projeto Supabase**
(`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` diferentes) e o seu `VITE_WORKSPACE_ID`
(`porto-terapia` ou `grupoib`). Cada build inclui só o branding, as unidades, os quiosques e os administradores
do próprio grupo; não há seletor de grupo nem consulta ao banco do outro. Para acessar o outro grupo, saia
deste site e entre no site dele.

### ⚠️ Ajuste obrigatório do banco após publicar (URLs autorizadas)

Depois de ter o link da Vercel (ex.: `algum-nome.vercel.app`, ou o domínio próprio configurado):

1. No painel do Supabase, vá em **Authentication → URL Configuration**.
2. Em **"Site URL"** e/ou **"Redirect URLs"**, adicione o seu domínio da Vercel
   (ex.: `https://algum-nome.vercel.app`).
3. Salve. Isso autoriza o login a funcionar a partir do endereço publicado.

## 5. Primeiro uso (supervisão)

1. Abra o sistema → clique no ícone de escudo (canto superior direito) → digite o PIN **`1234`**.
2. Em **"Unidades & Localização do GPS"**: estando **fisicamente em cada unidade**,
   toque em **"Calibrar com minha localização"** para fixar o ponto exato de cada uma.
   (Sem calibrar, ficam as coordenadas aproximadas — o raio de 1 km ajuda, mas calibrar é o ideal.)
3. Em **"Gestão de Estagiários"**: cadastre os estagiários (nome, curso, unidade padrão, etc.).
4. Pronto. Os estagiários já podem bater o ponto na tela inicial, escolhendo nome, unidade,
   Entrada/Saída — o GPS valida automaticamente.

---

## Recursos de IA (opcional)

Os botões "✨ Profissionalizar" e "✨ Analisar Frequências" usam o Google Gemini.
Para ativá-los, copie `.env.example` para `.env` e cole uma chave gratuita
(https://aistudio.google.com/app/apikey) em `VITE_GEMINI_API_KEY`. Sem isso, o resto
do sistema funciona normalmente.

## Arquivos do projeto

| Arquivo | Para que serve |
|---|---|
| `src/App.jsx` | Todo o sistema (telas e lógica) |
| `src/supabase.js` | Cliente do Supabase, lê a configuração das variáveis de ambiente |
| `supabase_schema.sql` | Estrutura do banco (tabelas, políticas RLS) — rode no SQL Editor do Supabase |
| `vercel.json` | Configuração de build, cabeçalhos de segurança e SPA fallback na Vercel |
| `.env.example` | Modelo para as chaves do Supabase e a chave opcional de IA |

## Observações importantes

- **Dados na nuvem e compartilhados:** todos os aparelhos veem os mesmos estagiários e registros.
- **GPS por dispositivo:** cada estagiário bate o ponto no próprio celular; a localização é conferida
  contra a unidade escolhida (entrada e saída), dentro de 1 km.
- **Estagiários, não empregados:** o sistema segue a Lei 11.788/2008 (estágio), com alertas de
  6h/dia e 30h/semana — não é ponto CLT.
