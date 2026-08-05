import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { PageFrame, Container, Section } from '../../../ui/public/institutional/InstitutionalContentSystem';
import { useExecutiveFormatter } from '../../../../core/localization';

export function DebugI18nPage() {
  const { language } = useLanguage();
  const { i18n } = useTranslation();
  const formatter = useExecutiveFormatter();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const debugInfo = {
    'i18next Language': i18n.language,
    'Context Language': language,
    'Resolved Language': i18n.resolvedLanguage,
    'Fallback Language': (i18n.options.fallbackLng as string[] | string) || 'none',
    'Browser Language': navigator.language,
    'Persisted Language': localStorage.getItem('illumine-language') || 'none',
    'Current Namespace (default)': i18n.options.defaultNS,
    'Loaded Namespaces': i18n.reportNamespaces ? i18n.reportNamespaces.getUsedNamespaces().join(', ') : 'unknown',
    'Current Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    'Current Date Format (short)': formatter.date(now, { dateStyle: 'short' }),
    'Current Number Format': formatter.currency(1234.56, { currency: 'BRL' }),
  };

  return (
    <PageFrame>
      <Section className="bg-black pt-32 pb-16 min-h-screen">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">i18n Debug Console</h1>
            
            <div className="bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-semibold text-white">Runtime Information</h2>
              </div>
              
              <div className="p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {Object.entries(debugInfo).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-slate-400 mb-1">{key}</dt>
                      <dd className="text-base text-white font-mono break-all bg-black/50 p-2 rounded border border-white/5">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            
            <div className="mt-8 bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-semibold text-white">Live Test</h2>
              </div>
              <div className="p-6">
                <p className="text-slate-300 mb-4">
                  Testing key <code className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">institutional:hero.title</code>:
                </p>
                <div className="text-xl font-bold text-white bg-black/50 p-4 rounded-lg border border-white/10">
                  {i18n.t('institutional:hero.title')}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </PageFrame>
  );
}
