import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import loginBg from '../assets/login_bg_plant.png';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onRegisterClick }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const user = await login({ email, password });

      if (user.role === 'donor') {
        navigate('/donor-profile');
      } else if (user.role === 'ong') {
        navigate('/gestao-ong');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(
        err.message || 'Credenciais inválidas. Tente novamente.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FCFBF9] font-sans">

      {/* Left Column - Image & Branding */}
      <div className="relative w-full lg:w-1/2 h-64 lg:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${loginBg})` }}>
        {/* Overlay for contrast if needed, but keeping it light if the image is light */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative h-full flex flex-col justify-between p-8 lg:p-16">
          {/* Logo */}
          <div className="text-white font-bold text-xl tracking-widest uppercase flex items-center">
            <span className="text-2xl mr-1">✦</span> ONG+
          </div>

          {/* Text at bottom */}
          <div className="max-w-[450px] mb-8 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              Continue seu impacto curado.
            </h1>
            <p className="text-gray-100 text-sm lg:text-base leading-relaxed">
              Acesse sua conta para visualizar histórias de mudança, gerenciar suas contribuições e descobrir novas causas editoriais selecionadas para você.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-[400px] w-full">

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-500 text-sm">
              Entre com suas credenciais para acessar sua área de impacto.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}

            {/* E-mail */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">E-mail corporativo ou pessoal</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nome@exemplo.com"
                  className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Senha</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#147B72] hover:bg-teal-800 text-white font-bold py-4 rounded-full transition shadow-md cursor-pointer"
            >
              Entrar
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Ou continue com</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={() => handleLogin('donor')}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold py-4 rounded-full transition flex items-center justify-center space-x-3 shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Entrar com Google</span>
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600 mt-6 pt-2">
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={onRegisterClick}
                className="text-[#147B72] font-bold hover:underline focus:outline-none"
              >
                Cadastre-se
              </button>
            </p>

            {/* Link temporário para simular acesso ONG */}
            <div className="text-center mt-4">
              <button type="button" onClick={() => handleLogin('ong')} className="text-xs text-gray-400 hover:text-gray-600 underline">
                [Dev] Simular Login ONG
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
