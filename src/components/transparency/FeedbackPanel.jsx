import React from 'react';
import { MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function FeedbackPanel({ requests }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] text-center">
        <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight mb-2">Feedback de Solicitações</h3>
        <p className="text-gray-500 text-sm">Nenhuma solicitação pendente.</p>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Em Análise' };
      case 'approved': return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Aprovada' };
      case 'rejected': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Rejeitada' };
      default: return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', label: status };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight">Status das Solicitações</h3>
          <p className="text-sm text-gray-500 mt-0.5">Acompanhe a análise das suas requisições.</p>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((req) => {
          const statusInfo = getStatusInfo(req.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={req.id} className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/50 transition">
              <div className="flex justify-between items-start mb-3">
                <span className={`inline-flex items-center space-x-1.5 ${statusInfo.bg} ${statusInfo.color} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{statusInfo.label}</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  {new Date(req.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <h4 className="text-sm font-extrabold text-gray-800 mb-1">Alteração de {req.field}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">Para: {req.newValue}</p>
              
              {req.adminResponse && (
                <div className="mt-4 bg-white border border-gray-200 p-3 rounded-xl">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Resposta do Admin</span>
                  <p className="text-xs text-gray-700 italic">"{req.adminResponse}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
