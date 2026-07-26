/**
 * Goverdhan Haveli - Central Data & Configuration File
 * 
 * This file contains configuration constants, sizes dropdown list, 
 * Janmashtami target date, admin security passwords, gallery data, 
 * and Cloudinary/Supabase setup defaults.
 */

export const DEFAULT_TSHIRT_SIZES = [
  { size: "18", label: "", width: "10.5", length: "16", year: "06-01" },
  { size: "20", label: "", width: "11.5", length: "18", year: "02-03" },
  { size: "22", label: "", width: "12.5", length: "20", year: "03-04" },
  { size: "24", label: "", width: "13.5", length: "20", year: "04-05" },
  { size: "26", label: "", width: "14.5", length: "22", year: "05-06" },
  { size: "28", label: "", width: "15.5", length: "25", year: "06-07" },
  { size: "30", label: "", width: "16.5", length: "26", year: "08-09" },
  { size: "32", label: "", width: "17.5", length: "27", year: "10-11" },
  { size: "34", label: "XS", width: "18.5", length: "28", year: "11-12" },
  { size: "36", label: "S", width: "19.5", length: "29", year: "" },
  { size: "38", label: "M", width: "20.5", length: "30", year: "" },
  { size: "40", label: "L", width: "21.5", length: "31", year: "" },
  { size: "42", label: "XL", width: "22.5", length: "32", year: "" },
  { size: "44", label: "2XL", width: "23.5", length: "33", year: "" },
  { size: "46", label: "3XL", width: "24.5", length: "34", year: "" },
  { size: "48", label: "4XL", width: "25.5", length: "35", year: "" },
  { size: "50", label: "5XL", width: "26.5", length: "36", year: "" },
  { size: "52", label: "6XL", width: "27.5", length: "37", year: "" },
  { size: "54", label: "7XL", width: "28.5", length: "38", year: "" },
  { size: "56", label: "8XL", width: "29.5", length: "38", year: "" },
  { size: "58", label: "9XL", width: "30.5", length: "38", year: "" }
];

export const formatSizeKey = (szItem) => {
  if (!szItem) return "";
  if (typeof szItem === 'string') return szItem;
  if (szItem.label) return `${szItem.size} (${szItem.label})`;
  return String(szItem.size || "");
};

export const JANMASTHAMI_CONFIG = {
  // Group details
  groupName: "Goverdhan Haveli",
  tagline: "Shree Krishna Janmashtami Mahotsav 2026",
  location: "Goverdhan Haveli, India",

  // Target Janmashtami Date (Year 2026: September 4th)
  // Format: YYYY-MM-DDTHH:mm:ss
  targetDate: "2026-09-04T00:00:00+05:30",

  // T-Shirt Sizes available for registration
  tshirtSizes: DEFAULT_TSHIRT_SIZES,

  // Allowed Admin Passwords as specified in requirement:
  // Passwords: "Govardhan-Haveli-2026" and "TGH@2026"
  adminPasswords: [
    "Govardhan-Haveli-2026",
    "TGH@2026"
  ],

  // Supabase Table Names
  supabaseTableName: "tshirt_registrations",
  supabaseSettingsTableName: "tshirt_settings",
  supabaseReelsTableName: "instagram_reels",

  // Cloudinary configuration defaults
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
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
