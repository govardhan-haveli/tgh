import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shirt, User, Phone, CheckCircle2, Sparkles, AlertCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { JANMASTHAMI_CONFIG } from '../data/data';
import { submitRegistration } from '../services/supabase';
import tshirtMockup from '../assets/tshirt-mockup.png';

export const TShirtForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    size: JANMASTHAMI_CONFIG.tshirtSizes[1] || 'M' // Default to M
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.trim())) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.size) {
      setErrorMsg('Please select a T-Shirt size.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await submitRegistration({
        name: formData.name,
        mobile: formData.mobile,
        size: formData.size
      });

      if (res.success) {
        setSubmittedData({
          ...res.data,
          source: res.source
        });

        // Trigger celebration confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Reset form inputs
        setFormData({
          name: '',
          mobile: '',
          size: JANMASTHAMI_CONFIG.tshirtSizes[1] || 'M'
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tshirt-form" className="py-16 px-4 sm:px-6 relative scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-3">
            <Shirt className="w-4 h-4 text-amber-400" />
            <span>Mahotsav Uniform T-Shirt</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-serif">
            Register For Goverdhan Haveli T-Shirt
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            All group members wear matching royal blue t-shirts during the Janmashtami Mahotsav celebration. Submit your details below to reserve your size.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-[#0d1425]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative"
          >
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submittedData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 font-serif">
                  Registration Successful!
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you <strong className="text-amber-300">{submittedData.name}</strong>. Your T-shirt size <strong className="text-amber-400">({submittedData.size})</strong> has been registered with mobile <span className="text-slate-200">{submittedData.mobile}</span>.
                </p>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 inline-block text-xs text-amber-300">
                  Status: <span className="font-bold uppercase tracking-wider">{submittedData.status || 'Pending'}</span>
                  {submittedData.source === 'supabase' ? ' • Saved to Supabase DB' : ' • Saved to Local Storage'}
                </div>

                <div>
                  <button
                    onClick={() => setSubmittedData(null)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-sm"
                  >
                    Register Another Person
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Field: Full Name */}
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Patel"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
                    />
                  </div>
                </div>

                {/* Field: Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">
                    Mobile Number <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
                    />
                  </div>
                </div>

                {/* Field: Size Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">
                    Select T-Shirt Size <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                      <Shirt className="w-5 h-5" />
                    </div>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm cursor-pointer"
                    >
                      {JANMASTHAMI_CONFIG.tshirtSizes.map((sz) => (
                        <option key={sz} value={sz} className="bg-[#0d1425] text-slate-100">
                          Size {sz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Size Select Pills */}
                <div>
                  <span className="text-xs text-slate-400 mb-2 block">Quick size picker:</span>
                  <div className="flex flex-wrap gap-2">
                    {JANMASTHAMI_CONFIG.tshirtSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setFormData({ ...formData, size: sz })}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                          formData.size === sz
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-[#080d19] text-amber-300 border-amber-500/20 hover:border-amber-500/50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-base disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Registration...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit T-Shirt Registration</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right Column: T-Shirt Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-gradient-to-b from-[#0d1425] to-[#0a0f1d] border border-amber-500/20 rounded-3xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden"
          >
            <div className="relative z-10 w-full">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Uniform Preview</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 font-serif">
                Goverdhan Haveli Official T-Shirt
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Royal Blue & Gold Edition 2026
              </p>

              {/* Mockup Image Container */}
              <div className="my-6 relative flex justify-center group">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-400/20 blur-lg opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={tshirtMockup}
                  alt="Goverdhan Haveli T-Shirt Mockup"
                  className="relative w-56 sm:w-64 h-auto rounded-2xl border border-amber-500/30 object-cover shadow-2xl"
                />
                
                {/* Selected Size Badge Floating */}
                <div className="absolute bottom-3 right-4 bg-amber-500 text-slate-950 font-black text-sm px-3.5 py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
                  <span>SIZE:</span>
                  <span className="text-base">{formData.size}</span>
                </div>
              </div>
            </div>

            <div className="w-full p-4 rounded-xl bg-[#080d19]/80 border border-amber-500/20 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Color:</span>
                <strong className="text-amber-300">Royal Midnight Blue</strong>
              </div>
              <div className="flex justify-between">
                <span>Print:</span>
                <strong className="text-amber-300">Gold Goverdhan Logo</strong>
              </div>
              <div className="flex justify-between">
                <span>Fabric:</span>
                <strong className="text-amber-300">Premium 100% Cotton</strong>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
