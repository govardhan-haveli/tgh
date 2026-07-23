import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, ArrowLeft, ExternalLink, Film, Heart, Search, Filter, Play, X } from 'lucide-react';
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

export const InstagramPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedReel, setSelectedReel] = useState(null);

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

  const categories = ['All', ...new Set(reels.map(r => r.category || 'General'))];

  const filteredReels = reels.filter(reel => {
    const matchesSearch =
      reel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reel.category && reel.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || reel.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Back Navigation */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0d1425] border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-medium hover:border-pink-400/60 transition active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-semibold">
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>Goverdhan Haveli Official Instagram Collection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-serif">
            All Mahotsav Instagram Reels
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Watch all Janmashtami celebration reels, Matki Phod Govinda clips, and Bhakti status videos!
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#0d1425] border border-pink-500/20 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-400/70">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reels by caption or title..."
              className="w-full pl-9 pr-4 py-2 bg-[#080d19] border border-pink-500/30 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs text-slate-400 mr-1">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                  categoryFilter === cat
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-md'
                    : 'bg-[#080d19] text-pink-300 border-pink-500/20 hover:border-pink-500/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Reels Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            Loading Instagram Reels...
          </div>
        ) : filteredReels.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-[#0d1425] rounded-3xl border border-pink-500/20">
            No matching Instagram Reels found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredReels.map((reel) => {
              const embedUrl = getInstagramEmbedUrl(reel.reel_url);

              return (
                <motion.div
                  key={reel.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="w-full max-w-[320px] bg-[#0d1425] border border-pink-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group transition duration-300 relative"
                >
                  {/* Card Header */}
                  <div className="p-3.5 bg-gradient-to-r from-[#0d1425] via-[#080d19] to-[#0d1425] border-b border-pink-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 flex-shrink-0">
                        <div className="w-full h-full bg-[#0d1425] rounded-full flex items-center justify-center">
                          <Instagram className="w-3.5 h-3.5 text-pink-400" />
                        </div>
                      </div>
                      <h3 className="text-xs font-bold text-slate-100 truncate">
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

                  {/* Reel / Photo Frame (Pure Content Only) */}
                  <div className="w-full bg-[#080d19] relative h-[335px] sm:h-[345px] flex items-center justify-center overflow-hidden group">
                    {embedUrl ? (
                      <>
                        <iframe
                          src={embedUrl}
                          className="w-[112%] h-[470px] -mt-[58px] border-0 overflow-hidden pointer-events-auto scale-[1.06]"
                          title={reel.title}
                          scrolling="no"
                          allowTransparency={true}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          loading="lazy"
                        ></iframe>

                        {/* Mobile Expand Button Overlay */}
                        <button
                          type="button"
                          onClick={() => setSelectedReel(reel)}
                          className="absolute bottom-3 right-3 p-2 rounded-full bg-pink-600/90 text-white shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 transition flex items-center gap-1 text-[11px] font-bold z-10"
                          title="Watch Full Reel"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Expand</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-6 text-slate-400 space-y-2">
                        <Film className="w-10 h-10 text-pink-400 mx-auto" />
                        <p className="text-xs">Invalid Instagram URL</p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="p-3 bg-[#0a0f1d] border-t border-pink-500/20 flex items-center justify-between text-xs">
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 font-bold px-2 py-0.5 rounded-md uppercase">
                      {reel.category || 'Reel'}
                    </span>

                    <a
                      href={reel.reel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
                    >
                      <span>Open App</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

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

    </div>
  );
};
