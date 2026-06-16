                {/* Radar de Governança Integrado - Canônico */}
                <ExecutiveSurface padding="lg" radius="md" className="flex flex-col h-full gap-6 border border-border/50 bg-surface-high/30">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <h3 className="font-semibold text-lg tracking-tight leading-none text-foreground">Radar de Governança</h3>
                    <p className="text-foreground/70 text-sm leading-snug">Dimensões Institucionais de Retenção de Capital.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    {[
                      { label: 'Sustentabilidade Patrimonial', value: cpiStatus !== 'NEUTRO' ? cpiStatus : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color },
                      { label: 'Dependência de Capitalização', value: fiduciaryOutput?.capitalSupportRatio === 'NOT_AVAILABLE' ? 'N/A' : fiduciaryOutput?.capitalSupportRatio != null ? `${(fiduciaryOutput.capitalSupportRatio * 100).toFixed(1)}%` : '—', badge: retentionStyle.label, badgeColor: retentionStyle.color },
                      { label: 'Capacidade Distributiva', value: distribution?.distributionRatio != null && distribution.distributionRatio > 0 ? `${(distribution.distributionRatio * 100).toFixed(1)}%` : 'Inexistente', badge: distributionStyle.label, badgeColor: distributionStyle.color },
                      { label: 'Integridade Patrimonial', value: preservation ? `${(preservation.equityPreservationRatio * 100).toFixed(1)}%` : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color }
                    ].map(({ label, value, badge, badgeColor }) => {
                      const tone = badgeColor.includes('emerald') || badgeColor.includes('success') ? 'success' :
                                   badgeColor.includes('amber') || badgeColor.includes('warning') ? 'warning' :
                                   badgeColor.includes('rose') || badgeColor.includes('critical') ? 'critical' :
                                   badgeColor.includes('blue') || badgeColor.includes('info') ? 'info' : 'neutral';
                      
                      let statusBadgeType: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | undefined;
                      if (tone === 'success') statusBadgeType = 'HEALTHY';
                      else if (tone === 'warning') statusBadgeType = 'WARNING';
                      else if (tone === 'critical') statusBadgeType = 'CRITICAL';
                      else statusBadgeType = 'NEUTRAL';
                      
                      return (
                        <ExecutiveMetricCard
                          key={label}
                          label={label}
                          value={value}
                          statusBadge={statusBadgeType}
                          tone={tone as any}
                          variant="transparent"
                          className="bg-surface-container/30"
                        />
                      );
                    })}
                  </div>
                </ExecutiveSurface>
