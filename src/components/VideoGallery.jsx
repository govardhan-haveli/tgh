import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Play, X, Calendar, Clock } from 'lucide-react';
import { CELEBRATION_VIDEOS } from '../data/data';
import heroBannerImg from '../assets/hero-banner.jpg';
import celebration1Img from '../assets/celebration1.jpg';

export const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: "Janmashtami Mahotsav Highlights 2025",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: heroBannerImg,
      duration: "04:15",
      date: "August 2025",
      description: "Complete video summary of Goverdhan Haveli grand Janmashtami Mahotsav."
    },
    {
      id: 2,
      title: "Dahi Handi Govinda Team Celebration",
      youtubeId: "3JZ_D3ELwOQ",
      thumbnail: celebration1Img,
      duration: "06:30",
      date: "August 2025",
      description: "High energy Matki Phod performance by group members in uniform t-shirts."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-3">
            <Film className="w-4 h-4 text-amber-400" />
            <span>Mahotsav Video Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-serif">
            Celebration Videos & Utsav Clips
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Watch live recordings of Aarti, Dahi Handi, and festive music performances.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((vid) => (
            <motion.div
              key={vid.id}
              whileHover={{ y: -5 }}
              className="bg-[#0d1425] border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
              onClick={() => setSelectedVideo(vid)}
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1425] via-transparent to-black/40"></div>

                {/* Big Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 group-hover:scale-110 transition duration-300">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/80 text-amber-300 text-xs font-mono flex items-center gap-1 border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{vid.duration}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{vid.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 font-serif group-hover:text-amber-300 transition">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  {vid.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <div
                className="relative max-w-4xl w-full bg-[#0d1425] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-[#0a0f1d]">
                  <h3 className="text-lg font-bold text-amber-300 font-serif">
                    {selectedVideo.title}
                  </h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 rounded-full text-slate-400 hover:text-amber-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
