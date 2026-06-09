import React from 'react';
import { Database, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DataSourceCard({ sources = [] }) {
  return (
    <div className="bg-[#111827] rounded-3xl p-8 border border-gray-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <Database className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">Fontes de Dados</h3>
            <p className="text-sm text-gray-400 mt-0.5">Sistemas integrados para auditoria.</p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {sources.map((source, idx) => (
          <div key={idx} className="bg-gray-800/50 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-gray-200 block">{source.name}</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Sincronizado: {source.lastSync}</span>
            </div>
            {source.status === 'success' && (
              <span className="inline-flex items-center space-x-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Online</span>
              </span>
            )}
            {source.status === 'warning' && (
              <span className="inline-flex items-center space-x-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Atenção</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
