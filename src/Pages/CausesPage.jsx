import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ngoService } from '../services/ngoService';
import {
  Search,
  Heart,
  Settings,
  Leaf,
  GraduationCap,
  HeartPulse,
  Scale,
  Sparkles,
  MapPin,
  ShieldCheck,
  Percent,
  Users,
  Info,
  Award,
  Check
} from 'lucide-react';

// Import local assets for cover images
import verdeUrbeGarden from '../assets/verde_urbe_garden.png';
import reflorestaSeedling from '../assets/refloresta_seedling.png';
import loginBgPlant from '../assets/login_bg_plant.png';
import aboutUs from '../assets/about_us.png';
import genericImage from '../assets/imagem_generica.jpg';

// Fallback icons per cause slug
const CAUSE_ICONS = {
  'meio-ambiente': 'tree',
  saude: 'drop',
  educacao: 'pencil',
  'direitos-humanos': 'scale',
};

// Cover image pool — assigned to campaigns/bundles by index as cosmetic fallbacks
const CAMPAIGN_COVERS = [verdeUrbeGarden, genericImage, reflorestaSeedling];
const BUNDLE_COVERS = [aboutUs, loginBgPlant];

export default function CausesPage({ onNavigate }) {
  const navigate = useNavigate();
  const [ongs, setOngs] = useState([]);
  const [ongsLoading, setOngsLoading] = useState(true);
  const [ongsError, setOngsError] = useState(null);

  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  const [bundles, setBundles] = useState([]);
  const [bundlesLoading, setBundlesLoading] = useState(true);

  // Set default active tab to 'ongs' for maximum prominence and better UX
  const [activeTab, setActiveTab] = useState('ongs');
  const [activeFilter, setActiveFilter] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Support modal states
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  
  const [locationFilter, setLocationFilter] = useState('todas');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [minScore, setMinScore] = useState(0);

  // Load ONGs
  useEffect(() => {
    let cancelled = false;
    ngoService.list()
      .then((data) => {
        if (!cancelled) {
          setOngs(
            data.map((ong) => ({
              ...ong,
              icon: CAUSE_ICONS[ong.cause] || 'tree',
            }))
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOngsError('Não foi possível carregar as ONGs. Verifique se o backend está ativo.');
        }
      })
      .finally(() => {
        if (!cancelled) setOngsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Load Campaigns
  useEffect(() => {
    let cancelled = false;
    ngoService.listCampaigns()
      .then((data) => {
        if (!cancelled) {
          setCampaigns(
            data.map((c, idx) => ({
              ...c,
              cover: CAMPAIGN_COVERS[idx % CAMPAIGN_COVERS.length],
            }))
          );
        }
      })
      .catch(() => { /* silently fallback to empty */ })
      .finally(() => { if (!cancelled) setCampaignsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Load Bundles
  useEffect(() => {
    let cancelled = false;
    ngoService.listBundles()
      .then((data) => {
        if (!cancelled) {
          setBundles(
            data.map((b, idx) => ({
              ...b,
              cover: BUNDLE_COVERS[idx % BUNDLE_COVERS.length],
            }))
          );
        }
      })
      .catch(() => { /* silently fallback to empty */ })
      .finally(() => { if (!cancelled) setBundlesLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const locations = [...new Set(ongs.map((ong) => ong.location).filter(Boolean))];

  const handleGoToBundle = (bundleId) => {
    navigate(`/bundle/${bundleId}`);
  };

  const handleGoToDonate = (item, type) => {
    if (type === 'campaign') {
      navigate('/doacao', { state: { campaignId: item.id, campaignName: item.name, type: 'campaign', score: item.score, ngoId: item.ngoId } });
    } else if (type === 'bundle') {
      navigate('/doacao', { state: { bundleId: item.id, bundleName: item.name, type: 'bundle', score: item.transparencyScore, ngoId: item.ongs?.[0]?.id } });
    } else {
      navigate('/doacao', { state: { ngoId: item.id, ngoName: item.name, type: 'ngo', score: item.score } });
    }
  };

  // Filter logic for ONGs
  const filteredOngs = ongs.filter(ong => {
    const matchesCause = activeFilter === 'todas' || ong.cause === activeFilter;
    const matchesSearch = 
      ong.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ong.cnpj.includes(searchQuery) ||
      ong.causeLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'todas' || ong.location === locationFilter;
    const matchesVerified = !onlyVerified || ong.verified;
    const matchesScore = ong.score >= minScore;
    
    return matchesCause && matchesSearch && matchesLocation && matchesVerified && matchesScore;
  });

  // Filter logic for Campaigns (API data — score and ngoId come directly from backend)
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesCause = activeFilter === 'todas' || campaign.cause === activeFilter;
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.ngoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.causeLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'todas' || campaign.location === locationFilter;
    return matchesCause && matchesSearch && matchesLocation;
  });

  // Filter logic for Bundles (transparencyScore computed server-side)
  const filteredBundles = bundles.filter(bundle => {
    const matchesCause = activeFilter === 'todas' || bundle.cause === activeFilter;
    const matchesSearch =
      bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bundle.causeLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCause && matchesSearch;
  });

  return (
    <div className="flex-1 bg-[#FAF8F5] min-h-screen flex font-sans">
      
      {/* Sidebar Lateral de Filtros */}
      <aside className="w-80 bg-[#F5F2EC] flex flex-col justify-between p-8 border-r border-[#E5E2D9] shrink-0">
        <div className="space-y-8">
          <div>
            <h3 className="text-[#0A3D36] font-bold text-xs uppercase tracking-wider mb-2">Filtros</h3>
            <p className="text-gray-400 text-xs font-semibold">Customize sua busca</p>
          </div>

          {/* Filtro Principal por Causas */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Filtrar por Causa</label>
            <nav className="space-y-1.5">
              {[
                { id: 'todas', label: 'Todas as causas', icon: Sparkles },
                { id: 'meio-ambiente', label: 'Meio ambiente', icon: Leaf },
                { id: 'educacao', label: 'Educação', icon: GraduationCap },
                { id: 'saude', label: 'Saúde', icon: HeartPulse },
                { id: 'direitos-humanos', label: 'Direitos humanos', icon: Scale },
              ].map(filter => {
                const IconComponent = filter.icon;
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all text-left ${
                      isActive
                        ? 'bg-white text-[#0A665C] shadow-sm'
                        : 'text-gray-500 hover:bg-[#EBE9E3] hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#0A665C]' : 'text-gray-400'}`} />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Filtros específicos para ONGs e Campanhas */}
          {activeTab !== 'bundles' && (
            <div className="space-y-5 pt-4 border-t border-[#E5E2D9]/60">
              {/* Localidade */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Localidade</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full bg-white border border-[#E5E2D9] rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0A665C]"
                >
                  <option value="todas">Todas as regiões</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {activeTab === 'ongs' && (
                <>
                  {/* Status Verificado */}
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      id="verified-checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0A665C] border-gray-300 focus:ring-[#0A665C]"
                    />
                    <label htmlFor="verified-checkbox" className="text-xs font-semibold text-gray-600 cursor-pointer select-none">
                      Apenas ONGs Verificadas
                    </label>
                  </div>

                  {/* Score Mínimo */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <span>Score Mínimo</span>
                      <span className="text-[#0A665C]">{minScore || 'Todos'}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="95"
                      step="5"
                      value={minScore}
                      onChange={(e) => setMinScore(Number(e.target.value))}
                      className="w-full accent-[#0A665C]"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="space-y-2.5 w-full">
            <button 
              onClick={() => setShowSupportModal(true)}
              className="w-full bg-white hover:bg-gray-50 text-teal-800 border border-teal-700/20 py-3.5 px-6 rounded-full font-bold text-xs flex items-center justify-center space-x-2.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>Suporte & Ajuda</span>
            </button>
          </div>
        </div>


      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 py-12 px-16 max-w-6xl mx-auto space-y-8">
        
        {/* Barra de Busca com Design Arredondado Clean */}
        <div className="relative w-full max-w-4xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-6 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar por nome, causa, CNPJ${activeTab !== 'bundles' ? ' ou localidade' : ''}...`}
            className="w-full bg-white text-gray-800 placeholder-gray-400 rounded-full pl-14 pr-8 py-4.5 border-none shadow-[0_4px_20px_rgba(0,0,0,0.015)] focus:outline-none focus:ring-1 focus:ring-[#0A665C]/30 text-sm transition-all"
          />
        </div>

        {/* Cabeçalho de Título */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-[#0A3D36] tracking-tight">
            Descubra Impacto
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Explore organizações parceiras, campanhas de curto prazo e fundos colaborativos de causas.
          </p>
        </div>

        {/* Navegação de Abas Principal - Reordenado e com destaque para Campanhas Coletivas */}
        <div className="flex border-b border-gray-200/80 max-w-4xl pt-2">
          {[
            { id: 'bundles', label: '✨ Campanhas Coletivas (Bundles)' },
            { id: 'campaigns', label: 'Campanhas Individuais' },
            { id: 'ongs', label: 'ONGs Individuais' }
          ].map(tab => {
            const isFeatured = tab.id === 'bundles';
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMinScore(0);
                  setLocationFilter('todas');
                }}
                className={`pb-4 px-6 font-extrabold text-sm border-b-2 transition-all cursor-pointer relative ${
                  activeTab === tab.id
                    ? 'border-[#0A665C] text-[#0A665C]'
                    : isFeatured
                      ? 'border-transparent text-[#8C6D3F] hover:text-[#0A665C]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <span>{tab.label}</span>
                {isFeatured && (
                  <span className="absolute -top-2 right-2 bg-[#8C6D3F] text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-widest scale-90">
                    Recomendado
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Listagem Dinâmica baseada na Aba Ativa */}
        <div className="space-y-6 max-w-4xl">
          
          {/* ABA CAMPANHAS COLETIVAS (BUNDLES) - Destaque Principal */}
          {activeTab === 'bundles' && (
            filteredBundles.length > 0 ? (
              filteredBundles.map(bundle => {
                const progressPercent = Math.min(Math.round((bundle.raisedAmount / bundle.targetAmount) * 100), 100);
                const hasMatchfunding = bundle.matchMultiplier > 1;
                return (
                  <div 
                    key={bundle.id} 
                    className="bg-white rounded-[2rem] border-2 border-[#8C6D3F]/20 shadow-[0_8px_30px_rgba(140,109,63,0.04)] hover:shadow-[0_8px_35px_rgba(140,109,63,0.08)] hover:border-[#8C6D3F]/40 transition-all flex flex-col md:flex-row items-stretch overflow-hidden gap-0"
                  >
                    {/* Imagem de Capa */}
                    <div className="relative w-full md:w-60 h-52 md:h-auto shrink-0 bg-gray-100">
                      <img src={bundle.cover} alt={bundle.name} className="w-full h-full object-cover" />
                      <span className="absolute top-4 left-4 bg-[#8C6D3F] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                        Campanha Coletiva
                      </span>
                      {hasMatchfunding && (
                        <span className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center space-x-1">
                          <Percent className="w-3.5 h-3.5 fill-white" />
                          <span>Matchfunding {bundle.matchMultiplier}x</span>
                        </span>
                      )}
                    </div>

                    <div className="p-6 md:p-8 flex flex-col justify-between flex-grow space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#0A665C] border border-[#E5E2D9] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {bundle.causeLabel}
                          </span>
                          <span className="text-[10px] font-bold bg-[#FAF2E8] text-[#8C6D3F] px-2.5 py-1 rounded-full flex items-center space-x-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>Iniciativa de Destaque</span>
                          </span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">{bundle.name}</h3>

                        <p className="text-gray-500 text-xs leading-relaxed max-w-xl font-medium">
                          {bundle.description}
                        </p>

                        {/* Matchfunding Explicit Warning/Description */}
                        {hasMatchfunding && bundle.matchSponsor && (
                          <div className="flex items-start space-x-2 text-[10px] font-bold text-emerald-800 bg-[#EAF5F0] border border-emerald-250 p-3 rounded-2xl max-w-md">
                            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <span>Matchfunding Ativo:</span>
                              <p className="text-gray-600 font-medium text-[9px] mt-0.5">
                                Cada contribuição para esta campanha coletiva será multiplicada por <strong>{bundle.matchMultiplier}x</strong> através do aporte da entidade parceira <strong>{bundle.matchSponsor}</strong>.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* participating NGOs logos list */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">ONGs Participantes Beneficiadas:</span>
                          <div className="flex flex-wrap gap-2">
                            {bundle.ongs.map((ong, idx) => (
                              <span key={idx} className="inline-flex items-center bg-[#FAF8F5] border border-gray-200/60 rounded-full px-3 py-1 text-xs font-bold text-gray-700 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-[#0A665C] mr-2"></span>
                                {ong.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress, stats and links */}
                    <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 p-6 md:p-8 space-y-4 bg-gray-50/40 shrink-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-gray-400">Progresso Geral</span>
                          <span className="text-[#0A665C]">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#0A665C] h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                          <span>R$ {bundle.raisedAmount.toLocaleString('pt-BR')}</span>
                          <span>Meta: R$ {bundle.targetAmount.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <button 
                          onClick={() => handleGoToBundle(bundle.id)}
                          className="w-full bg-white hover:bg-gray-100 border border-gray-250 text-gray-700 py-2.5 px-4 rounded-xl font-extrabold text-xs text-center transition-colors cursor-pointer shadow-xs"
                        >
                          Ver Detalhes do Coletivo
                        </button>
                        <button 
                          onClick={() => handleGoToDonate(bundle, 'bundle')}
                          className="w-full bg-[#0A665C] hover:bg-[#08524a] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm"
                        >
                          <Heart className="w-3.5 h-3.5 fill-white" />
                          <span>Apoiar Coletivo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState onClear={() => { setActiveFilter('todas'); setSearchQuery(''); }} />
            )
          )}

          {/* ABA CAMPANHAS INDIVIDUAIS */}
          {activeTab === 'campaigns' && (
            filteredCampaigns.length > 0 ? (
              filteredCampaigns.map(campaign => {
                const progressPercent = Math.min(Math.round((campaign.raisedAmount / campaign.targetAmount) * 100), 100);
                return (
                  <div 
                    key={campaign.id} 
                    className="bg-white rounded-[2rem] p-0 border border-gray-150 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch justify-between"
                  >
                    {/* Imagem de Capa */}
                    <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-gray-100">
                      <img src={campaign.cover} alt={campaign.name} className="w-full h-full object-cover" />
                      {campaign.matchMultiplier > 1 && (
                        <span className="absolute top-4 left-4 bg-[#0A3D36]/90 text-white text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
                          Match {campaign.matchMultiplier}x
                        </span>
                      )}
                    </div>

                    <div className="p-6 md:p-8 flex flex-col justify-between flex-grow space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#0A665C] border border-[#E5E2D9] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {campaign.causeLabel}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                          <p className="text-xs text-[#0A3D36] font-bold">Por: {campaign.ngoName}</p>
                        </div>

                        <p className="text-gray-500 text-xs leading-relaxed max-w-xl font-medium">
                          {campaign.description}
                        </p>

                        {/* Matchfunding Sponsor Highlight */}
                        {campaign.matchMultiplier > 1 && campaign.matchSponsor && (
                          <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-gray-400 bg-[#FAF8F5] p-2 rounded-lg w-fit">
                            <Info className="w-3.5 h-3.5 text-[#0A665C]" />
                            <span>Cada R$ 1 doado vira R$ {campaign.matchMultiplier} por conta do patrocinador {campaign.matchSponsor}.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress & Goals Sidebar */}
                    <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 p-6 md:p-8 space-y-4 shrink-0 bg-gray-50/20">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-[#0A665C]">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#0A665C] h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                          <span>R$ {campaign.raisedAmount.toLocaleString('pt-BR')}</span>
                          <span>Meta: R$ {campaign.targetAmount.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleGoToDonate(campaign, 'campaign')}
                        className="w-full bg-[#0A665C] hover:bg-[#08524a] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Apoiar Campanha</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState onClear={() => { setActiveFilter('todas'); setSearchQuery(''); setLocationFilter('todas'); }} />
            )
          )}

          {/* ABA ONGS INDIVIDUAIS */}
          {activeTab === 'ongs' && (
            ongsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A665C] mb-3" />
                <p className="text-sm font-medium">Carregando ONGs...</p>
              </div>
            ) : ongsError ? (
              <div className="text-center py-20 text-red-500 font-medium">{ongsError}</div>
            ) : filteredOngs.length > 0 ? (
              filteredOngs.map(ong => (
                <div 
                  key={ong.id} 
                  className="bg-white rounded-[2rem] p-8 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.025)] transition-all flex items-center justify-between gap-8"
                >
                  {/* Logo / Categoria Icon */}
                  <div className="w-16 h-16 rounded-full bg-[#EAE8E3]/60 flex items-center justify-center shrink-0">
                    {ong.icon === 'tree' && (
                      <div className="w-12 h-12 bg-[#CBDDCD] rounded-full flex items-center justify-center text-[#0A665C]">
                        <Leaf className="w-6 h-6" />
                      </div>
                    )}
                    {ong.icon === 'drop' && (
                      <div className="w-12 h-12 bg-[#CBD9ED] rounded-full flex items-center justify-center text-[#2F6196]">
                        <HeartPulse className="w-6 h-6" />
                      </div>
                    )}
                    {ong.icon === 'pencil' && (
                      <div className="w-12 h-12 bg-[#F2DDD9] rounded-full flex items-center justify-center text-[#B55A48]">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                    )}
                    {ong.icon === 'scale' && (
                      <div className="w-12 h-12 bg-[#EDE5D9] rounded-full flex items-center justify-center text-[#8C6D3F]">
                        <Scale className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Informações da ONG */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{ong.name}</h3>
                      {ong.verified && (
                        <span className="inline-flex items-center space-x-1 bg-[#CBDDCD] text-[#0A3D36] text-[9px] font-bold px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verificado</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400 font-semibold">
                      <span>CNPJ: {ong.cnpj}</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{ong.location}</span>
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed max-w-xl font-medium">
                      {ong.description}
                    </p>
                  </div>

                  {/* Score Dial Gauge / Link Ver Mais */}
                  <div className="flex flex-col items-center justify-center shrink-0 space-y-3">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="stroke-[#EBE9E3]" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="50" cy="50" r="40" className="stroke-[#0A665C]" strokeWidth="8" fill="transparent"
                          strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - ong.score / 100)} strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-sm font-extrabold text-[#0A3D36]">{ong.score}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onNavigate && onNavigate('ong-profile', ong)}
                      className="text-[#0A665C] hover:text-[#08524a] text-xs font-bold transition hover:underline cursor-pointer"
                    >
                      Ver Mais
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <EmptyState onClear={() => { setActiveFilter('todas'); setSearchQuery(''); setMinScore(0); setLocationFilter('todas'); setOnlyVerified(false); }} />
            )
          )}

        </div>

      </main>

      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 space-y-6 shadow-2xl relative text-left">
            <button 
              onClick={() => {
                setShowSupportModal(false);
                setSupportSubmitted(false);
                setSupportName('');
                setSupportEmail('');
                setSupportMessage('');
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition text-lg font-bold"
            >
              &times;
            </button>

            {!supportSubmitted ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setSupportSubmitted(true);
              }} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#0A3D36]">Suporte ao Doador</h3>
                  <p className="text-xs text-gray-500 font-medium">Como podemos ajudar você hoje? Envie uma mensagem.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-[#FAF8F5] text-gray-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0A665C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">E-mail de Contato</label>
                    <input 
                      type="email" 
                      required
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-[#FAF8F5] text-gray-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0A665C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Mensagem / Dúvida</label>
                    <textarea 
                      required
                      rows="4"
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Descreva seu problema ou sugestão..."
                      className="w-full bg-[#FAF8F5] text-gray-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0A665C] resize-none"
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0A665C] hover:bg-[#08524a] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
                >
                  Enviar Solicitação
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-[#E4F2EE] rounded-full flex items-center justify-center mx-auto text-[#0A665C]">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">Mensagem Enviada!</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Obrigado, {supportName}. Recebemos sua mensagem e nossa equipe de suporte entrará em contato em até 24 horas no e-mail {supportEmail}.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowSupportModal(false);
                    setSupportSubmitted(false);
                    setSupportName('');
                    setSupportEmail('');
                    setSupportMessage('');
                  }}
                  className="bg-[#0A665C] text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#08524a] transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 space-y-4">
      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
        <Search className="w-7 h-7 text-gray-300" />
      </div>
      <p className="text-gray-500 font-semibold text-sm">Nenhum resultado encontrado</p>
      <p className="text-gray-400 text-xs max-w-xs mx-auto">
        Tente ajustar os filtros na barra lateral ou limpe seus critérios de busca.
      </p>
      <button
        onClick={onClear}
        className="text-[#0A665C] text-xs font-bold hover:underline cursor-pointer"
      >
        Limpar todos os filtros
      </button>
    </div>
  );
}
