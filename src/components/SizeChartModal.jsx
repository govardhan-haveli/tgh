import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatSizeKey } from '../data/data';

export const SizeChartModal = ({ isOpen, onClose, sizes = [] }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0d1425] border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-b border-amber-500/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <Ruler className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-amber-200 font-serif tracking-wide flex items-center gap-2">
                  <span>T-SHIRTS SIZE LIST & GUIDE</span>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Detailed chest width, shirt length & age recommendations in inches
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-amber-500/20"
              title="Close Size Chart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body / Size Chart Table */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-grow">
            {/* Visual Measurement Help Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#080d19] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>Width:</strong> Measured flat across chest 1 inch below armhole</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span><strong>Length:</strong> Measured from highest point of shoulder to bottom hem</span>
              </div>
            </div>

            {/* Size Chart Table */}
            <div className="rounded-2xl border border-amber-500/30 overflow-hidden bg-[#080d19]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 uppercase font-extrabold border-b border-amber-500/30">
                      <th className="p-3 sm:p-3.5 text-center">Size No</th>
                      <th className="p-3 sm:p-3.5 text-center">Size Label</th>
                      <th className="p-3 sm:p-3.5 text-center">Width (Inches)</th>
                      <th className="p-3 sm:p-3.5 text-center">Length (Inches)</th>
                      <th className="p-3 sm:p-3.5 text-center">Recommended Age / Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-500/10 text-slate-200 font-mono">
                    {sizes.map((sz, idx) => {
                      const sizeNo = typeof sz === 'object' ? sz.size : String(sz);
                      const label = typeof sz === 'object' ? sz.label : '';
                      const width = typeof sz === 'object' ? sz.width : '';
                      const length = typeof sz === 'object' ? sz.length : '';
                      const year = typeof sz === 'object' ? sz.year : '';

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-amber-500/5 transition text-center"
                        >
                          <td className="p-2.5 sm:p-3 font-extrabold text-amber-300 font-sans">{sizeNo}</td>
                          <td className="p-2.5 sm:p-3 font-bold text-yellow-300">{label || '-'}</td>
                          <td className="p-2.5 sm:p-3 text-slate-100">{width ? `${width}"` : '-'}</td>
                          <td className="p-2.5 sm:p-3 text-slate-100">{length ? `${length}"` : '-'}</td>
                          <td className="p-2.5 sm:p-3 text-amber-200/90 font-semibold font-sans">{year || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-[#080d19] border-t border-amber-500/20 flex items-center justify-between flex-shrink-0">
            <span className="text-xs text-slate-400">
              * Sizes available from 18 (Kids 6M) to 58 (Adult 9XL)
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-amber-500/20"
            >
              Got it, Close Chart
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
