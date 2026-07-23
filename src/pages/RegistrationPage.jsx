import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shirt,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Send,
  ArrowLeft,
  QrCode,
  Upload,
  X,
  IndianRupee,
  Loader2,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { JANMASTHAMI_CONFIG } from '../data/data';
import { submitRegistration, fetchTShirtSettings } from '../services/supabase';
import { uploadToCloudinary } from '../services/cloudinary';
import tshirtMockup from '../assets/tshirt-mockup.png';

export const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    size: JANMASTHAMI_CONFIG.tshirtSizes[1] || '38 (S)'
  });

  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState('');
  
  const [settings, setSettings] = useState({
    price: 250,
    qr_code_url: '',
    sample_image_url: '',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitStatusText, setSubmitStatusText] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const res = await fetchTShirtSettings();
      if (res.data) {
        setSettings({
          price: res.data.price || 250,
          qr_code_url: res.data.qr_code_url || '',
          sample_image_url: res.data.sample_image_url || '',
          description: res.data.description || ''
        });
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file for the payment screenshot.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Payment screenshot size must be less than 10MB.');
      return;
    }

    setPaymentFile(file);
    setPaymentPreview(URL.createObjectURL(file));
    if (errorMsg) setErrorMsg('');
  };

  const handleRemoveFile = () => {
    setPaymentFile(null);
    if (paymentPreview) {
      URL.revokeObjectURL(paymentPreview);
      setPaymentPreview('');
    }
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

    // MANDATORY FIELD: Payment Screenshot
    if (!paymentFile) {
      setErrorMsg('Payment screenshot is mandatory. Please scan QR code, make payment, and upload screenshot.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // Step 1: Upload Payment Screenshot to Cloudinary
      setSubmitStatusText('Uploading Payment Screenshot to Cloudinary...');
      let uploadedScreenshotUrl = '';
      try {
        uploadedScreenshotUrl = await uploadToCloudinary(paymentFile);
      } catch (uploadErr) {
        throw new Error(`Cloudinary upload failed: ${uploadErr.message}`);
      }

      // Step 2: Submit registration to Supabase
      setSubmitStatusText('Saving T-Shirt Registration...');
      const res = await submitRegistration({
        name: formData.name,
        mobile: formData.mobile,
        size: formData.size,
        payment_screenshot_url: uploadedScreenshotUrl
      });

      if (res.success) {
        setSubmittedData({
          ...res.data,
          source: res.source
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        setFormData({
          name: '',
          mobile: '',
          size: JANMASTHAMI_CONFIG.tshirtSizes[1] || '38 (S)'
        });
        handleRemoveFile();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
      setSubmitStatusText('');
    }
  };

  const samplePhoto = settings.sample_image_url || tshirtMockup;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
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
            All group members wear matching royal blue t-shirts during Janmashtami Mahotsav. Scan QR code to pay, upload payment screenshot, and reserve your size.
          </p>
        </div>

        {/* Mobile-Optimized Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-[#0d1425] border border-amber-500/30 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl relative"
          >
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submittedData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
                  Registration Confirmed!
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                  Thank you <strong className="text-amber-300">{submittedData.name}</strong>. Your T-shirt size <strong className="text-amber-400">({submittedData.size})</strong> has been registered with mobile <span className="text-slate-200">{submittedData.mobile}</span>. Payment screenshot uploaded!
                </p>

                {submittedData.payment_screenshot_url && (
                  <div className="mt-2 inline-block">
                    <a
                      href={submittedData.payment_screenshot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>View Uploaded Payment Screenshot</span>
                    </a>
                  </div>
                )}

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

                {/* MANDATORY FIELD: Payment Screenshot Upload */}
                <div className="p-4 rounded-2xl bg-[#080d19]/90 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs sm:text-sm font-bold text-amber-300">
                      Payment Screenshot Photo <span className="text-rose-400">* (Mandatory)</span>
                    </label>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-semibold uppercase">
                      Required
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs">
                    Please scan the QR code below, make the payment of <strong className="text-amber-300">₹{settings.price}</strong>, and attach the payment screenshot here.
                  </p>

                  {paymentPreview ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950/60 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={paymentPreview}
                          alt="Payment Screenshot Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-amber-500/30"
                        />
                        <div>
                          <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Screenshot Attached
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            {paymentFile?.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {(paymentFile?.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl cursor-pointer bg-[#0d1425]/60 hover:bg-amber-500/5 transition text-center group">
                      <Upload className="w-7 h-7 text-amber-400 group-hover:scale-110 transition mb-1.5" />
                      <span className="text-xs font-bold text-amber-200">
                        Click to Upload Payment Screenshot
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, WEBP up to 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>{submitStatusText || 'Processing...'}</span>
                    </span>
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

          {/* T-Shirt Live Preview & Dynamic QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-5"
          >
            {/* Sample Photo & Price Card */}
            <div className="bg-gradient-to-b from-[#0d1425] to-[#0a0f1d] border border-amber-500/20 rounded-3xl p-5 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Uniform Sample Preview</span>
              </div>

              <h3 className="text-lg font-bold text-slate-100 font-serif">
                Goverdhan Haveli Official T-Shirt
              </h3>

              <div className="mt-1.5 inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-base px-3.5 py-1 rounded-full shadow-md border border-amber-300">
                <IndianRupee className="w-4 h-4 stroke-[3]" />
                <span>PRICE: ₹{settings.price}</span>
              </div>

              <div className="my-4 relative flex justify-center w-full">
                <img
                  src={samplePhoto}
                  alt="Goverdhan Haveli T-Shirt"
                  className="max-h-56 object-contain rounded-2xl border border-amber-500/30 shadow-xl bg-[#080d19]/80"
                />
                <div className="absolute bottom-2 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border border-amber-300">
                  SIZE: {formData.size}
                </div>
              </div>

              {settings.description && (
                <p className="text-xs text-slate-300 bg-[#080d19]/80 p-2.5 rounded-xl border border-amber-500/20 w-full text-left">
                  {settings.description}
                </p>
              )}
            </div>

            {/* Dynamic Payment QR Code Card */}
            <div className="bg-gradient-to-b from-[#0d1425] to-[#0a0f1d] border border-amber-500/20 rounded-3xl p-5 flex flex-col items-center text-center relative shadow-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Payment QR Code</span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-100">
                Scan & Pay ₹{settings.price}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                GPay, PhonePe, Paytm or any UPI app
              </p>

              <div className="my-3 p-2.5 bg-white rounded-2xl border-2 border-amber-400 shadow-xl flex items-center justify-center min-w-[160px] min-h-[160px]">
                {settings.qr_code_url ? (
                  <img
                    src={settings.qr_code_url}
                    alt="Payment QR Code"
                    className="w-40 h-40 object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center p-3">
                    <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-600 font-semibold">
                      QR Code Pending Setup
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Pay ₹{settings.price} to Group Coordinator
                    </p>
                  </div>
                )}
              </div>

              <div className="w-full text-center text-[10px] sm:text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 font-medium">
                ⚠️ Mandatory: Upload payment screenshot in form after paying.
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
};
