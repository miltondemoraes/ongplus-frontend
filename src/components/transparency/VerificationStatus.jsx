import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function VerificationStatus({ verification }) {
  if (!verification) return null;

  const { status, evidenceList, lastUpdate, verifiedAt, consistencyStatus } = verification;

  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return { color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', icon: ShieldCheck, label: 'ONG Verificada' };
      case 'analysis':
        return { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Clock, label: 'Em Análise' };
      case 'pending':
        return { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle, label: 'Pendente de Verificação' };
      case 'inconsistent':
        return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: ShieldAlert, label: 'Dados Inconsistentes' };
      default:
        return { color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: ShieldCheck, label: 'Status Desconhecido' };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-50 pb-6">
        <div>
          <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight">Status de Verificação</h3>
          <p className="text-sm text-gray-500 mt-1">Garantia de segurança e transparência dos dados.</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${config.bg} ${config.border} ${config.color}`}>
          <StatusIcon className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wide">{config.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Evidências Analisadas</h4>
          <ul className="space-y-3">
            {evidenceList.map((evidence, index) => (
              <li key={index} className="flex items-start space-x-3">
                {evidence.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                )}
                <span className="text-sm text-gray-700 font-medium leading-relaxed">{evidence.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Data de Verificação</span>
            <span className="text-sm font-extrabold text-gray-800">{new Date(verifiedAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Última Atualização de Dados</span>
            <span className="text-sm font-bold text-gray-700">{new Date(lastUpdate).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Consistência Sistêmica</span>
            {consistencyStatus === 'consistent' ? (
              <span className="inline-flex items-center space-x-1.5 bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Consistente</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Inconsistência Detectada</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
