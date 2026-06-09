import React, { useState } from 'react';
import { Lock, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import loginBg from '../assets/login_bg_plant.png';
import { authService } from '../services/authService';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirm: confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/configuracoes'), 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Não foi possível alterar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBF9] font-sans p-8">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-[#E4F2EE] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-[#0A665C]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Senha alterada!</h2>
          <p className="text-gray-500 text-sm">
            Sua nova senha foi salva com sucesso. Redirecionando para configurações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FCFBF9] font-sans">
      
      {/* Left Column - Image & Branding */}
      <div className="relative w-full lg:w-1/2 h-64 lg:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${loginBg})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative h-full flex flex-col justify-between p-8 lg:p-16">
          <div className="text-white font-bold text-xl tracking-widest uppercase flex items-center">
             <span className="text-2xl mr-1">✦</span> ONG+
          </div>
          
          <div className="max-w-[450px] mb-8 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              Segurança em primeiro lugar.
            </h1>
            <p className="text-gray-100 text-sm lg:text-base leading-relaxed">
              Mantenha sua conta segura alterando sua senha regularmente. Utilize uma combinação forte de letras, números e símbolos.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 relative">
        <button 
          onClick={() => navigate('/configuracoes')}
          className="self-start text-[#147B72] hover:text-teal-900 font-bold flex items-center space-x-2 text-sm mb-10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Configurações</span>
        </button>

        <div className="max-w-[400px] w-full mx-auto flex-1 flex flex-col justify-center">
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Alterar Senha</h2>
            <p className="text-gray-500 text-sm">
              Preencha os campos abaixo para atualizar suas credenciais de acesso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}

            {/* Senha Atual */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Senha Atual</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Nova Senha */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Nova Senha</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Confirmar Nova Senha</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#147B72] hover:bg-teal-800 text-white font-bold py-4 rounded-full transition shadow-md cursor-pointer mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar Nova Senha</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
