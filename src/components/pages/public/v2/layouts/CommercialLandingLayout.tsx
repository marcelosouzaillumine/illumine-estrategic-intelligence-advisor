import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export function CommercialLandingLayout() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-amber-500/30 selection:text-white flex flex-col">
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 z-50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <img src="/logo.png" alt="Illumine" className="w-10 h-10 object-contain transition-transform group-hover:scale-105 duration-500" />
            <div className="flex flex-col">
              <span 
                className="text-2xl tracking-[-0.04em] text-white leading-none block" 
                style={{ fontFamily: '"Tilt Warp", sans-serif' }}
              >
                illumine
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050506] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="text-white font-bold tracking-widest uppercase text-sm">Illumine</span>
            <span className="text-slate-500 text-xs">Executive Intelligence Platform™</span>
            <span className="text-slate-600 text-xs mt-2">© {new Date().getFullYear()} Illumine.</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <Link to="/pt/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/pt/termos" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
