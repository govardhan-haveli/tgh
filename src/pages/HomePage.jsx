import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shirt, Image, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer';
import { MediaGallery } from '../components/MediaGallery';
import { VideoGallery } from '../components/VideoGallery';
import { InstagramReelsGallery } from '../components/InstagramReelsGallery';
import { JANMASTHAMI_CONFIG } from '../data/data';
import logoImg from '../assets/logo.png';
import heroBannerImg from '../assets/hero-banner.jpg';

export const HomePage = () => {
  return (
    <div className="relative overflow-hidden text-slate-100">
      
      {/* Mobile-Optimized Hero Section */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center px-4 sm:px-6 pt-8 sm:pt-12 pb-16 overflow-hidden">
        
        {/* Background Banner */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBannerImg}
            alt="Janmashtami Mahotsav Background"
            className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/70 via-[#070b14]/90 to-[#070b14]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Logo Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <img
                src={logoImg}
                alt="Goverdhan Haveli Logo"
                className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-amber-400 shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Titles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Shree Krishna Janmashtami Mahotsav</span>
            </div>

            <h1 className="text-3xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent font-serif tracking-tight leading-tight">
              {JANMASTHAMI_CONFIG.groupName}
            </h1>

            <p className="text-slate-300 text-xs sm:text-lg max-w-2xl mx-auto font-light leading-relaxed px-2">
              Every year we celebrate the divine festival of Lord Krishna with grand devotion, traditional Dahi Handi, Mahotsav Aarti, and matching group T-Shirts!
            </p>
          </motion.div>

          {/* Hero Action Buttons - Full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 pt-2 max-w-sm sm:max-w-none mx-auto"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-xl shadow-amber-500/25 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Shirt className="w-5 h-5" />
              <span>Register T-Shirt Now</span>
            </Link>

            <a
              href="#gallery"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0d1425] hover:bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold transition transform active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Image className="w-4 h-4" />
              <span>View Celebration Media</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* Countdown Timer */}
      <CountdownTimer />

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      </div>

      {/* Photo Gallery */}
      <MediaGallery />

      {/* Instagram Reels Gallery */}
      <InstagramReelsGallery />

      {/* Video Gallery */}
      <VideoGallery />

    </div>
  );
};
