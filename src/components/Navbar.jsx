import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Shirt, Image, Home } from 'lucide-react';
import { JANMASTHAMI_CONFIG } from '../data/data';
import logoImg from '../assets/logo.png';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Register T-Shirt', path: '/register', icon: Shirt, highlight: true },
    { name: 'Photos & Videos', path: '/#gallery', icon: Image, isHash: true }
  ];

  const handleNavClick = (link) => {
    setIsOpen(false);
    if (link.isHash) {
      if (location.pathname !== '/') {
        // If not on home page, route to home with hash
        window.location.href = `/#${link.path.replace('/#', '')}`;
      } else {
        const element = document.getElementById(link.path.replace('/#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0f1d]/90 border-b border-amber-500/20 shadow-lg shadow-amber-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Group Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <img
                src={logoImg}
                alt="Goverdhan Haveli Logo"
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400"
              />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-wide font-serif">
                {JANMASTHAMI_CONFIG.groupName}
              </span>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-300/80 font-medium">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Janmashtami Mahotsav</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              }

              if (link.isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link);
                    }}
                    className="flex items-center gap-2 text-slate-300 hover:text-amber-300 transition text-sm font-medium cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-amber-400/70" />
                    <span>{link.name}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition ${
                    isActive ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-amber-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400/70" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button - Optimized touch target */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 focus:outline-none active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Touch-Friendly Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1424] border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            if (link.isHash) {
              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-amber-500/10 hover:text-amber-400 active:scale-98 text-base font-medium"
                >
                  <Icon className="w-5 h-5 text-amber-400" />
                  <span>{link.name}</span>
                </a>
              );
            }
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition active:scale-98 ${
                  link.highlight
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-200 hover:bg-amber-500/10 hover:text-amber-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
