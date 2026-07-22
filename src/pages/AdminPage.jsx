import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  Trash2,
  Lock,
  Shirt,
  Database,
  ListOrdered,
  CheckCircle2,
  Hash
} from 'lucide-react';
import { AdminAuthModal } from '../components/AdminAuthModal';
import {
  fetchRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  fixRegistrationNumbering
} from '../services/supabase';
import { JANMASTHAMI_CONFIG } from '../data/data';

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('goverdhan_admin_authenticated') === 'true';
  });

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fixLoading, setFixLoading] = useState(false);
  const [dataSource, setDataSource] = useState('local');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sizeFilter, setSizeFilter] = useState('All');

  const loadData = async () => {
    setLoading(true);
    const { data, source } = await fetchRegistrations();
    setRegistrations(data || []);
    setDataSource(source);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
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

  // Fix Numbering (Resequence registration_no 1, 2, 3...)
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

    const headers = ['Reg No', 'UUID ID', 'Date', 'Name', 'Mobile Number', 'T-Shirt Size', 'Status'];
    const rows = registrations.map((r, idx) => [
      r.registration_no || idx + 1,
      r.id,
      new Date(r.created_at).toLocaleDateString(),
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${r.mobile}"`,
      r.size,
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

  // Calculate size counts
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
                T-Shirt Admin Control
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Fix Numbering Button */}
            <button
              onClick={handleFixNumbering}
              disabled={fixLoading}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              title="Fix & Resequence Registration Numbers"
            >
              <ListOrdered className={`w-4 h-4 text-amber-400 ${fixLoading ? 'animate-spin' : ''}`} />
              <span>Fix Numbering</span>
            </button>

            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-[#080d19] hover:bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium transition flex items-center gap-1.5"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Stats Overview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-amber-500/20 shadow-lg">
            <div className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">Total Requests</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1">{totalCount}</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-yellow-500/20 shadow-lg">
            <div className="text-[11px] sm:text-xs font-medium text-yellow-400 uppercase tracking-wider">Pending</div>
            <div className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono mt-1">{pendingCount}</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1425] border border-emerald-500/20 shadow-lg">
            <div className="text-[11px] sm:text-xs font-medium text-emerald-400 uppercase tracking-wider">Accepted</div>
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
            <span>T-Shirt Size Summary (For Vendor Order)</span>
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
                  <th className="p-3.5">UUID ID</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Mobile</th>
                  <th className="p-3.5">Size</th>
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
                      <td className="p-3.5 font-mono text-[10px] text-slate-400 max-w-[100px] truncate" title={item.id}>
                        {item.id ? `${item.id.slice(0, 8)}...` : '-'}
                      </td>
                      <td className="p-3.5 text-slate-400 text-xs">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 font-bold text-amber-200">{item.name}</td>
                      <td className="p-3.5 font-mono text-slate-300">{item.mobile}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-xs">
                          {item.size}
                        </span>
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
    </div>
  );
};
