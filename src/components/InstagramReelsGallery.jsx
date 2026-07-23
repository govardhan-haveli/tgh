import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, ExternalLink, Film, Heart, ArrowRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchInstagramReels } from '../services/supabase';

// Helper to extract Instagram Embed URL (without /captioned/ to hide comments & caption text)
export const getInstagramEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/instagram\.com\/(?:reel|p|reels)\/([^/?#&]+)/i);
  if (match && match[1]) {
    const isReel = url.toLowerCase().includes('/reel/') || url.toLowerCase().includes('/reels/');
    return isReel
      ? `https://www.instagram.com/reel/${match[1]}/embed/`
      : `https://www.instagram.com/p/${match[1]}/embed/`;
  }
  if (url.includes('/embed')) {
    return url.replace(/\/captioned\/?/i, '/');
  }
  return url;
};

// Fallback initial reels if database is empty
const INITIAL_SAMPLE_REELS = [
  {
    id: 'sample-1',
    title: 'Goverdhan Haveli Grand Janmashtami Mahotsav Dahi Handi 2025',
    category: 'Dahi Handi',
    reel_url: 'https://www.instagram.com/reel/DBa7XpZSp6i/'
  },
  {
    id: 'sample-2',
    title: 'Midnight Divine Aarti & Mahaprasad Mahotsav',
    category: 'Aarti & Darshan',
    reel_url: 'https://www.instagram.com/p/C_xxxxxxx/'
  }
];

export const InstagramReelsGallery = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReel, setSelectedReel] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const loadReels = async () => {
      setLoading(true);
      const res = await fetchInstagramReels();
      if (res.data && res.data.length > 0) {
        setReels(res.data);
      } else {
        setReels(INITIAL_SAMPLE_REELS);
      }
      setLoading(false);
    };

    loadReels();
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -310, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 310, behavior: 'smooth' });
    }
  };

  // Display Top 4 Reels on Home Page
  const topReels = reels.slice(0, 4);

  return (
    <section id="reels-gallery" className="py-12 sm:py-16 px-4 sm:px-6 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header with View All Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-pink-500/20 pb-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>Mahotsav Short Reels</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-serif">
              Instagram Reels & Highlights
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Swipe or tap arrows below to watch Dahi Handi & Aarti status reels directly!
            </p>
          </div>

          <Link
            to="/instagram"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-pink-500/20 transition active:scale-95 self-start sm:self-auto"
          >
            <span>View All Instagram Reels</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Scrollable Carousel on Mobile, Responsive Grid on Desktop */}
        <div
          ref={scrollContainerRef}
          className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-pink-500/30 touch-pan-x scroll-smooth"
        >
          {topReels.map((reel) => {
            const embedUrl = getInstagramEmbedUrl(reel.reel_url);

            return (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="min-w-[285px] sm:min-w-[300px] md:min-w-0 w-full snap-center bg-[#0d1425] border border-pink-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group transition duration-300 relative flex-shrink-0 md:flex-shrink"
              >
                {/* Reel Header */}
                <div className="p-3 bg-gradient-to-r from-[#0d1425] via-[#080d19] to-[#0d1425] border-b border-pink-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 flex-shrink-0">
                      <div className="w-full h-full bg-[#0d1425] rounded-full flex items-center justify-center">
                        <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-100 truncate max-w-[170px]">
                      {reel.title}
                    </h3>
                  </div>

                  <a
                    href={reel.reel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-full bg-pink-500/10 hover:bg-pink-500/30 text-pink-300 transition flex-shrink-0"
                    title="Open on Instagram"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Embedded Reel / Photo Frame - PC Direct Play Enabled (pointer-events-auto on PC, pointer-events-none on Mobile) */}
                <div
                  onClick={(e) => {
                    // Open modal only if on mobile or if clicking outside iframe
                    if (window.innerWidth < 768) {
                      setSelectedReel(reel);
                    }
                  }}
                  className="w-full bg-[#080d19] relative h-[335px] sm:h-[345px] flex items-center justify-center overflow-hidden cursor-pointer md:cursor-default"
                >
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-[112%] h-[470px] -mt-[58px] border-0 overflow-hidden pointer-events-none md:pointer-events-auto scale-[1.06]"
                      title={reel.title}
                      scrolling="no"
                      allowTransparency={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <div className="text-center p-6 text-slate-400 space-y-2">
                      <Film className="w-10 h-10 text-pink-400 mx-auto" />
                      <p className="text-xs">Invalid Instagram URL</p>
                    </div>
                  )}
                </div>

                {/* Reel Card Footer - Mobile Play Button & Direct App Link */}
                <div className="p-3 bg-[#0a0f1d] border-t border-pink-500/20 flex items-center justify-between text-xs gap-2">
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 font-bold px-2 py-1 rounded-md uppercase truncate">
                    {reel.category || 'Reel'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Mobile Only Play Reel Modal Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedReel(reel)}
                      className="md:hidden px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play Reel</span>
                    </button>

                    <a
                      href={reel.reel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/30 text-pink-300 transition text-[10px] font-bold flex items-center gap-1"
                      title="Open on Instagram App"
                    >
                      <span className="hidden sm:inline">Open App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe Notice & Interactive Prev / Next Navigation Buttons */}
        <div className="flex items-center justify-between sm:justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleScrollLeft}
            className="px-3.5 py-2 rounded-xl bg-[#0d1425] hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold transition flex items-center gap-1 active:scale-95 shadow-md cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <div className="text-[11px] text-pink-300/80 font-medium text-center">
            👈 Swipe left to right or tap arrows 👉
          </div>

          <button
            type="button"
            onClick={handleScrollRight}
            className="px-3.5 py-2 rounded-xl bg-[#0d1425] hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold transition flex items-center gap-1 active:scale-95 shadow-md cursor-pointer"
            title="Scroll Right"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* FULLSCREEN REEL MODAL PLAYER FOR MOBILE COMPATIBILITY */}
      <AnimatePresence>
        {selectedReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
            onClick={() => setSelectedReel(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1425] border border-pink-500/40 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl flex flex-col max-h-[92vh] relative"
            >
              <div className="flex items-center justify-between p-3.5 bg-[#0a0f1d] border-b border-pink-500/20">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                    {selectedReel.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReel(null)}
                  className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full bg-[#080d19] relative flex-grow min-h-[460px] flex items-center justify-center overflow-hidden">
                <iframe
                  src={getInstagramEmbedUrl(selectedReel.reel_url)}
                  className="w-full h-[520px] -mt-[56px] border-0"
                  title={selectedReel.title}
                  allowTransparency={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>

              <div className="p-3.5 bg-[#0a0f1d] border-t border-pink-500/20 flex items-center justify-between">
                <span className="text-xs text-pink-300 font-semibold">
                  Goverdhan Haveli Janmashtami 2026
                </span>
                <a
                  href={selectedReel.reel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Watch on Instagram App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
