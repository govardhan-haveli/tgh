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
  Sliders,
  Plus,
  Pencil,
  UserPlus,
  FileCheck,
  Instagram
} from 'lucide-react';
import { AdminAuthModal } from '../components/AdminAuthModal';
import {
  fetchRegistrations,
  updateRegistrationStatus,
  updateRegistrationDetails,
  adminCreateRegistration,
  deleteRegistration,
  fixRegistrationNumbering,
  fetchTShirtSettings,
  updateTShirtSettings,
  fetchInstagramReels,
  addInstagramReel,
  updateInstagramReel,
  deleteInstagramReel
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

  // Modal States
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form State for Add New Entry
  const [addForm, setAddForm] = useState({
    name: '',
    mobile: '',
    size: JANMASTHAMI_CONFIG.tshirtSizes[1] || '38 (S)',
    status: 'Accepted',
    payment_screenshot_url: ''
  });
  const [addFile, setAddFile] = useState(null);

  // Form State for Edit Entry
  const [editForm, setEditForm] = useState({
    name: '',
    mobile: '',
    size: '38 (S)',
    status: 'Pending',
    payment_screenshot_url: ''
  });
  const [editFile, setEditFile] = useState(null);

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

  // Instagram Reels State
  const [reelsList, setReelsList] = useState([]);
  const [loadingReels, setLoadingReels] = useState(false);
  const [addingReel, setAddingReel] = useState(false);
  const [reelMsg, setReelMsg] = useState({ type: '', text: '' });
  const [newReel, setNewReel] = useState({
    title: '',
    reel_url: '',
    category: 'Dahi Handi',
    display_order: 1
  });

  // Edit Reel Modal State
  const [isEditReelModalOpen, setIsEditReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState({
    id: '',
    title: '',
    reel_url: '',
    category: 'Dahi Handi',
    display_order: 1
  });
  const [savingEditReel, setSavingEditReel] = useState(false);
  const [editReelError, setEditReelError] = useState('');

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

  const loadReelsData = async () => {
    setLoadingReels(true);
    const res = await fetchInstagramReels();
    setReelsList(res.data || []);
    setLoadingReels(false);
  };

  const handleAddReel = async (e) => {
    e.preventDefault();
    if (!newReel.title.trim() || !newReel.reel_url.trim()) {
      setReelMsg({ type: 'error', text: 'Please enter both Title and Reel URL.' });
      return;
    }

    setAddingReel(true);
    setReelMsg({ type: '', text: '' });

    try {
      const res = await addInstagramReel(newReel);
      if (res.success) {
        setReelMsg({ type: 'success', text: '✅ Instagram Reel added successfully!' });
        setNewReel({
          title: '',
          reel_url: '',
          category: 'Dahi Handi',
          display_order: (reelsList.length + 1)
        });
        await loadReelsData();
      }
    } catch (err) {
      setReelMsg({ type: 'error', text: err.message || 'Failed to add Instagram Reel.' });
    } finally {
      setAddingReel(false);
    }
  };

  const handleOpenEditReelModal = (reel) => {
    setEditingReel({
      id: reel.id,
      title: reel.title || '',
      reel_url: reel.reel_url || '',
      category: reel.category || 'Dahi Handi',
      display_order: reel.display_order || 1
    });
    setEditReelError('');
    setIsEditReelModalOpen(true);
  };

  const handleSaveEditReel = async (e) => {
    e.preventDefault();
    if (!editingReel.title.trim() || !editingReel.reel_url.trim()) {
      setEditReelError('Title and Reel URL are required.');
      return;
    }

    setSavingEditReel(true);
    setEditReelError('');

    try {
      const res = await updateInstagramReel(editingReel.id, editingReel);
      if (res.success) {
        setIsEditReelModalOpen(false);
        await loadReelsData();
      }
    } catch (err) {
      setEditReelError(err.message || 'Failed to update Reel.');
    } finally {
      setSavingEditReel(false);
    }
  };

  const handleDeleteReel = async (id) => {
    if (window.confirm('Delete this Instagram Reel link?')) {
      try {
        await deleteInstagramReel(id);
        setReelsList(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        alert('Failed to delete reel: ' + err.message);
      }
    }
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
      loadReelsData();
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

  // Filtered List based on search, status, and size
  const filteredRegistrations = registrations.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm) ||
      (item.registration_no && item.registration_no.toString().includes(searchTerm));
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSize = sizeFilter === 'All' || item.size === sizeFilter;
    return matchesSearch && matchesStatus && matchesSize;
  });

  // Calculate size counts based on FILTERED registrations for Vendor Bulk Printing Order
  const filteredSizeCounts = JANMASTHAMI_CONFIG.tshirtSizes.reduce((acc, sz) => {
    acc[sz] = filteredRegistrations.filter(r => r.size === sz).length;
    return acc;
  }, {});

  const totalFilteredPcs = filteredRegistrations.length;
  const totalCount = registrations.length;
  const pendingCount = registrations.filter(r => r.status === 'Pending').length;
  const acceptedCount = registrations.filter(r => r.status === 'Accepted').length;
  const deliveredCount = registrations.filter(r => r.status === 'Delivered').length;

  // Export to CSV for T-Shirt Printing Vendor (Exports currently filtered data)
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No registration data matches the current filter to export.');
      return;
    }

    const headers = ['Reg No', 'UUID ID', 'Date', 'Name', 'Mobile Number', 'T-Shirt Size', 'Payment Screenshot URL', 'Status'];
    const rows = filteredRegistrations.map((r, idx) => [
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
    link.setAttribute('download', `Goverdhan_Haveli_TShirt_Orders_${statusFilter}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingRegistration(item);
    setEditForm({
      name: item.name || '',
      mobile: item.mobile || '',
      size: item.size || '38 (S)',
      status: item.status || 'Pending',
      payment_screenshot_url: item.payment_screenshot_url || ''
    });
    setEditFile(null);
    setModalError('');
  };

  // Submit Edit Registration
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setModalError('Please enter full name.');
      return;
    }
    if (!/^[0-9]{10}$/.test(editForm.mobile.trim())) {
      setModalError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setModalLoading(true);
    setModalError('');

    try {
      let screenshotUrl = editForm.payment_screenshot_url;
      if (editFile) {
        screenshotUrl = await uploadToCloudinary(editFile);
      }

      const res = await updateRegistrationDetails(editingRegistration.id, {
        name: editForm.name,
        mobile: editForm.mobile,
        size: editForm.size,
        status: editForm.status,
        payment_screenshot_url: screenshotUrl
      });

      if (res.success) {
        setRegistrations(prev =>
          prev.map(r => r.id === editingRegistration.id ? { ...r, ...res.data } : r)
        );
        setEditingRegistration(null);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to update registration.');
    } finally {
      setModalLoading(false);
    }
  };

  // Submit Add Registration (Admin entry - NO QR Code Required!)
  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      setModalError('Please enter full name.');
      return;
    }
    if (!/^[0-9]{10}$/.test(addForm.mobile.trim())) {
      setModalError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setModalLoading(true);
    setModalError('');

    try {
      let screenshotUrl = addForm.payment_screenshot_url;
      if (addFile) {
        screenshotUrl = await uploadToCloudinary(addFile);
      }

      const res = await adminCreateRegistration({
        name: addForm.name,
        mobile: addForm.mobile,
        size: addForm.size,
        status: addForm.status,
        payment_screenshot_url: screenshotUrl
      });

      if (res.success) {
        await loadData();
        setIsAddModalOpen(false);
        setAddForm({
          name: '',
          mobile: '',
          size: JANMASTHAMI_CONFIG.tshirtSizes[1] || '38 (S)',
          status: 'Accepted',
          payment_screenshot_url: ''
        });
        setAddFile(null);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to add registration.');
    } finally {
      setModalLoading(false);
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg({ type: '', text: '' });

    try {
      let finalQrUrl = settings.qr_code_url;
      let finalSampleUrl = settings.sample_image_url;

      if (qrFile) {
        setSettingsMsg({ type: 'info', text: 'Uploading QR Code image to Cloudinary...' });
        finalQrUrl = await uploadToCloudinary(qrFile);
      }

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
                Manage orders, add manual entries, verify payment screenshots & set dynamic QR code
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Add New Registration Button */}
            <button
              onClick={() => {
                setModalError('');
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Registration</span>
            </button>

            {/* Tab Switching Buttons */}
            <div className="flex bg-[#080d19] p-1 rounded-2xl border border-amber-500/20 mr-1">
              <button
                onClick={() => setActiveTab('registrations')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'registrations'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Shirt className="w-4 h-4" />
                <span>Orders</span>
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
                <span>QR & Price</span>
              </button>
              <button
                onClick={() => setActiveTab('reels')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'reels'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'text-pink-400 hover:text-white'
                }`}
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram Reels</span>
              </button>
            </div>

            <button
              onClick={handleFixNumbering}
              disabled={fixLoading}
              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              title="Fix & Resequence Registration Numbers"
            >
              <ListOrdered className={`w-4 h-4 text-amber-400 ${fixLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Fix Numbers</span>
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
                <div className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">Total Registrations</div>
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

            {/* DYNAMIC SIZE ORDER SUMMARY (BASED ON FILTERED STATUS) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-amber-500/30 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Shirt className="w-4 h-4 text-amber-400" />
                  <span>T-Shirt Size Summary (For Vendor Printing Order)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Current Filter:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">
                    {statusFilter === 'All' ? 'ALL STATUSES' : statusFilter.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs font-mono">
                    Total: {totalFilteredPcs} Pcs
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
                {JANMASTHAMI_CONFIG.tshirtSizes.map((sz) => (
                  <div
                    key={sz}
                    className={`p-2.5 rounded-xl border transition text-center ${
                      filteredSizeCounts[sz] > 0
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-[#080d19] border-amber-500/10 opacity-60'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-amber-400 truncate">{sz}</div>
                    <div className="text-lg font-mono font-bold text-slate-100 mt-0.5">
                      {filteredSizeCounts[sz]} Pcs
                    </div>
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
                  <span>Status Filter:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#080d19] border border-amber-500/30 text-amber-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none font-semibold cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Accepted">Accepted Only (For Vendor Order)</option>
                    <option value="Pending">Pending Only</option>
                    <option value="Delivered">Delivered Only</option>
                    <option value="Rejected">Rejected Only</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span>Size:</span>
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    className="bg-[#080d19] border border-amber-500/30 text-amber-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
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
                      <th className="p-3.5 text-center">Status Action</th>
                      <th className="p-3.5 text-center">Edit</th>
                      <th className="p-3.5 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-500/10 text-slate-200">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-slate-400">
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

                          {/* Quick Status Action Buttons */}
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

                          {/* Edit Individual Data Button */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition"
                              title="Edit User Registration"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </td>

                          {/* Delete Button */}
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
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
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

        {/* TAB 3: INSTAGRAM REELS MANAGEMENT */}
        {activeTab === 'reels' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d1425] border border-pink-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-pink-500/20 pb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100 font-serif">
                    Add & Manage Instagram Reels
                  </h2>
                  <p className="text-xs text-slate-400">
                    Paste any Instagram Reel link to showcase it directly on the public homepage gallery.
                  </p>
                </div>
              </div>

              {reelMsg.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm ${
                  reelMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}>
                  {reelMsg.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{reelMsg.text}</span>
                </div>
              )}

              {/* Form to Add New Reel */}
              <form onSubmit={handleAddReel} className="space-y-4 bg-[#080d19] p-5 rounded-2xl border border-pink-500/20">
                <h3 className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                  Add New Instagram Reel Link
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Instagram Reel URL <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="url"
                      value={newReel.reel_url}
                      onChange={(e) => setNewReel({ ...newReel, reel_url: e.target.value })}
                      placeholder="https://www.instagram.com/reel/C_xxxxxxx/"
                      required
                      className="w-full px-3.5 py-2.5 bg-[#0d1425] border border-pink-500/30 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newReel.category}
                      onChange={(e) => setNewReel({ ...newReel, category: e.target.value })}
                      placeholder="e.g. Dahi Handi"
                      className="w-full px-3.5 py-2.5 bg-[#0d1425] border border-pink-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Sequence Order No <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newReel.display_order}
                      onChange={(e) => setNewReel({ ...newReel, display_order: e.target.value })}
                      placeholder="1, 2, 3..."
                      required
                      className="w-full px-3.5 py-2.5 bg-[#0d1425] border border-pink-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Reel Title / Caption <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newReel.title}
                    onChange={(e) => setNewReel({ ...newReel, title: e.target.value })}
                    placeholder="e.g. Goverdhan Haveli Matki Phod Highlights 2025"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#0d1425] border border-pink-500/30 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingReel}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-md shadow-pink-500/20 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {addingReel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Add Reel to Website</span>
                </button>
              </form>

              {/* Reels List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Active Instagram Reels ({reelsList.length}) - Ordered by Sequence
                </h3>

                {loadingReels ? (
                  <div className="py-6 text-center text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                    <span>Loading reels...</span>
                  </div>
                ) : reelsList.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-[#080d19] rounded-2xl border border-pink-500/10 text-xs">
                    No Instagram Reels added yet. Paste a Reel link above to display it on your website!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reelsList.map((reel) => (
                      <div
                        key={reel.id}
                        className="p-3.5 rounded-2xl bg-[#080d19] border border-pink-500/20 flex items-center justify-between gap-3 hover:border-pink-500/40 transition"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {/* Sequence Badge */}
                          <div className="px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-300 font-extrabold text-xs border border-pink-500/30 flex-shrink-0" title="Sequence Order">
                            #{reel.display_order || 1}
                          </div>

                          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 flex-shrink-0">
                            <Instagram className="w-4 h-4" />
                          </div>

                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-100 truncate">
                                {reel.title}
                              </h4>
                              <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded font-semibold">
                                {reel.category || 'Reel'}
                              </span>
                            </div>
                            <a
                              href={reel.reel_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-pink-300 hover:underline flex items-center gap-1 truncate"
                            >
                              <span className="truncate">{reel.reel_url}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </div>
                        </div>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditReelModal(reel)}
                            className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition"
                            title="Edit Reel Title / URL / Order"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReel(reel.id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete Reel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD REGISTRATION (ADMIN MANUAL ENTRY - QR CODE NOT REQUIRED) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1425] border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-base font-serif">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                  <span>Add New Registration (Admin Entry)</span>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                ℹ️ Create registration manually for cash or offline payments. QR code and payment screenshot are <strong>not required</strong>!
              </div>

              {modalError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleSaveAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="e.g. Suresh Kumar"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={addForm.mobile}
                    onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      T-Shirt Size
                    </label>
                    <select
                      value={addForm.size}
                      onChange={(e) => setAddForm({ ...addForm, size: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {JANMASTHAMI_CONFIG.tshirtSizes.map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      Initial Status
                    </label>
                    <select
                      value={addForm.status}
                      onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Accepted">Accepted (Paid)</option>
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Optional Payment Screenshot Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAddFile(e.target.files[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30 cursor-pointer"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-amber-500/20">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {modalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Registration</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDIT INDIVIDUAL REGISTRATION */}
      <AnimatePresence>
        {editingRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setEditingRegistration(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1425] border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-base font-serif">
                  <Pencil className="w-5 h-5 text-amber-400" />
                  <span>Edit Registration #{editingRegistration.registration_no}</span>
                </div>
                <button
                  onClick={() => setEditingRegistration(null)}
                  className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      T-Shirt Size
                    </label>
                    <select
                      value={editForm.size}
                      onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {JANMASTHAMI_CONFIG.tshirtSizes.map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#080d19] border border-amber-500/30 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Payment Screenshot Photo (Upload New to Replace)
                  </label>
                  {editForm.payment_screenshot_url && (
                    <div className="mb-2 flex items-center gap-2">
                      <img
                        src={editForm.payment_screenshot_url}
                        alt="Current Screenshot"
                        className="w-8 h-8 object-cover rounded border border-amber-400"
                      />
                      <a
                        href={editForm.payment_screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-amber-400 underline"
                      >
                        View Existing Photo
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditFile(e.target.files[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30 cursor-pointer"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-amber-500/20">
                  <button
                    type="button"
                    onClick={() => setEditingRegistration(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {modalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Update Registration</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: FULL SCREEN PAYMENT SCREENSHOT PREVIEW */}
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

      {/* MODAL 4: EDIT INSTAGRAM REEL DETAILS */}
      <AnimatePresence>
        {isEditReelModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsEditReelModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1425] border border-pink-500/40 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
                <div className="flex items-center gap-2 text-pink-300 font-bold text-base font-serif">
                  <Pencil className="w-5 h-5 text-pink-400" />
                  <span>Edit Instagram Reel</span>
                </div>
                <button
                  onClick={() => setIsEditReelModalOpen(false)}
                  className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editReelError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {editReelError}
                </div>
              )}

              <form onSubmit={handleSaveEditReel} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Reel Title / Caption <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingReel.title}
                    onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#080d19] border border-pink-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Instagram Reel URL <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={editingReel.reel_url}
                    onChange={(e) => setEditingReel({ ...editingReel, reel_url: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#080d19] border border-pink-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingReel.category}
                      onChange={(e) => setEditingReel({ ...editingReel, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#080d19] border border-pink-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Sequence Order No <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={editingReel.display_order}
                      onChange={(e) => setEditingReel({ ...editingReel, display_order: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#080d19] border border-pink-500/30 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-pink-500/20">
                  <button
                    type="button"
                    onClick={() => setIsEditReelModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEditReel}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {savingEditReel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Update Reel</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
