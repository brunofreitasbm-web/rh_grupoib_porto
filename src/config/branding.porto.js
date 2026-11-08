// Branding do workspace Porto Terapia. Este arquivo só entra no bundle do deploy
// Porto (alias @workspace-branding em vite.config.js), então nada do Grupo IB
// (unidades, quiosques, admins, logos) chega ao navegador deste site.
export const WORKSPACE_BRANDING = {
  id: 'porto-terapia',
  appTitle: 'Porto Terapia • Gestão de Pessoas',
  shortName: 'Porto Terapia',
  themeColor: '#1a1a2e',
  logoPath: '/logo.jpg',
  logoType: 'image/jpeg',
  faviconPath: '/favicon.ico',
  faviconType: 'image/jpeg',
  logoAlt: 'Logo Porto Terapia',
  // Subtítulo mostrado abaixo do nome na tela de login (ver App.jsx).
  subtitle: 'Gestão de Pessoas',
  loginSubtitle: 'Gestão de Pessoas',
  displayName: 'Porto Terapia',
  legalEntityName: 'Porto Terapia Clínica de Psicologia LTDA',
  legalEntityShort: 'Porto Terapia Clínica de Psicologia',
  documentTagline: 'Clínica de Psicologia e Desenvolvimento Humano',
  documentLocation: 'Belém - PA',
  contactEmail: 'contato@portoterapia.com.br',
  rhEmail: 'rh@portoterapia.com.br',
  cnpj: '12.345.678/0001-90',
  phone: '(91) 98888-7777',
  // Widget de chat "Fale com a Supervisão" (estagiário) + painel espelhado
  // de atendimento na aba RH (supervisor).
  showSupervisionChat: true,
  // Garante o estagiário de teste para o supervisor (comportamento histórico da Porto).
  ensureTestIntern: true,
  showPublicPayrollUpload: false,
  // Função de "esqueci minha senha" usada hoje pelo login do supervisor.
  recuperarSenhaUrl: 'https://ivjvpdzsfjdpyabbzzuj.supabase.co/functions/v1/recuperar-senha',
  // Domínio usado quando um estagiário é cadastrado sem e-mail próprio
  // (vira <usuario>@<fallbackInternEmailDomain>).
  fallbackInternEmailDomain: 'portoterapia.com',
  // Módulo de Profissionais PJ (prestadores de serviço) — ver ProfessionalKiosk.jsx.
  // Desligado neste site: a Porto Terapia hoje só controla estagiários.
  showProfessionalsModule: false,
  professionalTermsVersion: '1.0',
  professionalLabels: {
    singular: 'Prestador(a)',
    plural: 'Profissionais PJ',
    presence: 'Registro de Presença',
    production: 'Apuração de Produção',
  },
  professionalTermsText:
    'Este registro de presença serve exclusivamente para organização de agenda, ' +
    'segurança do local e conferência dos serviços prestados para fins de faturamento. ' +
    'Ele não constitui, e não deve ser interpretado como, controle de jornada de trabalho, ' +
    'ponto eletrônico ou qualquer forma de subordinação, sendo seu uso facultativo e ' +
    'autodeclarado pelo(a) próprio(a) prestador(a) de serviços, no âmbito do contrato de ' +
    'prestação de serviços firmado com a empresa.',
  // Autocadastro de Profissionais PJ (ver ProfessionalSelfRegistration.jsx)
  // — desligado neste site junto com o restante do módulo PJ.
  showProfessionalSelfRegistration: false,
  autonomyDeclarationVersion: '1.0',
  autonomyDeclarationText: '',
  // Módulo de Funcionários CLT — ver EmployeeKiosk.jsx. Desligado neste site
  // (a Porto Terapia hoje não usa o hub para empregados CLT).
  showEmployeesModule: false,
  biometricConsentVersion: '1.0',
  // Autocadastro de Funcionários CLT (ver EmployeeSelfRegistration.jsx) —
  // desligado neste site junto com o restante do módulo CLT.
  showEmployeeSelfRegistration: false,
  employeeLgpdConsentVersion: '1.0',
  employeeLabels: {
    singular: 'Funcionário(a)',
    plural: 'Funcionários CLT',
    timesheet: 'Ponto Eletrônico',
  },
  // Módulo Freelance (trabalhos pontuais) — ver src/config/freelanceConstants.js.
  // Quarta categoria de vínculo do hub, sem quiosque/PIN/presença; entrada
  // pelo cadastro direto ou pelo Banco de Talentos. Desligado neste site.
  showFreelanceModule: false,
  freelanceLabels: {
    singular: 'Freelancer',
    plural: 'Freelancers',
    jobs: 'Trabalhos (OS)',
  },
  // Contas com role 'supervisor' que podem logar nomeadas neste site
  // (resolveAdminKey). Qualquer outro texto digitado cai no "supervisor"
  // genérico.
  // Módulo de Usuários do Sistema
  showSystemUsersModule: false,
  // Banco de Talentos
  showTalentBankModule: false,
  // Levantamento de Perfil Comportamental (DISC) para equipe/estagiários
  // Desligado no módulo Porto Terapia por solicitação da gestão.
  showStaffDiscAssessment: false,
  adminUsers: {
    supervisor: { label: 'Supervisor Geral', email: 'supervisor@portoterapia.com' },
    guimelly: { label: 'Guimelly', email: 'guimelly@portoterapia.com' },
    bruno: { label: 'Bruno', email: 'bruno@portoterapia.com' },
    isabella: { label: 'Isabella', email: 'isabella@portoterapia.com' },
    ian: { label: 'Ian', email: 'ian@portoterapia.com' },
    silvania: { label: 'Silvania', email: 'silvania@portoterapia.com' },
    alessandra: { label: 'Alessandra', email: 'alessandra@portoterapia.com' },
    safira: { label: 'Safira', email: 'safira@portoterapia.com' },
  },
  // Unidades mostradas nos botões de login do quiosque (tela pré-login, sem
  // sessão — por isso não dá para consultar a tabela `units` via RLS ainda;
  // ver App.jsx). Precisam bater com os ids/kiosk_email da tabela `units`.
  kioskUnits: [
    {
      id: 'antonio-barreto',
      name: 'Antônio Barreto',
      workspaceId: 'porto-terapia',
      buttonLabel: 'Estagiários - Antônio Barreto',
      loginLabel: 'Estagiário - Unidade Antônio Barreto',
      kioskEmail: 'antoniobarreto@portoterapia.com',
      razaoSocial: 'Porto Terapia Clínica de Psicologia LTDA',
      cnpj: '12.345.678/0001-90',
      address: 'R. Antônio Barreto, 2050 - Fátima, Belém - PA, 66060-021',
      phone: '(91) 98888-7777',
      accent: 'emerald',
    },
    {
      id: 'generalissimo',
      name: 'Generalíssimo Deodoro',
      workspaceId: 'porto-terapia',
      buttonLabel: 'Estagiários - Generalíssimo',
      loginLabel: 'Estagiário - Unidade Generalíssimo Deodoro',
      kioskEmail: 'generalissimo@portoterapia.com',
      razaoSocial: 'Porto Terapia Clínica de Psicologia LTDA',
      cnpj: '12.345.678/0002-71',
      address: 'Av. Generalíssimo Deodoro, 564 - Nazaré, Belém - PA',
      phone: '(91) 98888-7778',
      accent: 'indigo',
    },
  ],
};
