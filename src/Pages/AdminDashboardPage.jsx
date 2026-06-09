import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Building2,
  Megaphone,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Trash2,
  RefreshCw,
  Plus,
  Ban,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

const TABS = [
  { id: 'revisao', label: 'Revisão', icon: Shield },
  { id: 'ongs', label: 'ONGs', icon: Building2 },
  { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
  { id: 'bundles', label: 'Bundles', icon: Package },
];

const NGO_STATUS_LABELS = {
  verified: { label: 'Verificada', color: 'bg-[#CBDDCD] text-[#0A3D36]' },
  analysis: { label: 'Em análise', color: 'bg-amber-100 text-amber-800' },
  pending: { label: 'Pendente', color: 'bg-gray-100 text-gray-700' },
  inconsistent: { label: 'Inconsistente', color: 'bg-red-50 text-red-700' },
};

const CAMPAIGN_STATUS_LABELS = {
  'rascunho': { label: 'Rascunho', color: 'bg-gray-100 text-gray-600' },
  'em-revisao': { label: 'Em revisão', color: 'bg-amber-100 text-amber-800' },
  'aprovada': { label: 'Aprovada', color: 'bg-blue-50 text-blue-700' },
  'publicada': { label: 'Publicada', color: 'bg-[#CBDDCD] text-[#0A3D36]' },
  'recusada': { label: 'Recusada', color: 'bg-red-50 text-red-700' },
  'encerrada': { label: 'Encerrada', color: 'bg-gray-200 text-gray-600' },
  'arquivada': { label: 'Arquivada', color: 'bg-gray-200 text-gray-500' },
};

const CAUSES = [
  { value: 'meio-ambiente', label: 'Meio ambiente' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'direitos-humanos', label: 'Direitos humanos' },
];

function StatusBadge({ status, map }) {
  const cfg = map[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function MessageBanner({ message, type = 'info' }) {
  if (!message) return null;
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-[#CBDDCD] border-[#0A665C]/20 text-[#0A3D36]',
    error: 'bg-red-50 border-red-200 text-red-700',
  };
  return (
    <div className={`mb-4 px-4 py-3 rounded-xl border text-sm font-medium ${colors[type]}`}>
      {message}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('revisao');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const [reviewNgos, setReviewNgos] = useState([]);
  const [reviewCampaigns, setReviewCampaigns] = useState([]);
  const [allNgos, setAllNgos] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [scoreCriteria, setScoreCriteria] = useState([]);

  const [expandedNgo, setExpandedNgo] = useState(null);
  const [ngoDocuments, setNgoDocuments] = useState({});
  const [scoreEdits, setScoreEdits] = useState({});

  const [bundleForm, setBundleForm] = useState({
    name: '', cause: 'meio-ambiente', description: '', targetAmount: '',
    matchMultiplier: '1', matchSponsor: '',
  });
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [addNgoId, setAddNgoId] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rNgos, rCamps, ngos, camps, bndls, criteria] = await Promise.all([
        adminService.listReviewNgos(),
        adminService.listReviewCampaigns(),
        adminService.listNgos(),
        adminService.listCampaigns(),
        adminService.listBundles(),
        adminService.getScoreCriteria(),
      ]);
      setReviewNgos(rNgos || []);
      setReviewCampaigns(rCamps || []);
      setAllNgos(ngos || []);
      setAllCampaigns(camps || []);
      setBundles(bndls || []);
      setScoreCriteria(criteria || []);
      const edits = {};
      (ngos || []).forEach((n) => { edits[n.id] = n.score ?? 0; });
      setScoreEdits(edits);
    } catch (err) {
      showMessage(err.message || 'Erro ao carregar dados.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const loadDocuments = async (ngoId) => {
    if (ngoDocuments[ngoId]) return;
    try {
      const docs = await adminService.getNgoDocuments(ngoId);
      setNgoDocuments((prev) => ({ ...prev, [ngoId]: docs }));
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const toggleNgoExpand = (ngoId) => {
    if (expandedNgo === ngoId) {
      setExpandedNgo(null);
    } else {
      setExpandedNgo(ngoId);
      loadDocuments(ngoId);
    }
  };

  const withAction = async (key, fn) => {
    setActionLoading(key);
    try {
      await fn();
      await loadData();
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleNgoVerification = (ngoId, status) =>
    withAction(`ngo-verify-${ngoId}`, () => adminService.updateNgoVerification(ngoId, status));

  const handleNgoScore = (ngoId) =>
    withAction(`ngo-score-${ngoId}`, () => adminService.updateNgoScore(ngoId, Number(scoreEdits[ngoId])));

  const handleNgoValidate = async (ngoId) => {
    setActionLoading(`ngo-validate-${ngoId}`);
    try {
      const result = await adminService.validateNgo(ngoId);
      const v = result.validation || {};
      const cnpjOk  = v.cnpj_ativo  ? '✅ CNPJ Ativo (+50 pts)' : '❌ CNPJ Inativo (0 pts)';
      const addrOk  = v.endereco_valido ? '✅ Endereço Consistente (+25 pts)' : '❌ Endereço Inconsistente (0 pts)';
      const yearsOk = (v.anos_atuacao ?? 0) >= 5 ? `✅ ${v.anos_atuacao} anos de atividade (+25 pts)` : `⚠️ ${v.anos_atuacao ?? 0} anos (< 5 anos, 0 pts)`;
      const score = v.score ?? result.ngo?.score ?? '?';
      showMessage(
        `CNPJ validado. Score calculado: ${score}/100 — ${cnpjOk} | ${addrOk} | ${yearsOk}`,
        v.cnpj_ativo ? 'success' : 'error'
      );
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleNgoDelete = (ngoId, name) => {
    if (!window.confirm(`Excluir permanentemente a ONG "${name}" e sua conta de usuário?`)) return;
    withAction(`ngo-delete-${ngoId}`, () => adminService.deleteNgo(ngoId));
  };

  const handleCampaignReview = (id, status) =>
    withAction(`camp-review-${id}`, () => adminService.reviewCampaign(id, status));

  const handleCampaignEnd = (id) => {
    if (!window.confirm('Encerrar esta campanha?')) return;
    withAction(`camp-end-${id}`, () => adminService.endCampaign(id));
  };

  const handleCreateBundle = (e) => {
    e.preventDefault();
    withAction('bundle-create', () => adminService.createBundle({
      name: bundleForm.name,
      cause: bundleForm.cause,
      description: bundleForm.description,
      targetAmount: Number(bundleForm.targetAmount) || 0,
      matchMultiplier: Number(bundleForm.matchMultiplier) || 1,
      matchSponsor: bundleForm.matchSponsor,
    }).then(() => {
      setBundleForm({ name: '', cause: 'meio-ambiente', description: '', targetAmount: '', matchMultiplier: '1', matchSponsor: '' });
    }));
  };

  const handleAddNgoToBundle = (bundleId) => {
    if (!addNgoId) return;
    withAction(`bundle-add-${bundleId}`, () => adminService.addNgoToBundle(bundleId, addNgoId).then(() => setAddNgoId('')));
  };

  const handleRemoveNgoFromBundle = (bundleId, ngoId) =>
    withAction(`bundle-rm-${bundleId}-${ngoId}`, () => adminService.removeNgoFromBundle(bundleId, ngoId));

  const handleEndBundle = (bundleId) => {
    if (!window.confirm('Encerrar este bundle coletivo?')) return;
    withAction(`bundle-end-${bundleId}`, () => adminService.endBundle(bundleId));
  };

  const verifiedNgos = allNgos.filter((n) => n.verified);

  const renderNgoCard = (ngo, showReviewActions = false) => {
    const isExpanded = expandedNgo === ngo.id;
    const docs = ngoDocuments[ngo.id] || [];
    const verification = ngo.verification;

    return (
      <div key={ngo.id} className="bg-white rounded-2xl border border-[#E5E2D9] p-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">{ngo.name}</h3>
            <p className="text-sm text-gray-500">{ngo.cnpj} · {ngo.location}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={ngo.verification?.status || (ngo.verified ? 'verified' : 'pending')} map={NGO_STATUS_LABELS} />
              <span className="text-xs text-gray-500">Score: <strong>{ngo.score}</strong></span>
            </div>
          </div>
          <button
            onClick={() => toggleNgoExpand(ngo.id)}
            className="flex items-center gap-1 text-xs font-bold text-[#0A665C] hover:underline"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Documentos
          </button>
        </div>

        {isExpanded && (
          <div className="border-t border-[#E5E2D9] pt-4 space-y-4">
            {verification && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#FAF8F5] rounded-xl p-3">
                  <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">CNPJ</p>
                  <p className="font-semibold">{verification.criteria?.cnpjValidated ? 'Validado' : 'Pendente'}</p>
                </div>
                <div className="bg-[#FAF8F5] rounded-xl p-3">
                  <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Endereço</p>
                  <p className="font-semibold">{verification.criteria?.addressConsistency ? 'Consistente' : 'Inconsistente'}</p>
                </div>
                <div className="bg-[#FAF8F5] rounded-xl p-3">
                  <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Anos ativos</p>
                  <p className="font-semibold">{verification.criteria?.yearsActive ?? '—'}</p>
                </div>
                <div className="bg-[#FAF8F5] rounded-xl p-3">
                  <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Consistência</p>
                  <p className="font-semibold capitalize">{verification.consistencyStatus}</p>
                </div>
              </div>
            )}

            {docs.length === 0 ? (
              <p className="text-sm text-gray-400 flex items-center gap-2"><FileText className="w-4 h-4" /> Nenhum documento enviado.</p>
            ) : (
              <ul className="space-y-2">
                {docs.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between bg-[#FAF8F5] rounded-xl px-4 py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{doc.title}</p>
                      <p className="text-xs text-gray-400">{doc.isPublic ? 'Público' : 'Privado'}</p>
                    </div>
                    {doc.documentUrl && (
                      <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-[#0A665C] hover:underline">
                        Abrir <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {showReviewActions && (
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={actionLoading === `ngo-verify-${ngo.id}`}
                  onClick={() => handleNgoVerification(ngo.id, 'verified')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0A665C] text-white text-xs font-bold rounded-full hover:bg-[#0A3D36] transition disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" /> Aprovar
                </button>
                <button
                  disabled={actionLoading === `ngo-verify-${ngo.id}`}
                  onClick={() => handleNgoVerification(ngo.id, 'inconsistent')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-full hover:bg-red-100 transition disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Reprovar
                </button>
                <button
                  disabled={actionLoading === `ngo-validate-${ngo.id}`}
                  onClick={() => handleNgoValidate(ngo.id)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-[#0A665C] text-[#0A665C] text-xs font-bold rounded-full hover:bg-[#FAF8F5] transition disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" /> Revalidar CNPJ
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0A665C] mb-2">Painel Administrativo</p>
          <h1 className="text-3xl font-extrabold text-[#0A3D36]">Gestão ONG+</h1>
          <p className="text-gray-500 text-sm mt-2">Verifique ONGs e campanhas, gerencie bundles coletivos e scores de confiança.</p>
        </div>

        <div className="mb-8 bg-white border border-[#E5E2D9] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Administrador logado</p>
            <h2 className="text-lg font-extrabold text-[#0A3D36] mt-1">{user?.name || 'Administrador'}</h2>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <span className="bg-[#0A665C] text-white text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1">
            role: {user?.role}
          </span>
        </div>

        <MessageBanner message={message?.text} type={message?.type} />

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${activeTab === id
                  ? 'bg-[#0A665C] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-[#E5E2D9] hover:border-[#0A665C]'
                }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
          <button
            onClick={loadData}
            disabled={loading}
            className="ml-auto flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-[#0A665C] transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-10 h-10 text-[#0A665C] animate-spin" />
            <p className="text-gray-400 mt-4 text-sm">Carregando painel...</p>
          </div>
        ) : (
          <>
            {activeTab === 'revisao' && (
              <div className="space-y-10">
                <section>
                  <h2 className="text-lg font-bold text-[#0A3D36] mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" /> ONGs em revisão
                    <span className="text-sm font-normal text-gray-400">({reviewNgos.length})</span>
                  </h2>
                  {reviewNgos.length === 0 ? (
                    <p className="text-sm text-gray-400 bg-white rounded-2xl border border-[#E5E2D9] p-6">Nenhuma ONG aguardando revisão.</p>
                  ) : (
                    <div className="space-y-4">{reviewNgos.map((ngo) => {
                      const full = allNgos.find((n) => n.id === ngo.id) || ngo;
                      return renderNgoCard(full, true);
                    })}</div>
                  )}
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0A3D36] mb-4 flex items-center gap-2">
                    <Megaphone className="w-5 h-5" /> Campanhas em revisão
                    <span className="text-sm font-normal text-gray-400">({reviewCampaigns.length})</span>
                  </h2>
                  {reviewCampaigns.length === 0 ? (
                    <p className="text-sm text-gray-400 bg-white rounded-2xl border border-[#E5E2D9] p-6">Nenhuma campanha aguardando revisão.</p>
                  ) : (
                    <div className="space-y-4">
                      {reviewCampaigns.map((camp) => (
                        <div key={camp.id} className="bg-white rounded-2xl border border-[#E5E2D9] p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-gray-900">{camp.name}</h3>
                              <p className="text-sm text-gray-500">{camp.ngoName} · Meta R$ {camp.targetAmount?.toLocaleString('pt-BR')}</p>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{camp.description}</p>
                              <div className="mt-3 grid md:grid-cols-2 gap-2 text-xs">
                                <div className="bg-[#FAF8F5] border border-[#E5E2D9] rounded-xl p-3">
                                  <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">Requisitos enviados</p>
                                  <p className="text-gray-700">{camp.requirements || 'Nenhum requisito informado.'}</p>
                                </div>
                                <div className="bg-[#FAF8F5] border border-[#E5E2D9] rounded-xl p-3">
                                  <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">Destino dos recursos</p>
                                  <p className="text-gray-700">{camp.destination || 'Destino não informado.'}</p>
                                </div>
                              </div>
                            </div>
                            <StatusBadge status={camp.status} map={CAMPAIGN_STATUS_LABELS} />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button
                              disabled={actionLoading === `camp-review-${camp.id}`}
                              onClick={() => handleCampaignReview(camp.id, 'aprovada')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-[#0A665C] text-white text-xs font-bold rounded-full hover:bg-[#0A3D36] transition disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" /> Aprovar
                            </button>
                            <button
                              disabled={actionLoading === `camp-review-${camp.id}`}
                              onClick={() => handleCampaignReview(camp.id, 'publicada')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" /> Publicar
                            </button>
                            <button
                              disabled={actionLoading === `camp-review-${camp.id}`}
                              onClick={() => handleCampaignReview(camp.id, 'recusada')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-full hover:bg-red-100 transition disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" /> Recusar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === 'ongs' && (
              <div className="space-y-8">
                {scoreCriteria.length > 0 && (
                  <div className="bg-white rounded-[2rem] border border-[#E5E2D9] p-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A665C] mb-4">Critérios de score (API)</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      {scoreCriteria.map((c) => (
                        <div key={c.key} className="bg-[#FAF8F5] rounded-xl p-4">
                          <p className="font-bold text-gray-900 text-sm">{c.label}</p>
                          <p className="text-xs text-gray-500 mt-1">{c.description}</p>
                          <p className="text-xs font-bold text-[#0A665C] mt-2">+{c.weight} pontos</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <section>
                  <h2 className="text-lg font-bold text-[#0A3D36] mb-4">Todas as ONGs ({allNgos.length})</h2>
                  <div className="space-y-3">
                    {allNgos.map((ngo) => (
                      <div key={ngo.id} className="bg-white rounded-2xl border border-[#E5E2D9] p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex-1 min-w-[200px]">
                            <h3 className="font-bold text-gray-900">{ngo.name}</h3>
                            <p className="text-xs text-gray-500">{ngo.cnpj}</p>
                            <StatusBadge status={ngo.verification?.status || (ngo.verified ? 'verified' : 'pending')} map={NGO_STATUS_LABELS} />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-gray-500">Score</label>
                            <input
                              type="number" min="0" max="100"
                              value={scoreEdits[ngo.id] ?? ngo.score}
                              onChange={(e) => setScoreEdits((prev) => ({ ...prev, [ngo.id]: e.target.value }))}
                              className="w-16 px-2 py-1.5 text-sm border border-[#E5E2D9] rounded-lg text-center"
                            />
                            <button
                              disabled={actionLoading === `ngo-score-${ngo.id}`}
                              onClick={() => handleNgoScore(ngo.id)}
                              className="px-3 py-1.5 bg-[#0A665C] text-white text-xs font-bold rounded-lg hover:bg-[#0A3D36] transition disabled:opacity-50"
                            >
                              Salvar
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              disabled={actionLoading === `ngo-validate-${ngo.id}`}
                              onClick={() => handleNgoValidate(ngo.id)}
                              title="Recalcular score via API de CNPJ"
                              className="p-2 text-[#0A665C] hover:bg-[#FAF8F5] rounded-lg transition disabled:opacity-50"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              disabled={actionLoading === `ngo-delete-${ngo.id}`}
                              onClick={() => handleNgoDelete(ngo.id, ngo.name)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {verifiedNgos.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-[#0A3D36] mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#0A665C]" /> ONGs aprovadas — editar score
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Use o campo de score acima ou revalide via API para recalcular automaticamente.</p>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'campanhas' && (
              <section>
                <h2 className="text-lg font-bold text-[#0A3D36] mb-4">Todas as campanhas ({allCampaigns.length})</h2>
                <div className="space-y-3">
                  {allCampaigns.map((camp) => (
                    <div key={camp.id} className="bg-white rounded-2xl border border-[#E5E2D9] p-5 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{camp.name}</h3>
                        <p className="text-sm text-gray-500">{camp.ngoName}</p>
                        <div className="mt-2"><StatusBadge status={camp.status} map={CAMPAIGN_STATUS_LABELS} /></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {camp.status === 'em-revisao' && (
                          <>
                            <button onClick={() => handleCampaignReview(camp.id, 'aprovada')}
                              className="px-3 py-1.5 bg-[#0A665C] text-white text-xs font-bold rounded-full">Aprovar</button>
                            <button onClick={() => handleCampaignReview(camp.id, 'recusada')}
                              className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-full">Recusar</button>
                          </>
                        )}
                        {!['encerrada', 'arquivada', 'recusada'].includes(camp.status) && (
                          <button
                            disabled={actionLoading === `camp-end-${camp.id}`}
                            onClick={() => handleCampaignEnd(camp.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-50 transition disabled:opacity-50"
                          >
                            <Ban className="w-3.5 h-3.5" /> Encerrar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'bundles' && (
              <div className="space-y-8">
                <form onSubmit={handleCreateBundle} className="bg-white rounded-[2rem] border border-[#E5E2D9] p-6 space-y-4">
                  <h2 className="text-lg font-bold text-[#0A3D36] flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Nova campanha coletiva
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input required placeholder="Nome do bundle" value={bundleForm.name}
                      onChange={(e) => setBundleForm((f) => ({ ...f, name: e.target.value }))}
                      className="px-4 py-3 bg-[#FAF8F5] rounded-xl text-sm border border-transparent focus:border-[#0A665C] outline-none" />
                    <select value={bundleForm.cause}
                      onChange={(e) => setBundleForm((f) => ({ ...f, cause: e.target.value }))}
                      className="px-4 py-3 bg-[#FAF8F5] rounded-xl text-sm border border-transparent focus:border-[#0A665C] outline-none">
                      {CAUSES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input placeholder="Meta (R$)" type="number" value={bundleForm.targetAmount}
                      onChange={(e) => setBundleForm((f) => ({ ...f, targetAmount: e.target.value }))}
                      className="px-4 py-3 bg-[#FAF8F5] rounded-xl text-sm border border-transparent focus:border-[#0A665C] outline-none" />
                    <input placeholder="Patrocinador match" value={bundleForm.matchSponsor}
                      onChange={(e) => setBundleForm((f) => ({ ...f, matchSponsor: e.target.value }))}
                      className="px-4 py-3 bg-[#FAF8F5] rounded-xl text-sm border border-transparent focus:border-[#0A665C] outline-none" />
                  </div>
                  <textarea placeholder="Descrição" rows={2} value={bundleForm.description}
                    onChange={(e) => setBundleForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#FAF8F5] rounded-xl text-sm border border-transparent focus:border-[#0A665C] outline-none resize-none" />
                  <button type="submit" disabled={actionLoading === 'bundle-create'}
                    className="px-6 py-3 bg-[#0A665C] text-white text-sm font-bold rounded-full hover:bg-[#0A3D36] transition disabled:opacity-50">
                    Criar bundle
                  </button>
                </form>

                <section>
                  <h2 className="text-lg font-bold text-[#0A3D36] mb-4">Bundles ({bundles.length})</h2>
                  {bundles.length === 0 ? (
                    <p className="text-sm text-gray-400 bg-white rounded-2xl border p-6">Nenhum bundle cadastrado.</p>
                  ) : (
                    <div className="space-y-4">
                      {bundles.map((bundle) => (
                        <div key={bundle.id} className={`bg-white rounded-2xl border p-5 ${bundle.isActive === false ? 'opacity-60 border-gray-200' : 'border-[#E5E2D9]'}`}>
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                            <div>
                              <h3 className="font-bold text-gray-900">{bundle.name}</h3>
                              <p className="text-sm text-gray-500">{bundle.causeLabel} · Meta R$ {bundle.targetAmount?.toLocaleString('pt-BR')}</p>
                              {bundle.isActive === false && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 mt-1">
                                  <AlertTriangle className="w-3.5 h-3.5" /> Encerrado
                                </span>
                              )}
                            </div>
                            {bundle.isActive !== false && (
                              <button onClick={() => handleEndBundle(bundle.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-50">
                                <Ban className="w-3.5 h-3.5" /> Encerrar
                              </button>
                            )}
                          </div>

                          <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">ONGs participantes</p>
                            {(bundle.ongs || []).length === 0 ? (
                              <p className="text-sm text-gray-400">Nenhuma ONG vinculada.</p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {bundle.ongs.map((o) => (
                                  <span key={o.id} className="inline-flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700">
                                    {o.name} (score {o.score})
                                    {bundle.isActive !== false && (
                                      <button onClick={() => handleRemoveNgoFromBundle(bundle.id, o.id)}
                                        className="text-red-400 hover:text-red-600 ml-1">×</button>
                                    )}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {bundle.isActive !== false && (
                            <div className="flex flex-wrap items-center gap-2">
                              <select value={selectedBundle === bundle.id ? addNgoId : ''}
                                onChange={(e) => { setSelectedBundle(bundle.id); setAddNgoId(e.target.value); }}
                                className="px-3 py-2 bg-[#FAF8F5] rounded-xl text-sm border border-[#E5E2D9] outline-none">
                                <option value="">Adicionar ONG...</option>
                                {allNgos
                                  .filter((n) => !(bundle.ongs || []).some((o) => o.id === n.id))
                                  .map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
                              </select>
                              <button
                                disabled={!addNgoId || selectedBundle !== bundle.id || actionLoading?.startsWith('bundle-add')}
                                onClick={() => handleAddNgoToBundle(bundle.id)}
                                className="px-4 py-2 bg-[#0A665C] text-white text-xs font-bold rounded-full hover:bg-[#0A3D36] transition disabled:opacity-50"
                              >
                                Adicionar
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
