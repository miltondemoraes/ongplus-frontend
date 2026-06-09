import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import { useGlobalTransparency } from '../hooks/useGlobalTransparency';
import GlobalMetricsCard from '../components/transparency/GlobalMetricsCard';
import AllocationCriteriaPanel from '../components/transparency/AllocationCriteriaPanel';
import ResourceDistributionTable from '../components/transparency/ResourceDistributionTable';


// ─── Main Page ──────────────────────────────────────────────────────────────
export default function TransparencyPage({ onNavigate }) {
  const { user } = useAuth();
  const role = user?.role === 'ong' ? 'NGO' : 'DONOR';

  const { metrics, transfers, criteria, loading, error, reload } = useGlobalTransparency();

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
          <p className="text-gray-500 font-medium">Carregando dados de transparência…</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-bold">{error}</p>
          <button
            onClick={reload}
            className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 font-bold transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tentar novamente</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex-grow max-w-[1100px] mx-auto w-full px-6 pt-16 md:pt-24">

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-teal-800 leading-[1.1] tracking-tight mb-6">
            Nossa Transparência é<br />Radical.
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {role === 'NGO'
              ? 'Como organização parceira, você pode acompanhar exatamente como os recursos da plataforma são captados, distribuídos e quais critérios balizam cada decisão de repasse.'
              : 'Acreditamos que a confiança é o alicerce de qualquer mudança social. Aqui, você acompanha cada centavo investido — de onde veio, para onde foi e por quê.'}
          </p>
        </div>



        {/* ── Métricas Globais ─────────────────────────────────────────── */}
        <GlobalMetricsCard metrics={metrics} role={role} />

        {/* ── Critérios de Alocação ────────────────────────────────────── */}
        <AllocationCriteriaPanel criteria={criteria} role={role} />


        {/* ── Tabela de Repasses ───────────────────────────────────────── */}
        <ResourceDistributionTable transfers={transfers} role={role} />
      </main>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
