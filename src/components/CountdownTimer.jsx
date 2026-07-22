import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Flame, Sparkles } from 'lucide-react';
import { JANMASTHAMI_CONFIG } from '../data/data';

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(JANMASTHAMI_CONFIG.targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className="relative py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-amber-500/5"
        >
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Shree Krishna Janmashtami Countdown</span>
        </motion.div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-100 font-serif tracking-wide mb-2">
          Janmashtami Mahotsav 2026
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-10">
          Counting down to the grand celebration of Lord Krishna's divine birth. Get ready, join the celebration & wear matching team T-shirts!
        </p>

        {timeLeft.isCompleted ? (
          <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 text-center animate-bounce">
            <h3 className="text-3xl font-bold text-amber-300 font-serif">
              🎉 Jai Shree Krishna! Janmashtami Mahotsav Has Arrived! 🎉
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Glow border on hover */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-amber-500/40 to-yellow-600/10 blur opacity-60 group-hover:opacity-100 transition duration-300"></div>

                <div className="relative rounded-2xl bg-[#0d1527]/90 border border-amber-500/30 p-4 sm:p-6 backdrop-blur-md text-center shadow-xl">
                  <div className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-mono tracking-wider">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className="mt-2 text-xs sm:text-sm font-bold text-amber-400/80 tracking-widest uppercase">
                    {unit.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Expected Date: <strong className="text-amber-300">September 4, 2026</strong></span>
        </div>

      </div>
    </div>
  );
};
