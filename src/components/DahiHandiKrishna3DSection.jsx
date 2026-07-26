import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Award, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import krishna3DImg from '../assets/krishna-dahi-handi-3d.png';

export const DahiHandiKrishna3DSection = () => {
  const [isBroken, setIsBroken] = useState(false);
  const [butterSplashCount, setButterSplashCount] = useState(0);

  const triggerDahiHandiBreak = () => {
    setIsBroken(true);
    setButterSplashCount((prev) => prev + 1);

    // Multi-stage festive confetti celebration
    const count = 220;
    const defaults = {
      origin: { y: 0.6 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#f59e0b', '#fbbf24', '#ffffff']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#ec4899', '#8b5cf6', '#3b82f6']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#eab308', '#ffffff', '#f43f5e']
    });

    setTimeout(() => setIsBroken(false), 4000);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#070b14] via-[#0d1425] to-[#070b14]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Grand 3D Dahi Handi Mahotsav</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl md:text-6xl font-black font-serif bg-gradient-to-r from-amber-100 via-amber-300 via-pink-300 to-yellow-400 bg-clip-text text-transparent tracking-tight leading-tight"
          >
            Makhan Chor Bal Krishna Dahi Handi
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-300 text-xs sm:text-base leading-relaxed font-light"
          >
            Witness the energetic 3D spectacle of young Lord Krishna atop the human pyramid, breaking the hanging earthen pot of pure white butter while joyful village friends celebrate with vibrant colors & cheers!
          </motion.p>
        </div>

        {/* Main Interactive 3D Card Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative group rounded-3xl overflow-hidden border border-amber-500/30 bg-[#0d1425]/80 shadow-2xl shadow-amber-500/10 backdrop-blur-xl"
        >
          {/* Animated Glowing Frame border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 rounded-3xl opacity-30 group-hover:opacity-60 blur-md transition duration-700"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-4 sm:p-8">

            {/* 3D Image Showcase Container */}
            <div className="lg:col-span-7 relative group/img overflow-hidden rounded-2xl border border-amber-400/30 bg-[#080d19]">

              {/* Floating Badges on Image */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 font-black text-xs shadow-md backdrop-blur-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current text-slate-950" />
                  <span>Govinda Ala Re!</span>
                </span>
                {butterSplashCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 rounded-full bg-pink-500 text-white font-extrabold text-xs shadow-md"
                  >
                    🧈 {butterSplashCount} Pots Broken!
                  </motion.span>
                )}
              </div>

              {/* 3D Illustration */}
              <motion.img
                src={krishna3DImg}
                alt="3D Bal Krishna Breaking Dahi Handi Pot"
                animate={isBroken ? { scale: [1, 1.04, 1], rotate: [0, -1, 1, 0] } : {}}
                transition={{ duration: 0.6 }}
                className="w-full h-[360px] sm:h-[480px] object-cover object-center rounded-2xl transform group-hover/img:scale-105 transition duration-700"
              />

              {/* Dynamic Butter & Color Particles Overlay when Broken */}
              <AnimatePresence>
                {isBroken && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-amber-500/30 via-pink-500/20 to-transparent pointer-events-none flex items-center justify-center p-4"
                  >
                    <div className="text-center space-y-2">
                      <motion.div
                        initial={{ scale: 0.5, y: -20 }}
                        animate={{ scale: 1.2, y: 0 }}
                        className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_4px_12px_rgba(245,158,11,0.8)] font-serif"
                      >
                        🧈 MAKHAN SPLASH! 💥
                      </motion.div>
                      <p className="text-amber-200 text-xs sm:text-sm font-bold drop-shadow">
                        Divine Butter & Gulal Colors Everywhere!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Light gradient highlight */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d19] via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>

            {/* Content & Action Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Dahi Handi Special Feature</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif leading-snug">
                  Break the Divine Pot & Celebrate Janmashtami!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Join the village celebration of Goverdhan Haveli. Tap the interactive button below to trigger the Dahi Handi butter splash and fireworks confetti!
                </p>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#080d19] border border-amber-500/20 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                    🍯
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Pure Makhan</h4>
                    <p className="text-[10px] text-slate-400">Fresh Makkhan & Curd</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#080d19] border border-pink-500/20 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-sm">
                    🎨
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Gulal Colors</h4>
                    <p className="text-[10px] text-slate-400">Holi Festival Vibes</p>
                  </div>
                </div>
              </div>

              {/* Interactive Break Handi Button */}
              <div className="pt-4 space-y-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={triggerDahiHandiBreak}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
                >
                  <Zap className="w-5 h-5 fill-slate-950 animate-bounce" />
                  <span>Break Dahi Handi Pot Now! 🏺💥</span>
                </motion.button>

                <p className="text-center text-[11px] text-slate-400 font-medium">
                  ✨ Tap to release butter confetti & festive colors!
                </p>
              </div>

            </div>

          </div>
        </motion.div>

        {/* 3 Festival Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#0d1425] border border-amber-500/30 space-y-3 shadow-xl"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg">
              👶
            </div>
            <h3 className="text-base font-extrabold text-slate-100 font-serif">
              Makhan Chor Krishna
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Celebrating young Lord Krishna's playful antics of stealing freshly churned butter from pots hung high in Gokul village homes.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#0d1425] border border-pink-500/30 space-y-3 shadow-xl"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
              🪜
            </div>
            <h3 className="text-base font-extrabold text-slate-100 font-serif">
              Govinda Human Pyramid
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Joyful groups of village children forming multi-tier human pyramids with unity, courage, and traditional chants of "Govinda Ala Re!".
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#0d1425] border border-purple-500/30 space-y-3 shadow-xl"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
              🎉
            </div>
            <h3 className="text-base font-extrabold text-slate-100 font-serif">
              Gulal & Butter Splash
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When the earthen pot breaks, rich white yogurt & butter splash down accompanied by flying festive colors and joyous music!
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
