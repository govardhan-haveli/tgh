import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Maximize2, X } from 'lucide-react';
import celebration1Img from '../assets/celebration1.jpg';
import heroBannerImg from '../assets/hero-banner.jpg';
import tshirtMockupImg from '../assets/tshirt-mockup.png';
import logoImg from '../assets/logo.png';

export const MediaGallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const photos = [
    {
      id: 1,
      title: "Dahi Handi Utsav 2025",
      category: "Dahi Handi",
      image: celebration1Img,
      description: "Goverdhan Haveli team making high pyramid for Matki Phod!"
    },
    {
      id: 2,
      title: "Grand Janmashtami Mandap Decor",
      category: "Puja & Aarti",
      image: heroBannerImg,
      description: "Illuminated temple mandap with divine lighting and flowers."
    },
    {
      id: 3,
      title: "Matching Team T-Shirt Wearers",
      category: "Team & Celebration",
      image: tshirtMockupImg,
      description: "Group members wearing matching royal blue & gold Janmashtami t-shirts."
    },
    {
      id: 4,
      title: "Goverdhan Haveli Official Emblem",
      category: "Puja & Aarti",
      image: logoImg,
      description: "Divine Lord Krishna Bansuri & Mor Pankh Logo."
    }
  ];

  const categories = ['All', 'Dahi Handi', 'Puja & Aarti', 'Team & Celebration'];

  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  return (
    <section id="gallery" className="py-16 px-4 sm:px-6 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-3">
            <Image className="w-4 h-4 text-amber-400" />
            <span>Memories & Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-serif">
            Janmashtami Celebration Photos
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Glance back at our previous Mahotsav celebrations, Dahi Handi, and team spirit.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-[#0d1425] text-slate-300 border border-amber-500/20 hover:border-amber-400/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl overflow-hidden bg-[#0d1425] border border-amber-500/20 shadow-xl cursor-pointer"
              onClick={() => setSelectedImage(photo)}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-70"></div>
                <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 text-amber-400 opacity-0 group-hover:opacity-100 transition">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {photo.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-2 font-serif group-hover:text-amber-300 transition">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {photo.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative max-w-4xl w-full bg-[#0d1425] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-amber-300 hover:text-amber-100"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="max-h-[70vh] w-auto object-contain"
                  />
                </div>

                <div className="p-6 bg-[#0d1425]">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-100 font-serif mt-1">
                    {selectedImage.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2">
                    {selectedImage.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
