import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InstitutionalLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const navLinks = [
    { label: 'Manifesto', href: '/manifesto' },
    { label: 'Plataforma', href: '/plataforma' },
    { label: 'Domínios', href: '/dominios' },
    { label: 'Por que Illumine', href: '/por-que-illumine' },
    { label: 'Governança', href: '/governanca' },
    { label: 'Centro de Inteligência', href: '/centro-de-inteligencia' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
          isScrolled 
            ? "bg-[#0A0A0B]/80 backdrop-blur-xl border-white/5 py-4" 
            : "bg-transparent border-transparent py-8"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Illumine" className="w-8 h-8 object-contain transition-transform group-hover:scale-105 duration-500" />
            <span 
              className="text-3xl tracking-[-0.04em] text-white leading-[0.8] block group-hover:text-amber-500 transition-colors duration-500" 
              style={{ fontFamily: '"Tilt Warp", sans-serif' }}
            >
              illumine
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href}
                className="text-[13px] font-semibold text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link 
              to="/login"
              className="text-[13px] font-semibold text-slate-400 hover:text-white transition-all px-4 py-2"
            >
              Login
            </Link>
            <Link 
              to="/assessment"
              className="text-[13px] font-bold bg-white text-black px-6 py-2.5 rounded-full hover:scale-105 hover:bg-slate-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.08)] flex items-center gap-2"
            >
              Iniciar Executive Assessment
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0B] pt-24 px-6 flex flex-col">
          <nav className="flex flex-col gap-6 text-xl font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto mb-12 flex flex-col gap-4">
            <Link 
              to="/assessment"
              className="text-center text-base font-semibold bg-white text-black px-6 py-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Iniciar Executive Assessment™
            </Link>
            <Link 
              to="/login"
              className="text-center text-base font-medium text-slate-400 py-4 border border-white/10 rounded-full"
            >
              Login Plataforma
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-[80px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 lg:py-24 mt-24 bg-[#050506] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

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
              A inteligência amplia.<br />
              <span className="text-amber-500">A decisão permanece humana.</span>
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-8 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">Plataforma</h4>
              <ul className="space-y-4">
                <li><Link to="/manifesto" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Manifesto</Link></li>
                <li><Link to="/plataforma" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Infraestrutura</Link></li>
                <li><Link to="/dominios" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Domínios</Link></li>
                <li><Link to="/enterprise" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Enterprise</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">Ecossistema</h4>
              <ul className="space-y-4">
                <li><Link to="/centro-de-inteligencia" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Executive Intelligence Center</Link></li>
                <li><Link to="/network" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Advisor Network</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">Confiança</h4>
              <ul className="space-y-4">
                <li><Link to="/governanca" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Trust Architecture</Link></li>
                <li><Link to="/governanca" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Security</Link></li>
                <li><Link to="/privacidade" className="text-[13px] font-medium text-slate-400 hover:text-amber-500 hover:translate-x-1 inline-block transition-all">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <p className="text-slate-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} Illumine Governance. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
