import React, { useState } from 'react';
import { Anchor, Play, Menu, X, Maximize2 } from 'lucide-react';

interface NavbarProps {
  onLaunchDemo: () => void;
  onOpenFullPage3D?: () => void;
}

export function Navbar({ onLaunchDemo, onOpenFullPage3D }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'SYSTEM', href: '#system-overview' },
    { label: 'LIVE SIMULATION', href: '#interactive-simulation' },
    { label: 'SENSORS', href: '#sensor-inspection' },
    { label: 'FUSION', href: '#sensor-fusion' },
    { label: 'MAPPING', href: '#seafloor-mapping' },
    { label: 'ARCHITECTURE', href: '#architecture' },
    { label: 'TECH STACK', href: '#tech-stack' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060b14]/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Project Branding */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-950">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-white group-hover:text-cyan-300 transition flex items-center gap-2">
              SIH 26064 • SEAFLOOR PROBE
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                PROTOTYPE
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              MoES / NCPOR • Robotics & Drones
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-cyan-300 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onOpenFullPage3D && (
            <button
              onClick={onOpenFullPage3D}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-800/80 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95"
              title="Open full page 3D interactive viewer with all telemetry details"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D VIEW</span>
            </button>
          )}

          <button
            onClick={onLaunchDemo}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>LAUNCH DEMO</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070e1c] border-b border-slate-800 px-4 py-4 space-y-3 font-mono text-xs animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-cyan-300 border-b border-slate-800/60"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            {onOpenFullPage3D && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFullPage3D();
                }}
                className="flex-1 py-2 rounded-lg bg-slate-800 text-cyan-300 font-bold flex items-center justify-center gap-1.5 border border-cyan-800"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>3D VIEW</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchDemo();
              }}
              className="flex-1 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>LAUNCH DEMO</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
