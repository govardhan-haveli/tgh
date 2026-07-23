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
  QrCode,
  Upload,
  X,
  IndianRupee,
  Loader2,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JANMASTHAMI_CONFIG } from '../data/data';
import { submitRegistration, fetchTShirtSettings } from '../services/supabase';
import { uploadToCloudinary } from '../services/cloudinary';
import tshirtMockup from '../assets/tshirt-mockup.png';

export const TShirtForm = () => {
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
    <section id="tshirt-form" className="py-12 sm:py-16 px-4 sm:px-6 relative scroll-mt-20">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-3">
            <Shirt className="w-4 h-4 text-amber-400" />
            <span>Mahotsav Uniform T-Shirt</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-serif">
            Register For Goverdhan Haveli T-Shirt
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
            Fill details, view sample & scan payment QR code, attach payment screenshot, and register!
          </p>
        </div>

        {/* Error Alert Bar */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submittedData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d1425] border border-amber-500/30 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-2xl"
          >
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100 font-serif">
              Registration Successful!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you <strong className="text-amber-300">{submittedData.name}</strong>. Your size <strong className="text-amber-400">({submittedData.size})</strong> has been registered with mobile <span className="text-slate-200">{submittedData.mobile}</span>. Payment screenshot uploaded!
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

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 block text-xs text-amber-300 max-w-xs mx-auto">
              Status: <span className="font-bold uppercase tracking-wider">{submittedData.status || 'Pending'}</span>
              {submittedData.source === 'supabase' ? ' • Saved in Supabase DB' : ' • Saved locally'}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSubmittedData(null)}
                className="px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-sm shadow-md"
              >
                Register Another Person
              </button>
            </div>
          </motion.div>
        ) : (
          /* Mobile-Optimized Step-by-Step Form Layout */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* STEP 1: User Personal Details -> order-1 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-1 lg:col-span-7 bg-[#0d1425] border border-amber-500/30 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-serif">
                  Step 1: Enter Your Details
                </h3>
              </div>

              {/* Full Name */}
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
                    placeholder="e.g. Ramesh Patel"
                    required
                    className="w-full pl-10 sm:pl-11 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Mobile Number */}
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

              {/* Quick Select Size Pills */}
              <div>
                <div className="text-[11px] text-amber-400/80 mb-2 font-medium">
                  Quick Size Picker:
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {JANMASTHAMI_CONFIG.tshirtSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFormData({ ...formData, size: sz })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
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
            </motion.div>

            {/* STEP 2: T-Shirt Sample & Payment QR Code Cards -> order-2 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-2 lg:col-span-5 lg:row-span-3 space-y-5"
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
              <div className="bg-gradient-to-b from-[#0d1425] to-[#0a0f1d] border border-amber-500/30 rounded-3xl p-5 flex flex-col items-center text-center relative shadow-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Step 2: Scan & Pay</span>
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
                  👇 After scanning and paying, attach your screenshot below!
                </div>
              </div>
            </motion.div>

            {/* STEP 3: Mandatory Payment Screenshot Upload Card -> order-3 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="order-3 lg:col-span-7 bg-[#0d1425] border border-amber-500/30 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">3</span>
                  <label className="block text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider font-serif">
                    Step 3: Upload Payment Screenshot
                  </label>
                </div>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30 font-semibold uppercase">
                  Mandatory *
                </span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">
                Attach the payment confirmation screenshot from GPay/PhonePe/Paytm after paying <strong className="text-amber-300">₹{settings.price}</strong>.
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
                        Screenshot Attached!
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
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl cursor-pointer bg-[#080d19]/60 hover:bg-amber-500/5 transition text-center group">
                  <Upload className="w-8 h-8 text-amber-400 group-hover:scale-110 transition mb-2" />
                  <span className="text-xs sm:text-sm font-bold text-amber-200">
                    Click Here to Attach Payment Screenshot
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
            </motion.div>

            {/* STEP 4: Submit Button -> order-4 */}
            <div className="order-4 lg:col-span-7">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-xl shadow-amber-500/25 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{submitStatusText || 'Processing...'}</span>
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5 stroke-[2.5]" />
                    <span>Submit T-Shirt Registration</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
