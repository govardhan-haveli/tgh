/**
 * Goverdhan Haveli - Central Data & Configuration File
 * 
 * This file contains configuration constants, sizes dropdown list, 
 * Janmashtami target date, admin security passwords, gallery data, 
 * and Cloudinary/Supabase setup defaults.
 */

export const JANMASTHAMI_CONFIG = {
  // Group details
  groupName: "Goverdhan Haveli",
  tagline: "Shree Krishna Janmashtami Mahotsav 2026",
  location: "Goverdhan Haveli, India",

  // Target Janmashtami Date (Year 2026: September 4th)
  // Format: YYYY-MM-DDTHH:mm:ss
  targetDate: "2026-09-04T00:00:00+05:30",

  // T-Shirt Sizes available for registration
  tshirtSizes: ["18", "20", "22", "24", "26", "28", "30", "32", "34", "36 (XS)", "38 (S)", "40 (M)", "42 (L)", "44 (XL)", "46 (XXL)", "48 (3XL)", "50 (4XL)"],

  // Allowed Admin Passwords as specified in requirement:
  // Passwords: "Govardhan-Haveli-2026" and "TGH@2026"
  adminPasswords: [
    "Govardhan-Haveli-2026",
    "TGH@2026"
  ],

  // Supabase Table Name
  supabaseTableName: "tshirt_registrations",

  // Cloudinary configuration defaults for future direct upload module
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "goverdhan-haveli-cloud",
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "haveli_unsigned_preset",
    folder: "janmashtami_celebrations"
  }
};

/**
 * Initial sample gallery photos for Janmashtami Mahotsav
 */
export const GALLERY_PHOTOS = [
  {
    id: 1,
    title: "Grand Janmashtami Aarti 2025",
    category: "Puja & Aarti",
    image: "/logo.png",
    description: "Midnight divine aarti and prashad distribution at Goverdhan Haveli."
  },
  {
    id: 2,
    title: "Dahi Handi Utsav",
    category: "Dahi Handi",
    image: "/logo.png",
    description: "Goverdhan Haveli team making high pyramid for Matki Phod!"
  },
  {
    id: 3,
    title: "Matching Team T-Shirt Wearers",
    category: "Team & Celebration",
    image: "/logo.png",
    description: "Group members wearing matching royal blue & gold Janmashtami t-shirts."
  },
  {
    id: 4,
    title: "Mandap Flower Decoration",
    category: "Decoration",
    image: "/logo.png",
    description: "Exclusive marigold and jasmine flower decorations."
  }
];

/**
 * Initial sample celebration videos
 */
export const CELEBRATION_VIDEOS = [
  {
    id: 1,
    title: "Janmashtami Mahotsav Highlights 2025",
    youtubeId: "dQw4w9WgXcQ", // Placeholder YouTube video ID, can be replaced
    thumbnail: "/logo.png",
    duration: "04:15",
    date: "August 2025"
  },
  {
    id: 2,
    title: "Dahi Handi Govinda Team Celebration",
    youtubeId: "3JZ_D3ELwOQ",
    thumbnail: "/logo.png",
    duration: "06:30",
    date: "August 2025"
  },
  {
    id: 3,
    title: "Goverdhan Haveli Bhakti Sangeet & Raas Garba",
    youtubeId: "L_LUpnjgPso",
    thumbnail: "/logo.png",
    duration: "12:00",
    date: "August 2024"
  }
];
