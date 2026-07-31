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
    { label: 'Tese', href: '/manifesto' },
    { label: 'Plataforma', href: '/plataforma' },
    { label: 'Domínios', href: '/dominios' },
    { label: 'Ecossistema', href: '/ecossistema' },
    { label: 'Governança', href: '/governanca' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled 
            ? "bg-[#0A0A0B]/80 backdrop-blur-md border-white/5 py-4" 
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start group">
            <span 
              className="text-3xl tracking-[-0.04em] text-white leading-[0.8] block group-hover:text-primary transition-colors" 
              style={{ fontFamily: '"Tilt Warp", sans-serif' }}
            >
              illumine
            </span>
            <div 
              className="flex justify-between w-full text-[7px] text-white/70 uppercase mt-[2px] whitespace-nowrap tracking-widest" 
              style={{ fontFamily: '"Work Sans", sans-serif', paddingLeft: '2px' }}
            >
              Governance
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link 
              to="/login"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link 
              to="/assessment"
              className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              Solicitar Assessment
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
              className="text-center text-base font-semibold bg-white text-black px-6 py-4 rounded-full"
            >
              Solicitar Assessment
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
      <footer className="border-t border-white/5 py-12 lg:py-24 mt-24 bg-[#050506]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex flex-col items-start mb-6 inline-flex">
              <span 
                className="text-3xl tracking-[-0.04em] text-white leading-[0.8] block" 
                style={{ fontFamily: '"Tilt Warp", sans-serif' }}
              >
                illumine
              </span>
              <div 
                className="flex justify-between w-full text-[7px] text-white/70 uppercase mt-[2px] whitespace-nowrap tracking-widest" 
                style={{ fontFamily: '"Work Sans", sans-serif', paddingLeft: '2px' }}
              >
                Governance
              </div>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm mb-8">
              A camada de inteligência entre a organização e suas decisões estratégicas.
            </p>
            <p className="text-white font-medium text-lg leading-tight">
              A inteligência amplia.<br />
              <span className="text-slate-500">A decisão permanece humana.</span>
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Plataforma</h4>
            <ul className="space-y-4">
              <li><Link to="/plataforma" className="text-slate-400 hover:text-white text-sm transition-colors">Visão Geral</Link></li>
              <li><Link to="/foundation" className="text-slate-400 hover:text-white text-sm transition-colors">Intelligence Foundation™</Link></li>
              <li><Link to="/engine" className="text-slate-400 hover:text-white text-sm transition-colors">Intelligence Engine™</Link></li>
              <li><Link to="/advisory" className="text-slate-400 hover:text-white text-sm transition-colors">Executive Advisory™</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Trust Architecture™</h4>
            <ul className="space-y-4">
              <li><Link to="/trust" className="text-slate-400 hover:text-white text-sm transition-colors">Visão Geral de Confiança</Link></li>
              <li><Link to="/trust#constitution" className="text-slate-400 hover:text-white text-sm transition-colors">Intelligence Constitution</Link></li>
              <li><Link to="/trust#security" className="text-slate-400 hover:text-white text-sm transition-colors">Security & Governance</Link></li>
              <li><Link to="/trust#explainability" className="text-slate-400 hover:text-white text-sm transition-colors">Explainable Intelligence</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Ecossistema</h4>
            <ul className="space-y-4">
              <li><Link to="/enterprise" className="text-slate-400 hover:text-white text-sm transition-colors">Illumine Enterprise™</Link></li>
              <li><Link to="/network" className="text-slate-400 hover:text-white text-sm transition-colors">Advisor Network™</Link></li>
              <li><Link to="/assessment" className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">Maturity Assessment</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Illumine Governance. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
