import React, { useState } from 'react';
import { Send, Edit3, Paperclip } from 'lucide-react';

export default function ChangeRequestForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    field: 'Nome',
    newValue: '',
    justification: '',
    attachment: null
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    setFormData({ field: 'Nome', newValue: '', justification: '', attachment: null });
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
          <Edit3 className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight">Solicitar Alteração</h3>
          <p className="text-sm text-gray-500 mt-0.5">Atualize os dados institucionais do seu perfil.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Campo a Alterar</label>
          <select 
            value={formData.field}
            onChange={(e) => setFormData({...formData, field: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#0A665C]/50 transition font-medium"
          >
            <option value="Nome">Nome</option>
            <option value="Descrição">Descrição</option>
            <option value="Endereço">Endereço</option>
            <option value="Site">Site</option>
            <option value="Telefone">Telefone</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Novo Valor</label>
          <textarea 
            value={formData.newValue}
            onChange={(e) => setFormData({...formData, newValue: e.target.value})}
            required
            rows={3}
            placeholder="Insira a nova informação..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#0A665C]/50 transition font-medium resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Justificativa</label>
          <textarea 
            value={formData.justification}
            onChange={(e) => setFormData({...formData, justification: e.target.value})}
            required
            rows={2}
            placeholder="Explique o motivo da alteração..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#0A665C]/50 transition font-medium resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Anexos Comprobatórios</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Paperclip className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 font-medium">Clique para anexar arquivo ou arraste até aqui</p>
              </div>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-[#0A665C] hover:bg-teal-900 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="animate-pulse">Enviando...</span>
          ) : (
            <>
              <span>Enviar Solicitação</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
