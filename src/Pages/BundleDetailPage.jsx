import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ngoService } from '../services/ngoService';
import { Loader2 } from 'lucide-react';
import { 
  Heart, 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  FileText, 
  TrendingUp, 
  Award,
  CheckCircle,
  MapPin
} from 'lucide-react';

// Cover image fallbacks pool
import aboutUs from '../assets/about_us.png';
import loginBgPlant from '../assets/login_bg_plant.png';

const COVER_POOL = [aboutUs, loginBgPlant];

export default function BundleDetailPage({ onNavigate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    ngoService.getBundleById(id)
      .then(data => {
        if (!cancelled) {
          // Assign a cosmetic cover based on a stable hash of the name
          const coverIdx = (data.name || '').length % COVER_POOL.length;
          setBundle({ ...data, cover: COVER_POOL[coverIdx] });
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error("Error loading bundle:", err);
          setError('Não foi possível carregar os dados do bundle.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 bg-[#FAF8F5] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#0A665C]" />
          <p className="text-sm font-medium">Carregando bundle...</p>
        </div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="flex-1 bg-[#FAF8F5] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">{error || 'Bundle não encontrado.'}</p>
          <button
            onClick={() => navigate('/causas')}
            className="text-[#0A665C] font-bold text-sm hover:underline"
          >
            Voltar para Causas
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(Math.round((bundle.raisedAmount / bundle.targetAmount) * 100), 100);

  const handleDonate = () => {
    navigate('/doacao', {
      state: {
        bundleId: bundle.id,
        bundleName: bundle.name,
        type: 'bundle',
        score: bundle.transparencyScore,
        ngoId: bundle.ongs?.[0]?.id,
      },
    });
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] min-h-screen py-12 px-6 md:px-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back link */}
        <button 
          onClick={() => navigate('/causas')}
          className="flex items-center space-x-2 text-gray-500 hover:text-[#0A665C] transition font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Causas</span>
        </button>

        {/* Bundle Banner / Hero with cover image background */}
        <div 
          className="relative rounded-[2.5rem] overflow-hidden text-white shadow-lg p-10 md:p-12 min-h-[360px] flex flex-col justify-end bg-cover bg-center"
          style={{ backgroundImage: `url(${bundle.cover})` }}
        >
          {/* Sleek dark green-to-transparent overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#0A3D36]/80 to-black/10"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="inline-block bg-[#A4E0D1] text-[#0A3D36] text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded-full uppercase">
              Campanha Coletiva (Bundle)
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
              {bundle.name}
            </h1>
            
            <p className="text-teal-50/90 text-xs md:text-sm leading-relaxed max-w-3xl font-medium">
              {bundle.description}
            </p>

            {/* Progress Bar & Goals */}
            <div className="pt-6 border-t border-white/20 space-y-3 max-w-xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-teal-200">Progresso da Campanha</span>
                <span>{progressPercent}% atingido</span>
              </div>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-[#A4E0D1] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs pt-1">
                <div>
                  <span className="text-teal-200 text-[10px] block">Arrecadado</span>
                  <span className="font-extrabold text-white text-sm">R$ {bundle.raisedAmount.toLocaleString('pt-BR')}</span>
                </div>
                <div className="text-right">
                  <span className="text-teal-200 text-[10px] block">Meta Coletiva</span>
                  <span className="font-extrabold text-white text-sm">R$ {bundle.targetAmount.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button 
                onClick={handleDonate}
                className="bg-white hover:bg-teal-50 text-[#0A665C] py-3.5 px-8 rounded-full font-bold text-xs flex items-center space-x-2.5 shadow-md transition transform active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-[#0A665C]" />
                <span>Doar para o Bundle</span>
              </button>

              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A4E0D1]" />
                <span>Score de Transparência: {bundle.transparencyScore}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Info Columns (Left 2 cols) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Participating ONGs */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
              <div className="flex items-center space-x-2 pb-4 border-b border-gray-100">
                <Users className="w-5 h-5 text-[#0A665C]" />
                <h2 className="text-lg font-bold text-gray-900">ONGs Participantes</h2>
              </div>
              
              <div className="space-y-4">
                {(bundle.ongs || []).map(ong => (
                  <div key={ong.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 hover:border-gray-200 transition">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-800 border border-gray-100 font-bold text-xs uppercase">
                        {ong.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{ong.name}</h4>
                        {ong.location && (
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span>{ong.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block font-semibold">Score</span>
                        <span className="font-extrabold text-[#0A3D36] text-xs">{ong.score}/100</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/ong/${ong.id}`, { state: { ong } })}
                        className="text-xs font-bold text-[#0A665C] hover:underline"
                      >
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution Rules */}
            {bundle.distributionRules && (
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-4">
                <div className="flex items-center space-x-2 pb-4 border-b border-gray-100">
                  <TrendingUp className="w-5 h-5 text-[#0A665C]" />
                  <h2 className="text-lg font-bold text-gray-900">Distribuição dos Recursos</h2>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {bundle.distributionRules}
                </p>
              </div>
            )}

          </div>

          {/* Right sidebar details (1 col) */}
          <div className="space-y-8">
            
            {/* Eligibility Rules */}
            {(bundle.eligibilityRules || []).length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
                <div className="flex items-center space-x-2 pb-2">
                  <Award className="w-5 h-5 text-[#0A665C]" />
                  <h2 className="text-sm font-bold text-gray-900">Elegibilidade</h2>
                </div>
                
                <ul className="space-y-3.5">
                  {bundle.eligibilityRules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2 text-xs text-gray-600 leading-relaxed font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Aggregated Transparency */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100/80 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-4">
              <div className="flex items-center space-x-2 pb-2">
                <FileText className="w-5 h-5 text-[#0A665C]" />
                <h2 className="text-sm font-bold text-gray-900">Transparência Agregada</h2>
              </div>
              
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-teal-50 space-y-2">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                  Score de Prestação
                </div>
                <div className="text-2xl font-extrabold text-[#0A3D36]">
                  {bundle.transparencyScore} <span className="text-xs text-gray-400 font-normal">/ 100</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Calculado com base na conformidade fiscal, integridade cadastral e histórico de projetos das ONGs participantes.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
