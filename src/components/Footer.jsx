import React from 'react';
import { JANMASTHAMI_CONFIG } from '../data/data';
import logoImg from '../assets/logo.png';

export const Footer = () => {
  return (
    <footer className="border-t border-amber-500/20 bg-[#080d19] text-slate-300 py-10 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand info */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <img
            src={logoImg}
            alt="Goverdhan Haveli Logo"
            className="w-10 h-10 rounded-full border border-amber-400 object-cover flex-shrink-0"
          />
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent font-serif">
              {JANMASTHAMI_CONFIG.groupName}
            </span>
            <p className="text-xs text-slate-400">
              Shree Krishna Janmashtami Mahotsav Celebration
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-500 text-center sm:text-right">
          © {new Date().getFullYear()} Goverdhan Haveli Group. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};
