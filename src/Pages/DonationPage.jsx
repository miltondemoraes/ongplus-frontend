import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { financialService } from '../services/financialService';
import { ngoService } from '../services/ngoService';
import { 
  Sparkles,
  GraduationCap, 
  TreeDeciduous, 
  HeartPulse, 
  Scale,
  QrCode, 
  ShieldCheck, 
  Lock, 
  ThumbsUp, 
  Heart,
  DollarSign
} from 'lucide-react';
import amaraStoryBg from '../assets/amara_story.png';

const PAYMENT_TYPE_MAP = {
  PIX: 'pix',
};

const FREQUENCY_MAP = {
  Mensal: 'monthly',
  Trimestral: 'quarterly',
  Anual: 'annual',
  Única: 'once',
};

export default function DonationPage({ onGoHome }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state || {}; // contains ngoId, ngoName, campaignId, campaignName, bundleId, bundleName, type
  
  const [donationStep, setDonationStep] = useState(1); // 1 = Form, 3 = Confirmation
  const [ngoScore, setNgoScore] = useState(routeState.score || null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [submittingDonation, setSubmittingDonation] = useState(false);
  const [completedDonation, setCompletedDonation] = useState(null);
  const [frequency, setFrequency] = useState(routeState.frequency || 'Mensal');
  const [selectedAmount, setSelectedAmount] = useState(routeState.amount ? Number(routeState.amount) : 50);
  const [customAmount, setCustomAmount] = useState(
    routeState.amount && ![50, 100, 200].includes(Number(routeState.amount))
      ? String(routeState.amount)
      : ''
  );
  const [selectedCause, setSelectedCause] = useState(() => {
    if (routeState.type === 'bundle') return `Bundle: ${routeState.bundleName}`;
    if (routeState.type === 'campaign') return `Campanha: ${routeState.campaignName}`;
    if (routeState.type === 'ngo') return `ONG: ${routeState.ngoName}`;
    return '';
  });
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'ong' && !routeState.type) {
      navigate('/causas', { replace: true });
    }
  }, [user?.role, routeState.type, navigate]);

  useEffect(() => {
    if (routeState.type === 'ngo' || routeState.type === 'campaign') {
      const targetNgoId = routeState.ngoId;
      if (targetNgoId && !ngoScore) {
        ngoService.getById(targetNgoId)
          .then(data => {
            if (data && data.score !== undefined) {
              setNgoScore(data.score);
            }
          })
          .catch(err => console.error("Error loading NGO score:", err));
      }
    } else if (routeState.type === 'bundle') {
      if (!ngoScore && routeState.bundleId) {
        ngoService.getBundleById(routeState.bundleId)
          .then(data => {
            if (data?.transparencyScore !== undefined) {
              setNgoScore(data.transparencyScore);
            }
          })
          .catch(err => console.error("Error loading bundle score:", err));
      }
    } else {
      if (!ngoScore) {
        ngoService.list()
          .then(data => {
            if (data && data.length > 0) {
              const total = data.reduce((sum, item) => sum + (item.score || 0), 0);
              setNgoScore(Math.round(total / data.length));
            }
          })
          .catch(err => {
            console.error("Error loading all NGOs for average score:", err);
          });
      }
    }
  }, [routeState.ngoId, routeState.bundleId, routeState.type, ngoScore]);

  useEffect(() => {
    let cancelled = false;
    financialService.listPaymentMethods()
      .then((methods) => {
        if (!cancelled) {
          setPaymentMethods(methods || []);
          setPaymentError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setPaymentError(err.message || 'Não foi possível carregar os métodos de pagamento.');
      })
      .finally(() => {
        if (!cancelled) setPaymentMethodsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (user?.role === 'ong') {
    return (
      <div className="flex-grow bg-[#FCFBF9] font-sans py-16 px-6 text-center flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-500 text-sm mb-6">
            O perfil de ONG não tem permissão para realizar doações. Para doar, por favor faça login com um perfil de Doador.
          </p>
          <button 
            onClick={onGoHome}
            className="w-full bg-[#147B72] text-white py-3 rounded-xl font-bold hover:bg-teal-800 transition"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }
  const displayAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const matchMultiplier = routeState.matchMultiplier || 1;
  const matchSponsor = routeState.matchSponsor || null;

  const combinedAmount = displayAmount * matchMultiplier;

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*$/.test(val)) {
      setCustomAmount(val);
      setSelectedAmount(0);
    }
  };

  const resolvePaymentMethodId = () => {
    const methodType = PAYMENT_TYPE_MAP[paymentMethod];
    const match = paymentMethods.find((m) => m.method_type === methodType);
    return match?.id || null;
  };

  const handleFinalizeDonation = async () => {
    if (!routeState.ngoId) {
      setSubmitError('Selecione uma causa na página de causas antes de doar.');
      return;
    }
    if (displayAmount <= 0) {
      setSubmitError('Informe um valor válido para a doação.');
      return;
    }
    const paymentMethodId = resolvePaymentMethodId();
    if (!paymentMethodId) {
      setSubmitError('Método de pagamento indisponível. Tente outra opção.');
      return;
    }

    setSubmittingDonation(true);
    setSubmitError(null);
    try {
      const donation = await financialService.createDonation({
        ong: routeState.ngoId,
        amount: displayAmount,
        payment_method: paymentMethodId,
        recurrence_type: FREQUENCY_MAP[frequency] || 'once',
        notes: [
          routeState.type === 'campaign' && routeState.campaignId ? `Campanha verificada: ${routeState.campaignId}` : null,
          routeState.type === 'bundle' && routeState.bundleId ? `Bundle coletivo: ${routeState.bundleId}` : null,
        ].filter(Boolean).join(' | '),
      });
      const processed = await financialService.processDonation(donation.id);
      setCompletedDonation(processed);
      setDonationStep(3);
    } catch (err) {
      setSubmitError(err.message || 'Não foi possível processar sua doação.');
    } finally {
      setSubmittingDonation(false);
    }
  };

  const causesList = [
    {
      id: 'Todas as causas',
      title: 'Todas as causas',
      description: 'Deixe a alocação com nosso time para apoiar as frentes mais urgentes.',
      icon: Sparkles,
    },
    {
      id: 'Educação para o Futuro',
      title: 'Educação para o Futuro',
      description: 'Alfabetização e treinamento em comunidades carentes.',
      icon: GraduationCap,
    },
    {
      id: 'Preservação Ambiental',
      title: 'Preservação Ambiental',
      description: 'Reflorestamento, proteção de mananciais e fauna silvestre.',
      icon: TreeDeciduous,
    },
    {
      id: 'Saúde Comunitária',
      title: 'Saúde Comunitária',
      description: 'Apoio médico, psicológico e atendimento em clínicas sociais.',
      icon: HeartPulse,
    },
    {
      id: 'Direitos Humanos',
      title: 'Direitos Humanos',
      description: 'Defesa de direitos, acolhimento e suporte jurídico para populações vulneráveis.',
      icon: Scale,
    },
  ];

  // Success Step 3 UI
  if (donationStep === 3) {
    return (
      <div className="flex-grow bg-[#FAF8F5] font-sans flex flex-col items-center justify-center py-16 px-6">
        {/* Step Indicator */}
        <div className="text-center mb-8 space-y-2">
          <p className="text-[#147B72] font-bold text-xs tracking-widest uppercase">
            Passo 3 de 3
          </p>
          <div className="flex items-center justify-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <div className="w-8 h-2 rounded-full bg-[#147B72]" />
          </div>
        </div>

        {/* Success Card */}
        <div className="bg-white max-w-xl w-full rounded-[2.5rem] p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100">
          {/* Green Circle with Heart */}
          <div className="w-20 h-20 bg-[#DDF3E8] rounded-full flex items-center justify-center mx-auto text-[#0A665C]">
            <Heart className="w-8 h-8 fill-[#0A665C] text-[#0A665C]" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mt-8 leading-tight">
            Obrigado por seu apoio!
          </h2>
          <p className="text-gray-500 mt-4 text-sm leading-relaxed max-w-sm mx-auto">
            Sua generosidade ecoa. Recebemos sua doação com imensa gratidão. Juntos, estamos transformando narrativas em impacto tangível.
          </p>

          {/* Receipt Card */}
          <div className="bg-[#FAF8F5] p-6 rounded-2xl mt-8 space-y-4 border border-gray-100 text-left">
            <h3 className="font-bold text-gray-900 text-sm">
              Resumo da Doação
            </h3>
            <div className="space-y-3 pt-2 text-sm border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Causa Apoiada</span>
                <span className="text-gray-900 font-bold">{selectedCause}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Valor da sua Doação</span>
                <span className="text-gray-900 font-bold">R$ {displayAmount},00</span>
              </div>
              {matchMultiplier > 1 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Multiplicador Matchfunding</span>
                    <span className="text-[#0A665C] font-bold">{matchMultiplier}x ({matchSponsor})</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#EAF5F0] p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-emerald-800 font-bold">Impacto Total Combinado</span>
                    <span className="text-[#0A665C] font-extrabold text-lg">R$ {combinedAmount},00</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Frequência</span>
                <span className="text-gray-900 font-bold">{frequency}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <button
              onClick={() => {
                setDonationStep(1);
                if (onGoHome) {
                  onGoHome();
                }
              }}
              className="bg-[#0A665C] hover:bg-[#08524a] text-white font-bold py-3.5 px-8 rounded-full transition-colors flex items-center justify-center space-x-2 shadow-sm text-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Voltar ao Início</span>
            </button>
            <button
              type="button"
              className="bg-[#EAE8E3] hover:bg-gray-200 text-gray-800 font-bold py-3.5 px-8 rounded-full transition-colors flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l8.977-4.489m0 0l-8.977-4.49M17.66 6.253a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM8.684 13.258l8.977 4.49m0 0l-8.977 4.49m8.977-4.49a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm-13.48-3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-[11px] text-gray-400 mt-6 max-w-sm leading-relaxed">
          Um recibo detalhado foi enviado para o seu e-mail. Para dúvidas, contate-nos através do nosso canal de suporte.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#FCFBF9] font-sans py-12 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20">
        
        {/* Left Column - Steps Form */}
        <div className="space-y-12">
          
          {/* Header/Manifesto */}
          <div className="space-y-4">
            <p className="text-[#147B72] font-bold text-xs tracking-widest uppercase">
              Manifesto de Impacto
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Transforme sua <br />
              <span className="relative inline-block text-[#147B72]">
                intenção
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#147B72]/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>{' '}
              em ação.
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-[500px] leading-relaxed">
              Cada doação é uma curadoria de esperança. Escolha onde sua marca no mundo será deixada hoje.
            </p>
            {routeState.type && (
              <div className="bg-[#FAF8F5] border border-[#E5E2D9] rounded-2xl p-4 flex items-center space-x-3 text-sm text-[#0A3D36] max-w-xl">
                <ShieldCheck className="w-5 h-5 text-[#0A665C] shrink-0" />
                <div>
                  <span className="font-semibold text-gray-500">Destino da Doação: </span>
                  <span className="font-bold text-gray-900">
                    {routeState.type === 'bundle' && `Bundle Coletivo: ${routeState.bundleName}`}
                    {routeState.type === 'campaign' && `Campanha: ${routeState.campaignName}`}
                    {routeState.type === 'ngo' && `ONG: ${routeState.ngoName}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 1 - Escolha o Valor */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-[#147B72] text-white flex items-center justify-center font-bold text-sm">
                01
              </span>
              <h2 className="text-xl font-bold text-gray-900">Escolha o Valor & Frequência</h2>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Mínimo', value: 30 },
                { label: 'Ideal', value: 50 },
                { label: 'Impacto', value: 100 },
                { label: 'Líder', value: 500 }
              ].map((item) => {
                const isActive = selectedAmount === item.value && !customAmount;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleAmountSelect(item.value)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                      isActive 
                        ? 'bg-[#147B72] border-[#147B72] text-white shadow-md' 
                        : 'bg-white border-gray-100 hover:border-gray-200 text-gray-800'
                    }`}
                  >
                    <span className={`text-[0.65rem] font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                    <span className="text-lg font-extrabold">R$ {item.value}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <DollarSign className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Outro valor personalizado"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full bg-[#F5F3F0] text-gray-800 placeholder-gray-500 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#147B72] transition font-medium"
              />
            </div>

            {/* Frequency Options */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setFrequency('Única')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  frequency === 'Única'
                    ? 'bg-[#147B72] border-[#147B72] text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Doação Única
              </button>
              <button
                type="button"
                onClick={() => setFrequency('Mensal')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  frequency === 'Mensal'
                    ? 'bg-[#147B72] border-[#147B72] text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Doação Mensal
              </button>
            </div>
          </div>

          {/* Step 2 - Direcione seu Impacto */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-[#147B72] text-white flex items-center justify-center font-bold text-sm">
                02
              </span>
              <h2 className="text-xl font-bold text-gray-900">Direcione seu Impacto</h2>
            </div>
            <p className="text-gray-500 text-sm">Qual causa ressoa mais com você agora?</p>

            {routeState.type ? (
              <div className="p-5 rounded-2xl border-2 border-[#147B72] bg-white flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-teal-50 text-[#147B72] shrink-0">
                  <Heart className="w-6 h-6 fill-[#147B72]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {routeState.type === 'bundle' && `Bundle Coletivo: ${routeState.bundleName}`}
                    {routeState.type === 'campaign' && `Campanha: ${routeState.campaignName}`}
                    {routeState.type === 'ngo' && `ONG: ${routeState.ngoName}`}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    Destino selecionado previamente no catálogo. Caso queira apoiar outro projeto, retorne à página de causas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {causesList.map((cause) => {
                  const CauseIcon = cause.icon;
                  const isSelected = selectedCause === cause.id;
                  return (
                    <button
                      key={cause.id}
                      type="button"
                      onClick={() => setSelectedCause(cause.id)}
                      className={`w-full flex items-start text-left p-5 rounded-2xl border-2 transition-all ${
                        isSelected 
                          ? 'bg-white border-[#147B72] shadow-sm' 
                          : 'bg-white border-transparent hover:border-gray-100'
                      }`}
                    >
                      <div className="flex items-center h-5 mr-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#147B72]' : 'border-gray-300'
                         }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#147B72]" />}
                        </div>
                      </div>
                      <div className="flex-grow flex items-start space-x-4">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-teal-50 text-[#147B72]' : 'bg-gray-50 text-gray-500'}`}>
                          <CauseIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{cause.title}</h4>
                          <p className="text-gray-500 text-xs mt-1 leading-relaxed">{cause.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 3 - Método de Pagamento */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-[#147B72] text-white flex items-center justify-center font-bold text-sm">
                03
              </span>
              <h2 className="text-xl font-bold text-gray-900">Método de Pagamento</h2>
            </div>

            {/* Payment Selection Tabs */}
            <div className="flex space-x-4 border-b border-gray-100 pb-2">
              {[
                { id: 'PIX', label: 'PIX', icon: QrCode }
              ].map((method) => {
                const MethodIcon = method.icon;
                const isActive = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl border transition-all font-bold text-sm ${
                      isActive 
                        ? 'bg-white border-[#147B72] text-[#147B72] shadow-sm' 
                        : 'bg-white border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <MethodIcon className="w-4 h-4" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Conditional fields */}
            {paymentMethod === 'PIX' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-50 text-center space-y-3">
                <QrCode className="w-16 h-16 mx-auto text-gray-300" />
                <p className="text-gray-600 text-sm">
                  Um QR Code PIX será gerado na próxima tela para você concluir sua doação.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 space-y-3">
            {submitError && (
              <p className="text-sm text-red-600 font-medium">{submitError}</p>
            )}
            {paymentError && (
              <p className="text-sm text-amber-700 font-medium">{paymentError}</p>
            )}
            <button 
              type="button" 
              onClick={handleFinalizeDonation}
              disabled={submittingDonation || paymentMethodsLoading || !routeState.ngoId}
              className="w-full sm:w-auto bg-[#147B72] hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-12 py-4 rounded-full transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>
                {submittingDonation ? 'Processando...' : `Finalizar Doação de R$ ${displayAmount}`}
              </span>
              <Heart className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>

        {/* Right Column - Summaries & Stories */}
        <div className="space-y-8 lg:sticky lg:top-8 h-fit">
          
          {/* Card 1 - Donation Summary */}
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-50 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
              Resumo da Doação
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Sua Doação</span>
                <span className="text-gray-900 font-bold">R$ {displayAmount},00</span>
              </div>
              {matchMultiplier > 1 && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Multiplicador</span>
                    <span className="text-emerald-700 font-bold">{matchMultiplier}x ({matchSponsor})</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/55">
                    <span className="text-emerald-800 font-bold text-xs">Total do Match</span>
                    <span className="text-[#0A665C] font-extrabold">R$ {combinedAmount},00</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Destino</span>
                <span className="text-gray-900 font-bold text-right max-w-[200px] truncate">{selectedCause}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Taxas Operacionais</span>
                <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">Cobertas pelo Impacto</span>
              </div>
            </div>

            {/* Score box */}
            <div className="bg-[#F5F9F8] p-5 rounded-2xl space-y-2 border border-teal-50">
              <div className="flex items-center space-x-2 text-teal-800">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Transparência</span>
              </div>
              <div className="text-teal-900 font-extrabold text-sm">
                SCORE {ngoScore !== null ? `${ngoScore}/100` : 'Carregando...'}
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                Score calculado via verificação automatizada de CNPJ, endereço e tempo de atuação.
              </p>
            </div>

            {/* Certifications badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-gray-100">
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <span className="text-[0.6rem] font-bold text-gray-500 tracking-tight uppercase">SSL Seguro</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Lock className="w-5 h-5 text-gray-400" />
                <span className="text-[0.6rem] font-bold text-gray-500 tracking-tight uppercase">Dados Cripto</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ThumbsUp className="w-5 h-5 text-gray-400" />
                <span className="text-[0.6rem] font-bold text-gray-500 tracking-tight uppercase">Impacto Real</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Story Card */}
          <div 
            className="relative rounded-[2rem] overflow-hidden aspect-[4/3] flex flex-col justify-end p-8 bg-cover bg-center shadow-md"
            style={{ backgroundImage: `url(${amaraStoryBg})` }}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            <div className="relative z-10 text-white space-y-2">
              <h4 className="text-lg font-bold">Conheça a história de Amara.</h4>
              <p className="text-xs text-gray-200 leading-relaxed max-w-[280px]">
                Como uma doação de R$ 30 mudou o destino de uma aldeia inteira na Angola.
              </p>
              <a href="#" className="inline-block text-xs font-bold text-orange-200 hover:text-orange-300 transition-colors pt-2">
                Ler Reportagem ➔
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
