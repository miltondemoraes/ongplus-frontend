import React from 'react';
import { Banknote, HandCoins, Building2, TrendingUp, Calendar } from 'lucide-react';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function MetricBlock({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.06)] border border-gray-50">
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-[0.65rem] font-bold text-gray-500 tracking-wider mb-1 uppercase">{label}</p>
      <p className="text-2xl md:text-3xl font-extrabold text-teal-900 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 font-medium mt-1">{sub}</p>}
    </div>
  );
}

function CompatibilityBar({ compatibility, distributed, raised, period }) {
  const pct = Math.min(compatibility, 100);
  const color = pct >= 90 ? 'bg-teal-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400';
  const textColor = pct >= 90 ? 'text-teal-700' : pct >= 60 ? 'text-yellow-700' : 'text-red-700';
  const bgColor = pct >= 90 ? 'bg-teal-50' : pct >= 60 ? 'bg-yellow-50' : 'bg-red-50';

  return (
    <div className={`${bgColor} rounded-2xl p-5 border border-gray-100`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
          Compatibilidade de repasses — {period}
        </span>
        <span className={`text-lg font-extrabold ${textColor}`}>{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
        <div
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-500 font-medium">
        {formatCurrency(distributed)} distribuídos de {formatCurrency(raised)} arrecadados
      </p>
    </div>
  );
}

export default function GlobalMetricsCard({ metrics, role }) {
  const [period, setPeriod] = React.useState('week');
  if (!metrics) return null;

  const data = metrics[period];

  return (
    <section className="bg-[#F9FAF9] rounded-[2.5rem] p-8 md:p-12 mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Visão Geral de Distribuição</h2>
          <p className="text-gray-500 text-sm">
            {role === 'NGO'
              ? 'Dados consolidados de captação e repasse de recursos da plataforma para organizações parceiras.'
              : 'Acompanhe em tempo real como cada real doado é captado e distribuído entre as ONGs verificadas.'}
          </p>
        </div>
        {/* Period Toggle */}
        <div className="flex bg-white border border-gray-200 rounded-full p-1 gap-1 self-start shadow-sm">
          <button
            onClick={() => setPeriod('week')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition ${
              period === 'week'
                ? 'bg-teal-700 text-white shadow'
                : 'text-gray-500 hover:text-teal-700'
            }`}
          >
            Esta semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition ${
              period === 'month'
                ? 'bg-teal-700 text-white shadow'
                : 'text-gray-500 hover:text-teal-700'
            }`}
          >
            Este mês
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricBlock
          icon={Banknote}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          label="Total Arrecadado"
          value={formatCurrency(data.raised)}
          sub={period === 'week' ? 'nos últimos 7 dias' : 'no mês corrente'}
        />
        <MetricBlock
          icon={HandCoins}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          label="Total Distribuído"
          value={formatCurrency(data.distributed)}
          sub={`${data.ongsCount} ONGs beneficiadas`}
        />
        <MetricBlock
          icon={Building2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="ONGs Beneficiadas"
          value={`${data.ongsCount} organizações`}
          sub="todas verificadas na plataforma"
        />
      </div>

      {/* Compatibility Bar */}
      <CompatibilityBar
        compatibility={data.compatibility}
        distributed={data.distributed}
        raised={data.raised}
        period={period === 'week' ? 'semana' : 'mês'}
      />

      {role === 'NGO' && (
        <div className="mt-6 bg-teal-900/5 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3">
          <TrendingUp className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
          <p className="text-xs text-teal-800 font-medium leading-relaxed">
            <span className="font-bold">Para ONGs:</span> O volume de repasses reflete a soma de todos os critérios de elegibilidade avaliados.
            Organizações com score mais alto e dados consistentes recebem maior participação proporcional no pool de recursos.
          </p>
        </div>
      )}
    </section>
  );
}
