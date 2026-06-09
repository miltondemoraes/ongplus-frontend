import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ngoService } from '../services/ngoService';
import { transparencyService } from '../services/transparencyService';
import { saveBlob } from '../services/apiClient';
import { 
  UploadCloud, 
  ChevronRight, 
  ShieldCheck,
  PlusCircle,
  Download,
  History,
  RefreshCw,
  FileText,
  FileDown,
  Check,
  Heart,
  Percent,
  Info,
  Archive,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import genericImage from '../assets/imagem_generica.jpg';
import Footer from '../components/Footer';

const CHANGE_STATUS_STYLES = {
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  approved: { label: 'Aprovada', color: 'bg-[#CBDDCD] text-[#0A3D36] border-[#CBDDCD]' },
  rejected: { label: 'Recusada', color: 'bg-red-50 text-red-700 border-red-100' },
};

function formatReportDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso)).toUpperCase();
}

function formatChangeDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export default function NgoManagementPage({ onNavigate }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const ngoName = user?.ngoName || user?.name || 'Sua ONG';
  const [ngoId, setNgoId] = useState(user?.ngoId || null);
  const [ngoScore, setNgoScore] = useState(0);

  const [ngoDetails, setNgoDetails] = useState(null);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [myBundles, setMyBundles] = useState([]);

  const tabFromUrl = searchParams.get('tab');
  const [activeSubTab, setActiveSubTab] = useState(tabFromUrl || 'visao-geral');
  const [campaignTab, setCampaignTab] = useState('ativas');
  const [financialData, setFinancialData] = useState(null);
  const [reports, setReports] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [clearHistoryLoading, setClearHistoryLoading] = useState(false);
  const [downloadingReportId, setDownloadingReportId] = useState(null);
  const [cadastroLoading, setCadastroLoading] = useState(false);
  const [cadastroMessage, setCadastroMessage] = useState(null);
  const [cadastroName, setCadastroName] = useState('');
  const [cadastroFantasy, setCadastroFantasy] = useState('');
  const [cadastroLocation, setCadastroLocation] = useState('');
  const [cadastroDescription, setCadastroDescription] = useState('');
  const [cadastroFile, setCadastroFile] = useState(null);

  // Relatorios tab states
  const [period, setPeriod] = useState('30-days');
  const [includeFinance, setIncludeFinance] = useState(true);
  const [includeDonors, setIncludeDonors] = useState(true);
  const [includeCampaigns, setIncludeCampaigns] = useState(false);
  const [includeCnpj, setIncludeCnpj] = useState(true);

  // States for campaign management
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [menuOpenCampaignId, setMenuOpenCampaignId] = useState(null);

  // Form states for campaign
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCause, setFormCause] = useState('meio-ambiente');
  const [formTarget, setFormTarget] = useState('');
  const [formDays, setFormDays] = useState('30');
  const [formRequirements, setFormRequirements] = useState('');
  const [formDestination, setFormDestination] = useState('');
  // Matchfunding form states
  const [hasMatch, setHasMatch] = useState(false);
  const [formMatchMultiplier, setFormMatchMultiplier] = useState('2');
  const [formMatchSponsor, setFormMatchSponsor] = useState('');
  const [formMatchCap, setFormMatchCap] = useState('');
  const [formMatchPeriod, setFormMatchPeriod] = useState('');

  useEffect(() => {
    if (!user?.ngoId) return;
    setNgoId(user.ngoId);
  }, [user?.ngoId]);

  useEffect(() => {
    if (tabFromUrl) setActiveSubTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabChange = (tabId) => {
    setActiveSubTab(tabId);
    setSearchParams(tabId === 'visao-geral' ? {} : { tab: tabId });
    setIsCreatingCampaign(false);
  };

  useEffect(() => {
    if (!ngoId) return;

    // Fetch NGO Details
    ngoService.getById(ngoId)
      .then((data) => {
        setNgoDetails(data);
        setNgoScore(data.score ?? 0);
        setCadastroName(data.name || '');
        setCadastroFantasy(data.name || '');
        setCadastroLocation(data.location || '');
        setCadastroDescription(data.description || '');
      })
      .catch(console.error);

    transparencyService.getFinancialData(ngoId)
      .then(setFinancialData)
      .catch(console.error);

    transparencyService.listReports(ngoId)
      .then(setReports)
      .catch(console.error);

    transparencyService.getChangeRequests(ngoId)
      .then(setChangeRequests)
      .catch(console.error);
    
    // Fetch NGO Campaigns
    ngoService.getNgoCampaigns(ngoId)
      .then(setMyCampaigns)
      .catch(console.error);

    // Fetch NGO Bundles
    ngoService.listBundles()
      .then(bundles => {
        const participating = bundles.filter(b => b.ongs && b.ongs.some(n => n.id === ngoId));
        setMyBundles(participating);
      })
      .catch(console.error);
  }, [ngoId]);

  const lastAuditLabel = ngoDetails?.lastExternalAudit
    || financialData?.lastAudit
    || '—';

  const ngoInitials = (ngoDetails?.name || ngoName || 'ONG')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  // Action handlers
  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setFormName('');
    setFormDescription('');
    setFormCause('meio-ambiente');
    setFormTarget('');
    setFormDays('30');
    setFormRequirements('');
    setFormDestination('');
    setHasMatch(false);
    setFormMatchMultiplier('2');
    setFormMatchSponsor('');
    setFormMatchCap('');
    setFormMatchPeriod('');
    setIsCreatingCampaign(true);
  };

  const handleOpenEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormName(campaign.name);
    setFormDescription(campaign.description);
    setFormCause(campaign.cause);
    setFormTarget(campaign.targetAmount.toString());
    setFormDays(campaign.daysLeft.toString());
    setFormRequirements(campaign.requirements || '');
    setFormDestination(campaign.destination || '');
    setHasMatch(campaign.matchMultiplier > 1);
    setFormMatchMultiplier((campaign.matchMultiplier || 2).toString());
    setFormMatchSponsor(campaign.matchSponsor || '');
    setFormMatchCap(campaign.matchCap ? campaign.matchCap.toString() : '');
    setFormMatchPeriod(campaign.matchPeriod || '');
    setIsCreatingCampaign(true);
    setMenuOpenCampaignId(null);
  };

  const handleSaveCampaign = async (status = 'rascunho') => {
    if (!formName.trim() || !formTarget.trim()) {
      alert('Por favor, preencha o Nome e a Meta de Arrecadação.');
      return;
    }

    const payload = {
      name: formName,
      description: formDescription,
      cause: formCause,
      targetAmount: parseFloat(formTarget) || 10000,
      status: status,
      daysLeft: parseInt(formDays) || 30,
      matchMultiplier: hasMatch ? parseInt(formMatchMultiplier) || 1 : 1,
      matchSponsor: hasMatch ? formMatchSponsor : null,
      matchCap: hasMatch && formMatchCap ? parseFloat(formMatchCap) : null,
      matchPeriod: hasMatch ? formMatchPeriod : null,
      requirements: formRequirements,
      destination: formDestination
    };

    try {
      if (editingCampaign) {
        const updated = await ngoService.updateCampaign(editingCampaign.id, payload);
        setMyCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? updated : c));
        alert(`Campanha "${formName}" atualizada no estado: ${status === 'em-revisao' ? 'Enviada para Revisão' : 'Rascunho salvo'}`);
      } else {
        const created = await ngoService.createCampaign(ngoId, payload);
        setMyCampaigns(prev => [created, ...prev]);
        alert(`Campanha "${formName}" criada no estado: ${status === 'em-revisao' ? 'Enviada para Revisão' : 'Rascunho salvo'}`);
      }
      setIsCreatingCampaign(false);
      setEditingCampaign(null);
    } catch (error) {
      alert(`Erro ao salvar campanha: ${error.message}`);
    }
  };

  const handleDuplicate = async (campaign) => {
    try {
      const payload = {
        name: campaign.name + ' (Cópia)',
        description: campaign.description,
        cause: campaign.cause,
        targetAmount: campaign.targetAmount,
        status: 'rascunho',
        daysLeft: campaign.daysLeft,
        matchMultiplier: campaign.matchMultiplier,
        matchSponsor: campaign.matchSponsor,
        matchCap: campaign.matchCap,
        matchPeriod: campaign.matchPeriod,
        requirements: campaign.requirements,
        destination: campaign.destination
      };
      const duplicated = await ngoService.createCampaign(ngoId, payload);
      setMyCampaigns(prev => [duplicated, ...prev]);
      alert(`Campanha "${campaign.name}" duplicada como rascunho com sucesso.`);
    } catch (error) {
      alert(`Erro ao duplicar campanha: ${error.message}`);
    } finally {
      setMenuOpenCampaignId(null);
    }
  };

  const handleChangeStatus = async (campaignId, newStatus) => {
    try {
      const updated = await ngoService.updateCampaignStatus(campaignId, newStatus);
      setMyCampaigns(prev => prev.map(c => c.id === campaignId ? updated : c));
      alert(`Status da campanha atualizado para: ${newStatus}`);
    } catch (error) {
      alert(`Erro ao atualizar status: ${error.message}`);
    } finally {
      setMenuOpenCampaignId(null);
    }
  };

  const refreshChangeRequests = () => {
    if (!ngoId) return;
    transparencyService.getChangeRequests(ngoId)
      .then(setChangeRequests)
      .catch(console.error);
  };

  const handleExportReport = async () => {
    if (!ngoId) {
      alert('Nenhuma ONG vinculada à sua conta. Cadastre ou vincule uma ONG para gerar relatórios.');
      return;
    }
    setExportLoading(true);
    try {
      const report = await transparencyService.generateAndDownloadReport(ngoId, {
        period,
        include_finance: includeFinance,
        include_donors: includeDonors,
        include_campaigns: includeCampaigns,
        include_cnpj: includeCnpj,
      });
      if (report) {
        setReports((prev) => [report, ...prev]);
      }
    } catch (error) {
      alert(`Erro ao gerar relatório: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    if (!ngoId || !reportId) return;
    setDownloadingReportId(reportId);
    try {
      const file = await transparencyService.downloadReport(ngoId, reportId);
      saveBlob(file.blob, file.filename);
    } catch (error) {
      alert(`Erro ao baixar relatório: ${error.message}`);
    } finally {
      setDownloadingReportId(null);
    }
  };

  const handleClearReportHistory = async () => {
    if (!ngoId || reports.length === 0) return;
    const confirmed = window.confirm(
      'Deseja limpar todo o histórico de relatórios? Os arquivos PDF serão removidos permanentemente.',
    );
    if (!confirmed) return;

    setClearHistoryLoading(true);
    try {
      await transparencyService.clearReports(ngoId);
      const updatedReports = await transparencyService.listReports(ngoId);
      setReports(updatedReports || []);
    } catch (error) {
      alert(`Erro ao limpar histórico: ${error.message}`);
    } finally {
      setClearHistoryLoading(false);
    }
  };

  const handleAuditRequest = async () => {
    if (!ngoId) return;
    try {
      await transparencyService.submitChangeRequest(ngoId, {
        field_name: 'Auditoria Externa',
        old_value: lastAuditLabel === '—' ? '' : lastAuditLabel,
        new_value: 'Atualização solicitada',
        reason: 'Solicitação de envio de nova auditoria externa via painel de gestão.',
      });
      refreshChangeRequests();
      alert('Solicitação registrada. A equipe ONG+ entrará em contato para receber o documento.');
    } catch (error) {
      alert(`Erro ao registrar solicitação: ${error.message}`);
    }
  };

  const handleCadastroFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCadastroFile(null);
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setCadastroMessage({ type: 'error', text: 'Apenas arquivos PDF são permitidos.' });
      e.target.value = '';
      setCadastroFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCadastroMessage({ type: 'error', text: 'O arquivo deve ter no máximo 10 MB.' });
      e.target.value = '';
      setCadastroFile(null);
      return;
    }

    setCadastroMessage(null);
    setCadastroFile(file);
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    if (!ngoId) return;

    const fields = [
      { field_name: 'Razão Social', old: ngoDetails?.name || '', new: cadastroName.trim() },
      { field_name: 'Nome Fantasia', old: ngoDetails?.name || '', new: cadastroFantasy.trim() },
      { field_name: 'Endereço / Sede', old: ngoDetails?.location || '', new: cadastroLocation.trim() },
      { field_name: 'Descrição Institucional', old: ngoDetails?.description || '', new: cadastroDescription.trim() },
    ].filter((item) => item.new && item.new !== item.old);

    if (fields.length === 0 && !cadastroFile) {
      setCadastroMessage({ type: 'error', text: 'Nenhuma alteração detectada nos campos ou documento.' });
      return;
    }

    setCadastroLoading(true);
    setCadastroMessage(null);
    try {
      let submittedCount = 0;

      if (cadastroFile) {
        const uploaded = await transparencyService.uploadDocument(ngoId, cadastroFile, {
          description: 'Documento comprobatório enviado com solicitação cadastral.',
        });
        await transparencyService.submitChangeRequest(ngoId, {
          field_name: 'Documento Comprovatório',
          old_value: '',
          new_value: uploaded.title,
          reason: `Documento anexado: ${uploaded.title}`,
        });
        submittedCount += 1;
        setCadastroFile(null);
      }

      if (fields.length > 0) {
        await Promise.all(
          fields.map((item) => transparencyService.submitChangeRequest(ngoId, {
            field_name: item.field_name,
            old_value: item.old,
            new_value: item.new,
            reason: 'Solicitação via painel de gestão da ONG.',
          })),
        );
        submittedCount += fields.length;
      }

      refreshChangeRequests();
      setCadastroMessage({
        type: 'success',
        text: `${submittedCount} solicitação(ões) enviada(s) para análise.`,
      });
    } catch (error) {
      setCadastroMessage({ type: 'error', text: error.message || 'Erro ao enviar solicitação.' });
    } finally {
      setCadastroLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      
      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-10 space-y-8">
        
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#FAF8F5] pb-2 border-b border-[#E5E2D9]/60">
          <div className="space-y-3 max-w-3xl">
            {/* Gestao Badge & CNPJ */}
            <div className="flex items-center space-x-3.5">
              <span className="bg-[#CBDDCD] text-[#0A3D36] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Painel de Gestão</span>
              </span>
              <span className="text-xs font-semibold text-gray-500">
                CNPJ: {ngoDetails?.cnpj || '—'}
              </span>
            </div>

            {/* NGO Title */}
            <h1 className="text-4xl font-extrabold text-[#0A3D36] tracking-tight">
              {ngoDetails?.name || ngoName}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
              Bem-vindo de volta, {user?.name || 'gestor'}. Aqui você pode gerenciar suas campanhas, monitorar doações e exportar relatórios de impacto.
            </p>
          </div>

          {/* Brand/Logo Card */}
          <div className="mt-6 md:mt-0 w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center p-3">
            <div className="w-full h-full bg-[#EAE8E3] rounded-lg flex flex-col items-center justify-center text-gray-400 font-bold text-xs uppercase tracking-tighter">
              <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center font-bold text-[10px]">
                {ngoInitials || 'ONG'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-6 border-b border-[#E5E2D9]/40 pb-1">
          {[
            { id: 'visao-geral', label: 'Visão Geral & Transparência' },
            { id: 'campanhas', label: 'Minhas Campanhas' },
            { id: 'relatorios', label: 'Relatórios' },
            { id: 'cadastro', label: 'Alterações Cadastrais' }
          ].map((subTab) => {
            const isActive = activeSubTab === subTab.id;
            return (
              <button
                key={subTab.id}
                onClick={() => handleTabChange(subTab.id)}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                  isActive 
                    ? 'text-[#0A665C] border-b-2 border-[#0A665C]' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {subTab.label}
              </button>
            );
          })}
        </div>

        {/* VIEW 1: Visão Geral & Transparência */}
        {activeSubTab === 'visao-geral' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-8">
            {/* Left Card - Transparência Pública */}
            <div className="bg-[#F5F2EC] rounded-[2rem] p-8 border border-[#E5E2D9] flex flex-col justify-between items-center text-center space-y-8">
              <div className="w-full">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-left mb-6">
                  Transparência Pública
                </h3>
                
                {/* Circular Dial Gauge */}
                <div className="relative w-44 h-44 flex items-center justify-center mx-auto my-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-[#E0DBD3]" strokeWidth="8.5" fill="transparent" />
                    <circle
                      cx="50" cy="50" r="40" className="stroke-[#0A665C]" strokeWidth="8.5" fill="transparent"
                      strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - ngoScore / 100)} strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-[#0A3D36]">{ngoScore}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">de 100</span>
                  </div>
                </div>
              </div>

              {/* Bottom details & Button */}
              <div className="w-full space-y-4">
                <p className="text-xs font-medium text-gray-500">
                  Última auditoria externa: <span className="font-bold text-gray-700">{lastAuditLabel}</span>
                </p>
                {financialData?.auditStatus && (
                  <p className="text-[10px] text-gray-400">Status: {financialData.auditStatus}</p>
                )}
                
                <button
                  type="button"
                  onClick={handleAuditRequest}
                  className="w-full bg-white hover:bg-gray-50 text-[#0A665C] font-bold py-3.5 px-6 rounded-2xl border border-[#EBE9E3] shadow-sm flex items-center justify-center space-x-2 text-sm transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Solicitar Atualização de Auditoria</span>
                </button>
              </div>
            </div>

            {/* Right Card - Campaign Progress card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
              {myCampaigns.length > 0 ? (() => {
                const topCampaign = myCampaigns[0];
                const percent = Math.min(Math.round((topCampaign.raisedAmount / topCampaign.targetAmount) * 100) || 0, 100);
                return (
                  <>
                    <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                      <img src={topCampaign.cover || genericImage} alt={topCampaign.name} className="w-full h-full object-cover" />
                      <span className="absolute top-6 left-6 bg-[#0A3D36] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                        {topCampaign.status === 'publicada' ? 'Ativa no Portal' : topCampaign.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold text-[#0A3D36]">{topCampaign.name}</h2>
                        <p className="text-gray-500 text-sm font-medium">Campanha atingindo {percent}% da meta.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="w-full bg-[#FAF8F5] rounded-full h-3 overflow-hidden border border-gray-100">
                          <div className="bg-[#0A665C] h-full rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-gray-700">
                            R$ {topCampaign.raisedAmount.toLocaleString('pt-BR')} de R$ {topCampaign.targetAmount.toLocaleString('pt-BR')}
                          </span>
                          <button 
                            onClick={() => {
                              setActiveSubTab('campanhas');
                              setCampaignTab('ativas');
                            }}
                            className="text-[#0A665C] hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Gerenciar Campanhas</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })() : (
                <div className="p-8 flex-grow flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="bg-[#F5F2EC] p-4 rounded-full text-[#0A665C]">
                    <PlusCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0A3D36]">Nenhuma Campanha</h2>
                  <p className="text-gray-500 text-sm">Crie sua primeira campanha para começar a arrecadar.</p>
                  <button 
                    onClick={() => {
                      setActiveSubTab('campanhas');
                      setCampaignTab('rascunhos');
                      handleOpenCreate();
                    }}
                    className="mt-4 bg-[#0A665C] hover:bg-[#08524a] text-white font-bold px-6 py-2.5 rounded-full flex items-center space-x-2 text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Criar Campanha</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: Minhas Campanhas */}
        {activeSubTab === 'campanhas' && (
          <div className="space-y-10">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-[#0A3D36]">Minhas Campanhas</h2>
                <p className="text-gray-500 text-xs mt-1.5">
                  Gerencie o impacto de {ngoDetails?.name || ngoName}. Acompanhe a arrecadação em tempo real e crie novas iniciativas.
                </p>
              </div>
              {!isCreatingCampaign && (
                <button 
                  onClick={handleOpenCreate}
                  className="bg-[#0A665C] hover:bg-[#08524a] text-white font-bold px-6 py-3 rounded-full flex items-center space-x-2 text-sm shadow-md transition-colors cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Criar Nova Campanha</span>
                </button>
              )}
            </div>

            {/* CREATE / EDIT FORM */}
            {isCreatingCampaign ? (
              <div className="bg-white rounded-[2.5rem] border border-gray-150 p-8 shadow-sm space-y-6 max-w-3xl">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-150 pb-4">
                  {editingCampaign ? 'Editar Campanha' : 'Criar Nova Campanha'}
                </h3>

                <form className="space-y-6">
                  {/* Basic fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome da Campanha</label>
                      <input 
                        type="text" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Reflorestamento de Encostas" 
                        className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Causa Relacionada</label>
                      <select
                        value={formCause}
                        onChange={(e) => setFormCause(e.target.value)}
                        className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]"
                      >
                        <option value="meio-ambiente">Meio ambiente</option>
                        <option value="educacao">Educação</option>
                        <option value="saude">Saúde</option>
                        <option value="direitos-humanos">Direitos humanos</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição do Objetivo</label>
                    <textarea 
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Descreva o propósito da campanha e qual será o impacto gerado..."
                      rows="3" 
                      className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meta de Arrecadação (R$)</label>
                      <input 
                        type="number" 
                        value={formTarget}
                        onChange={(e) => setFormTarget(e.target.value)}
                        placeholder="Ex: 50000" 
                        className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prazo de Duração (dias)</label>
                      <input 
                        type="number" 
                        value={formDays}
                        onChange={(e) => setFormDays(e.target.value)}
                        placeholder="Ex: 30" 
                        className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requisitos da Campanha</label>
                      <input 
                        type="text" 
                        value={formRequirements}
                        onChange={(e) => setFormRequirements(e.target.value)}
                        placeholder="Ex: Laudo e autorizações prévias" 
                        className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destino dos Recursos</label>
                      <input 
                        type="text" 
                        value={formDestination}
                        onChange={(e) => setFormDestination(e.target.value)}
                        placeholder="Ex: Aquisição de mudas e insumos de plantio" 
                        className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]" 
                      />
                    </div>
                  </div>



                  {/* Actions buttons */}
                  <div className="flex justify-end space-x-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsCreatingCampaign(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-bold text-xs"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleSaveCampaign('rascunho')}
                      className="bg-[#FAF2E8] hover:bg-[#ebdcc8] text-[#8C6D3F] py-3 px-6 rounded-full font-bold text-xs"
                    >
                      Salvar como Rascunho
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleSaveCampaign('em-revisao')}
                      className="bg-[#0A665C] hover:bg-[#08524a] text-white py-3 px-6 rounded-full font-bold text-xs"
                    >
                      Solicitar Publicação
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Campaign sub-sub-tabs selection */}
                <div className="flex space-x-6 border-b border-gray-100 pb-1">
                  {[
                    { id: 'ativas', label: 'Ativas' },
                    { id: 'rascunhos', label: 'Rascunhos & Em Revisão' },
                    { id: 'encerradas', label: 'Encerradas' },
                    { id: 'arquivadas', label: 'Arquivadas' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCampaignTab(tab.id)}
                      className={`pb-3 text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
                        campaignTab === tab.id ? 'text-[#0A665C] border-b-2 border-[#0A665C]' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Campaigns List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...myCampaigns, ...myBundles.map(b => ({ ...b, isBundle: true, status: 'publicada' }))]
                    .filter(c => {
                      if (campaignTab === 'ativas') return c.status === 'publicada' || c.status === 'aprovada';
                      if (campaignTab === 'rascunhos') return c.status === 'rascunho' || c.status === 'em-revisao' || c.status === 'recusada';
                      if (campaignTab === 'encerradas') return c.status === 'encerrada';
                      if (campaignTab === 'arquivadas') return c.status === 'arquivada';
                      return false;
                    })
                    .map(campaign => {
                      const progressPercent = Math.min(Math.round((campaign.raisedAmount / campaign.targetAmount) * 100) || 0, 100);
                      const isMenuOpen = menuOpenCampaignId === campaign.id;
                      
                      return (
                        <div 
                          key={campaign.id} 
                          className="bg-white rounded-[2rem] border border-gray-150 shadow-sm overflow-hidden flex flex-col md:flex-row relative"
                        >
                          {/* Left Cover Image */}
                          <div className="relative w-full md:w-44 h-48 md:h-auto shrink-0 bg-gray-150">
                            <img src={campaign.cover || genericImage} alt={campaign.name} className="w-full h-full object-cover" />
                            
                            {/* Badges for status */}
                            <div className="absolute top-4 left-4 flex flex-col space-y-1">
                              {campaign.isBundle && (
                                <span className="bg-[#6B21A8] text-white text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider w-fit">
                                  COLETIVO (BUNDLE)
                                </span>
                              )}
                              <span className="bg-gray-900/80 text-white text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider w-fit">
                                {campaign.status === 'em-revisao' && 'EM REVISÃO'}
                                {campaign.status === 'rascunho' && 'RASCUNHO'}
                                {campaign.status === 'publicada' && 'EM PROGRESSO'}
                                {campaign.status === 'recusada' && 'RECUSADA'}
                                {campaign.status === 'encerrada' && 'CONCLUÍDA'}
                                {campaign.status === 'arquivada' && 'ARQUIVADA'}
                              </span>
                            </div>
                          </div>

                          {/* Campaign details */}
                          <div className="p-6 flex flex-col justify-between flex-grow space-y-4 relative">
                            {/* Alert for administrative review validation */}
                            {campaign.status === 'em-revisao' && (
                              <div className="bg-amber-50 text-amber-800 text-[9px] font-bold px-2 py-1 rounded border border-amber-100 flex items-center space-x-1 w-fit">
                                <Info className="w-3 h-3 text-amber-700" />
                                <span>Depende de validação administrativa</span>
                              </div>
                            )}

                            <div className="space-y-1">
                              <h3 className="text-base font-extrabold text-gray-900 leading-tight pr-6">{campaign.name}</h3>
                              <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2">
                                {campaign.description}
                              </p>
                            </div>

                            {/* Matchfunding indicators */}
                            {campaign.matchMultiplier > 1 && (
                              <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-100 text-[9px] font-semibold space-y-0.5">
                                <div className="flex items-center space-x-1">
                                  <Percent className="w-3 h-3 text-emerald-600" />
                                  <span className="font-extrabold">Matchfunding {campaign.matchMultiplier}x ativo</span>
                                </div>
                                <p className="text-gray-500 font-medium">Parceiro: {campaign.matchSponsor} (Teto: R$ {campaign.matchCap?.toLocaleString('pt-BR')})</p>
                              </div>
                            )}

                            {/* Progress bar info */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-end text-[10px] font-bold">
                                <span className="text-[#0A665C] font-extrabold">{progressPercent}%</span>
                                <span className="text-gray-400 uppercase tracking-widest">META: R$ {campaign.targetAmount.toLocaleString('pt-BR')}</span>
                              </div>
                              <div className="w-full bg-gray-150 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-[#0A665C] h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                              </div>
                              <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                <span>R$ {campaign.raisedAmount.toLocaleString('pt-BR')} arrecadados</span>
                                <span>{campaign.daysLeft} dias restantes</span>
                              </div>
                            </div>

                            {/* Action links & Action menu ••• */}
                            <div className="flex items-center justify-between pt-1">
                              {campaign.isBundle ? (
                                <span className="text-xs font-bold text-gray-400">Edição via Admin</span>
                              ) : (
                                <button 
                                  onClick={() => handleOpenEdit(campaign)}
                                  className="text-xs font-bold text-[#0A665C] hover:underline"
                                >
                                  Editar
                                </button>
                              )}

                              <div className="relative">
                                <button 
                                  onClick={() => setMenuOpenCampaignId(isMenuOpen ? null : campaign.id)}
                                  disabled={campaign.isBundle}
                                  className={`border border-gray-200 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-2xs ${campaign.isBundle ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                                >
                                  Ações •••
                                </button>

                                {isMenuOpen && (
                                  <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20">
                                    {campaign.status === 'rascunho' && (
                                      <button 
                                        onClick={() => handleChangeStatus(campaign.id, 'em-revisao')}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition text-left"
                                      >
                                        <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
                                        <span>Solicitar Publicação</span>
                                      </button>
                                    )}
                                    {campaign.status === 'publicada' && (
                                      <button 
                                        onClick={() => handleChangeStatus(campaign.id, 'encerrada')}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition text-left font-bold"
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>Encerrar Campanha</span>
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => handleDuplicate(campaign)}
                                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition text-left"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                                      <span>Duplicar Iniciativa</span>
                                    </button>
                                    {campaign.status !== 'arquivada' && (
                                      <button 
                                        onClick={() => handleChangeStatus(campaign.id, 'arquivada')}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition text-left"
                                      >
                                        <Archive className="w-3.5 h-3.5 text-gray-400" />
                                        <span>Arquivar</span>
                                      </button>
                                    )}
                                    {campaign.status === 'arquivada' && (
                                      <button 
                                        onClick={() => handleChangeStatus(campaign.id, 'rascunho')}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition text-left"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                                        <span>Restaurar Rascunho</span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>

                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        )}

        {/* VIEW 3: Relatórios */}
        {activeSubTab === 'relatorios' && (
          <div className="space-y-8">
            
            {/* Header info panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-5 gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{ngoDetails?.name || ngoName}</h3>
                <div className="flex items-center space-x-3.5 mt-1">
                  <span className="bg-[#CBDDCD] text-[#0A3D36] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    CNPJ Ativo
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">{ngoDetails?.cnpj || '—'}</span>
                </div>
              </div>
            </div>

            {/* Layout Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">
              
              {/* Left Panel - Export configuration */}
              <div className="bg-[#FAF8F5] border border-gray-150 rounded-[2rem] p-8 shadow-[0_1px_8px_rgba(0,0,0,0.01)] space-y-6">
                <div>
                  <h4 className="text-base font-bold text-gray-900">Configurar Exportação de PDF</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Personalize os dados que serão compilados no seu relatório editorial.
                  </p>
                </div>

                {/* Period selector */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Seletor de Período
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPeriod('30-days')}
                      className={`flex items-center space-x-3 p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-white ${
                        period === '30-days' ? 'border-[#0A665C] shadow-sm' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                        period === '30-days' ? 'border-[#0A665C]' : 'border-gray-300'
                      }`}>
                        {period === '30-days' && <div className="w-2.5 h-2.5 rounded-full bg-[#0A665C]" />}
                      </div>
                      <span className="text-gray-800">Últimos 30 dias</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPeriod('3-months')}
                      className={`flex items-center space-x-3 p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-white ${
                        period === '3-months' ? 'border-[#0A665C] shadow-sm' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                        period === '3-months' ? 'border-[#0A665C]' : 'border-gray-300'
                      }`}>
                        {period === '3-months' && <div className="w-2.5 h-2.5 rounded-full bg-[#0A665C]" />}
                      </div>
                      <span className="text-gray-800">Últimos 3 meses</span>
                    </button>
                  </div>
                </div>

                {/* Checklist options */}
                <div className="space-y-3 pt-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Dados a serem incluídos
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Option 1 */}
                    <button
                      type="button"
                      onClick={() => setIncludeFinance(!includeFinance)}
                      className={`flex items-start text-left p-4 bg-white border rounded-xl transition-all cursor-pointer ${
                        includeFinance ? 'border-[#0A665C]' : 'border-gray-150 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center mr-3 mt-0.5 shrink-0 ${
                        includeFinance ? 'bg-[#0A665C] border-[#0A665C] text-white' : 'border-gray-300'
                      }`}>
                        {includeFinance && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">Resumo Financeiro</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Entradas, saídas e balanço geral</p>
                      </div>
                    </button>

                    {/* Option 2 */}
                    <button
                      type="button"
                      onClick={() => setIncludeDonors(!includeDonors)}
                      className={`flex items-start text-left p-4 bg-white border rounded-xl transition-all cursor-pointer ${
                        includeDonors ? 'border-[#0A665C]' : 'border-gray-150 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center mr-3 mt-0.5 shrink-0 ${
                        includeDonors ? 'bg-[#0A665C] border-[#0A665C] text-white' : 'border-gray-300'
                      }`}>
                        {includeDonors && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">Doadores</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Fidelidade e novos ingressos</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIncludeCampaigns(!includeCampaigns)}
                      className={`flex items-start text-left p-4 bg-white border rounded-xl transition-all cursor-pointer ${
                        includeCampaigns ? 'border-[#0A665C]' : 'border-gray-150 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center mr-3 mt-0.5 shrink-0 ${
                        includeCampaigns ? 'bg-[#0A665C] border-[#0A665C] text-white' : 'border-gray-300'
                      }`}>
                        {includeCampaigns && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">Campanhas</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Arrecadação e campanhas ativas</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIncludeCnpj(!includeCnpj)}
                      className={`flex items-start text-left p-4 bg-white border rounded-xl transition-all cursor-pointer ${
                        includeCnpj ? 'border-[#0A665C]' : 'border-gray-150 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center mr-3 mt-0.5 shrink-0 ${
                        includeCnpj ? 'bg-[#0A665C] border-[#0A665C] text-white' : 'border-gray-300'
                      }`}>
                        {includeCnpj && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">Dados Cadastrais</h5>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">CNPJ e identificação da ONG</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Export button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleExportReport}
                    disabled={exportLoading || !ngoId}
                    className="w-full bg-[#0A665C] hover:bg-[#08524a] disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2.5 text-sm shadow-md transition-colors cursor-pointer"
                  >
                    <FileDown className="w-5 h-5" />
                    <span>{exportLoading ? 'Gerando PDF...' : 'Exportar Relatório PDF'}</span>
                  </button>
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    O relatório é gerado com dados reais da plataforma e baixado em PDF.
                  </p>
                </div>
              </div>

              {/* Right Panel - History & Score info */}
              <div className="space-y-8">
                {/* File History panel */}
                <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-6">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-bold text-gray-900">Histórico</h4>
                      <div className="flex items-center space-x-2">
                        {reports.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearReportHistory}
                            disabled={clearHistoryLoading}
                            className="flex items-center space-x-1.5 text-[10px] font-bold text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{clearHistoryLoading ? 'Limpando...' : 'Limpar histórico'}</span>
                          </button>
                        )}
                        <History className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reports.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4">
                          Nenhum relatório gerado ainda. Use o botão de exportação para criar o primeiro.
                        </p>
                      ) : (
                        reports.map((doc) => (
                          <div key={doc.id} className="flex justify-between items-center p-3 bg-[#FAF8F5] rounded-xl border border-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 bg-[#DDF3E8] text-[#0A665C] rounded-lg flex items-center justify-center shrink-0">
                                <FileText className="w-4.5 h-4.5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-800">{doc.title}</div>
                                <div className="text-[9px] font-bold text-gray-400 mt-0.5 tracking-wider">
                                  GERADO EM {formatReportDate(doc.generatedAt)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] font-semibold text-gray-400 uppercase hidden sm:inline">
                                {doc.periodLabel || doc.period}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDownloadReport(doc.id)}
                                disabled={!doc.hasPdf || downloadingReportId === doc.id}
                                title={doc.hasPdf ? 'Baixar PDF' : 'PDF indisponível'}
                                className="p-2 text-[#0A665C] hover:bg-[#EAE8E3] rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Score badge card */}
                <div className="bg-[#FAF8F5] border border-gray-150 p-6 rounded-2xl flex items-center space-x-6">
                  {/* Small progress score dial */}
                  <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-[#EAE8E3]" strokeWidth="10" fill="transparent" />
                      <circle
                        cx="50" cy="50" r="40" className="stroke-[#0A665C]" strokeWidth="10" fill="transparent"
                        strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - ngoScore / 100)} strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-base font-extrabold text-[#0A3D36]">{ngoScore}</span>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Impacto & Transparência</h5>
                    <h6 className="text-xs font-bold text-gray-900 mt-0.5">Score de Confiança</h6>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      Sua ONG possui {ngoScore} pontos nos critérios de verificação automatizada.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 5: Alterações Cadastrais */}
        {activeSubTab === 'cadastro' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 animate-fadeIn">
            {/* Form */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">Solicitar Alteração Cadastral</h3>
                <p className="text-xs text-gray-400">
                  Envie novas informações cadastrais para revisão administrativa. As alterações serão publicadas após validação dos documentos pela equipe do ONG+.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleCadastroSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Razão Social</label>
                    <input
                      type="text"
                      value={cadastroName}
                      onChange={(e) => setCadastroName(e.target.value)}
                      placeholder="Razão social da organização"
                      className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome Fantasia / Público</label>
                    <input
                      type="text"
                      value={cadastroFantasy}
                      onChange={(e) => setCadastroFantasy(e.target.value)}
                      placeholder="Nome público da ONG"
                      className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endereço Principal / Sede</label>
                  <input
                    type="text"
                    value={cadastroLocation}
                    onChange={(e) => setCadastroLocation(e.target.value)}
                    placeholder="Cidade, UF"
                    className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição Institucional</label>
                  <textarea
                    rows="4"
                    value={cadastroDescription}
                    onChange={(e) => setCadastroDescription(e.target.value)}
                    placeholder="Descrição institucional da ONG"
                    className="w-full bg-[#FAF8F5] border-none rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#0A665C]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="cadastro-pdf" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Documento Comprovatório (PDF)
                  </label>
                  <label
                    htmlFor="cadastro-pdf"
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition block"
                  >
                    <UploadCloud className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    {cadastroFile ? (
                      <>
                        <span className="text-xs font-bold text-[#0A665C] block">{cadastroFile.name}</span>
                        <span className="text-[10px] text-gray-400">
                          {(cadastroFile.size / (1024 * 1024)).toFixed(2)} MB — clique para trocar o arquivo
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-gray-500 block">Clique para anexar um PDF</span>
                        <span className="text-[10px] text-gray-400">Máximo 10 MB. Estatuto, ata ou outro comprovante cadastral.</span>
                      </>
                    )}
                  </label>
                  <input
                    id="cadastro-pdf"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={handleCadastroFileChange}
                  />
                </div>

                {cadastroMessage && (
                  <p className={`text-xs font-medium ${cadastroMessage.type === 'success' ? 'text-[#0A665C]' : 'text-red-600'}`}>
                    {cadastroMessage.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={cadastroLoading}
                  className="bg-[#0A665C] hover:bg-[#08524a] disabled:opacity-60 text-white py-3.5 px-6 rounded-full font-bold text-xs tracking-wider transition-colors cursor-pointer"
                >
                  {cadastroLoading ? 'Enviando...' : 'Enviar para Análise'}
                </button>
              </form>
            </div>

            {/* Request feedback section */}
            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-6">
                <h4 className="text-sm font-bold text-gray-900">Histórico de Solicitações</h4>
                
                <div className="space-y-4">
                  {changeRequests.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Nenhuma solicitação cadastral registrada.
                    </p>
                  ) : (
                    changeRequests.map((req) => {
                      const style = CHANGE_STATUS_STYLES[req.status] || CHANGE_STATUS_STYLES.pending;
                      return (
                        <div key={req.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-50 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-900">{req.field}</span>
                            <span className={`text-[9px] font-extrabold border px-2 py-0.5 rounded-full uppercase tracking-wider ${style.color}`}>
                              {style.label}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-semibold">
                            Solicitado em: {formatChangeDate(req.createdAt)}
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium leading-relaxed bg-white p-2 rounded-lg border border-gray-100/50">
                            {req.justification || req.reason || '—'}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer onNavigate={onNavigate} />

    </div>
  );
}
