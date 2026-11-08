import { test, expect } from '@playwright/test';

// Roda com: VITE_WORKSPACE_ID=porto-terapia VITE_SUPABASE_URL=https://mock.supabase.co
//           VITE_SUPABASE_ANON_KEY=x npx playwright test e2e/porto-sem-dados-grupoib.spec.js
// Supabase 100% mockado: supervisor com escopo "all" (RLS devolve os dois workspaces)
// e dados que misturam unidades/estagiarios da Porto Terapia com os do Grupo IB.
const SHOTS = process.env.SHOTS_DIR || 'test-results';
const PORTO_NAMES = ['PortoEstagiaria Alfa', 'PortoEstagiario Beta', 'PortoEstagiaria Gama', 'PortoEstagiario Delta'];
const IB_NAMES = ['IBEstagiario Zeta', 'IBEstagiaria Eta', 'IBEstagiario Theta'];
const IB_UNIT_NAMES = ['FaçaAmigos Grão Pará', 'FaçaAmigos Parque Shopping'];

const units = [
  { id: 'antonio-barreto', name: 'Porto Terapia Antônio Barreto', workspace_id: 'porto-terapia', lat: -1.4, lng: -48.4, radius_km: 1 },
  { id: 'generalissimo', name: 'Porto Terapia Generalíssimo', workspace_id: 'porto-terapia', lat: -1.4, lng: -48.4, radius_km: 1 },
  { id: 'faca-amigos-grao-para', name: 'FaçaAmigos Grão Pará', workspace_id: 'grupoib', lat: -1.4, lng: -48.4, radius_km: 1 },
  { id: 'faca-amigos-parque-shopping', name: 'FaçaAmigos Parque Shopping', workspace_id: 'grupoib', lat: -1.4, lng: -48.4, radius_km: 1 },
];
const mk = (id, name, unit_id) => ({
  id, name, course: 'Psicologia', institution: 'UFPA', unit_id,
  active: true, daily_hours: 6, allowance: 1000, start_date: '2026-01-01', end_date: '2026-12-31',
  registration_status: 'active', birthdate: `1999-${String(new Date().getMonth() + 1).padStart(2, '0')}-15`,
});
const interns = [
  mk('p0', PORTO_NAMES[0], 'antonio-barreto'), mk('p1', PORTO_NAMES[1], 'antonio-barreto'),
  mk('p2', PORTO_NAMES[2], 'generalissimo'), mk('p3', PORTO_NAMES[3], 'generalissimo'),
  mk('ib0', IB_NAMES[0], 'faca-amigos-grao-para'), mk('ib1', IB_NAMES[1], 'faca-amigos-parque-shopping'),
  mk('ib2', IB_NAMES[2], 'faca-amigos-parque-shopping'),
];
const now = new Date().toISOString();
const rec = (id, intern_id, intern_name, unitId) => ({
  id, intern_id, intern_name, action: 'entrada', timestamp: now, created_at: now,
  geo: unitId ? { unitId, unitName: 'x' } : null,
});
const records = [
  rec('r0', 'p0', PORTO_NAMES[0], 'antonio-barreto'),
  rec('r1', 'ib0', IB_NAMES[0], 'faca-amigos-grao-para'),
  rec('r2', 'ib1', IB_NAMES[1], null), // sem geo.unitId: so o intern_id denuncia o workspace
];

const supervisor = {
  id: 'sup-id', aud: 'authenticated', role: 'authenticated', email: 'bruno@portoterapia.com',
  user_metadata: { role: 'supervisor', name: 'Bruno' },
  app_metadata: { role: 'supervisor', provider: 'email', workspace_scope: ['grupoib', 'porto-terapia', 'all'] },
  created_at: now,
};
const session = { access_token: 'fake', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'r', user: supervisor };

async function setup(page) {
  await page.route('**/auth/v1/**', (route) => {
    const body = route.request().url().includes('/user') ? supervisor : session;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await page.route('**/rest/v1/**', (route) => {
    const u = route.request().url();
    let body = [];
    if (u.includes('/rest/v1/units')) body = units;
    else if (u.includes('/rest/v1/interns')) body = interns;
    else if (u.includes('/rest/v1/records')) body = records;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body), headers: { 'content-range': `0-${body.length}/${body.length}` } });
  });
  await page.route('**/rest/v1/rpc/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"candidates":[],"total":0}' }));
  await page.addInitScript((s) => { localStorage.setItem('sb-mock-auth-token', JSON.stringify(s)); }, session);
}

async function enterAdmin(page) {
  const adminBtn = page.getByRole('button', { name: /Acesso Administrativo/i });
  if (await adminBtn.isVisible().catch(() => false)) await adminBtn.click();
}

async function assertNoIb(page, where) {
  const text = await page.locator('body').innerText();
  for (const n of IB_NAMES) expect(text, `${where}: ${n}`).not.toContain(n);
  for (const n of IB_UNIT_NAMES) expect(text, `${where}: ${n}`).not.toContain(n);
  expect(text, where).not.toMatch(/Grão Pará|Parque Shopping|Umarizal/i);
}

// Todos os botoes de aba do modulo de estagiarios (descobertos em runtime).
const ABAS = ['Dashboard', 'Estagiários', 'Frequência', 'Escala', 'Acompanhamento & Recesso', 'Abonos & Ocorrências', 'Desligamento / Rescisão', 'Documentos', 'Documentos Admissionais', 'Alertas & Pendências', 'Aniversariantes', 'Financeiro & Folhas'];

test('Porto Terapia: so estagiarios da Porto, nenhum do Grupo IB, em todas as abas e filtros', async ({ page }, info) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await setup(page);
  await page.goto('/');
  await enterAdmin(page);
  await page.waitForTimeout(3000);

  const select = page.locator('select[title="Filtrar por unidade"]').first();
  await expect(select).toBeVisible();
  const opts = await select.locator('option').allInnerTexts();
  console.log('opcoes do filtro de unidade:', JSON.stringify(opts));
  expect(opts.join('|')).toMatch(/Antônio Barreto/);
  expect(opts.join('|')).toMatch(/Generalíssimo/);
  expect(opts.join('|')).not.toMatch(/Grão Pará|Parque Shopping|FaçaAmigos/i);

  const visitadas = [];
  for (const filtro of ['all', 'antonio-barreto', 'generalissimo']) {
    await select.selectOption(filtro);
    for (const aba of ABAS) {
      const btn = page.getByRole('button', { name: aba, exact: true }).first();
      if (!(await btn.isVisible().catch(() => false))) continue;
      await btn.click();
      await page.waitForTimeout(900);
      if (!visitadas.includes(aba)) visitadas.push(aba);
      await assertNoIb(page, `${aba} [${filtro}]`);
      if (aba === 'Estagiários') {
        const text = await page.locator('body').innerText();
        const esperados = filtro === 'all' ? PORTO_NAMES : filtro === 'antonio-barreto' ? PORTO_NAMES.slice(0, 2) : PORTO_NAMES.slice(2);
        for (const n of esperados) expect(text, `Estagiarios [${filtro}] deve mostrar ${n}`).toContain(n);
        if (filtro === 'all') await page.screenshot({ path: `${SHOTS}/porto-estagiarios-todas-unidades.png`, fullPage: true });
      }
      if (aba === 'Dashboard' && filtro === 'all') {
        // KPIs: 4 estagiarios da Porto (7 se o Grupo IB vazasse), R$ 4.000 (R$ 7.000), 1 presente (3).
        const kpi = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
        expect(kpi).toMatch(/ESTAGIÁRIOS ATIVOS 4 /i);
        expect(kpi).toContain('R$ 4.000,00');
        expect(kpi).toMatch(/PRESENTES HOJE \(1\)/i);
      }
      if (aba === 'Dashboard' && filtro === 'all') await page.screenshot({ path: `${SHOTS}/porto-dashboard-todas-unidades.png`, fullPage: true });
    }
  }
  console.log('abas visitadas:', visitadas.join(', '));
  expect(visitadas).toContain('Dashboard');
  expect(visitadas).toContain('Estagiários');
  expect(visitadas.length).toBeGreaterThan(6);

  // Busca global: acha estagiario da Porto, nao acha o do Grupo IB. Abre pelo botao
  // "Buscar (Ctrl+K)": o atalho em si nao e testado aqui (ha dois <Omnibar> montados
  // no admin e o toggle duplo anula o Ctrl+K, defeito pre-existente fora deste escopo).
  await page.getByRole('button', { name: 'Buscar' }).first().click();
  await page.keyboard.type('Estagiari');
  await expect(page.getByPlaceholder(/Buscar estagiário/).first()).toBeVisible();
  await page.waitForTimeout(800);
  const omni = await page.locator('body').innerText();
  expect(omni).toContain('PortoEstagiaria Alfa');
  for (const n of IB_NAMES) expect(omni).not.toContain(n);
  await page.screenshot({ path: `${SHOTS}/porto-omnibar.png` });
  await page.keyboard.press('Escape');
});
