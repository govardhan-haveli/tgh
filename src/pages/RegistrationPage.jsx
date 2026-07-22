import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shirt, User, Phone, CheckCircle2, Sparkles, AlertCircle, Send, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { JANMASTHAMI_CONFIG } from '../data/data';
import { submitRegistration } from '../services/supabase';
import tshirtMockup from '../assets/tshirt-mockup.png';

export const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    size: '38 (S)' // Default size
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

        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setFormData({
          name: '',
          mobile: '',
          size: '38 (S)'
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Back Navigation */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1425] border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-medium hover:border-amber-400/50 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Mobile-First Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Shirt className="w-3.5 h-3.5 text-amber-400" />
            <span>Goverdhan Haveli Uniform 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-serif leading-tight">
            Janmashtami T-Shirt Registration
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            All group members wear matching royal blue t-shirts during Janmashtami Mahotsav. Fill in your name, mobile, and size below.
          </p>
        </div>

        {/* Mobile-Optimized Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form Card (Span 7 on desktop, 100% on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-[#0d1425] border border-amber-500/30 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative"
          >
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submittedData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
                  Registration Confirmed!
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                  Thank you <strong className="text-amber-300">{submittedData.name}</strong>. Your T-shirt size <strong className="text-amber-400">({submittedData.size})</strong> has been registered with mobile <span className="text-slate-200">{submittedData.mobile}</span>.
                </p>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 inline-block text-[11px] sm:text-xs text-amber-300">
                  Status: <span className="font-bold uppercase tracking-wider">{submittedData.status || 'Pending'}</span>
                  {submittedData.source === 'supabase' ? ' • Saved in Supabase DB' : ' • Saved locally'}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSubmittedData(null)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-sm active:scale-95"
                  >
                    Register Another Person
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-amber-200 mb-1.5">
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Mobile Number Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-amber-200 mb-1.5">
                    Mobile Number <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      required
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs sm:text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Size Dropdown */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-amber-200 mb-1.5">
                    Select T-Shirt Size <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                      <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400 text-xs sm:text-sm cursor-pointer"
                    >
                      {JANMASTHAMI_CONFIG.tshirtSizes.map((sz) => (
                        <option key={sz} value={sz} className="bg-[#0d1425] text-slate-100">
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Select Size Pills for Touch Screens */}
                <div>
                  <div className="text-[11px] text-amber-400/80 mb-2 font-medium">
                    Quick Size Selection:
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {JANMASTHAMI_CONFIG.tshirtSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setFormData({ ...formData, size: sz })}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition border active:scale-95 text-center ${
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
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Registration...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Submit T-Shirt Registration</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* T-Shirt Live Preview Card (Desktop & Mobile view) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 bg-gradient-to-b from-[#0d1425] to-[#0a0f1d] border border-amber-500/20 rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Uniform Preview</span>
            </div>

            <h3 className="text-lg font-bold text-slate-100 font-serif">
              Goverdhan Haveli Official T-Shirt
            </h3>
            <p className="text-xs text-slate-400">Royal Midnight Blue & Gold</p>

            <div className="my-4 relative flex justify-center w-full">
              <img
                src={tshirtMockup}
                alt="Goverdhan Haveli T-Shirt"
                className="w-48 sm:w-56 h-auto rounded-2xl border border-amber-500/30 object-cover shadow-xl"
              />
              <div className="absolute bottom-2 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border border-amber-300">
                SIZE: {formData.size}
              </div>
            </div>

            <div className="w-full p-3 rounded-xl bg-[#080d19]/80 border border-amber-500/20 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Selected Size:</span>
                <strong className="text-amber-300 font-bold">{formData.size}</strong>
              </div>
              <div className="flex justify-between">
                <span>Color:</span>
                <strong className="text-amber-300">Royal Blue & Gold</strong>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
