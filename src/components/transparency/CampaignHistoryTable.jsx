import React from 'react';

const STATUS_LABELS = {
  publicada: 'Publicada',
  encerrada: 'Encerrada',
  arquivada: 'Arquivada',
  rascunho: 'Rascunho',
  'em-revisao': 'Em Revisão',
  aprovada: 'Aprovada',
  recusada: 'Recusada',
  active: 'Ativa',
  closed: 'Encerrada',
  cancelled: 'Cancelada',
};

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('pt-BR');
}

function formatDateRange(startDate, endDate) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (start && end) return `${start} - ${end}`;
  if (end) return `Até ${end}`;
  if (start) return `Desde ${start}`;
  return '—';
}

export default function CampaignHistoryTable({ campaigns }) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] text-center">
        <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight mb-2">Histórico de Campanhas</h3>
        <p className="text-gray-500 text-sm">Nenhuma campanha registrada.</p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
  };

  const getStatusBadge = (status) => {
    const label = STATUS_LABELS[status] || status;
    const isActive = ['publicada', 'active', 'aprovada'].includes(status);
    const isEnded = ['encerrada', 'arquivada', 'closed'].includes(status);
    const isRejected = ['recusada', 'cancelled'].includes(status);

    let className = 'bg-gray-100 text-gray-600';
    if (isActive) className = 'bg-green-100 text-green-800';
    else if (isEnded) className = 'bg-gray-100 text-gray-600';
    else if (isRejected) className = 'bg-red-100 text-red-800';

    return (
      <span className={`${className} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight">Histórico de Campanhas</h3>
        <p className="text-sm text-gray-500 mt-1">Visão geral das iniciativas e resultados alcançados.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 bg-[#FAF8F5] rounded-t-xl">
              <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest rounded-tl-xl">Nome</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Período</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Meta</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Arrecadado</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center rounded-tr-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-5 px-6 font-bold text-gray-900 text-sm">{camp.title}</td>
                <td className="py-5 px-6 text-gray-500 text-xs font-medium">
                  {formatDateRange(camp.startDate, camp.endDate)}
                </td>
                <td className="py-5 px-6 text-gray-600 text-sm font-semibold text-right">{formatCurrency(camp.goal)}</td>
                <td className="py-5 px-6 font-bold text-teal-700 text-sm text-right">{formatCurrency(camp.raisedAmount)}</td>
                <td className="py-5 px-6 text-center">
                  {getStatusBadge(camp.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
