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
  FileCheck,
  Plus,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { JANMASTHAMI_CONFIG } from '../data/data';
import { submitRegistration, fetchTShirtSettings } from '../services/supabase';
import { uploadToCloudinary } from '../services/cloudinary';
import tshirtMockup from '../assets/tshirt-mockup.png';

export const RegistrationPage = () => {
  const [primaryContact, setPrimaryContact] = useState({
    name: '',
    mobile: ''
  });

  const [sizeQuantities, setSizeQuantities] = useState(() => {
    const initial = {};
    JANMASTHAMI_CONFIG.tshirtSizes.forEach(sz => {
      initial[sz] = 0;
    });
    return initial;
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

  const handleContactChange = (e) => {
    setPrimaryContact({
      ...primaryContact,
      [e.target.name]: e.target.value
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleQuantityChange = (sz, qty) => {
    const num = Math.max(0, parseInt(qty, 10) || 0);
    setSizeQuantities(prev => ({
      ...prev,
      [sz]: num
    }));
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

  const totalTShirts = Object.values(sizeQuantities).reduce((a, b) => a + Number(b), 0);
  const totalPayable = totalTShirts * (settings.price || 250);

  const selectedSizesList = Object.entries(sizeQuantities)
    .filter(([_, qty]) => qty > 0)
    .map(([sz, qty]) => ({ size: sz, quantity: qty }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!primaryContact.name.trim()) {
      setErrorMsg('Please enter your full name as the contact person.');
      return;
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(primaryContact.mobile.trim())) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (totalTShirts === 0) {
      setErrorMsg('Please select a quantity (at least 1 T-Shirt) for your desired size.');
      return;
    }

    // MANDATORY FIELD: Payment Screenshot
    if (!paymentFile) {
      setErrorMsg(`Payment screenshot is mandatory. Please scan QR code, pay ₹${totalPayable}, and upload the screenshot.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // Step 1: Upload Payment Screenshot
      setSubmitStatusText('Uploading Payment Screenshot...');
      let uploadedScreenshotUrl = '';
      try {
        uploadedScreenshotUrl = await uploadToCloudinary(paymentFile);
      } catch (uploadErr) {
        throw new Error(`Payment screenshot upload failed: ${uploadErr.message}`);
      }

      // Step 2: Submit registration to Supabase
      setSubmitStatusText('Saving T-Shirt Registration...');
      const res = await submitRegistration({
        name: primaryContact.name.trim(),
        mobile: primaryContact.mobile.trim(),
        sizes: sizeQuantities,
        total_tshirts: totalTShirts,
        total_amount: totalPayable,
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

        setPrimaryContact({ name: '', mobile: '' });
        const resetQty = {};
        JANMASTHAMI_CONFIG.tshirtSizes.forEach(sz => { resetQty[sz] = 0; });
        setSizeQuantities(resetQty);
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

        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Shirt className="w-3.5 h-3.5 text-amber-400" />
            <span>Goverdhan Haveli Uniform 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-serif leading-tight">
            Janmashtami T-Shirt Registration
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Select size quantities (₹{settings.price}/shirt), scan QR code to pay total amount, upload screenshot, and confirm!
          </p>
        </div>

        {/* Error Alert Bar */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submittedData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d1425] border border-amber-500/30 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-2xl"
          >
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
              Registration Confirmed!
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Thank you <strong className="text-amber-300">{submittedData.name}</strong> (Mobile: <span className="text-slate-200">{submittedData.mobile}</span>). Your order for <strong className="text-amber-400">{submittedData.total_tshirts} T-Shirt(s)</strong> totaling <strong className="text-emerald-400">₹{submittedData.total_amount}</strong> has been received!
            </p>

            {/* Detailed T-Shirt Breakdown */}
            <div className="max-w-md mx-auto bg-[#080d19] border border-amber-500/20 rounded-2xl p-4 text-left space-y-2">
              <div className="text-xs font-bold text-amber-300 border-b border-amber-500/20 pb-2 flex justify-between items-center">
                <span>Selected Sizes & Quantity:</span>
                <span className="bg-amber-500/10 px-2 py-0.5 rounded text-[11px] font-mono text-amber-400">{submittedData.total_tshirts} Pcs Total</span>
              </div>
              <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto pr-1">
                {Object.entries(submittedData.sizes || {})
                  .filter(([_, qty]) => qty > 0)
                  .map(([sz, qty], idx) => (
                    <div key={sz} className="flex justify-between items-center text-xs py-1 px-2.5 rounded-lg bg-[#0d1425]/60 border border-amber-500/10">
                      <span className="font-medium text-slate-200">
                        Size: <strong className="text-amber-300">{sz}</strong>
                      </span>
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {qty} Pc{qty > 1 ? 's' : ''} (₹{qty * settings.price})
                      </span>
                    </div>
                  ))}
              </div>
            </div>

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

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 block text-[11px] sm:text-xs text-amber-300 max-w-xs mx-auto font-medium">
              Registration Status: <span className="font-bold uppercase tracking-wider text-amber-200">{submittedData.status === 'Accepted' ? 'Accepted & Confirmed' : 'Submitted (Under Review)'}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSubmittedData(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-sm active:scale-95 cursor-pointer"
              >
                Register More T-Shirts
              </button>
            </div>
          </motion.div>
        ) : (
          /* Mobile-Optimized Form Layout */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* STEP 1: Registrant & Size Quantity Matrix -> order-1 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-1 lg:col-span-7 bg-[#0d1425] border border-amber-500/30 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-serif">
                  Step 1: Contact Info & Size Quantities
                </h3>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#080d19] p-4 rounded-2xl border border-amber-500/20">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Your Full Name <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400/70">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={primaryContact.name}
                      onChange={handleContactChange}
                      placeholder="Enter full name"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0d1425] border border-amber-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Mobile Number <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400/70">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      maxLength={10}
                      value={primaryContact.mobile}
                      onChange={handleContactChange}
                      placeholder="10-digit mobile number"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0d1425] border border-amber-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs sm:text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes Quantity Selection List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Shirt className="w-4 h-4 text-amber-400" />
                    <span>Select Quantity for Each Size:</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    ₹{settings.price} per shirt
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                  {JANMASTHAMI_CONFIG.tshirtSizes.map((sz) => {
                    const qty = sizeQuantities[sz] || 0;
                    const isSelected = qty > 0;
                    return (
                      <div
                        key={sz}
                        className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border-amber-400 shadow-md shadow-amber-500/10'
                            : 'bg-[#080d19] border-amber-500/20 hover:border-amber-500/40'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                            <span>Size {sz}</span>
                            {isSelected && (
                              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                                ₹{qty * settings.price}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {qty > 0 ? `${qty} shirt(s) selected` : 'Select quantity'}
                          </div>
                        </div>

                        {/* Quantity Controls: Stepper Buttons & Dropdown */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(sz, qty - 1)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded-lg bg-[#0d1425] border border-amber-500/30 text-amber-300 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-[#0d1425] hover:bg-amber-500/20 transition active:scale-95 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <select
                            value={qty}
                            onChange={(e) => handleQuantityChange(sz, e.target.value)}
                            className="w-14 py-1 text-center bg-[#0d1425] border border-amber-500/40 rounded-lg text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                              <option key={num} value={num} className="bg-[#0d1425] text-slate-100">
                                {num}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleQuantityChange(sz, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center hover:bg-amber-500/30 transition active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Order Summary Bar */}
              <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="text-slate-300">Total Quantity: </span>
                  <strong className="text-amber-300 font-bold">{totalTShirts} T-Shirt{totalTShirts !== 1 ? 's' : ''}</strong>
                </div>
                <div>
                  <span className="text-slate-300">Total Payable: </span>
                  <strong className="text-emerald-400 font-extrabold text-sm sm:text-base">₹{totalPayable}</strong>
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
                  <span>₹{settings.price} per T-Shirt</span>
                </div>

                <div className="my-4 relative flex justify-center w-full">
                  <img
                    src={samplePhoto}
                    alt="Goverdhan Haveli T-Shirt"
                    className="max-h-52 object-contain rounded-2xl border border-amber-500/30 shadow-xl bg-[#080d19]/80"
                  />
                  <div className="absolute bottom-2 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border border-amber-300">
                    {totalTShirts} T-Shirt{totalTShirts !== 1 ? 's' : ''} Selected
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
                  <span>Step 2: Scan & Pay Total</span>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-amber-300">
                  Scan & Pay Total ₹{totalPayable}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ₹{settings.price} × {totalTShirts} T-Shirt{totalTShirts !== 1 ? 's' : ''} via GPay, PhonePe, Paytm
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
                        Payment QR Code Not Uploaded Yet
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Pay ₹{totalPayable} to Group Coordinator
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full text-center text-[10px] sm:text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 font-medium">
                  👇 After scanning and paying ₹{totalPayable}, attach your screenshot below!
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
                Attach the payment confirmation screenshot showing total payment of <strong className="text-emerald-400">₹{totalPayable}</strong>.
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
                    className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl cursor-pointer bg-[#080d19]/60 hover:bg-amber-500/5 transition text-center group">
                  <Upload className="w-8 h-8 text-amber-400 group-hover:scale-110 transition mb-2" />
                  <span className="text-xs sm:text-sm font-bold text-amber-200">
                    Click Here to Attach Payment Screenshot (₹{totalPayable})
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
                    <span>Submit T-Shirt Registration ({totalTShirts} T-Shirt{totalTShirts !== 1 ? 's' : ''} • ₹{totalPayable})</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

