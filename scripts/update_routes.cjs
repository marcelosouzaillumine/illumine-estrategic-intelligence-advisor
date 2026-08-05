const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Insert imports
if (!content.includes('internationalRoutes')) {
  content = content.replace(
    "import { renderCurrentPage } from './app/routes';",
    "import { renderCurrentPage } from './app/routes';\nimport { internationalRoutes, SupportedLocale } from './core/routing/internationalRoutes';"
  );
}

const originalRoutes = `
                    {/* Institutional V2 Routes */}
                    <Route element={<InstitutionalLayout />}>
                      <Route path="/" element={<InstitutionalHomePage />} />
                      <Route path="/tese" element={<Navigate to="/manifesto" replace />} />
                      <Route path="/manifesto" element={<InstitutionalManifestoPage />} />
                      <Route path="/por-que-illumine" element={<InstitutionalWhyPage />} />
                      <Route path="/plataforma" element={<InstitutionalPlatformPage />} />
                      <Route path="/dominios" element={<InstitutionalDomainsPage />} />
                      <Route path="/governanca" element={<InstitutionalGovernancePage />} />
                      <Route path="/centro-de-inteligencia" element={<InstitutionalIntelligenceCenterPage />} />
                      <Route path="/intelligence-center" element={<ExecutiveIntelligenceCenterPage />} />
                      <Route path="/assessment" element={<ExecutiveAssessmentPage />} />
                      {import.meta.env.DEV && (
                        <Route path="/debug/i18n" element={<DebugI18nPage />} />
                      )}
                      <Route path="/contato" element={
                          <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-center">
                              <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                                  <h3 className="text-2xl font-bold text-white mb-4">Contato Institucional</h3>
                                  <p className="text-slate-400 mb-8">A primeira etapa para conhecer a Illumine é realizar um Executive Assessment™.</p>
                                  <a href="/assessment" className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                      Iniciar Assessment
                                  </a>
                              </div>
                          </div>
                      } />
                      {/* Fallbacks temporários para as páginas de apoio antigas dentro do novo layout */}
                      <Route path="/advisory" element={<ExecutiveAdvisorNetworkLandingPage />} />
                      <Route path="/network" element={<ExecutiveAdvisorNetworkLandingPage />} />
                      <Route path="/insights" element={<ExecutivePlatformLandingPage />} />
                    </Route>`;

const newRoutes = `
                    {/* Institutional V2 Routes (Internationalized) */}
                    {Object.keys(internationalRoutes.home).map((locale) => {
                      const l = locale as SupportedLocale;
                      return (
                        <Route key={l} element={<InstitutionalLayout />}>
                          <Route path={internationalRoutes.home[l]} element={<InstitutionalHomePage />} />
                          <Route path={internationalRoutes.manifesto[l]} element={<InstitutionalManifestoPage />} />
                          <Route path={internationalRoutes.why[l]} element={<InstitutionalWhyPage />} />
                          <Route path={internationalRoutes.platform[l]} element={<InstitutionalPlatformPage />} />
                          <Route path={internationalRoutes.domains[l]} element={<InstitutionalDomainsPage />} />
                          <Route path={internationalRoutes.governance[l]} element={<InstitutionalGovernancePage />} />
                          <Route path={internationalRoutes.intelligenceCenter[l]} element={<InstitutionalIntelligenceCenterPage />} />
                          <Route path={internationalRoutes.assessment[l]} element={<ExecutiveAssessmentPage />} />
                          <Route path={internationalRoutes.contact[l]} element={
                              <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-center">
                                  <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                                      <h3 className="text-2xl font-bold text-white mb-4">Contato Institucional</h3>
                                      <p className="text-slate-400 mb-8">A primeira etapa para conhecer a Illumine é realizar um Executive Assessment™.</p>
                                      <a href={internationalRoutes.assessment[l]} className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                          Iniciar Assessment
                                      </a>
                                  </div>
                              </div>
                          } />
                          {/* Legacy mappings for campaigns */}
                          <Route path="/advisory" element={<ExecutiveAdvisorNetworkLandingPage />} />
                          <Route path="/network" element={<ExecutiveAdvisorNetworkLandingPage />} />
                          <Route path="/insights" element={<ExecutivePlatformLandingPage />} />
                        </Route>
                      );
                    })}
                    
                    {/* Dev routes */}
                    {import.meta.env.DEV && (
                      <Route element={<InstitutionalLayout />}>
                        <Route path="/debug/i18n" element={<DebugI18nPage />} />
                      </Route>
                    )}
                    
                    {/* Root Redirect to language prefix */}
                    <Route path="/" element={<Navigate to="/pt" replace />} />
                    <Route path="/tese" element={<Navigate to="/pt/manifesto" replace />} />
`;

content = content.replace(originalRoutes, newRoutes);
fs.writeFileSync(appPath, content);
console.log('App.tsx updated');
