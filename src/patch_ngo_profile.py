from pathlib import Path
path = Path(r'c:\Users\conde\gitprojects\ongplus\frontend\src\Pages\NgoProfilePage.jsx')
text = path.read_text(encoding='utf-8')
start_marker = '          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">'
end_marker = '        {/* Histórico de Campanhas */}'
start = text.find(start_marker)
end = text.find(end_marker, start)
if start == -1 or end == -1:
    raise SystemExit('Could not find replacement markers')
old_block = text[start:end]
new_block = '''          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
'''
text = text[:start] + new_block + text[end:]
path.write_text(text, encoding='utf-8')
print('patched')
