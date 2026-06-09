import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Star,
} from 'lucide-react';

function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function CriteriaTag({ ok, label }) {
  return ok ? (
    <span className="inline-flex items-center space-x-1 bg-teal-50 text-teal-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-teal-100">
      <CheckCircle2 className="w-3 h-3" />
      <span>{label}</span>
    </span>
  ) : (
    <span className="inline-flex items-center space-x-1 bg-red-50 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-red-100">
      <XCircle className="w-3 h-3" />
      <span>{label}</span>
    </span>
  );
}

function ScoreDial({ score }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 90 ? '#0A665C' : score >= 70 ? '#d97706' : '#dc2626';

  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} stroke="#EBE9E3" strokeWidth="5" fill="none" />
        <circle
          cx="24" cy="24" r={r}
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-extrabold text-gray-800 leading-none">{score}</span>
        <span className="text-[6px] text-gray-400 uppercase tracking-wide leading-none mt-0.5">score</span>
      </div>
    </div>
  );
}

function TransferRow({ transfer, role }) {
  const [open, setOpen] = useState(false);
  const { ong, cause, amount, date, reason, docType, docLabel, criteria } = transfer;

  return (
    <>
      <tr
        className="border-b border-gray-50 hover:bg-gray-50/60 transition cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {/* ONG */}
        <td className="py-4 px-5">
          <p className="font-bold text-gray-900 text-sm">{ong}</p>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{cause}</p>
        </td>

        {/* Score */}
        <td className="py-4 px-5">
          <ScoreDial score={criteria.score} />
        </td>

        {/* Valor */}
        <td className="py-4 px-5 font-bold text-teal-700 text-sm whitespace-nowrap">
          {formatCurrency(amount)}
        </td>

        {/* Data */}
        <td className="py-4 px-5 text-gray-500 text-xs font-medium whitespace-nowrap">
          {new Date(date).toLocaleDateString('pt-BR')}
        </td>

        {/* Motivo */}
        <td className="py-4 px-5 text-gray-600 text-xs max-w-[200px]">{reason}</td>

        {/* Comprovante */}
        <td className="py-4 px-5">
          <button
            onClick={(e) => { e.stopPropagation(); alert(`Abrir: ${docLabel}`); }}
            className="flex items-center space-x-1.5 text-teal-700 hover:text-teal-900 font-bold text-xs transition whitespace-nowrap"
          >
            {docType === 'receipt' ? <FileText className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{docLabel}</span>
          </button>
        </td>

        {/* Expand */}
        <td className="py-4 px-5 text-gray-400">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </td>
      </tr>

      {/* Expanded: Por que esta ONG foi escolhida */}
      {open && (
        <tr className="bg-[#F9FAFB]">
          <td colSpan={7} className="px-5 pb-6 pt-3">
            <div className="border border-teal-100 rounded-2xl p-5 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-3">
                Por que esta ONG foi selecionada para receber este repasse?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Score */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
                  <Star className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score de Confiança</p>
                    <p className="text-lg font-extrabold text-gray-800">
                      {criteria.score}
                      <span className="text-sm font-bold text-gray-400">/100</span>
                    </p>
                    <p className="text-[10px] text-gray-500">Acima do mínimo elegível (80 pts)</p>
                  </div>
                </div>

                {/* Tempo */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tempo de Atividade</p>
                    <p className="text-lg font-extrabold text-gray-800">
                      {criteria.yearsActive}{' '}
                      <span className="text-sm font-bold text-gray-400">anos</span>
                    </p>
                    <p className="text-[10px] text-gray-500">Acima do mínimo de 2 anos</p>
                  </div>
                </div>

                {/* Auditoria */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Última Auditoria</p>
                    <p className="text-sm font-extrabold text-gray-800">{criteria.lastAudit}</p>
                    <p className="text-[10px] text-gray-500">{criteria.auditStatus}</p>
                  </div>
                </div>
              </div>

              {/* Critérios como tags */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Indicadores de conformidade verificados
              </p>
              <div className="flex flex-wrap gap-2">
                <CriteriaTag ok={criteria.cnpjValidated} label="CNPJ Ativo" />
                <CriteriaTag ok={criteria.addressConsistency} label="Endereço consistente c/ Receita Federal" />
                <CriteriaTag ok={criteria.documentationComplete} label="Documentação completa" />
                <CriteriaTag ok={criteria.auditStatus === 'Sem Ressalvas'} label="Auditoria sem ressalvas" />
              </div>

              {!criteria.addressConsistency && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-yellow-700 font-medium">
                    Divergência de endereço detectada. Repasse foi liberado com valor reduzido até regularização
                    cadastral junto à Receita Federal.
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ResourceDistributionTable({ transfers, role }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? transfers : transfers.filter((t) => t.period === filter);

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Transparência de Repasses</h3>
          <p className="text-gray-500 text-sm mt-0.5">
            Clique em qualquer linha para ver os critérios que justificaram o repasse àquela ONG.
          </p>
        </div>
        {/* Period filter */}
        <div className="flex bg-gray-100 rounded-full p-1 gap-1 self-start">
          {[{ v: 'all', l: 'Todos' }, { v: 'week', l: 'Semana' }, { v: 'month', l: 'Mês' }].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                filter === v ? 'bg-white text-teal-700 shadow' : 'text-gray-500 hover:text-teal-600'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-[#FCFBF9]">
              <th className="py-4 px-5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">ONG Beneficiada</th>
              <th className="py-4 px-5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">Score</th>
              <th className="py-4 px-5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">Valor Repassado</th>
              <th className="py-4 px-5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">Data</th>
              <th className="py-4 px-5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">Motivo / Causa</th>
              <th className="py-4 px-5 text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">Comprovante</th>
              <th className="py-4 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <TransferRow key={t.id} transfer={t} role={role} />
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">Nenhum repasse encontrado para o período selecionado.</p>
      )}
    </section>
  );
}
