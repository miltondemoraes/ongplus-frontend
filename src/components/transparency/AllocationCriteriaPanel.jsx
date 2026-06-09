import React from 'react';
import {
  ShieldCheck,
  Clock,
  MapPin,
  FileCheck,
  ClipboardCheck,
  Info,
} from 'lucide-react';

const iconMap = {
  shield: ShieldCheck,
  clock: Clock,
  'map-pin': MapPin,
  'file-check': FileCheck,
  'clipboard-check': ClipboardCheck,
};

function WeightBar({ weight }) {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-teal-500 h-full rounded-full"
          style={{ width: `${weight}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-gray-400 w-8 text-right">{weight}%</span>
    </div>
  );
}

export default function AllocationCriteriaPanel({ criteria, role }) {
  const [expanded, setExpanded] = React.useState(null);
  if (!criteria || criteria.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-6">
        <span className="bg-teal-100 text-teal-800 text-[0.65rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Como decidimos
        </span>
        <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-1">
          Critérios de Alocação de Recursos
        </h2>
        <p className="text-gray-500 text-sm max-w-2xl">
          {role === 'NGO'
            ? 'Estes são os critérios que sua organização precisa atender para se manter elegível e aumentar sua participação nos repasses da plataforma.'
            : 'A distribuição de recursos não é uma caixa preta. Veja de forma objetiva os critérios que definem quais ONGs recebem repasses e em qual proporção.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criteria.map((c) => {
          const Icon = iconMap[c.icon] || ShieldCheck;
          const isOpen = expanded === c.key;

          return (
            <button
              key={c.key}
              onClick={() => setExpanded(isOpen ? null : c.key)}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-left hover:border-teal-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <Info className={`w-4 h-4 mt-1 transition ${isOpen ? 'text-teal-600' : 'text-gray-300 group-hover:text-gray-400'}`} />
              </div>

              <p className="text-sm font-extrabold text-gray-800 leading-tight">{c.label}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                Peso no score: {c.weight}%
              </p>
              <WeightBar weight={c.weight} />

              {isOpen && (
                <p className="text-xs text-gray-600 font-medium leading-relaxed mt-3 pt-3 border-t border-gray-50">
                  {c.description}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-400 mt-4 text-center">
        Clique em cada critério para ver mais detalhes. Os pesos somam 100% do score de elegibilidade.
      </p>
    </section>
  );
}
