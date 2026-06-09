import React from 'react';
import { History, ArrowRight } from 'lucide-react';

function formatTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function ChangeHistoryTimeline({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] text-center">
        <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight mb-2">Histórico de Alterações</h3>
        <p className="text-gray-500 text-sm">Nenhuma alteração registrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-8">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-[#EAE8E3]/50 flex items-center justify-center">
          <History className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight">Histórico de Alterações</h3>
          <p className="text-sm text-gray-500 mt-0.5">Auditoria de mudanças nos dados institucionais.</p>
        </div>
      </div>

      <div className="relative border-l-2 border-gray-100 ml-5 space-y-8 pb-4">
        {history.map((change) => {
          const date = formatTimestamp(change.date ?? change.changedAt);
          const author = change.approvedBy ?? change.changedBy ?? '—';

          return (
            <div key={change.id} className="relative pl-8">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#0A665C] shadow-sm"></div>

              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-gray-50 hover:border-gray-200 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      {date ? date.toLocaleDateString('pt-BR') : '—'}
                    </span>
                    {date && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                          {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="bg-white text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-100 uppercase tracking-widest w-max">
                    Autor: {author}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-gray-800 mb-4 tracking-tight">
                  Campo alterado: <span className="text-[#0A665C]">{change.field}</span>
                </h4>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                  <div className="flex-1 bg-white border border-red-100 rounded-xl p-3 w-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>
                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block mb-1">Antes</span>
                    <p className="text-xs text-gray-600 font-medium break-words line-clamp-3">{change.oldValue || '—'}</p>
                  </div>

                  <div className="hidden md:flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </div>

                  <div className="flex-1 bg-white border border-green-100 rounded-xl p-3 w-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider block mb-1">Depois</span>
                    <p className="text-xs text-gray-800 font-bold break-words line-clamp-3">{change.newValue || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
