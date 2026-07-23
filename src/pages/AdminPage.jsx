import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  Trash2,
  Lock,
  Shirt,
  ListOrdered,
  QrCode,
  IndianRupee,
  Upload,
  Eye,
  X,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileImage,
  Sliders
} from 'lucide-react';
import { AdminAuthModal } from '../components/AdminAuthModal';
import {
  fetchRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  fixRegistrationNumbering,
  fetchTShirtSettings,
  updateTShirtSettings
} from '../services/supabase';
import { uploadToCloudinary } from '../services/cloudinary';
import { JANMASTHAMI_CONFIG } from '../data/data';

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('goverdhan_admin_authenticated') === 'true';
  });

  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' | 'settings'

  // Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fixLoading, setFixLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sizeFilter, setSizeFilter] = useState('All');

  // Preview Modal for Payment Screenshot
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  // Dynamic T-Shirt & Payment Settings state
  const [settings, setSettings] = useState({
    price: 250,
    qr_code_url: '',
    sample_image_url: '',
    description: 'Goverdhan Haveli Official Janmashtami T-Shirt 2026'
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });

  // File upload states for Admin Settings
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState('');
  const [sampleFile, setSampleFile] = useState(null);
  const [samplePreview, setSamplePreview] = useState('');

  const loadData = async () => {
    setLoading(true);
    const { data } = await fetchRegistrations();
    setRegistrations(data || []);
    setLoading(false);
  };

  const loadSettingsData = async () => {
    setLoadingSettings(true);
    const res = await fetchTShirtSettings();
    if (res.data) {
      setSettings({
        price: res.data.price || 250,
        qr_code_url: res.data.qr_code_url || '',
        sample_image_url: res.data.sample_image_url || '',
        description: res.data.description || ''
      });
      setQrPreview(res.data.qr_code_url || '');
      setSamplePreview(res.data.sample_image_url || '');
    }
    setLoadingSettings(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      loadSettingsData();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (id, newStatus) => {
    await updateRegistrationStatus(id, newStatus);
    setRegistrations(prev =>
      prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      await deleteRegistration(id);
      setRegistrations(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleFixNumbering = async () => {
    if (!window.confirm('Re-sequence all registration numbers sequentially (1, 2, 3...) based on registration date?')) {
      return;
    }
    setFixLoading(true);
    try {
      const res = await fixRegistrationNumbering();
      if (res.success) {
        alert(`✅ Fixed registration numbers sequentially for ${res.count} record(s)!`);
        await loadData();
      }
    } catch (err) {
      alert('Failed to fix numbering: ' + err.message);
    } finally {
      setFixLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('goverdhan_admin_authenticated');
    setIsAuthenticated(false);
  };

  // Export to CSV for T-Shirt Printing Vendor
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert('No registration data to export.');
      return;
    }

    const headers = ['Reg No', 'UUID ID', 'Date', 'Name', 'Mobile Number', 'T-Shirt Size', 'Payment Screenshot URL', 'Status'];
    const rows = registrations.map((r, idx) => [
      r.registration_no || idx + 1,
      r.id,
      new Date(r.created_at).toLocaleDateString(),
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${r.mobile}"`,
      r.size,
      `"${r.payment_screenshot_url || ''}"`,
      r.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Goverdhan_Haveli_TShirt_Orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Settings Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg({ type: '', text: '' });

    try {
      let finalQrUrl = settings.qr_code_url;
      let finalSampleUrl = settings.sample_image_url;

      // Upload QR file if new file selected
      if (qrFile) {
        setSettingsMsg({ type: 'info', text: 'Uploading QR Code image to Cloudinary...' });
        finalQrUrl = await uploadToCloudinary(qrFile);
      }

      // Upload Sample T-shirt file if new file selected
      if (sampleFile) {
        setSettingsMsg({ type: 'info', text: 'Uploading T-Shirt Sample image to Cloudinary...' });
        finalSampleUrl = await uploadToCloudinary(sampleFile);
      }

      setSettingsMsg({ type: 'info', text: 'Saving settings to Supabase DB...' });

      const res = await updateTShirtSettings({
        price: settings.price,
        qr_code_url: finalQrUrl,
        sample_image_url: finalSampleUrl,
        description: settings.description
      });

      if (res.success) {
        setSettings({
          price: res.data.price,
          qr_code_url: res.data.qr_code_url,
          sample_image_url: res.data.sample_image_url,
          description: res.data.description
        });
        setQrFile(null);
        setSampleFile(null);
        setSettingsMsg({ type: 'success', text: '✅ T-Shirt Settings updated successfully!' });
      }
    } catch (err) {
      setSettingsMsg({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered List
  const filteredRegistrations = registrations.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm) ||
      (item.registration_no && item.registration_no.toString().includes(searchTerm));
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSize = sizeFilter === 'All' || item.size === sizeFilter;
    return matchesSearch && matchesStatus && matchesSize;
  });

  const sizeCounts = JANMASTHAMI_CONFIG.tshirtSizes.reduce((acc, sz) => {
    acc[sz] = registrations.filter(r => r.size === sz).length;
    return acc;
  }, {});

  const totalCount = registrations.length;
  const pendingCount = registrations.filter(r => r.status === 'Pending').length;
  const acceptedCount = registrations.filter(r => r.status === 'Accepted').length;
  const deliveredCount = registrations.filter(r => r.status === 'Delivered').length;

  if (!isAuthenticated) {
    return <AdminAuthModal onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Admin Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 bg-[#0d1425] border border-amber-500/30 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
                Goverdhan Haveli Admin Dashboard
              </h1>
              <p className="text-xs text-slate-400">
                Manage registrations, verify payment screenshots & configure dynamic QR codes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Tab Switching Buttons */}
            <div className="flex bg-[#080d19] p-1 rounded-2xl border border-amber-500/20 mr-2">
              <button
                onClick={() => setActiveTab('registrations')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'registrations'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Shirt className="w-4 h-4" />
                <span>Registrations</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>QR & Price Settings</span>
              </button>
            </div>

            <button
              onClick={handleFixNumbering}
              disabled={fixLoading}
              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              title="Fix & Resequence Registration Numbers"
            >
              <ListOrdered className={`w-4 h-4 text-amber-400 ${fixLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Fix Numbering</span>
            </button>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-[#080d19] hover:bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium transition flex items-center gap-1.5"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition flex items-center gap-1.5"
              title="Lock Admin"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: REGISTRATIONS MANAGEMENT */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            
            {/* Stats Overview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-amber-500/20 shadow-lg">
                <div className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">Total Requests</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1">{totalCount}</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-yellow-500/20 shadow-lg">
                <div className="text-[11px] sm:text-xs font-medium text-yellow-400 uppercase tracking-wider">Pending Verification</div>
                <div className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono mt-1">{pendingCount}</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-emerald-500/20 shadow-lg">
                <div className="text-[11px] sm:text-xs font-medium text-emerald-400 uppercase tracking-wider">Accepted / Paid</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">{acceptedCount}</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-sky-500/20 shadow-lg">
                <div className="text-[11px] sm:text-xs font-medium text-sky-400 uppercase tracking-wider">Delivered</div>
                <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono mt-1">{deliveredCount}</div>
              </div>
            </div>

            {/* Size Order Summary */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-amber-500/20">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                <Shirt className="w-4 h-4 text-amber-400" />
                <span>T-Shirt Size Summary (For Vendor Bulk Printing Order)</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
                {JANMASTHAMI_CONFIG.tshirtSizes.map((sz) => (
                  <div key={sz} className="p-2.5 rounded-xl bg-[#080d19] border border-amber-500/10 text-center">
                    <div className="text-[11px] font-bold text-amber-400 truncate">{sz}</div>
                    <div className="text-lg font-mono font-bold text-slate-100 mt-0.5">{sizeCounts[sz]} Pcs</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="p-4 rounded-2xl bg-[#0d1425] border border-amber-500/20 flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400/60">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, mobile, or reg no..."
                  className="w-full pl-9 pr-4 py-2 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#080d19] border border-amber-500/30 text-amber-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span>Size:</span>
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    className="bg-[#080d19] border border-amber-500/30 text-amber-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="All">All Sizes</option>
                    {JANMASTHAMI_CONFIG.tshirtSizes.map(sz => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#0d1425] border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#080d19] text-amber-400 font-semibold border-b border-amber-500/20 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5 text-center"># Reg No.</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Mobile</th>
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5 text-center">Payment Screenshot</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Manage Status</th>
                      <th className="p-3.5 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-500/10 text-slate-200">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400">
                          No matching T-shirt registrations found.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-amber-500/5 transition">
                          <td className="p-3.5 text-center font-mono font-bold text-amber-300">
                            #{item.registration_no || idx + 1}
                          </td>
                          <td className="p-3.5 text-slate-400 text-xs whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3.5 font-bold text-amber-200">{item.name}</td>
                          <td className="p-3.5 font-mono text-slate-300">{item.mobile}</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-xs">
                              {item.size}
                            </span>
                          </td>
                          
                          {/* Payment Screenshot Thumbnail Column */}
                          <td className="p-3.5 text-center">
                            {item.payment_screenshot_url ? (
                              <button
                                onClick={() => setSelectedScreenshot({
                                  url: item.payment_screenshot_url,
                                  name: item.name,
                                  mobile: item.mobile,
                                  size: item.size,
                                  regNo: item.registration_no || idx + 1
                                })}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition group"
                              >
                                <img
                                  src={item.payment_screenshot_url}
                                  alt="Payment Screenshot"
                                  className="w-6 h-6 object-cover rounded border border-amber-400"
                                />
                                <Eye className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                                <span>View Photo</span>
                              </button>
                            ) : (
                              <span className="text-slate-500 text-[11px] italic">No Photo</span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              item.status === 'Accepted'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : item.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : item.status === 'Delivered'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            }`}>
                              {item.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleStatusChange(item.id, 'Accepted')}
                                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 transition"
                                title="Accept Request"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'Delivered')}
                                className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-semibold border border-sky-500/30 transition"
                                title="Mark Delivered"
                              >
                                Delivered
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'Rejected')}
                                className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold border border-rose-500/30 transition"
                                title="Reject Request"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Delete Registration"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DYNAMIC T-SHIRT & PAYMENT QR SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d1425] border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100 font-serif">
                    Dynamic Payment QR Code & T-Shirt Settings
                  </h2>
                  <p className="text-xs text-slate-400">
                    Upload or update the payment QR code photo, T-shirt price, and sample image displayed on the public registration page.
                  </p>
                </div>
              </div>

              {settingsMsg.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm ${
                  settingsMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : settingsMsg.type === 'error'
                    ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                }`}>
                  {settingsMsg.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{settingsMsg.text}</span>
                </div>
              )}

              {loadingSettings ? (
                <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  <span>Loading settings from Supabase...</span>
                </div>
              ) : (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  
                  {/* Field: T-Shirt Price */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-amber-200 mb-2">
                      T-Shirt Registration Price (INR ₹)
                    </label>
                    <div className="relative max-w-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                        <IndianRupee className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        value={settings.price}
                        onChange={(e) => setSettings({ ...settings, price: e.target.value })}
                        placeholder="250"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400 font-mono text-base font-bold"
                      />
                    </div>
                  </div>

                  {/* Field: Dynamic Payment QR Code Photo */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-amber-200">
                      Payment QR Code Photo
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-8 space-y-2">
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-500/30 hover:border-amber-400 rounded-2xl cursor-pointer bg-[#080d19]/80 hover:bg-amber-500/5 transition text-center group">
                          <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition mb-1" />
                          <span className="text-xs font-bold text-amber-200">
                            Upload New QR Code Image to Cloudinary
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {qrFile ? `Selected: ${qrFile.name}` : 'Click to choose image file'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files[0];
                              if (f) {
                                setQrFile(f);
                                setQrPreview(URL.createObjectURL(f));
                              }
                            }}
                            className="hidden"
                          />
                        </label>

                        <div className="text-slate-400 text-xs">Or paste image URL directly:</div>
                        <input
                          type="url"
                          value={settings.qr_code_url}
                          onChange={(e) => {
                            setSettings({ ...settings, qr_code_url: e.target.value });
                            setQrPreview(e.target.value);
                          }}
                          placeholder="https://res.cloudinary.com/..."
                          className="w-full px-3.5 py-2 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-amber-400">
                        {qrPreview ? (
                          <img
                            src={qrPreview}
                            alt="QR Preview"
                            className="w-32 h-32 object-contain rounded"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <QrCode className="w-12 h-12 text-slate-400 mx-auto" />
                            <p className="text-[10px] text-slate-500 mt-1">No QR Code set</p>
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-slate-800 mt-1">QR Preview</span>
                      </div>
                    </div>
                  </div>

                  {/* Field: T-Shirt Sample Photo */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-amber-200">
                      T-Shirt Sample Photo
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-8 space-y-2">
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-500/30 hover:border-amber-400 rounded-2xl cursor-pointer bg-[#080d19]/80 hover:bg-amber-500/5 transition text-center group">
                          <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition mb-1" />
                          <span className="text-xs font-bold text-amber-200">
                            Upload New T-Shirt Sample Photo to Cloudinary
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {sampleFile ? `Selected: ${sampleFile.name}` : 'Click to choose image file'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files[0];
                              if (f) {
                                setSampleFile(f);
                                setSamplePreview(URL.createObjectURL(f));
                              }
                            }}
                            className="hidden"
                          />
                        </label>

                        <div className="text-slate-400 text-xs">Or paste image URL directly:</div>
                        <input
                          type="url"
                          value={settings.sample_image_url}
                          onChange={(e) => {
                            setSettings({ ...settings, sample_image_url: e.target.value });
                            setSamplePreview(e.target.value);
                          }}
                          placeholder="https://res.cloudinary.com/..."
                          className="w-full px-3.5 py-2 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-[#080d19] rounded-2xl border border-amber-500/30">
                        {samplePreview ? (
                          <img
                            src={samplePreview}
                            alt="Sample Preview"
                            className="w-32 h-32 object-contain rounded"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <FileImage className="w-12 h-12 text-slate-500 mx-auto" />
                            <p className="text-[10px] text-slate-500 mt-1">Mockup default</p>
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-amber-400 mt-1">Sample Preview</span>
                      </div>
                    </div>
                  </div>

                  {/* Description / Instructions */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-amber-200 mb-2">
                      Public T-Shirt Instructions / Description
                    </label>
                    <textarea
                      rows={3}
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      placeholder="e.g. Goverdhan Haveli Official Janmashtami Uniform T-Shirt 2026. Royal Blue & Gold Edition."
                      className="w-full p-3.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Save Settings Button */}
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {savingSettings ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Settings...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save T-Shirt & Payment Settings</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}

      </div>

      {/* FULL SCREEN PAYMENT SCREENSHOT PREVIEW MODAL */}
      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedScreenshot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1425] border border-amber-500/40 rounded-3xl p-5 max-w-2xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2 font-serif">
                    <span>Payment Screenshot Verification</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Reg No: <strong className="text-amber-400">#{selectedScreenshot.regNo}</strong> • {selectedScreenshot.name} ({selectedScreenshot.mobile})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Box */}
              <div className="flex-grow overflow-auto flex items-center justify-center bg-black/50 rounded-2xl p-2 border border-amber-500/20 max-h-[60vh]">
                <img
                  src={selectedScreenshot.url}
                  alt="Payment Screenshot Full"
                  className="max-h-[55vh] object-contain rounded-xl shadow-xl"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <a
                  href={selectedScreenshot.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full Image in New Tab</span>
                </a>

                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
