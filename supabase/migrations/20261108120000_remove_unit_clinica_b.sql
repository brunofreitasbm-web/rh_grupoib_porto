-- Remove a unidade 'clinica-b' (Clínica B) do Grupo IB.
-- Já aplicada manualmente em produção (BD_CLINICA_RH). Idempotente.
-- Antes da exclusão a unidade não tinha registros operacionais; só 3 profiles
-- e 3 logins de quiosque (padrão, PJ e CLT).
BEGIN;
DELETE FROM public.profiles WHERE unit_id = 'clinica-b';
DELETE FROM auth.users WHERE email IN (
  'clinicab@grupoib.internal',
  'pj-clinicab@grupoib.internal',
  'clt-clinicab@grupoib.internal'
);
DELETE FROM public.units WHERE id = 'clinica-b';
COMMIT;
