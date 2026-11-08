// Motor de alertas do módulo Profissionais PJ — espelha
// cltCalculations.computeEmployeeAlerts (mesma forma { level, kind,
// professionalId, message, dueDate }), mas com regras próprias do vínculo
// comercial (CNPJ/NF/conselho), sem nada de natureza trabalhista.

import { addDays, diffDays, todayBelem } from './cltCalculations.js';

export function computeProfessionalAlerts({
  professionals = [],
  nfKeysByProfessional = {},
  today = todayBelem(),
}) {
  const alerts = [];
  const in30 = addDays(today, 30);
  const in60 = addDays(today, 60);
  const currentCompetencia = today.slice(0, 7);
  const [curYear, curMonth] = currentCompetencia.split('-').map(Number);
  const prevCompetencia = curMonth === 1
    ? `${curYear - 1}-12`
    : `${curYear}-${String(curMonth - 1).padStart(2, '0')}`;

  for (const prof of professionals) {
    if (prof.active === false) continue;

    if (prof.contractEnd) {
      if (prof.contractEnd < today) {
        alerts.push({ level: 'critico', kind: 'contrato_vencido', professionalId: prof.id, message: `Contrato de ${prof.name} venceu em ${prof.contractEnd}.`, dueDate: prof.contractEnd });
      } else if (prof.contractEnd <= in30) {
        alerts.push({ level: 'critico', kind: 'contrato_vencendo', professionalId: prof.id, message: `Contrato de ${prof.name} vence em ${diffDays(today, prof.contractEnd)} dia(s) (${prof.contractEnd}).`, dueDate: prof.contractEnd });
      } else if (prof.contractEnd <= in60) {
        alerts.push({ level: 'atencao', kind: 'contrato_vencendo', professionalId: prof.id, message: `Contrato de ${prof.name} vence em ${diffDays(today, prof.contractEnd)} dias.`, dueDate: prof.contractEnd });
      }
    }

    if (prof.councilValidity) {
      if (prof.councilValidity < today) {
        alerts.push({ level: 'critico', kind: 'conselho_vencido', professionalId: prof.id, message: `Registro no conselho de ${prof.name} (${prof.councilType || 'conselho'}) venceu em ${prof.councilValidity}.`, dueDate: prof.councilValidity });
      } else if (prof.councilValidity <= in30) {
        alerts.push({ level: 'atencao', kind: 'conselho_vencendo', professionalId: prof.id, message: `Registro no conselho de ${prof.name} vence em ${prof.councilValidity}.`, dueDate: prof.councilValidity });
      }
    }

    if (prof.registrationStatus === 'pending_validation') {
      alerts.push({ level: 'atencao', kind: 'autocadastro_pendente', professionalId: prof.id, message: `Autocadastro de ${prof.name} aguarda validação do RH.`, dueDate: null });
    }

    // NF em atraso: só cobra a competência anterior (dá margem até o fim do
    // mês corrente para emitir a NF referente ao mês passado).
    const uploadedKeys = nfKeysByProfessional[prof.id] || new Set();
    if (!uploadedKeys.has(`nf-${prevCompetencia}`)) {
      alerts.push({ level: 'info', kind: 'nf_pendente', professionalId: prof.id, message: `${prof.name} ainda não enviou a Nota Fiscal de ${prevCompetencia}.`, dueDate: null });
    }
    void currentCompetencia;
  }

  for (const prof of professionals) {
    if (!prof.birthdate || prof.active === false) continue;
    const [, m, d] = prof.birthdate.split('-');
    const [ty, tm] = today.split('-');
    if (m === tm) {
      alerts.push({ level: 'info', kind: 'aniversariante', professionalId: prof.id, message: `${prof.name} faz aniversário em ${d}/${m}.`, dueDate: `${ty}-${m}-${d}` });
    }
  }

  return alerts;
}
