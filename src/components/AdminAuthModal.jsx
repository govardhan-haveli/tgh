import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { JANMASTHAMI_CONFIG } from '../data/data';

export const AdminAuthModal = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPass = password.trim();

    // Check if entered password matches any allowed password from data.js
    if (JANMASTHAMI_CONFIG.adminPasswords.includes(cleanPass)) {
      sessionStorage.setItem('goverdhan_admin_authenticated', 'true');
      onAuthenticated();
    } else {
      setError('Invalid password. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0d1425] border border-amber-500/40 rounded-3xl p-8 shadow-2xl relative text-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
          <ShieldCheck className="w-8 h-8 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-slate-100 font-serif">
          Goverdhan Haveli Admin Portal
        </h2>
        <p className="text-slate-400 text-xs mt-1 mb-6">
          Password protection required to access T-Shirt registration data and accept requests.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              Enter Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/60">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 text-sm"
          >
            <span>Unlock Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-amber-500/10 text-[11px] text-slate-500">
          Goverdhan Haveli Security • Authorized Personnel Only
        </div>
      </motion.div>
    </div>
  );
};
