              {/* --- ZONA B: ANALÍTICA ESSENCIAL --- */}
              {patrimonialIntelligenceReport.analyticalContextIntegrity?.isValid ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Contexto do Cliente */}
                  <div className="bg-slate-50 rounded-[40px] p-8 md:p-10 border border-slate-200">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-slate-300 bg-white text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Contexto Institucional</span>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-sm font-semibold text-slate-500">Segmento</span>
                        <span className="text-sm font-bold text-slate-800">{patrimonialIntelligenceReport.analyticalContext?.clientContext.segment || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-sm font-semibold text-slate-500">Estágio do Negócio</span>
                        <span className="text-sm font-bold text-slate-800">{patrimonialIntelligenceReport.analyticalContext?.clientContext.businessStage || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-sm font-semibold text-slate-500">Perfil Operacional</span>
                        <span className="text-sm font-bold text-slate-800">{patrimonialIntelligenceReport.analyticalContext?.clientContext.operatingProfile || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inteligência Patrimonial */}
                  <div className="bg-slate-50 rounded-[40px] p-8 md:p-10 border border-slate-200">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-slate-300 bg-white text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Inteligência Patrimonial</span>
                    <div className="space-y-4 text-sm text-slate-700 font-medium">
                      <p><strong>Solvência:</strong> {patrimonialIntelligenceReport.analyticalContext?.patrimonialIntelligence.solvencyReading}</p>
                      <p><strong>Liquidez:</strong> {patrimonialIntelligenceReport.analyticalContext?.patrimonialIntelligence.liquidityReading}</p>
                      <p><strong>Estrutura de Capital:</strong> {patrimonialIntelligenceReport.analyticalContext?.patrimonialIntelligence.capitalStructureReading}</p>
                      <p><strong>Preservação:</strong> {patrimonialIntelligenceReport.analyticalContext?.patrimonialIntelligence.capitalPreservationReading}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-xl mb-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold mb-1">CONTEXTO ANALÍTICO DEGRADADO</h4>
                    <p className="text-sm">Os dados técnicos estão disponíveis, mas a interpretação contextual está comprometida.</p>
                  </div>
                </div>
              )}
