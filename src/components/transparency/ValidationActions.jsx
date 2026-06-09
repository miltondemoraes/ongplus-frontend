import React from 'react';
import { Shield, Check, X } from 'lucide-react';

export default function ValidationActions({ requests, onApprove, onReject }) {
  const pendingRequests = requests?.filter(req => req.status === 'pending') || [];

  if (pendingRequests.length === 0) {
    return (
      <div className="bg-[#111827] rounded-3xl p-8 border border-gray-800 shadow-xl text-center">
        <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">Aprovação de Alterações</h3>
        <p className="text-gray-400 text-sm">Nenhuma alteração pendente de revisão.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] rounded-3xl p-8 border border-gray-800 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
          <Shield className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">Aprovação de Alterações</h3>
          <p className="text-sm text-gray-400 mt-0.5">Valide solicitações de mudanças cadastrais.</p>
        </div>
      </div>

      <div className="space-y-6">
        {pendingRequests.map((req) => (
          <div key={req.id} className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Solicitado em: {new Date(req.createdAt).toLocaleDateString('pt-BR')}</span>
                <h4 className="text-sm font-bold text-gray-200">Alteração de <span className="text-teal-400">{req.field}</span></h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800 p-3 rounded-xl border border-red-900/30 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50"></div>
                <span className="text-[9px] font-bold text-red-400/80 uppercase tracking-wider block mb-1">Valor Antigo</span>
                <p className="text-xs text-gray-400 line-clamp-3">{req.oldValue}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl border border-green-900/30 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500/50"></div>
                <span className="text-[9px] font-bold text-green-400/80 uppercase tracking-wider block mb-1">Valor Novo</span>
                <p className="text-xs text-gray-200 font-bold line-clamp-3">{req.newValue}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Justificativa da ONG</span>
              <p className="text-xs text-gray-400 italic bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                "{req.justification}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => onApprove(req.id)}
                className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Aprovar Alteração</span>
              </button>
              <button 
                onClick={() => onReject(req.id)}
                className="flex-1 bg-gray-700 hover:bg-red-900/80 hover:text-red-200 text-gray-300 font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Rejeitar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
