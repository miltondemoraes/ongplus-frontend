import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Scale, 
  Building2,
  Loader2,
  FileText
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

// Novos componentes dinâmicos do módulo
import { useTransparency } from '../hooks/useTransparency';
import CampaignHistoryTable from '../components/transparency/CampaignHistoryTable';
import ChangeHistoryTimeline from '../components/transparency/ChangeHistoryTimeline';
import ChangeRequestForm from '../components/transparency/ChangeRequestForm';
import FeedbackPanel from '../components/transparency/FeedbackPanel';
import DataSourceCard from '../components/transparency/DataSourceCard';
import ConsistencyPanel from '../components/transparency/ConsistencyPanel';
import ValidationActions from '../components/transparency/ValidationActions';
import VerificationStatus from '../components/transparency/VerificationStatus';

function getScoreLabel(score) {
  if (score >= 90) return 'Excelência A+';
  if (score >= 75) return 'Excelente';
  if (score >= 50) return 'Bom';
  return 'Em desenvolvimento';
}

const VERIFICATION_STATUS_LABELS = {
  verified: 'Sem Ressalvas',
  analysis: 'Em Análise',
  pending: 'Pendente',
  inconsistent: 'Inconsistência Detectada',
};

export default function NgoTransparencyPage({ ong, onNavigate }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'DONOR';

  const ongId = ong?.id;
  const {
    data,
    loading,
    error,
    submitChangeRequest,
    approveRequest,
    rejectRequest
  } = useTransparency(ongId);

  const apiScore = data.verification?.criteria?.score ?? data.profile?.score ?? ong?.score ?? 0;
  const apiVerified = data.verification?.status === 'verified' || ong?.verified;

  const verificationStatus = data.verification?.status;
  const resolvedOng = {
    name: data.profile?.name || ong?.name || '—',
    cnpj: data.profile?.cnpj || ong?.cnpj || '',
    location: data.profile?.location || ong?.location || '',
    operatingSince: data.profile?.yearsOperating
      ? `${data.profile.yearsOperating} anos de operação`
      : (ong?.operatingSince || '—'),
    score: apiScore,
    scoreLabel: getScoreLabel(apiScore),
    budgetUtilization: data.financial?.budgetUtilization ?? ong?.budgetUtilization ?? 0,
    lastAudit: data.financial?.lastAudit
      || data.profile?.lastExternalAudit
      || ong?.lastExternalAudit
      || '—',
    auditStatus: data.financial?.auditStatus
      || VERIFICATION_STATUS_LABELS[verificationStatus]
      || '—',
    verified: apiVerified,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#0A665C] animate-spin" />
          <p className="text-gray-500 font-medium">Carregando dados de transparência...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-bold">{error}</p>
          <button 
            onClick={() => onNavigate && onNavigate('ong-profile', ong)}
            className="text-[#0A665C] hover:underline font-medium cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      
      <div className="max-w-7xl w-full mx-auto px-8 md:px-16 pt-6">
        <button 
          onClick={() => onNavigate && onNavigate('ong-profile', ong)}
          className="flex items-center space-x-2 text-gray-500 hover:text-[#0A665C] transition font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Perfil</span>
        </button>
      </div>

      {/* Container Principal */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-8 md:px-16 py-10 space-y-12">


        {/* Bloco Superior: Título + Badge + Score Dial */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-4 max-w-3xl">
            <span className="bg-[#E4F2EE] text-[#0A665C] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1.5 w-fit border border-[#0A665C]/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{resolvedOng.verified ? 'Organização Verificada' : 'Verificação em Andamento'}</span>
            </span>

            <h1 className="text-5xl font-extrabold text-[#0A3D36] tracking-tight leading-none">
              {resolvedOng.name}
            </h1>

            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl font-medium pt-1">
              Transparência radical não é um objetivo — é nossa base. Revise nossa situação jurídica verificada, financeiras auditadas e histórico operacional.
            </p>
          </div>

          {/* Dial Score */}
          <div className="flex items-center space-x-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] shrink-0 self-stretch lg:self-auto justify-between md:justify-start">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-[#EBE9E3]" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50" cy="50" r="40" className="stroke-[#0A665C]" strokeWidth="8" fill="transparent"
                  strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - resolvedOng.score / 100)} strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-[#0A3D36]">{resolvedOng.score}</span>
                <span className="text-[6px] font-bold text-gray-400 uppercase tracking-widest">Score de Confiança</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0A665C] flex items-center space-x-1 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{resolvedOng.scoreLabel}</span>
              </span>
              <p className="text-[10px] text-gray-400 max-w-[120px] font-medium leading-tight">
                Score calculado com base em CNPJ ativo, endereço validado e tempo de atuação.
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Informações de Transparência Visual Antigo preservado */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          
          {/* Coluna da Esquerda */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Registro de Identidade</h3>
                <Building2 className="w-4 h-4 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 items-center">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">CNPJ</span>
                    <span className="text-sm font-extrabold text-[#0A3D36]">{resolvedOng.cnpj}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Em operação desde</span>
                    <span className="text-sm font-extrabold text-[#0A3D36]">{resolvedOng.operatingSince}</span>
                  </div>
                </div>

                <div className="relative h-44 rounded-2xl overflow-hidden border border-gray-100 bg-[#EAE8E3]/35 flex flex-col justify-end">
                  <svg className="absolute inset-0 w-full h-full text-gray-300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <path d="M -10,30 L 300,70 M 50,-10 L 120,200 M 150,-20 L 80,200 M -20,120 L 300,100 M 10,160 L 250,140" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M -10,30 L 300,70 M 50,-10 L 120,200 M 150,-20 L 80,200" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="95" cy="115" r="8" fill="rgba(10, 102, 92, 0.15)" />
                    <circle cx="95" cy="115" r="4" fill="#0A665C" />
                  </svg>
                  <div className="relative m-3 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md border border-gray-100 max-w-[190px]">
                    <span className="text-[8px] font-bold text-[#0A665C] uppercase tracking-wider block">Sede</span>
                    <span className="text-[10px] font-bold text-gray-700 leading-tight block mt-0.5">{resolvedOng.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status de Conformidade</h3>
                  <Scale className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {(data.verification?.evidenceList || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                      <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider ${
                          item.status === 'success'
                            ? 'bg-[#E4F2EE] text-[#0A665C] border border-[#0A665C]/10'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                        {item.status?.toUpperCase()}
                      </span>
                    </div>
                  ))}
                  {(!data.verification?.evidenceList || data.verification.evidenceList.length === 0) && (
                    <p className="text-xs text-gray-400">Dados de conformidade não disponíveis.</p>
                  )}
                </div>
              </div>

              <div className="bg-[#0A3D36] text-white rounded-[2rem] p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A665C]/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500" />
                <div className="w-10 h-10 bg-[#0A665C]/35 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-teal-300" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold tracking-tight">Verificação Cadastral</h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {apiVerified
                      ? 'Verificação concluída sem inconsistências detectadas pela plataforma ONG+.'
                      : 'Verificação em andamento. Consulte os registros públicos para validar a situação cadastral.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const cnpjClean = resolvedOng.cnpj.replace(/\D/g, '');
                    window.open(
                      `https://servicos.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp?cnpj=${cnpjClean}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                  className="w-full bg-[#0A665C] hover:bg-[#08524a] text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-md border border-white/5 cursor-pointer text-center"
                >
                  Verificar Registros Públicos
                </button>
              </div>
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Saúde Financeira</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Utilização Orçamentária</span>
                  <span className="text-sm font-extrabold text-[#0A665C]">{resolvedOng.budgetUtilization}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#0A665C] h-full rounded-full transition-all duration-1000" style={{ width: `${resolvedOng.budgetUtilization}%` }} />
                </div>
                <p className="text-[9px] text-gray-400 italic">Eficiência operacional vs. gasto programático.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-50">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Última Auditoria</span>
                  <span className="text-xs font-extrabold text-gray-700 block mt-1">{resolvedOng.lastAudit}</span>
                </div>
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-50">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Status</span>
                  <span className="text-xs font-extrabold text-[#0A665C] block mt-1 tracking-wider">{resolvedOng.auditStatus}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F2EC]/40 rounded-[2rem] p-8 border border-[#E5E2D9]/40 space-y-4">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Documentos Públicos</h3>
              
              {data.documents && data.documents.length > 0 ? (
                <div className="space-y-3">
                  {data.documents.map((doc) => (
                    <a 
                      key={doc.id}
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-4 hover:border-[#0A665C]/30 hover:shadow-md transition group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] group-hover:bg-[#E4F2EE] flex items-center justify-center text-gray-400 group-hover:text-[#0A665C] transition">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-bold text-[#0A3D36]">{doc.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{doc.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-gray-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    Nenhum documento publicado pela organização.
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Relatórios e demonstrativos aparecerão aqui quando a ONG disponibilizá-los.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Novas seções integradas do módulo de transparência */}
        <div className="space-y-8">
          {data.verification && (
            <VerificationStatus verification={data.verification} />
          )}

          {/* Histórico e Campanhas acessíveis para todos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CampaignHistoryTable campaigns={data.campaigns} />
            <ChangeHistoryTimeline history={data.changeHistory} />
          </div>

          {/* Renderização Condicional baseada na Persona (Role) */}
          {role === 'NGO' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 bg-teal-50/50 p-8 rounded-[3rem] border border-teal-100">
              <div className="col-span-full">
                <h2 className="text-2xl font-extrabold text-[#0A3D36]">Área da Organização</h2>
                <p className="text-teal-700 text-sm font-medium">Gerencie suas informações e acompanhe aprovações.</p>
              </div>
              <ChangeRequestForm onSubmit={submitChangeRequest} />
              <FeedbackPanel requests={data.pendingRequests} />
            </div>
          )}

          {role === 'ADMIN' && (
            <div className="grid grid-cols-1 gap-8 mt-12 bg-[#0B0F19] p-8 rounded-[3rem] border border-gray-800">
              <div className="col-span-full mb-4">
                <h2 className="text-2xl font-extrabold text-white">Painel de Auditoria</h2>
                <p className="text-gray-400 text-sm font-medium">Validação de dados e integração de fontes governamentais.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <DataSourceCard sources={data.dataSources} />
                  <ConsistencyPanel verification={data.verification} score={resolvedOng.score} />
                </div>
                <div>
                  <ValidationActions 
                    requests={data.pendingRequests} 
                    onApprove={approveRequest}
                    onReject={rejectRequest}
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'DONOR' && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => onNavigate && onNavigate('/doacao')}
                className="bg-[#0A665C] hover:bg-[#08524A] text-white font-extrabold text-lg px-12 py-5 rounded-full transition shadow-xl hover:scale-105 hover:shadow-2xl uppercase tracking-widest cursor-pointer"
              >
                Apoiar esta ONG Agora
              </button>
            </div>
          )}
        </div>

        {/* Banner Inferior: The Ethical Commitment */}
        <section className="bg-[#FAF8F5] border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)] rounded-[2.5rem] p-10 md:p-14 text-center max-w-5xl mx-auto space-y-4">
          <h2 className="text-2xl font-extrabold text-[#0A3D36] tracking-tight">
            Compromisso Ético
          </h2>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-3xl mx-auto">
            Nossa política de "Livro Aberto" garante que cada centavo doado para {resolvedOng.name} seja rastreável. Utilizamos auditorias independentes de terceiros para validar nossos dados de impacto, assegurando que sua contribuição gere a mudança esperada.
          </p>
        </section>

      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

    </div>
  );
}
