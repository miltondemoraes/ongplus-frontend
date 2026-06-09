import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, CreditCard, X } from 'lucide-react';
import Toast from '../components/Toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setToast({ message: '', type: 'success' }); // Reset caso já tenha um visível
    try {
      await updateUser({ name, email });
      setToast({ message: 'Alterações salvas com sucesso!', type: 'success' });
    } catch (e) {
      setToast({ message: `Erro ao salvar: ${e.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações da Conta</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 capitalize">Perfil: {user?.role === 'donor' ? 'Doador' : user?.role === 'ong' ? 'ONG' : user?.role}</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {user?.role !== 'ong' && (
              <>
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-400" />
                    Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        placeholder="email@exemplo.com"
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

              </>
            )}

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-gray-400" />
                Segurança
              </h3>
              <button 
                onClick={() => navigate('/alterar-senha')}
                className="text-teal-700 hover:text-teal-900 font-medium text-sm transition cursor-pointer"
              >
                Alterar senha
              </button>
            </section>
          </div>

          <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2 rounded-xl font-bold text-white transition ${saving ? 'bg-teal-700 opacity-70 cursor-not-allowed' : 'bg-teal-800 hover:bg-teal-900 cursor-pointer'}`}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </main>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />
    </div>
  );
}
