// Configuração de marca/identidade do workspace DESTE build. Cada deploy
// (Vercel) usa seu próprio projeto Supabase e seu próprio arquivo de branding:
// vite.config.js aponta o alias '@workspace-branding' para branding.porto.js ou
// branding.grupoib.js conforme VITE_WORKSPACE_ID. Assim o bundle de um site
// não contém unidades, contas de quiosque, admins ou logos do outro, e o
// restante do código nunca precisa checar "porto-terapia"/"grupoib".
import { WORKSPACE_BRANDING } from '@workspace-branding';

export const BRANDING = WORKSPACE_BRANDING;
export const CURRENT_WORKSPACE_ID = WORKSPACE_BRANDING.id;
