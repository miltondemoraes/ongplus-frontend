import { useState, useEffect } from 'react';
import { CheckCircle, Users, HandHeart, ArrowRight, AlertTriangle } from 'lucide-react';
import imagemGenerica from '../assets/imagem_generica.jpg';
import Footer from '../components/Footer';

const Hero = ({ onExploreCauses }) => (
  <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16 md:py-20 bg-white max-w-7xl mx-auto">
    <div className="md:w-1/2 space-y-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
        Conectando <br />
        <span className="text-teal-700">Empatia</span> a <br />
        Impacto Real.
      </h1>
      <p className="text-lg text-gray-600 max-w-md pt-2">
        Uma plataforma curada que facilita doações para ONGs verificadas, garantindo transparência radical e conexão verdadeira com causas que importam.
      </p>
      <div className="pt-4">
        <button 
          onClick={onExploreCauses}
          className="flex items-center space-x-2 bg-teal-700 text-white px-6 py-3 rounded-full font-medium hover:bg-teal-800 transition shadow-sm"
        >
          <span>Explorar Causas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="md:w-1/2 mt-12 md:mt-0 flex justify-end">
      <img
        src={imagemGenerica}
        alt="Pessoas unidas em apoio"
        className="w-full max-w-md aspect-square object-cover rounded-3xl shadow-sm"
      />
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description, benefits }) => (
  <div className="bg-white p-10 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full border border-gray-50">
    <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">{description}</p>
    <ul className="space-y-4 mt-auto">
      {benefits.map((benefit, idx) => (
        <li key={idx} className="flex items-start text-gray-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4 text-teal-600 mr-3 flex-shrink-0 mt-0.5" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Features = () => (
  <section className="py-20 px-8 bg-[#F9FAFB] max-w-7xl mx-auto rounded-[3rem] my-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Um Ecossistema de Confiança</h2>
      <p className="text-gray-500 max-w-xl mx-auto text-sm">
        Desenhado para unir quem quer ajudar com quem precisa de apoio, construindo pontes sólidas de impacto.
      </p>
    </div>
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <FeatureCard
        icon={<HandHeart className="w-6 h-6" />}
        title="Para Doadores"
        description="Descubra causas alinhadas aos seus valores com facilidade. Realize pagamentos seguros e acompanhe o destino de cada centavo através de relatórios de impacto detalhados e transparência radical."
        benefits={[
          "Curadoria rigorosa de ONGs",
          "Pagamentos criptografados e seguros",
          "Relatórios de impacto em tempo real"
        ]}
      />
      <FeatureCard
        icon={<Users className="w-6 h-6" />}
        title="Para ONGs"
        description="Amplie sua visibilidade e simplifique a captação de recursos. Crie um perfil dedicado, conte sua história com dignidade editorial e conecte-se com doadores engajados."
        benefits={[
          "Perfil editorial de alto impacto",
          "Gestão simplificada de doações",
          "Conexão direta com rede de apoio"
        ]}
      />
    </div>
  </section>
);

const Step = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center max-w-[280px] relative z-10">
    <div className="w-14 h-14 rounded-full bg-gray-100 text-teal-800 flex items-center justify-center text-xl font-bold mb-6 shadow-sm border border-white">
      {number}
    </div>
    <h4 className="text-base font-bold text-gray-900 mb-3">{title}</h4>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const HowItWorks = () => (
  <section className="py-24 px-8 bg-white max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
      <p className="text-gray-500 text-sm">Três passos simples para transformar empatia em ação concreta.</p>
    </div>
    <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-8 relative max-w-5xl mx-auto">
      <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-[2px] bg-gray-100 -z-0"></div>

      <Step
        number="1"
        title="Escolha uma campanha coletiva"
        description="Sua contribuição vai para causas temáticas (como meio ambiente ou educação) que reúnem diversas ONGs parceiras verificadas de uma vez."
      />
      <Step
        number="2"
        title="Rateio e distribuição transparente"
        description="O valor arrecadado é distribuído proporcionalmente entre as ONGs participantes da campanha, seguindo regras claras de divisão pública."
      />
      <Step
        number="3"
        title="Multiplicação com Matchfunding"
        description="Muitas campanhas contam com marcas parceiras que multiplicam cada real doado por você, dobrando o impacto gerado na ponta."
      />
    </div>
  </section>
);

const CTA = ({ onExploreCauses, onNavigate }) => (
  <section className="px-8 pb-24 max-w-6xl mx-auto">
    <div className="bg-[#147B72] rounded-[2.5rem] p-12 md:p-16 text-center text-white flex flex-col items-center shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para fazer a diferença?</h2>
      <p className="text-teal-100 max-w-xl mb-10 text-base md:text-lg">
        Junte-se à nossa comunidade de doadores e comece a apoiar causas que transformam vidas hoje mesmo.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button
          onClick={() => onNavigate && onNavigate('/causas')}
          className="bg-white text-teal-800 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-50 transition shadow-sm w-full sm:w-auto"
        >
          Doar Agora
        </button>
        <button 
          onClick={onExploreCauses}
          className="bg-transparent border border-white/80 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition w-full sm:w-auto"
        >
          Explorar ONGs
        </button>
      </div>
    </div>
  </section>
);

export default function LandingPage({ onExploreCauses, onNavigate }) {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('ongplus_warning_dismissed');
    if (!dismissed) {
      setShowWarning(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('ongplus_warning_dismissed', 'true');
    setShowWarning(false);
  };

  return (
    <>
      <main className="flex-grow">
        <Hero onExploreCauses={onExploreCauses} />
        <Features />
        <HowItWorks />
        <CTA onExploreCauses={onExploreCauses} onNavigate={onNavigate} />
      </main>
      <Footer onNavigate={onNavigate} />

      {showWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border border-gray-100 relative overflow-hidden flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Aviso Importante</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Esta plataforma é um <strong>projeto de software em desenvolvimento (protótipo)</strong> para fins acadêmicos e demonstrativos.
              <br /><br />
              O serviço <strong>NÃO está ativo</strong> e, por enquanto, <strong>NÃO deve ser utilizado</strong> para fins reais. Por favor, <strong>NÃO realize doações reais</strong> nem insira dados reais de pagamento.
            </p>
            <button
              onClick={handleDismiss}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-full transition shadow-sm"
            >
              Entendi e declaro ciente
            </button>
          </div>
        </div>
      )}
    </>
  );
}
