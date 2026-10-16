import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Filter,
  Copy,
  Calendar,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  X,
  Link as LinkIcon,
  Eye,
  FileText,
  ChevronDown,
  Check,
  Inbox,
  UploadCloud,
} from 'lucide-react';

const CYBEXEL_THEME = {
  bg: 'bg-[#0B1240]',
  card: 'bg-[#1C2452]',
  input: 'bg-[#2A3260]',
  border: 'border-white/10',
  accent: 'bg-[#2563EB]',
  textMuted: 'text-white/60',
};

import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import {
  createUploadLinkApi,
  getUploadCampaignsApi,
  deleteUploadCampaignApi,
} from '../../../Api/adminApi';

/* ---------- motion + small helpers (UI only) ---------- */
const MotionStyles = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatGlow {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50%      { transform: translate(24px, -18px) scale(1.08); }
    }
    @keyframes shimmer {
      from { transform: translateX(-100%); }
      to   { transform: translateX(100%); }
    }
    @keyframes pulseDot {
      0%   { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.55); }
      70%  { box-shadow: 0 0 0 7px rgba(74, 222, 128, 0); }
      100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    }
    .fade-up { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
    .float-glow { animation: floatGlow 14s ease-in-out infinite; }
    .pulse-dot { animation: pulseDot 2s ease-out infinite; }
    .shine::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.18) 50%, transparent 70%);
      transform: translateX(-100%);
    }
    .shine:hover::after { animation: shimmer .9s ease; }
    .thin-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
    .thin-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 999px; }
  `}</style>
);

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (d) =>
  new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const UploadCampaignsLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [activeTab, setActiveTab] = useState('Upload Links');
  const [campaigns, setCampaigns] = useState([]);

  const getCampaignStatus = (campaign) => {
    return new Date(campaign.expiresAt) < new Date() ? 'Expired' : 'Active';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const [stats, setStats] = useState({});
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Latest First');

  let filteredCampaigns = [...campaigns];

  if (filter !== 'All') {
    filteredCampaigns = filteredCampaigns.filter(
      (item) => getCampaignStatus(item) === filter
    );
  }

  if (sort === 'Latest First') {
    filteredCampaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (sort === 'Oldest First') {
    filteredCampaigns.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (sort === 'Name A-Z') {
    filteredCampaigns.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Expired':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await getUploadCampaignsApi();
      setCampaigns(response.data.campaigns);
      setStats(response.data.stats);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch campaigns');
    }
  };

  const handleGenerateLink = async () => {
    try {
      setLoading(true);

      if (!expiryDate || !expiryTime) {
        return toast.error('Expiry date & time required');
      }

      const localDate = new Date(`${expiryDate}T${expiryTime}`);
      const expiresAt = localDate.toISOString();

      const response = await createUploadLinkApi({
        expiresAt,
        notes,
      });

      toast.success('Secure link generated');

      navigator.clipboard.writeText(response.data.uploadLink);

      setIsModalOpen(false);

      setExpiryDate('');
      setExpiryTime('');
      setNotes('');

      fetchCampaigns();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      await deleteUploadCampaignApi(id);
      toast.success('Campaign deleted');
      fetchCampaigns();
    } catch (error) {
      console.log(error);
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCopyLink = (token) => {
    const fullUrl = `${window.location.origin}/upload/${token}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied successfully');
  };

  const statCards = [
    {
      label: 'Total Campaigns',
      value: stats.totalCampaigns || 0,
      icon: <FileText size={20} />,
      color: 'text-blue-400',
      ring: 'from-blue-500/30 to-blue-500/0',
      glow: 'bg-blue-500/20',
    },
    {
      label: 'Active Links',
      value: stats.activeLinks || 0,
      icon: <CheckCircle2 size={20} />,
      color: 'text-emerald-400',
      ring: 'from-emerald-500/30 to-emerald-500/0',
      glow: 'bg-emerald-500/20',
    },
    {
      label: 'Expired Links',
      value: stats.expiredLinks || 0,
      icon: <AlertCircle size={20} />,
      color: 'text-rose-400',
      ring: 'from-rose-500/30 to-rose-500/0',
      glow: 'bg-rose-500/20',
    },
    {
      label: 'Total Uploads',
      value: stats.totalUploads || 0,
      icon: <UploadCloud size={20} />,
      color: 'text-violet-400',
      ring: 'from-violet-500/30 to-violet-500/0',
      glow: 'bg-violet-500/20',
    },
  ];

  const dropdownPanel = `${CYBEXEL_THEME.card} absolute top-14 right-0 w-56 rounded-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl`;

  const triggerBtn = `${CYBEXEL_THEME.card} h-11 px-4 rounded-xl border border-white/10 text-sm font-medium flex items-center gap-2.5 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300`;

  return (
    <div className={`min-h-screen ${CYBEXEL_THEME.bg} text-white flex host-grotesk`}>
      <MotionStyles />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative thin-scroll">
        {/* ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="float-glow absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-blue-600/20 blur-[120px]" />
          <div
            className="float-glow absolute top-1/2 -left-40 w-[28rem] h-[28rem] rounded-full bg-violet-600/10 blur-[120px]"
            style={{ animationDelay: '-6s' }}
          />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <Navbar
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="relative p-6 lg:p-10 font-sans selection:bg-blue-500/30 max-w-[1500px] w-full mx-auto">
          {/* --- PAGE HEADER --- */}
          <div
            className="fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10"
            style={{ animationDelay: '0ms' }}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Secure Onboarding
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                Link Management
              </h2>
              <p className="text-white/45 text-sm mt-2 max-w-md">
                Manage secure upload links and onboarding sessions.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="shine relative overflow-hidden group bg-gradient-to-b from-[#3b74f5] to-[#2563EB] hover:from-[#4f83ff] hover:to-[#2f6df0] px-6 h-12 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 shadow-[0_10px_30px_-8px_rgba(37,99,235,0.7)] hover:shadow-[0_14px_40px_-8px_rgba(37,99,235,0.9)] hover:-translate-y-0.5 active:translate-y-0 ring-1 ring-white/20"
            >
              <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
              Generate Link
            </button>
          </div>

          {/* --- STATS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            {statCards.map((stat, i) => (
              <div
                key={i}
                className="fade-up group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-b from-white/15 to-white/[0.03] hover:from-white/30 transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                <div className={`${CYBEXEL_THEME.card} relative rounded-[15px] p-6 h-full overflow-hidden`}>
                  <div
                    className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${stat.glow}`}
                  />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-3">
                        {stat.label}
                      </p>
                      <p className="text-4xl font-bold tracking-tight tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`relative w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.ring} border border-white/10 ${stat.color} group-hover:scale-110 transition-transform duration-500`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- TOOLBAR --- */}
          <div
            className="fade-up flex items-center justify-between gap-3 mb-5 relative"
            style={{ animationDelay: '480ms' }}
          >
            <p className="text-sm text-white/40 hidden sm:block">
              Showing{' '}
              <span className="text-white font-semibold tabular-nums">
                {filteredCampaigns.length}
              </span>{' '}
              {filteredCampaigns.length === 1 ? 'link' : 'links'}
            </p>

            <div className="flex gap-3 ml-auto">
              {/* FILTER */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsSortOpen(false);
                  }}
                  className={triggerBtn}
                >
                  <Filter size={16} className="text-white/40" />
                  {filter}
                  <ChevronDown
                    size={14}
                    className={`text-white/40 transition-transform duration-300 ${
                      isFilterOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isFilterOpen && (
                  <div className={dropdownPanel}>
                    {['All', 'Active', 'Expired'].map((item) => (
                      <button
                        key={item}
                        className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                          filter === item
                            ? 'bg-blue-500/15 text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                        onClick={() => {
                          setFilter(item);
                          setIsFilterOpen(false);
                        }}
                      >
                        {item}
                        {filter === item && <Check size={14} className="text-blue-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SORT */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsFilterOpen(false);
                  }}
                  className={triggerBtn}
                >
                  <ArrowUpDown size={16} className="text-white/40" />
                  {sort}
                  <ChevronDown
                    size={14}
                    className={`text-white/40 transition-transform duration-300 ${
                      isSortOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isSortOpen && (
                  <div className={dropdownPanel}>
                    {['Latest First', 'Oldest First', 'Most Uploads'].map((item) => (
                      <button
                        key={item}
                        className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                          sort === item
                            ? 'bg-blue-500/15 text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                        onClick={() => {
                          setSort(item);
                          setIsSortOpen(false);
                        }}
                      >
                        {item}
                        {sort === item && <Check size={14} className="text-blue-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- CAMPAIGNS TABLE --- */}
          <div
            className="fade-up rounded-3xl p-[1px] bg-gradient-to-b from-white/15 via-white/[0.04] to-white/[0.02] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
            style={{ animationDelay: '560ms' }}
          >
            <div className={`${CYBEXEL_THEME.card} rounded-[23px] overflow-hidden`}>
              <div className="overflow-x-auto thin-scroll">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                      {['Upload Link', 'Expiry', 'Status', 'Uploads'].map((h) => (
                        <th
                          key={h}
                          className="px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35"
                        >
                          {h}
                        </th>
                      ))}
                      <th className="px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.05]">
                    {filteredCampaigns.map((camp, idx) => {
                      const status = getCampaignStatus(camp);
                      const isActive = status === 'Active';

                      return (
                        <tr
                          key={camp._id}
                          className="fade-up group relative hover:bg-white/[0.035] transition-colors duration-300"
                          style={{ animationDelay: `${640 + idx * 55}ms` }}
                        >
                          {/* LINK */}
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/15 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                <LinkIcon size={15} />
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-mono text-blue-300/90 truncate max-w-[200px]">
                                  {`${window.location.origin}/upload/${camp.token}`}
                                </span>
                                <button
                                  className="p-1.5 rounded-lg hover:bg-blue-500/20 text-white/25 hover:text-blue-300 transition-all active:scale-90"
                                  onClick={() => handleCopyLink(camp.token)}
                                  title="Copy link"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* EXPIRY */}
                          <td className="px-7 py-5">
                            <p className="text-sm text-white/80">{formatDate(camp.expiresAt)}</p>
                            <p className="text-[11px] text-white/35 mt-0.5 flex items-center gap-1">
                              <Clock size={11} />
                              {formatTime(camp.expiresAt)}
                            </p>
                          </td>

                          {/* STATUS */}
                          <td className="px-7 py-5">
                            <span
                              className={`inline-flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full border ${getStatusStyle(
                                status
                              )} uppercase tracking-wider`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? 'bg-green-400 pulse-dot' : 'bg-red-400'
                                }`}
                              />
                              {status}
                            </span>
                          </td>

                          {/* UPLOADS */}
                          <td className="px-7 py-5">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold tabular-nums bg-white/[0.05] border border-white/10 px-3 py-1 rounded-lg">
                              <UploadCloud size={13} className="text-violet-300" />
                              {camp.uploadCount}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-7 py-5">
                            <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-2.5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all active:scale-90"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="p-2.5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all active:scale-90"
                                title="Copy Link"
                                onClick={() => handleCopyLink(camp.token)}
                              >
                                <ExternalLink size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteCampaign(camp._id)}
                                className="p-2.5 hover:bg-red-500/15 rounded-xl text-white/50 hover:text-red-400 transition-all active:scale-90"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* EMPTY STATE */}
                {filteredCampaigns.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">
                      <Inbox size={26} className="text-white/30" />
                    </div>
                    <p className="font-semibold text-lg">No upload links found</p>
                    <p className="text-sm text-white/40 mt-1.5 max-w-xs">
                      Generate a secure link to start collecting documents.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-6 px-5 h-10 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-sm font-medium flex items-center gap-2 transition-all"
                    >
                      <Plus size={16} /> Generate Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- CREATE CAMPAIGN MODAL --- */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-[#050A28]/80 backdrop-blur-md"
                onClick={() => setIsModalOpen(false)}
              />

              {/* Modal Card */}
              <div className="relative w-full max-w-lg rounded-[2rem] p-[1px] bg-gradient-to-b from-white/25 via-white/5 to-white/[0.02] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <div className={`${CYBEXEL_THEME.card} relative rounded-[31px] overflow-hidden`}>
                  <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-500/25 blur-3xl" />

                  <div className="relative p-8 md:p-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-500/5 border border-blue-400/20 flex items-center justify-center text-blue-300">
                          <LinkIcon size={20} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold leading-tight">Create Campaign</h2>
                          <p className="text-sm text-white/40 mt-0.5">
                            Set parameters for the secure upload session.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all hover:rotate-90 duration-300"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 ml-1 flex items-center gap-2">
                            <Calendar size={13} /> Expiry Date
                          </label>
                          <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className={`w-full ${CYBEXEL_THEME.input} border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/15 transition-all [color-scheme:dark]`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 ml-1 flex items-center gap-2">
                            <Clock size={13} /> Expiry Time
                          </label>
                          <input
                            type="time"
                            value={expiryTime}
                            onChange={(e) => setExpiryTime(e.target.value)}
                            className={`w-full ${CYBEXEL_THEME.input} border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/15 transition-all [color-scheme:dark]`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 ml-1">
                          Administrative Notes
                        </label>
                        <textarea
                          rows="3"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Optional notes for the HR team..."
                          className={`w-full ${CYBEXEL_THEME.input} border border-white/10 rounded-xl py-3.5 px-4 text-sm placeholder:text-white/25 focus:outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/15 transition-all resize-none`}
                        ></textarea>
                      </div>

                      <button
                        onClick={handleGenerateLink}
                        disabled={loading}
                        className="shine relative overflow-hidden w-full h-14 bg-gradient-to-b from-[#3b74f5] to-[#2563EB] hover:from-[#4f83ff] hover:to-[#2f6df0] text-white rounded-xl font-semibold text-base transition-all duration-300 shadow-[0_12px_34px_-8px_rgba(37,99,235,0.8)] active:scale-[0.98] flex items-center justify-center gap-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-white/20"
                      >
                        {loading ? (
                          <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                          <LinkIcon size={18} />
                        )}
                        {loading ? 'Generating...' : 'Generate Secure Link'}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Glow */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadCampaignsLayout;