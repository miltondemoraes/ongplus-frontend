import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ngoService } from '../services/ngoService';
import {
  MapPin,
  Building2,
  ShieldCheck,
  FileText,
  Target,
  ArrowLeft,
  CreditCard,
  QrCode,
  Wallet,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import reflorestaSeedling from '../assets/refloresta_seedling.png';
import Footer from '../components/Footer';

const DEFAULT_BENEFITS = [
  {
    title: 'Doação Segura',
    desc: 'Protocolos bancários de alta segurança protegem cada transação financeira.',
    icon: ShieldCheck
  },
  {
    title: 'Transparência Total',
    desc: 'Relatórios auditados e disponíveis mensalmente em nossa plataforma.',
    icon: FileText
  },
  {
    title: 'Impacto Direto',
    desc: '95% do valor contribuído é investido diretamente nos projetos da organização.',
    icon: Target
  }
];

export default function NgoProfilePage({ ong, onNavigate }) {
  if (!ong) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-red-500 font-medium">ONG não encontrada.</p>
      </div>
    );
  }
  const currentOng = ong;

  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const loadCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const data = await ngoService.getNgoCampaigns(currentOng.id);
        if (!cancelled) {
          setCampaigns(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Erro ao carregar campanhas da ONG:', error);
        if (!cancelled) {
          setCampaigns([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCampaigns(false);
        }
      }
    };

    loadCampaigns();

    return () => {
      cancelled = true;
    };
  }, [currentOng.id]);

  const activeCampaigns = campaigns.filter((campaign) => {
    return campaign.status?.toLowerCase().includes('publicada') || campaign.daysLeft > 0;
  });

  const historicalCampaigns = campaigns.filter((campaign) => {
    return !activeCampaigns.includes(campaign) || campaign.raisedAmount >= campaign.targetAmount;
  });

  // Estados para o formulário interativo de doação
  const [frequency, setFrequency] = useState('mensal'); // 'mensal', 'unica'
  const [amount, setAmount] = useState('100'); // '50', '100', '200', 'custom'
  const [customAmount, setCustomAmount] = useState('');

  const handleCompleteDonation = (e) => {
    e.preventDefault();
    const selectedAmount = amount === 'custom' ? customAmount : amount;
    const donationState = {
      ngoId: currentOng.id,
      ngoName: currentOng.name,
      type: 'ngo',
      amount: selectedAmount,
      frequency
    };

    if (!user) {
      navigate('/login', {
        state: {
          from: {
            pathname: '/doacao',
            state: donationState
          }
        }
      });
      return;
    }

    navigate('/doacao', { state: donationState });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      
      {/* Back button to explore causes */}
      <div className="max-w-7xl w-full mx-auto px-8 md:px-16 pt-6">
        <button 
          onClick={() => onNavigate && onNavigate('causas')}
          className="flex items-center space-x-2 text-gray-500 hover:text-[#0A665C] transition font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Causas</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-8 md:px-16 py-10 space-y-12">
        
        {/* Intro Block: Header da ONG + Bloco Transparência */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 items-start">
          
          {/* Informações Principais da ONG */}
          <div className="space-y-6">
            {currentOng.verified !== false ? (
              <span className="bg-[#CBDDCD] text-[#0A3D36] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 w-fit">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Parceiro Verificado</span>
              </span>
            ) : (
              <span className="bg-gray-150 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 w-fit">
                <span>Aguardando Verificação</span>
              </span>
            )}

            <h1 className="text-5xl font-extrabold text-[#0A3D36] tracking-tight leading-none">
              {currentOng.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-xs font-semibold">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{currentOng.location}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>CNPJ: {currentOng.cnpj}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-[10px] font-semibold">
              <span>Fonte dos dados: Receita Federal & Auditoria Interna</span>
              <span>•</span>
              <span>Última atualização: {currentOng.lastUpdated || currentOng.scoreUpdatedAt?.slice(0, 10) || '—'}</span>
              <span>•</span>
              {(() => {
                const status = currentOng.verification?.consistencyStatus;
                if (status === 'consistent') {
                  return <span className="text-[#0A665C]">Consistência de dados: Íntegro</span>;
                }
                if (status === 'inconsistent') {
                  return <span className="text-red-600">Consistência de dados: Inconsistências detectadas</span>;
                }
                return <span className="text-amber-600">Consistência de dados: Sob análise documental</span>;
              })()}
            </div>

            <p className="text-gray-600 text-base leading-relaxed max-w-2xl font-medium pt-2">
              {currentOng.description}
            </p>
          </div>

          {/* Card Transparência */}
          <div 
            onClick={() => onNavigate && onNavigate('ong-transparency', currentOng)}
            className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-[#0A665C]/20 transition-all flex flex-col justify-between items-center text-center space-y-6 cursor-pointer group"
          >
            <div className="w-full space-y-4">
              <h3 className="text-xs font-extrabold text-[#0A3D36] uppercase tracking-widest group-hover:text-[#0A665C] transition-colors">
                Transparência
              </h3>
              
              {/* Circular Dial Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center mx-auto transition-transform group-hover:scale-105 duration-300">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-[#EBE9E3]" strokeWidth="7.5" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="40" className="stroke-[#0A665C]" strokeWidth="7.5" fill="transparent"
                    strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - currentOng.score / 100)} strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-[#0A3D36]">{currentOng.score}</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">de 100</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-[240px]">
                Pontuação máxima em saúde financeira e prestação de contas.
              </p>
              <span className="inline-flex items-center text-[#0A665C] group-hover:text-[#08524a] text-xs font-bold transition hover:underline">
                Ver Transparência Pública &rarr;
              </span>
            </div>
          </div>

        </div>

        {/* Impact Block: Banner de Destaque */}
        <div className="relative rounded-[2rem] overflow-hidden min-h-[400px] flex items-end">
          <img 
            src={reflorestaSeedling} 
            alt={`Projeto de ${currentOng.name}`} 
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative p-10 text-white space-y-2 max-w-2xl">
            <h3 className="text-2xl font-extrabold tracking-tight">Impacto real em {currentOng.location}</h3>
            <p className="text-white/80 text-xs leading-relaxed font-medium">
              Apoie {currentOng.name} em projetos focados em {currentOng.causeLabel?.toLowerCase() || 'ações sociais'} e acompanhe resultados com transparência.
            </p>
          </div>
        </div>

        {/* Investment Block: Apoie a causa da ONG + Card Checkout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 pt-6">
          
          {/* Esquerda: Benefícios e Garantias */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-[#0A3D36] tracking-tight">
                Apoie a causa de {currentOng.causeLabel || 'impacto social'}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                Concentre sua contribuição em {currentOng.name} e ajude a manter projetos com foco em {currentOng.causeLabel?.toLowerCase() || 'transformação comunitária'}.
              </p>
            </div>

            <div className="space-y-6">
              {DEFAULT_BENEFITS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EAE8E3]/60 flex items-center justify-center text-[#0A665C] shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500 leading-normal max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direita: Checkout Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-6 relative">
            


            {/* Toggle de Frequência */}
            <div className="bg-[#FAF8F5] p-1 rounded-full flex border border-gray-100">
              <button 
                onClick={() => setFrequency('mensal')}
                className={`flex-1 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  frequency === 'mensal' 
                    ? 'bg-[#0A665C] text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setFrequency('unica')}
                className={`flex-1 py-3 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  frequency === 'unica' 
                    ? 'bg-[#0A665C] text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Única
              </button>
            </div>

            {/* Seleção de Valores */}
            <div className="grid grid-cols-3 gap-3">
              {['50', '100', '200'].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount('');
                  }}
                  className={`py-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    amount === val 
                      ? 'border-[#0A665C] bg-[#FAF8F5] text-[#0A665C] font-extrabold shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                  }`}
                >
                  R${val}
                </button>
              ))}
            </div>

            {/* Input para Outro Valor */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Outro Valor
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs font-bold text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  placeholder="0,00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount('custom');
                  }}
                  className="w-full bg-[#FAF8F5] text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-4 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#0A665C]"
                />
              </div>
            </div>

            {/* Completar Doação Button */}
            <button 
              onClick={handleCompleteDonation}
              className="w-full bg-[#0A665C] hover:bg-[#08524a] text-white py-4.5 rounded-xl font-bold text-sm tracking-wide shadow-md transition-colors cursor-pointer text-center"
            >
              {user ? 'Completar Doação' : 'Entrar para Doar'}
            </button>

            {/* Payment Method Icons below button */}
            <div className="flex items-center justify-center space-x-6 pt-2 text-gray-400">
              <CreditCard className="w-5 h-5 hover:text-gray-600 transition" />
              <QrCode className="w-5 h-5 hover:text-gray-600 transition" />
              <Wallet className="w-5 h-5 hover:text-gray-600 transition" />
            </div>

          </div>

        </div>

        {/* Campanhas Ativas */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0A3D36] tracking-tight">Campanhas Ativas</h2>
              <p className="text-gray-500 text-sm mt-1">Iniciações em andamento — apoie uma causa específica.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingCampaigns ? (
              <div className="rounded-[2rem] bg-white p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] text-gray-500 text-sm">
                Carregando campanhas ativas...
              </div>
            ) : activeCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCampaigns.map((camp) => {
                  const pct = camp.targetAmount ? Math.round((camp.raisedAmount / camp.targetAmount) * 100) : 0;
                  const statusLabel = camp.status?.toLowerCase().includes('publicada') ? 'Ativa' : camp.status;
                  return (
                    <div key={camp.id} className="bg-white rounded-[1.5rem] p-7 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-4 hover:shadow-[0_4px_30px_rgba(0,0,0,0.04)] transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-[#CBDDCD] text-[#0A3D36] text-[10px] font-bold px-2.5 py-0.5 rounded-full">{statusLabel}</span>
                            {camp.matchMultiplier > 1 && (
                              <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>Match {camp.matchMultiplier}x{camp.matchSponsor ? ` — ${camp.matchSponsor}` : ''}</span>
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 text-base">{camp.name}</h3>
                          <p className="text-gray-500 text-xs leading-relaxed">{camp.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-gray-700">
                          <span>R$ {camp.raisedAmount.toLocaleString('pt-BR')} arrecadados</span>
                          <span>{pct}% da meta</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-teal-700 h-2 rounded-full"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Meta: R$ {camp.targetAmount.toLocaleString('pt-BR')}</span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Prazo: {camp.daysLeft > 0 ? `${camp.daysLeft} dias` : 'Sem prazo definido'}</span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!user) {
                            navigate('/login', {
                              state: {
                                from: {
                                  pathname: '/doacao',
                                  state: {
                                    campaignId: camp.id,
                                    campaignName: camp.name,
                                    ngoId: currentOng.id,
                                    ngoName: currentOng.name,
                                    type: 'campaign'
                                  }
                                }
                              }
                            });
                          } else {
                            navigate('/doacao', {
                              state: {
                                campaignId: camp.id,
                                campaignName: camp.name,
                                ngoId: currentOng.id,
                                ngoName: currentOng.name,
                                type: 'campaign'
                              }
                            });
                          }
                        }}
                        className="w-full bg-[#0A665C] hover:bg-[#08524a] text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                      >
                        {user ? 'Apoiar esta Campanha' : 'Entrar para Apoiar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[2rem] bg-white p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] text-gray-500 text-sm">
                Ainda não há campanhas ativas publicadas para {currentOng.name}.
              </div>
            )}
          </div>
        </div>

        {/* Histórico de Campanhas */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-extrabold text-[#0A3D36] tracking-tight">Histórico de Campanhas</h2>
          <div className="space-y-4">
            {historicalCampaigns.length > 0 ? (
              historicalCampaigns.map((camp) => {
                const pct = camp.targetAmount ? Math.round((camp.raisedAmount / camp.targetAmount) * 100) : 0;
                const isComplete = camp.raisedAmount >= camp.targetAmount;
                return (
                  <div key={camp.id} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {isComplete
                          ? <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                          : <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        }
                        <span className="text-sm font-semibold text-gray-700">{camp.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{camp.description}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-xs text-gray-500">Meta: R$ {camp.targetAmount.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-[#0A665C] font-bold">{pct}% concluído</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[2rem] bg-white p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] text-gray-500 text-sm">
                Ainda não há campanhas históricas para {currentOng.name}.
              </div>
            )}
          </div>
        </div>

      </main>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
