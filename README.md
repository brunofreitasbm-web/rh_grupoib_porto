# Gestão de Pessoas Porto Terapia

Controle de frequência e ponto de estagiários da Porto Terapia, com validação por GPS e biometria facial.

App React + Vite, publicado na Vercel (projeto `porto-terapia-gestao`, `VITE_WORKSPACE_ID=porto-terapia`).

## Banco de dados compartilhado
Este repo é a **fonte única do schema** do projeto Supabase compartilhado com o Grupo IB (repo `grupo_ib_rh`).
- `supabase/migrations/` e `supabase_schema.sql` valem para as duas marcas. O isolamento é por `workspace_id` + RLS.
- Mudanças de banco pedidas pelo Grupo IB entram por PR aqui.
- As edge functions do Grupo IB vivem no repo `grupo_ib_rh`.

## Desenvolvimento
```bash
cp .env.example .env   # preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm ci
npm run dev
npm test
```
Veja `MANUAL.md` para o uso do sistema.
