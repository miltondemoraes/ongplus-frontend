import React from 'react';
import { Target, TrendingUp, Users } from 'lucide-react';

export default function FinancialTransparencyCard({ financial }) {
  if (!financial) return null;

  const { currentGoal, raisedAmount, donorsCount } = financial;
  const percentage = Math.min(Math.round((raisedAmount / currentGoal) * 100), 100);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-8">
      <div>
        <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight">Metas e Arrecadações</h3>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o impacto financeiro e o progresso em tempo real.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progresso da Meta Atual</span>
          <span className="text-2xl font-extrabold text-[#0A665C]">{percentage}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-teal-500 to-[#0A665C] h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect inside progress bar */}
            <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-teal-700" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Meta Atual</span>
          </div>
          <span className="text-xl font-extrabold text-gray-800">{formatCurrency(currentGoal)}</span>
        </div>

        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-700" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Arrecadado</span>
          </div>
          <span className="text-xl font-extrabold text-teal-700">{formatCurrency(raisedAmount)}</span>
        </div>

        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-700" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Doadores</span>
          </div>
          <span className="text-xl font-extrabold text-gray-800">{donorsCount} pessoas</span>
        </div>
      </div>
    </div>
  );
}
