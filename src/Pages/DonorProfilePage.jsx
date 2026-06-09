import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Download,
  Globe,
  Heart,
  Loader2,
  Network,
  Plus,
  Wind,
} from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { donorProfileService } from '../services/donorProfileService';

const CAUSE_STYLE = {
  'meio-ambiente': { icon: Globe, bg: 'bg-teal-800 text-white', iconColor: 'text-white' },
  educacao: { icon: BookOpen, bg: 'bg-[#CBDDCD] text-[#0A3D36]', iconColor: 'text-[#0A3D36]' },
  clima: { icon: Wind, bg: 'bg-slate-700 text-white', iconColor: 'text-white' },
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function normalizeCause(cause) {
  const id = cause.id || cause.slug || cause.name;
  const style = CAUSE_STYLE[id] || { icon: Globe, bg: 'bg-teal-700 text-white', iconColor: 'text-white' };
  return {
    id,
    label: cause.label || cause.name || id,
    active: cause.active !== false,
    ...style,
  };
}

export default function DonorProfilePage({ onNavigate }) {
  const { user } = useAuth();
  const [downloadingId, setDownloadingId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCause, setShowAddCause] = useState(false);
  const [newCauseText, setNewCauseText] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    donorProfileService.getProfile()
      .then((data) => {
        if (!cancelled) {
          setProfileData(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Não foi possível carregar seu perfil.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const profile = profileData?.profile;
  const metrics = profile?.impactMetrics || {};
  const causes = useMemo(
    () => (profileData?.causePreferences || []).map(normalizeCause).filter((cause) => cause.active),
    [profileData],
  );
  const donations = profileData?.donations || [];

  const donorName = profile?.name || user?.name || 'Doador';
  const joinedAt = profile?.joinedAt || user?.joinedAt;

  const handleDownloadReceipt = (donation) => {
    setDownloadingId(donation.id);
    const receiptText = `ONG+ - RECIBO DE IMPACTO SOCIAL
ID da Doação: ${donation.id}
Data: ${formatDate(donation.date)}
Doador: ${donorName}
Organização Beneficiada: ${donation.ngo?.name || '-'}
Campanha: ${donation.campaign?.name || '-'}
Valor da Contribuição: ${formatCurrency(donation.amount)}
Status: ${donation.status}

Gerado automaticamente pela plataforma ONG+`;

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `recibo-ongplus-doacao-${donation.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadingId(null);
  };

  const handleAddCause = async (e) => {
    e.preventDefault();
    if (!newCauseText.trim()) return;

    const nextCause = {
      id: `custom-${Date.now()}`,
      label: newCauseText.trim(),
      active: true,
    };
    const nextPreferences = [...(profileData?.causePreferences || []), nextCause];
    try {
      const updated = await donorProfileService.updateCausePreferences(nextPreferences);
      setProfileData((current) => ({ ...current, causePreferences: updated }));
      setNewCauseText('');
      setShowAddCause(false);
    } catch (err) {
      setError(err.message || 'Não foi possível atualizar suas causas.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#0A665C]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-extrabold text-[#0A3D36]">Perfil indisponível</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 md:px-12 py-10 space-y-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-36 h-36 rounded-full bg-[#EAE8E3] flex items-center justify-center p-1.5 border border-dashed border-gray-300">
              <div className="w-full h-full rounded-full bg-[#F5F2EC] flex items-center justify-center relative overflow-hidden border-2 border-white shadow-inner">
                <Heart className="w-16 h-16 text-[#8C8273] opacity-80" />
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[#B55A48] p-1 rounded-full text-white">
                  <Heart className="w-2.5 h-2.5 fill-white" />
                </div>
              </div>
            </div>
            <span className="mt-3 bg-[#0A3D36] text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              DOADOR DESDE {joinedAt ? new Date(joinedAt).getFullYear() : '-'}
            </span>
          </div>

          <div className="text-center md:text-left space-y-4 pt-4 max-w-2xl">
            <h1 className="text-4xl font-extrabold text-[#0A3D36] tracking-tight">{donorName}</h1>
            <p className="text-gray-500 text-lg leading-relaxed font-normal">
              Sua contribuição já apoiou <span className="text-[#0A665C] font-semibold">{metrics.ngoCount || 0} ONGs</span> em <span className="text-[#0A665C] font-semibold">{metrics.donationCount || 0} doações</span>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[160px] space-y-8">
            <div className="flex items-center space-x-2 text-teal-800">
              <div className="w-10 h-10 rounded-full bg-[#E4F2EE] flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#0A665C] fill-[#0A665C]/10" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TOTAL DOADO</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0A3D36] tracking-tight">{formatCurrency(metrics.totalDonated)}</h2>
          </div>

          <div className="bg-[#F5F2EC] rounded-[2rem] p-8 border border-transparent shadow-[0_4px_25px_rgba(0,0,0,0.005)] flex flex-col justify-between min-h-[160px] space-y-8">
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="w-10 h-10 rounded-full bg-[#EAE8E3] flex items-center justify-center">
                <Network className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ONGS APOIADAS</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0A3D36] tracking-tight">{metrics.ngoCount || 0} Organizações</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 pt-4">
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight">Histórico de Doações</h3>
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
              {donations.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-500">Você ainda não possui doações concluídas.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <th className="py-5 px-6">Data</th>
                        <th className="py-5 px-6">Organização</th>
                        <th className="py-5 px-6">Valor</th>
                        <th className="py-5 px-6 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {donations.map((donation) => (
                        <tr key={donation.id} className="text-xs font-semibold text-gray-700 hover:bg-[#FAF8F5]/50 transition">
                          <td className="py-5 px-6 text-gray-400 font-normal">{formatDate(donation.date)}</td>
                          <td className="py-5 px-6">
                            <div className="font-bold text-gray-900">{donation.ngo?.name || '-'}</div>
                            {donation.campaign?.name && <div className="text-gray-400 text-[10px]">{donation.campaign.name}</div>}
                          </td>
                          <td className="py-5 px-6 text-[#0A665C] font-extrabold">{formatCurrency(donation.amount)}</td>
                          <td className="py-5 px-6 text-right">
                            <button
                              onClick={() => handleDownloadReceipt(donation)}
                              disabled={downloadingId === donation.id}
                              className="text-[#0A665C] hover:text-[#08524a] hover:underline transition flex items-center space-x-1.5 ml-auto cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{downloadingId === donation.id ? 'Baixando...' : 'Recibo'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-[#0A3D36] tracking-tight">Minhas Causas</h3>
              <div className="flex flex-wrap gap-2.5">
                {causes.map((cause) => {
                  const Icon = cause.icon;
                  return (
                    <span key={cause.id} className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold shadow-sm transition ${cause.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${cause.iconColor}`} />
                      <span>{cause.label}</span>
                    </span>
                  );
                })}

                {!showAddCause ? (
                  <button
                    onClick={() => setShowAddCause(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold border border-gray-300 text-gray-500 hover:bg-[#EAE8E3]/60 transition bg-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-400" />
                    <span>Adicionar Causa</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddCause} className="flex items-center space-x-2 w-full mt-2">
                    <input
                      type="text"
                      placeholder="Nova causa..."
                      value={newCauseText}
                      onChange={(e) => setNewCauseText(e.target.value)}
                      className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#0A665C] flex-grow"
                      autoFocus
                    />
                    <button type="submit" className="bg-[#0A665C] text-white p-2 rounded-xl hover:bg-teal-800 transition">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="bg-[#EAF2EE] rounded-[2rem] p-8 border border-transparent shadow-[0_4px_25px_rgba(0,0,0,0.005)] relative overflow-hidden space-y-6">
              <div className="relative space-y-4">
                <h4 className="text-xs font-extrabold text-[#0A3D36] uppercase tracking-widest">Próximos Passos</h4>
                <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                  Explore campanhas e ONGs conectadas às causas que você acompanha.
                </p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/causas')}
                className="w-full bg-[#0A665C] hover:bg-[#08524a] text-white py-3.5 px-6 rounded-full font-bold text-xs flex items-center justify-center space-x-2.5 shadow-md transition-colors cursor-pointer"
              >
                <span>Explorar Campanhas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
