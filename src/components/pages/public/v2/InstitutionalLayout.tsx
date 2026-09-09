import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { getLocalizedRoute, RouteKey, SupportedLocale } from '../../../../core/routing/internationalRoutes';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExecutiveCopilotWidget } from '../../../ui/public/institutional/copilot/ExecutiveCopilotWidget';
import { LanguageSelector } from '../../../ui/public/institutional/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useInstitutionalAuth } from '../../../../core/security/auth/InstitutionalAuthProvider';

export function InstitutionalLayout() {
  const { user } = useInstitutionalAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t: tNav, i18n } = useTranslation('navigation');
  const { t: tFooter } = useTranslation('footer');
  
  const currentLang = i18n.language === 'en-US' ? 'en' : i18n.language === 'es-ES' ? 'es' : 'pt';
  const loginUrl = `/${currentLang}/login`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/' || location.pathname.match(/^\/(pt|en|es)\/?$/) !== null;

  const currentLocale = (i18n.language === 'en-US' ? 'en-US' : i18n.language === 'es-ES' ? 'es-ES' : 'pt-BR') as SupportedLocale;

  type NavNode = { label: string; subtitle?: string; href?: string; children?: NavNode[] };

  const navLinks: NavNode[] = [
    { 
      label: tNav('nav.platform'),
      children: [
        { label: tNav('nav.manifesto'), href: getLocalizedRoute('MANIFESTO', currentLocale) },
        { label: tNav('nav.architecture'), href: getLocalizedRoute('PLATFORM', currentLocale) },
        { label: tNav('nav.governance_network'), href: getLocalizedRoute('DOMAINS', currentLocale) },
        { label: 'Trust Architecture™', href: getLocalizedRoute('GOVERNANCE', currentLocale) },
      ]
    },
    { 
      label: tNav('nav.solutions'),
      children: [
        { 
          label: 'Enterprise Governance™', 
          subtitle: tNav('nav.enterprise_sub'),
          href: getLocalizedRoute('ENTERPRISE', currentLocale) 
        },
        { 
          label: 'Nonprofit Governance™', 
          subtitle: tNav('nav.nonprofit_sub'),
          href: getLocalizedRoute('NONPROFIT', currentLocale) 
        },
      ]
    },
    {
      label: tNav('nav.ecosystem'),
      children: [
        { label: 'Executive Governance Center™', href: getLocalizedRoute('GOVERNANCE_CENTER', currentLocale) },
        { label: 'Advisor Network™', href: getLocalizedRoute('ADVISOR_NETWORK', currentLocale) },
      ]
    },
    {
      label: tNav('nav.trust'),
      children: [
        { label: 'Privacy Governance™', href: getLocalizedRoute('PRIVACY', currentLocale) },
        { label: tNav('nav.security_arch'), href: getLocalizedRoute('SECURITY', currentLocale) },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      {/* Navbar */}
        <header
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
          isScrolled 
            ? "bg-[#0A0A0B]/95 border-white/5 py-4" 
            : "bg-transparent border-transparent py-8"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src="/logo.png" alt="Illumine" className="w-8 h-8 object-contain transition-transform group-hover:scale-105 duration-500" />
            <span 
              className="text-3xl tracking-[-0.04em] text-white leading-[0.8] block group-hover:text-amber-500 transition-colors duration-500" 
              style={{ fontFamily: '"Tilt Warp", sans-serif' }}
            >
              illumine
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-8 px-4">
            {navLinks.map((link) => (
              link.children ? (
                <div key={link.label} className="relative group">
                  <button className="flex items-center gap-1 text-[16px] xl:text-[18px] font-semibold text-slate-400 group-hover:text-white transition-all duration-300 text-center whitespace-nowrap">
                    {link.label}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-black/80 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-2 min-w-[240px] flex flex-col backdrop-blur-2xl">
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          to={child.href || ''}
                          className="px-4 py-3 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all text-sm font-medium block"
                        >
                          <div className="flex flex-col gap-1">
                            <span>{child.label}</span>
                            {child.subtitle && (
                              <span className="text-xs text-slate-500 font-normal whitespace-normal line-clamp-2 min-w-[200px] max-w-[300px]">
                                {child.subtitle}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  key={link.href} 
                  to={link.href || ''}
                  className="text-[16px] xl:text-[18px] font-semibold text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 text-center whitespace-nowrap"
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 relative z-[60]">
            <LanguageSelector />
            {user ? (
              <a 
                href={loginUrl}
                className="text-[16px] xl:text-[18px] font-semibold text-slate-400 hover:text-white transition-all px-2 xl:px-4 py-2 cursor-pointer relative z-[70]"
              >
                Dashboard
              </a>
            ) : (
              <a 
                href={loginUrl}
                className="text-[16px] xl:text-[18px] font-semibold text-slate-400 hover:text-white transition-all px-2 xl:px-4 py-2 cursor-pointer relative z-[70]"
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            type="button"
            className="lg:hidden text-slate-400 hover:text-white p-2 relative z-[60]"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0B] pt-24 px-6 pb-6 flex flex-col overflow-y-auto">
          <nav className="flex flex-col gap-6 text-xl font-medium">
            {navLinks.map((link) => (
              link.children ? (
                <details key={link.label} className="flex flex-col group/details">
                  <summary className="text-slate-500 text-sm uppercase tracking-wider font-bold flex justify-between items-center cursor-pointer list-none">
                    {link.label}
                    <ChevronDown size={16} className="group-open/details:rotate-180 transition-transform" />
                  </summary>
                  <div className="flex flex-col gap-4 pl-4 border-l border-white/10 mt-4">
                    {link.children.map(child => (
                      <Link 
                        key={child.href} 
                        to={child.href || ''}
                        className="text-slate-300 hover:text-white transition-colors flex flex-col gap-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{child.label}</span>
                        {child.subtitle && (
                          <span className="text-sm text-slate-500 font-normal">{child.subtitle}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link 
                  key={link.href} 
                  to={link.href || ''}
                  className="text-slate-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>
          
          <div className="mt-8 flex justify-center border-t border-white/5 pt-8">
            <LanguageSelector />
          </div>

          <div className="mt-auto mb-12 flex flex-col gap-4">
            {user ? (
              <Link 
                to={loginUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-base font-semibold bg-[#1A212E] text-white border border-[#202733] px-6 py-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] block"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to={loginUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-base font-semibold bg-[#1A212E] text-white border border-[#202733] px-6 py-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] block"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-[100px] lg:pt-[120px]">
        {React.useMemo(() => <Outlet />, [location.pathname])}
      </main>

      {/* Footer */}
        <footer className="border-t border-white/5 py-16 lg:py-24 bg-[#050506] relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 relative z-10">
          <div className="col-span-1 md:col-span-4 lg:col-span-5 pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6 inline-flex group">
              <img src="/logo.png" alt="Illumine" className="w-8 h-8 object-contain transition-transform group-hover:scale-105 duration-500" />
              <span 
                className="text-3xl tracking-[-0.04em] text-white leading-[0.8] block" 
                style={{ fontFamily: '"Tilt Warp", sans-serif' }}
              >
                illumine
              </span>
            </Link>
            
            <p className="text-white text-xl font-medium tracking-tight leading-snug">
              {tFooter('brand.principle_1')}<br />
              <span className="text-amber-500">{tFooter('brand.principle_2')}</span>
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-8 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">{tFooter('sections.platform.title')}</h4>
              <ul className="space-y-4">
                <li><Link to={getLocalizedRoute('MANIFESTO', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">{tFooter('sections.platform.manifesto')}</Link></li>
                <li><Link to={getLocalizedRoute('PLATFORM', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">{tFooter('sections.platform.infrastructure')}</Link></li>
                <li><Link to={getLocalizedRoute('DOMAINS', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">{tFooter('sections.platform.domains')}</Link></li>
                <li><Link to={getLocalizedRoute('ENTERPRISE', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Enterprise Governance™</Link></li>
                <li><Link to={getLocalizedRoute('NONPROFIT', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Nonprofit Governance™</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">{tFooter('sections.ecosystem.title')}</h4>
              <ul className="space-y-4">
                <li><Link to={getLocalizedRoute('GOVERNANCE_CENTER', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">{tFooter('sections.ecosystem.governance_center')}</Link></li>
                <li><Link to={getLocalizedRoute('ADVISOR_NETWORK', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">{tFooter('sections.ecosystem.advisor_network')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">{tFooter('sections.trust.title')}</h4>
              <ul className="space-y-4">
                <li><Link to={getLocalizedRoute('GOVERNANCE', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">{tFooter('sections.trust.trust_architecture')}</Link></li>
                <li><Link to={getLocalizedRoute('PRIVACY', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Privacy Governance™</Link></li>
                <li><Link to={getLocalizedRoute('SECURITY', currentLocale)} className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">{tFooter('sections.trust.security')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <p className="text-slate-500 text-xs font-medium">
            {tFooter('bottom.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/termos" className="hover:text-white transition-colors">{tFooter('bottom.terms_of_use')}</Link>
          </div>
        </div>
      </footer>

      {/* Illumine Advisory Widget */}
      <ExecutiveCopilotWidget />
    </div>
  );
}
