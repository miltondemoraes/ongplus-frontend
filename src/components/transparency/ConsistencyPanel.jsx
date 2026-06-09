import React from 'react';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ConsistencyPanel({ verification, score }) {
  const isConsistent = verification?.consistencyStatus === 'consistent';
  const displayScore = score ?? verification?.criteria?.score ?? 0;

  return (
    <div className="bg-[#111827] rounded-3xl p-8 border border-gray-800 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">Painel de Consistência</h3>
          <p className="text-sm text-gray-400 mt-0.5">Métricas automatizadas de validação de perfil.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-5 rounded-2xl border ${isConsistent ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
          <div className="flex items-center space-x-3 mb-2">
            {isConsistent ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm font-bold ${isConsistent ? 'text-green-400' : 'text-red-400'} uppercase tracking-wider`}>
              {isConsistent ? 'Perfil Consistente' : 'Inconsistência Detectada'}
            </span>
          </div>
          <p className="text-xs text-gray-400 ml-8 leading-relaxed">
            {isConsistent
              ? 'Todos os dados cruzados com a Receita Federal e bases públicas batem com as informações fornecidas.'
              : 'Foi detectada uma divergência entre o endereço cadastrado e o registrado na Receita Federal. Requer atenção.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Score de Confiança</span>
            <span className="text-2xl font-extrabold text-white">{displayScore}/100</span>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Auditoria Ativa</span>
            <span className="text-sm font-bold text-teal-400 flex items-center space-x-1 mt-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>{verification?.auditStatus === 'monitoring' ? 'Monitorando' : (verification?.auditStatus || '—')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
