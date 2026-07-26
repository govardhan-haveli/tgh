import React, { createContext, useContext, useState, useEffect } from 'react';
import { JANMASTHAMI_CONFIG } from '../data/data';
import { fetchTShirtSettings } from '../services/supabase';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState({
    groupName: JANMASTHAMI_CONFIG.groupName,
    tagline: JANMASTHAMI_CONFIG.tagline,
    location: JANMASTHAMI_CONFIG.location,
    targetDate: JANMASTHAMI_CONFIG.targetDate,
    tshirtSizes: JANMASTHAMI_CONFIG.tshirtSizes,
    price: 250,
    qr_code_url: '',
    sample_image_url: '',
    description: 'Goverdhan Haveli Official Janmashtami T-Shirt 2026'
  });
  const [loading, setLoading] = useState(true);

  const reloadSettings = async () => {
    try {
      const res = await fetchTShirtSettings();
      if (res.data) {
        let sizes = JANMASTHAMI_CONFIG.tshirtSizes;
        if (res.data.tshirt_sizes) {
          if (Array.isArray(res.data.tshirt_sizes)) {
            sizes = res.data.tshirt_sizes;
          } else if (typeof res.data.tshirt_sizes === 'string') {
            try {
              const parsed = JSON.parse(res.data.tshirt_sizes);
              sizes = Array.isArray(parsed) ? parsed : res.data.tshirt_sizes.split(',').map(s => s.trim()).filter(Boolean);
            } catch (e) {
              sizes = res.data.tshirt_sizes.split(',').map(s => s.trim()).filter(Boolean);
            }
          }
        }

        setSiteSettings({
          groupName: res.data.group_name || JANMASTHAMI_CONFIG.groupName,
          tagline: res.data.tagline || JANMASTHAMI_CONFIG.tagline,
          location: res.data.location || JANMASTHAMI_CONFIG.location,
          targetDate: res.data.target_date || JANMASTHAMI_CONFIG.targetDate,
          tshirtSizes: sizes.length > 0 ? sizes : JANMASTHAMI_CONFIG.tshirtSizes,
          price: Number(res.data.price) || 250,
          qr_code_url: res.data.qr_code_url || '',
          sample_image_url: res.data.sample_image_url || '',
          description: res.data.description || 'Goverdhan Haveli Official Janmashtami T-Shirt 2026'
        });
      }
    } catch (err) {
      console.warn("Failed to load dynamic site settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ siteSettings, reloadSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      siteSettings: {
        groupName: JANMASTHAMI_CONFIG.groupName,
        tagline: JANMASTHAMI_CONFIG.tagline,
        location: JANMASTHAMI_CONFIG.location,
        targetDate: JANMASTHAMI_CONFIG.targetDate,
        tshirtSizes: JANMASTHAMI_CONFIG.tshirtSizes,
        price: 250,
        qr_code_url: '',
        sample_image_url: '',
        description: 'Goverdhan Haveli Official Janmashtami T-Shirt 2026'
      },
      reloadSettings: () => {},
      loading: false
    };
  }
  return context;
};
