// Unidades do Faça Amigos (Grupo IB) nunca devem aparecer neste site, mesmo que
// o banco devolva a linha sem workspace_id ou com escopo "all". Além do
// workspace_id, identifica pelo id/nome (sem acento, espaço ou hífen).
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const FACA_AMIGOS_IDS = ['clinicaa', 'clinicab'];

export const isFacaAmigosUnit = (u) => {
  if (!u) return false;
  const id = norm(u.id);
  const name = norm(u.name);
  return (
    id.includes('facaamigos') ||
    name.includes('facaamigos') ||
    FACA_AMIGOS_IDS.includes(id) ||
    u.workspaceId === 'grupoib' ||
    u.workspace_id === 'grupoib'
  );
};
