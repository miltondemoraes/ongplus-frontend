import {
  Target, Eye, Gem, Phone, Mail, MapPin, Send,
  Zap, ShieldCheck, BarChart3, Layers,
  FileCheck, Star, CheckCircle, Heart
} from 'lucide-react';
import Footer from '../components/Footer';
import aboutImage from '../assets/about_us.png';

const SectionLabel = ({ children }) => (
  <p className="text-teal-600 font-bold text-xs uppercase tracking-widest mb-4">{children}</p>
);

const FeatureBlock = ({ icon: Icon, title, description, items }) => (
  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 flex flex-col h-full">
    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-teal-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
    {description && <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>}
    {items && (
      <ul className="space-y-2.5 mt-auto">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start space-x-2.5 text-gray-600 text-sm">
            <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const ScoreFactor = ({ label, pct }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-semibold text-gray-700">
      <span>{label}</span>
      <span className="text-teal-700">{pct}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-teal-500 to-teal-700 h-2 rounded-full transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

export default function AboutPage({ onNavigate }) {
  return (
    <div className="flex-grow font-sans">

      {/* Hero */}
      <section className="max-w-[1000px] mx-auto px-6 pt-16 md:pt-24 mb-20">
        <div className="max-w-2xl">
          <SectionLabel>/ Quem somos nós</SectionLabel>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 tracking-tight">
            Sobre a ONG+.
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Uma plataforma que une tecnologia, transparência e empatia para potencializar o impacto de causas sociais verificadas em todo o Brasil.
          </p>
        </div>
      </section>

      {/* História & Missão */}
      <section className="bg-[#F9FAF9] py-20 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Nossa História</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                A ONG+ nasceu para simplificar a ponte entre doadores e organizações sérias. Nossa proposta é tornar o ato de ajudar mais claro, seguro e acompanhado de resultados concretos.
              </p>
              <p>
                Evoluímos com foco em melhoria contínua: fortalecemos critérios de curadoria, ampliamos mecanismos de transparência e priorizamos relações de confiança com comunidades e parceiros.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: 'ONGs verificadas', value: '42+' },
                { label: 'Doadores ativos', value: '8 mil' },
                { label: 'Recursos alocados', value: 'R$ 1.2M' },
              ].map(({ label, value }) => (
                <div key={label} className="text-center bg-white rounded-2xl py-4 px-2 border border-gray-100 shadow-sm">
                  <p className="text-2xl font-extrabold text-teal-700">{value}</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-1 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl aspect-video bg-gray-200">
              <img src={aboutImage} alt="História da ONG+" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="max-w-[1000px] mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <SectionLabel>/ Pilares</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900">Pilares da Nossa Atuação</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureBlock
            icon={Target}
            title="A Missão"
            description="Conectar pessoas a causas transformadoras através de uma plataforma segura e transparente, garantindo que cada doação chegue ao seu destino com rastreabilidade completa."
          />
          <FeatureBlock
            icon={Eye}
            title="A Visão"
            description="Ser a maior rede de solidariedade do Brasil, reconhecida pela excelência tecnológica e pelo compromisso inabalável com a transparência social e verificação de impacto."
          />
          <FeatureBlock
            icon={Gem}
            title="Os Valores"
            items={[
              'Transparência Radical',
              'Inovação Social',
              'Ética e Compromisso',
              'Empatia e Respeito',
              'Verificação Contínua',
            ]}
          />
        </div>
      </section>

      {/* Matchfunding */}
      <section className="bg-gradient-to-br from-[#0A3D36] to-[#0A665C] py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-6">
              <SectionLabel>/ Matchfunding</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Sua doação pode valer o dobro.
              </h2>
              <p className="text-teal-100 text-sm leading-relaxed">
                O matchfunding é um mecanismo em que patrocinadores parceiros complementam as doações recebidas por uma campanha, multiplicando o impacto de cada contribuição.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: 'Multiplicador', desc: 'Cada R$1 doado pode virar R$2 ou mais, dependendo das regras do patrocinador.' },
                  { icon: BarChart3, title: 'Teto e prazo', desc: 'O match tem um valor máximo e um período de validade definidos por campanha.' },
                  { icon: ShieldCheck, title: 'Transparência', desc: 'O patrocinador, o multiplicador e o teto são exibidos claramente antes da doação.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-teal-200" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{title}</p>
                      <p className="text-teal-100/80 text-xs leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-8 space-y-6 border border-white/20">
              <p className="text-teal-200 text-xs font-bold uppercase tracking-widest">Exemplo de doação com match</p>
              <div className="space-y-3">
                {[
                  { label: 'Sua doação', value: 'R$ 100,00', color: 'text-white' },
                  { label: 'Match do patrocinador (1x)', value: '+ R$ 100,00', color: 'text-teal-300' },
                  { label: 'Impacto total para a ONG', value: 'R$ 200,00', color: 'text-teal-200', bold: true },
                ].map(({ label, value, color, bold }) => (
                  <div key={label} className={`flex justify-between items-center ${bold ? 'border-t border-white/20 pt-3 mt-1' : ''}`}>
                    <span className="text-teal-100 text-sm">{label}</span>
                    <span className={`${color} font-bold ${bold ? 'text-xl' : 'text-sm'}`}>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-teal-200/70 text-xs">
                * O valor do match é depositado pelo patrocinador diretamente na ONG após confirmação do pagamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Score da ONG */}
      <section className="max-w-[1000px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <SectionLabel>/ Score de confiabilidade</SectionLabel>
            <h2 className="text-3xl font-bold text-gray-900">Como calculamos o Score da ONG</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Cada ONG cadastrada recebe uma pontuação de 0 a 100 calculada com base em múltiplos fatores de confiabilidade. Quanto maior o score, maior a evidência de transparência e boa gestão.
            </p>
            <div className="space-y-4 bg-[#F9FAF9] rounded-[1.5rem] p-6 border border-gray-100">
              <ScoreFactor label="CNPJ ativo e validado (Receita Federal)" pct={50} />
              <ScoreFactor label="Consistência de endereço (API de CEP)" pct={25} />
              <ScoreFactor label="Tempo de atuação comprovado (> 5 anos)" pct={25} />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-[#EBE9E3]" strokeWidth="8" fill="transparent" />
                    <circle cx="50" cy="50" r="40" className="stroke-[#0A665C]" strokeWidth="8" fill="transparent"
                      strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.96)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-[#0A3D36]">96</span>
                    <span className="text-[8px] text-gray-400 font-bold">/ 100</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Instituto Rebrota</p>
                  <p className="text-xs text-gray-500">Pontuação máxima - verificado em Jun/2026</p>
                  <span className="inline-flex items-center space-x-1 bg-[#CBDDCD] text-[#0A3D36] text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Parceiro Verificado</span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                O score é recalculado sempre que novos documentos são enviados ou verificações externas são realizadas. Doadores sempre veem a data da última atualização.
              </p>
            </div>

            {/* Verificação documental */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <FileCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-gray-900">Verificação Documental</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cada ONG passa por análise de CNPJ, estatuto social, balanços financeiros, relatórios de atividade e comprovantes de autenticidade. Documentos inconsistentes são sinalizados publicamente antes da exibição completa.
              </p>
              <ul className="space-y-2">
                {[
                  'CNPJ ativo e regular junto à Receita Federal',
                  'Estatuto social atualizado',
                  'Balanço patrimonial e DRE dos últimos 2 anos',
                  'Ata de eleição da diretoria',
                  'Comprovante de regularidade fiscal (CND)',
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-2 text-xs text-gray-600">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Campanhas e Bundles */}
      <section className="bg-[#F9FAF9] py-20 px-6">
        <div className="max-w-[1000px] mx-auto space-y-12">
          <div className="text-center">
            <SectionLabel>/ Formas de apoio</SectionLabel>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Campanhas e Bundles</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Você pode apoiar uma ONG individualmente, contribuir para uma campanha específica ou participar de um bundle - uma iniciativa coletiva que une múltiplas organizações em torno de uma causa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureBlock
              icon={Heart}
              title="Doação para ONG"
              description="Você escolhe uma ONG verificada e doa diretamente para ela. Sua contribuição vai para o caixa da organização e você recebe o recibo e acompanha o impacto."
            />
            <FeatureBlock
              icon={Star}
              title="Campanha Individual"
              description="Campanhas com objetivo, meta e prazo definidos pela ONG. Você vê o progresso em tempo real, o status da campanha e recebe recibo ao finalizar."
              items={['Meta e prazo definidos', 'Progresso em tempo real', 'Status: ativa, encerrada, arquivada']}
            />
            <FeatureBlock
              icon={Layers}
              title="Bundle"
              description="Um bundle reúne múltiplas ONGs em torno de uma causa temática. Sua doação é distribuída entre as organizações participantes conforme as regras de rateio públicas."
              items={['ONGs participantes listadas', 'Regra de distribuição transparente', 'Transparência agregada']}
            />
          </div>
        </div>
      </section>

      {/* Recibos e impacto */}
      <section className="max-w-[1000px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <SectionLabel>/ Para doadores</SectionLabel>
            <h2 className="text-3xl font-bold text-gray-900">Acompanhe cada centavo do seu apoio</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Após cada doação confirmada, você recebe um recibo com todos os dados da transação. No seu perfil, você tem acesso ao histórico completo de doações, recibos para download e o impacto gerado por cada ONG apoiada.
            </p>
            <div className="space-y-4">
              {[
                { icon: FileCheck, title: 'Recibo digital', desc: 'Emitido automaticamente após confirmação do pagamento, com dados da ONG, valor e data.' },
                { icon: BarChart3, title: 'Histórico de doações', desc: 'Visualize todas as suas contribuições, status de pagamento e valores de match aplicados.' },
                { icon: ShieldCheck, title: 'Relatórios públicos das ONGs', desc: 'As ONGs publicam relatórios de prestação de contas com data de atualização visível.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start space-x-4">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#F9FAF9] rounded-[2rem] p-8 border border-gray-100 space-y-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Exemplo de recibo</p>
            <div className="bg-white rounded-2xl p-6 border border-dashed border-gray-200 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">ONG</p>
                  <p className="font-bold text-gray-900 text-sm mt-1">Instituto Rebrota</p>
                </div>
                <span className="bg-[#CBDDCD] text-[#0A3D36] text-[10px] font-bold px-2.5 py-1 rounded-full">Confirmado</span>
              </div>
              {[
                { label: 'Data', value: '02 Jun 2026' },
                { label: 'Valor doado', value: 'R$ 100,00' },
                { label: 'Match aplicado', value: 'R$ 100,00' },
                { label: 'Impacto total', value: 'R$ 200,00' },
                { label: 'Método', value: 'PIX' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
              <button className="w-full mt-2 border border-teal-200 text-teal-700 text-xs font-bold py-2.5 rounded-lg hover:bg-teal-50 transition">
                Baixar Recibo PDF
              </button>
            </div>
          </div>
        </div>
      </section>



      <Footer onNavigate={onNavigate} />
    </div>
  );
}
