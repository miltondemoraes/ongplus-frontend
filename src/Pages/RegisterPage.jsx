import { useState } from 'react';
import {
  TreeDeciduous, GraduationCap, ShieldPlus, Users,
  Building2, MapPin, Mail, Lock, ArrowLeft, ArrowRight,
  Heart, Briefcase, CheckCircle
} from 'lucide-react';
import imagemGenerica from '../assets/imagem_generica.jpg';

const CAUSES = [
  { id: 'meio-ambiente', label: 'Meio Ambiente', icon: TreeDeciduous },
  { id: 'educacao', label: 'Educação', icon: GraduationCap },
  { id: 'saude', label: 'Saúde', icon: ShieldPlus },
  { id: 'direitos-humanos', label: 'Direitos Humanos', icon: Users },
];

function DonorForm({ onLoginClick }) {
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleCause = (id) => {
    setSelectedCauses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== passwordConfirm) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const { apiPost } = await import('../services/apiClient');
      await apiPost('/v1/auth/register/donor/', {
        full_name: fullName,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
        <div className="w-16 h-16 bg-[#E4F2EE] rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#0A665C]" />
        </div>
        <h3 className="text-2xl font-bold text-[#0A3D36]">Cadastro realizado!</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Sua conta de doador foi criada. Agora você pode explorar causas e apoiar ONGs verificadas.
        </p>
        <button
          onClick={onLoginClick}
          className="mt-4 bg-[#147B72] hover:bg-teal-800 text-white font-bold py-3 px-8 rounded-full transition shadow-md"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-800">Nome Completo</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Seu nome completo"
          className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-800">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">Confirmar Senha</label>
          <input
            type="password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
          />
        </div>
      </div>
      <div className="space-y-3 pt-1">
        <label className="block text-sm font-bold text-gray-800">Causas de Interesse</label>
        <div className="grid grid-cols-2 gap-3">
          {CAUSES.map(({ id, label, icon: Icon }) => {
            const active = selectedCauses.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCause(id)}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl border transition text-left ${
                  active
                    ? 'bg-[#E4F2EE] border-[#147B72] text-[#0A3D36]'
                    : 'bg-[#F5F3F0] hover:bg-[#EAE8E3] border-transparent text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#147B72]' : 'text-gray-500'}`} />
                <span className="font-medium text-sm">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="pt-4 space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#147B72] hover:bg-teal-800 disabled:opacity-60 text-white font-bold py-4 rounded-full transition shadow-md"
        >
          {loading ? 'Criando conta...' : 'Criar Conta de Doador'}
        </button>
        <p className="text-center text-sm text-gray-600 pt-1">
          Já tem uma conta?{' '}
          <button type="button" onClick={onLoginClick} className="text-[#147B72] font-bold hover:underline">
            Faça login
          </button>
        </p>
      </div>
    </form>
  );
}

function OngForm({ onLoginClick }) {
  const [submitted, setSubmitted] = useState(false);
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomePublico, setNomePublico] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== passwordConfirm) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const { apiPost } = await import('../services/apiClient');
      await apiPost('/v1/auth/register/ong/', {
        full_name: nomePublico,
        email,
        password,
        password_confirm: passwordConfirm,
        cnpj,
        organization_name: razaoSocial,
        focus_area: focusArea,
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao enviar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
        <div className="w-16 h-16 bg-[#E4F2EE] rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#0A665C]" />
        </div>
        <h3 className="text-2xl font-bold text-[#0A3D36]">Solicitação enviada!</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Recebemos seu cadastro. Nossa equipe irá verificar os dados da organização e entrar em contato em até 5 dias úteis.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">CNPJ</label>
          <input
            type="text"
            required
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="00.000.000/0001-00"
            className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">Razão Social</label>
          <input
            type="text"
            required
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
            placeholder="Nome oficial da organização"
            className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-800">Nome Público da ONG</label>
        <input
          type="text"
          required
          value={nomePublico}
          onChange={(e) => setNomePublico(e.target.value)}
          placeholder="Como sua ONG é conhecida pelo público"
          className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">Área de Atuação</label>
          <select
            required
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            className="w-full bg-[#EAE8E3] text-gray-800 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition appearance-none"
          >
            <option value="">Selecione...</option>
            <option value="meio-ambiente">Meio Ambiente</option>
            <option value="educacao">Educação</option>
            <option value="saude">Saúde</option>
            <option value="direitos-humanos">Direitos Humanos</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">E-mail de Contato</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contato@suaong.org.br"
              className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800">Confirmar Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#EAE8E3] text-gray-800 placeholder-gray-500 rounded-lg pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition"
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 bg-[#F5F3F0] px-4 py-3 rounded-xl">
        Após o cadastro, nossa equipe irá verificar os documentos e dados da organização antes de ativá-la na plataforma.
      </p>
      <div className="pt-2 space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#147B72] hover:bg-teal-800 disabled:opacity-60 text-white font-bold py-4 rounded-full transition shadow-md flex items-center justify-center space-x-2"
        >
          <span>{loading ? 'Enviando...' : 'Solicitar Cadastro da ONG'}</span>
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
        <p className="text-center text-sm text-gray-600 pt-1">
          Já tem uma conta?{' '}
          <button type="button" onClick={onLoginClick} className="text-[#147B72] font-bold hover:underline">
            Faça login
          </button>
        </p>
      </div>
    </form>
  );
}

export default function RegisterPage({ onLoginClick }) {
  // null = choosing, 'donor' = donor form, 'ong' = ong form
  const [mode, setMode] = useState(null);

  return (
    <div className="flex-grow bg-[#FCFBF9] font-sans flex items-center justify-center p-6 md:p-12">
      <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left Column */}
        <div className="flex flex-col">
          <div className="mb-10">
            <p className="text-[#147B72] font-bold text-sm tracking-widest uppercase mb-4">ONG+</p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              {mode === 'ong' ? 'Cadastre sua\norganização' : 'Crie sua conta\nde impacto'}
            </h1>
            <p className="text-gray-600 mt-6 text-base max-w-[400px] leading-relaxed">
              {mode === 'ong'
                ? 'Conecte sua organização a uma rede de doadores engajados. Após verificação, sua ONG estará visível para apoiadores de todo o Brasil.'
                : 'Junte-se a uma comunidade focada em transformar empatia em ação. Cadastre-se para apoiar causas que realmente importam.'
              }
            </p>
          </div>
          <img
            src={imagemGenerica}
            alt="Pessoas plantando"
            className="w-full max-w-[400px] aspect-square object-cover rounded-[2rem] shadow-sm"
          />
        </div>

        {/* Right Column */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">

          {/* Step indicator */}
          {mode && (
            <button
              onClick={() => setMode(null)}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#147B72] text-xs font-bold uppercase tracking-wider mb-8 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          )}

          {/* Profile type chooser */}
          {!mode && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quem é você?</h2>
                <p className="text-gray-500 text-sm">Escolha o tipo de conta para continuar.</p>
              </div>
              <div className="space-y-4">
                <button
                  id="register-as-donor"
                  onClick={() => setMode('donor')}
                  className="w-full group flex items-center space-x-5 bg-[#F5F3F0] hover:bg-[#E4F2EE] hover:border-[#147B72] border-2 border-transparent px-6 py-5 rounded-2xl transition text-left"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#147B72]/10 transition shrink-0">
                    <Heart className="w-6 h-6 text-[#147B72]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">Sou Doador</p>
                    <p className="text-gray-500 text-xs mt-0.5">Quero apoiar causas e ONGs verificadas</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-[#147B72] transition" />
                </button>

                <button
                  id="register-as-ong"
                  onClick={() => setMode('ong')}
                  className="w-full group flex items-center space-x-5 bg-[#F5F3F0] hover:bg-[#E4F2EE] hover:border-[#147B72] border-2 border-transparent px-6 py-5 rounded-2xl transition text-left"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#147B72]/10 transition shrink-0">
                    <Briefcase className="w-6 h-6 text-[#147B72]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">Sou ONG</p>
                    <p className="text-gray-500 text-xs mt-0.5">Quero cadastrar minha organização</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-[#147B72] transition" />
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 pt-2">
                Já tem uma conta?{' '}
                <button type="button" onClick={onLoginClick} className="text-[#147B72] font-bold hover:underline">
                  Faça login
                </button>
              </p>
            </div>
          )}

          {mode === 'donor' && <DonorForm onLoginClick={onLoginClick} />}
          {mode === 'ong' && <OngForm onLoginClick={onLoginClick} />}
        </div>
      </div>
    </div>
  );
}
