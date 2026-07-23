import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Film, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchInstagramReels } from '../services/supabase';

// Helper to extract Instagram Embed URL (without /captioned/ to hide comments & caption text)
export const getInstagramEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/instagram\.com\/(?:reel|p|reels)\/([^/?#&]+)/i);
  if (match && match[1]) {
    return `https://www.instagram.com/reel/${match[1]}/embed/`;
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
              Swipe or scroll to watch Dahi Handi & Aarti status reels directly on-page!
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
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-pink-500/30 touch-pan-x">
          {topReels.map((reel) => {
            const embedUrl = getInstagramEmbedUrl(reel.reel_url);

            return (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="min-w-[280px] sm:min-w-[300px] md:min-w-0 w-full snap-center bg-[#0d1425] border border-pink-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group transition duration-300 relative flex-shrink-0 md:flex-shrink"
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

                {/* Embedded Reel / Photo Frame - Pure Content Only (Crops Top White Header & Bottom 'View More' Bar on both Photos & Reels) */}
                <div className="w-full bg-[#080d19] relative h-[335px] sm:h-[345px] flex items-center justify-center overflow-hidden">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-[112%] h-[470px] -mt-[58px] border-0 overflow-hidden pointer-events-auto scale-[1.06]"
                      title={reel.title}
                      scrolling="no"
                      allowTransparency={true}
                      allow="encrypted-media"
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <div className="text-center p-6 text-slate-400 space-y-2">
                      <Film className="w-10 h-10 text-pink-400 mx-auto" />
                      <p className="text-xs">Invalid Instagram URL</p>
                    </div>
                  )}
                </div>

                {/* Reel Card Footer */}
                <div className="p-3 bg-[#0a0f1d] border-t border-pink-500/20 flex items-center justify-between text-xs">
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 font-bold px-2 py-0.5 rounded-md uppercase truncate max-w-[120px]">
                    {reel.category || 'Reel'}
                  </span>

                  <a
                    href={reel.reel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm flex-shrink-0"
                  >
                    <span>Open App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe Notice */}
        <div className="block md:hidden text-center text-[11px] text-pink-300/80 font-medium">
          👈 Swipe left to right to watch more reels 👉
        </div>

      </div>
    </section>
  );
};
