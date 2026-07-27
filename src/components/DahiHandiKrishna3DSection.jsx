import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Award, Zap, RefreshCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import krishna3DImg from '../assets/krishna-dahi-handi-3d.png';
import krishnaIntactImg from '../assets/krishna-dahi-handi-intact.png';
import krishnaReachingImg from '../assets/krishna-dahi-handi-reaching.png';
import krishnaCheeringImg from '../assets/krishna-dahi-handi-cheering.png';
import krishnaPyramidImg from '../assets/krishna-dahi-handi-pyramid.png';
import krishnaClimbingImg from '../assets/krishna-dahi-handi-climbing.png';
import krishnaStrikeImg from '../assets/krishna-dahi-handi-strike.png';
import krishnaRainImg from '../assets/krishna-dahi-handi-rain.png';
import { getDahiHandiBrokenCount, incrementDahiHandiBrokenCount } from '../services/supabase';

export const DahiHandiKrishna3DSection = () => {
  const [storyFrame, setStoryFrame] = useState(0); // 0 to 7
  const [isAnimating, setIsAnimating] = useState(false);
  const [butterSplashCount, setButterSplashCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    getDahiHandiBrokenCount().then((count) => {
      if (isMounted && count > 0) {
        setButterSplashCount(count);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const storySteps = [
    {
      id: 0,
      badge: 'Pot Hanging High! 🏺',
      status: 'Intact Dahi Handi Pot',
      buttonText: 'Break Dahi Handi Pot Now! 🏺💥',
      image: krishnaIntactImg
    },
    {
      id: 1,
      badge: '1. Human Pyramid Forming 🪜',
      status: '1. Village Boys Linking Arms & Building Pyramid',
      buttonText: '1. Building Human Pyramid... 🪜',
      image: krishnaPyramidImg
    },
    {
      id: 2,
      badge: '2. Krishna Climbing Up 👶',
      status: '2. Bal Krishna Climbing Shoulders',
      buttonText: '2. Bal Krishna Climbing Up... 👶',
      image: krishnaClimbingImg
    },
    {
      id: 3,
      badge: '3. Reaching Stick Near Pot 🪄',
      status: '3. Raising Wooden Stick Near Pot',
      buttonText: '3. Reaching Stick Near Pot... 🪄',
      image: krishnaReachingImg
    },
    {
      id: 4,
      badge: '4. STRIKING THE POT! ⚡',
      status: '4. Wooden Stick Striking Earthen Pot',
      buttonText: '4. Striking & Cracking Pot! ⚡',
      image: krishnaStrikeImg
    },
    {
      id: 5,
      badge: '5. MAKHAN SPLASH! 🧈💥',
      status: '5. Pot Broken! White Butter Splashing!',
      buttonText: '5. Pot Broken & Butter Splashing! 🧈💥',
      image: krishna3DImg
    },
    {
      id: 6,
      badge: '6. Butter & Gulal Rain 🎨',
      status: '6. Fresh Curd & Festive Gulal Raining Down',
      buttonText: '6. White Butter & Gulal Raining! 🎨',
      image: krishnaRainImg
    },
    {
      id: 7,
      badge: '7. Govinda Victory Celebration 🎉',
      status: '7. People Clapping Hands & Cheering!',
      buttonText: '7. People Clapping & Cheering! 👏🎉',
      image: krishnaCheeringImg
    }
  ];

  const currentStep = storySteps[storyFrame];

  const fireConfettiBurst = () => {
    const count = 220;
    const defaults = { origin: { y: 0.6 } };
    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }
    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f59e0b', '#fbbf24', '#ffffff'] });
    fire(0.2, { spread: 60, colors: ['#ec4899', '#8b5cf6', '#3b82f6'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#eab308', '#ffffff', '#f43f5e'] });
  };

  const triggerDahiHandiBreak = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setButterSplashCount((prev) => prev + 1);

    // Persist broken count increment in Supabase
    incrementDahiHandiBrokenCount().then((res) => {
      if (res?.count) {
        setButterSplashCount(res.count);
      }
    });

    // Step 1: Human Pyramid Forming (0s)
    setStoryFrame(1);

    // Step 2: Krishna Climbing Up (2.2s)
    setTimeout(() => setStoryFrame(2), 2200);

    // Step 3: Reaching Stick Near Pot (4.4s)
    setTimeout(() => setStoryFrame(3), 4400);

    // Step 4: Striking The Pot (6.6s)
    setTimeout(() => setStoryFrame(4), 6600);

    // Step 5: Pot Breaking & Butter Splash (8.8s)
    setTimeout(() => {
      setStoryFrame(5);
      fireConfettiBurst();
    }, 8800);

    // Step 6: Butter & Gulal Rain (11.3s)
    setTimeout(() => {
      setStoryFrame(6);
      fireConfettiBurst();
    }, 11300);

    // Step 7: People Clapping & Cheering (13.8s)
    setTimeout(() => {
      setStoryFrame(7);
      fireConfettiBurst();
    }, 13800);

    // Reset back to Step 0 (Intact Pot) (16.8s)
    setTimeout(() => {
      setStoryFrame(0);
      setIsAnimating(false);
    }, 16800);
  };

  return (
    <section className="py-6 sm:py-24 px-3 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#070b14] via-[#0d1425] to-[#070b14]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-12 relative z-10">

        {/* Header */}
        <div className="text-center space-y-1.5 sm:space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-[10px] sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 animate-spin" />
            <span>Grand 3D Dahi Handi Mahotsav</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl sm:text-5xl md:text-6xl font-black font-serif bg-gradient-to-r from-amber-100 via-amber-300 via-pink-300 to-yellow-400 bg-clip-text text-transparent tracking-tight leading-tight"
          >
            Makhan Chor Bal Krishna Dahi Handi
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-300 text-xs sm:text-base leading-relaxed font-light hidden sm:block"
          >
            Witness the energetic 3D spectacle of young Lord Krishna atop the human pyramid, breaking the hanging earthen pot of pure white butter while joyful village friends celebrate with vibrant colors & cheers!
          </motion.p>
        </div>

        {/* Highlighted Global Counter Banner (Matched to max-w-6xl width of feature card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-amber-500/15 via-pink-500/15 to-purple-500/15 border border-amber-500/30 bg-[#0d1425]/80 shadow-2xl shadow-amber-500/10 backdrop-blur-xl overflow-hidden text-center space-y-3"
        >
          {/* Glowing Ambient Backgrounds */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Global Devotee Celebration Counter</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-1">
            <span className="text-base sm:text-2xl font-bold text-slate-200 font-serif">
              Until now, Dahi Handi pot broken
            </span>
            <span className="text-4xl sm:text-6xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 tracking-tight drop-shadow-[0_4px_16px_rgba(245,158,11,0.6)]">
              {butterSplashCount.toLocaleString()}
            </span>
            <span className="text-base sm:text-2xl font-bold text-amber-300 font-serif">
              times by devotees! 🏺💥
            </span>
          </div>

          <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
            ✨ Every button click increments this live global counter across all devices worldwide!
          </p>
        </motion.div>

        {/* Main Interactive 3D Card Display */}
        <motion.div
          id="dahi-handi-3d"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative group rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 bg-[#0d1425]/80 shadow-2xl shadow-amber-500/10 backdrop-blur-xl max-w-6xl mx-auto scroll-mt-24"
        >
          {/* Animated Glowing Frame border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 rounded-2xl sm:rounded-3xl opacity-30 group-hover:opacity-60 blur-md transition duration-700"></div>

          {/* =========================================================================
              DESKTOP LAYOUT (lg:grid) - Side-by-side 2-column resolution
             ========================================================================= */}
          <div className="relative z-10 hidden lg:grid grid-cols-12 gap-8 items-center p-8">

            {/* Left Column (7/12): Fixed Height Desktop 3D Image Showcase (100% clean, zero text overlay) */}
            <div className="col-span-7 relative w-full h-[480px] group/img overflow-hidden rounded-2xl border border-amber-400/30 bg-[#080d19]">

              {/* Seamless Desktop Image Crossfade (No mode="wait") */}
              <AnimatePresence>
                <motion.img
                  key={storyFrame}
                  src={currentStep.image}
                  alt={currentStep.status}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl bg-[#080d19]"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#080d19]/40 via-transparent to-transparent pointer-events-none z-10"></div>
            </div>

            {/* Right Column (5/12): Desktop Content & Action Panel */}
            <div className="col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Dahi Handi Special Feature</span>
                </span>
                <h3 className="text-3xl font-extrabold text-slate-100 font-serif leading-snug">
                  Break the Divine Pot & Celebrate Janmashtami!
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Join the village celebration of Goverdhan Haveli. Tap the interactive button below to trigger the 8-step animated story video sequence!
                </p>
              </div>

              {/* 8-Step Story Progress Indicator Bar & Live Status */}
              <div className="p-3.5 rounded-xl bg-[#080d19] border border-amber-500/40 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-100">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>{currentStep.status}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-pink-300 font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30">
                      🧈 {butterSplashCount.toLocaleString()} Broken!
                    </span>
                    <span className="text-amber-400 font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      Step {storyFrame + 1} of 8
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-1.5 h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  {storySteps.map((step) => (
                    <div
                      key={step.id}
                      className={`h-full rounded-full transition-all duration-300 ${
                        storyFrame >= step.id ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-3 pt-1">
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

              {/* Desktop Break Handi Button */}
              <div className="pt-2 space-y-3">
                <motion.button
                  type="button"
                  disabled={isAnimating}
                  whileHover={!isAnimating ? { scale: 1.03 } : {}}
                  whileTap={!isAnimating ? { scale: 0.96 } : {}}
                  onClick={triggerDahiHandiBreak}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2.5 uppercase tracking-wider transition-all duration-300 ${
                    isAnimating
                      ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-none cursor-wait'
                      : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/30 cursor-pointer'
                  }`}
                >
                  {isAnimating ? (
                    <>
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                      <span>{currentStep.buttonText}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-slate-950 animate-bounce" />
                      <span>{currentStep.buttonText}</span>
                    </>
                  )}
                </motion.button>

                <p className="text-center text-[11px] text-slate-400 font-medium">
                  {isAnimating
                    ? '⏳ 8-Step story video playing! Resets after cheering...'
                    : '✨ Tap to play 8-step animated story sequence & confetti!'}
                </p>
              </div>

            </div>

          </div>

          {/* =========================================================================
              MOBILE LAYOUT (lg:hidden) - Fixed Aspect Ratio Mobile Showcase
             ========================================================================= */}
          <div className="relative z-10 block lg:hidden p-4 space-y-3">

            {/* 1. TEXT ABOVE IMAGE */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Dahi Handi Special Feature</span>
              </span>
              <h3 className="text-xl font-extrabold text-slate-100 font-serif leading-snug">
                Break the Divine Pot & Celebrate Janmashtami!
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Join the village celebration of Goverdhan Haveli. Tap the button to trigger 8-step story animation & confetti!
              </p>
            </div>

            {/* Mobile 8-Step Story Progress Bar */}
            <div className="p-2.5 rounded-xl bg-[#080d19] border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-100">
                <span className="flex items-center gap-1.5 text-amber-300 truncate">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
                  <span className="truncate">{currentStep.badge}</span>
                </span>
                <span className="text-[10px] text-pink-300 font-bold px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 shrink-0">
                  🧈 {butterSplashCount.toLocaleString()} Broken
                </span>
              </div>

              <div className="grid grid-cols-8 gap-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                {storySteps.map((step) => (
                  <div
                    key={step.id}
                    className={`h-full rounded-full transition-all duration-300 ${
                      storyFrame >= step.id ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* 2. FIXED ASPECT RATIO MOBILE IMAGE CONTAINER (100% clean artwork) */}
            <div className="relative w-full aspect-[4/3] max-h-[300px] group/img overflow-hidden rounded-xl border border-amber-400/30 bg-[#080d19]">

              {/* Seamless Mobile Image Crossfade (No mode="wait") */}
              <AnimatePresence>
                <motion.img
                  key={storyFrame}
                  src={currentStep.image}
                  alt={currentStep.status}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-center bg-[#080d19]"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#080d19]/40 via-transparent to-transparent pointer-events-none z-10"></div>
            </div>

            {/* 3. INTERACTIVE BREAK BUTTON BELOW IMAGE */}
            <div id="mobile-break-button" className="pt-1 space-y-1.5 scroll-mt-28">
              <motion.button
                type="button"
                disabled={isAnimating}
                whileHover={!isAnimating ? { scale: 1.02 } : {}}
                whileTap={!isAnimating ? { scale: 0.96 } : {}}
                onClick={triggerDahiHandiBreak}
                className={`w-full py-3.5 px-5 rounded-xl font-black text-xs shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-all duration-300 ${
                  isAnimating
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-none cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/30 cursor-pointer'
                }`}
              >
                {isAnimating ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    <span className="truncate">{currentStep.buttonText}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950 animate-bounce" />
                    <span>{currentStep.buttonText}</span>
                  </>
                )}
              </motion.button>

              <p className="text-center text-[10px] text-slate-400 font-medium">
                {isAnimating
                  ? '⏳ Playing 8-step story animation sequence...'
                  : '✨ Tap to play 8-step animated story sequence & confetti!'}
              </p>
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
