import React, { useState, useEffect } from "react";
import { getCandidatesApi } from "../../../Api/adminApi";

import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  ArrowUpRight,
  ChevronLeft,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Download,
  Check,
  Inbox,
} from 'lucide-react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Navbar from '../../Components/Navbar/Navbar';
const CYBEXEL_THEME = {
  bg: 'bg-[#0B1240]',

  card: 'bg-[#1C2452]',
  input: 'bg-[#2A3260]',
  border: 'border-white/10',
  accent: 'bg-[#2563EB]',
  textMuted: 'text-white/60',
};

/* ---------- motion + style helpers (UI only) ---------- */
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
    .fade-up { opacity: 0; animation: fadeUp .6s cubic-bezier(.22,1,.36,1) forwards; }
    .float-glow { animation: floatGlow 14s ease-in-out infinite; }
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

const STATUS_DOT = {
  Approved: 'bg-green-400',
  Pending: 'bg-amber-400',
  Rejected: 'bg-red-400',
  Reviewing: 'bg-blue-400',
};

const CandidatesLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isSortOpen, setIsSortOpen] = useState(false);

  const [filter, setFilter] = useState("All");

  const [sort, setSort] = useState("Latest First");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Candidates");
  const [stats, setStats] = useState({});

  const [candidates, setCandidates] = useState([]);

  let filteredCandidates = [...candidates];

  // SEARCH
  filteredCandidates = filteredCandidates.filter((cand) =>
    cand.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FILTER
  if (filter !== "All") {
    filteredCandidates = filteredCandidates.filter(
      (cand) => cand.status === filter
    );
  }

  // SORT
  if (sort === "Latest First") {
    filteredCandidates.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  if (sort === "Oldest First") {
    filteredCandidates.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  if (sort === "Name A-Z") {
    filteredCandidates.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }
  const getStatusBadge = (status) => {
    const base = "text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ";
    switch (status) {
      case 'Approved': return base + "bg-green-500/10 text-green-400 border-green-500/20";
      case 'Pending': return base + "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'Rejected': return base + "bg-red-500/10 text-red-400 border-red-500/20";
      case 'Reviewing': return base + "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return base + "bg-white/5 text-white/40 border-white/10";
    }
  };
  const fetchCandidates = async () => {
    try {
      const response = await getCandidatesApi();

      setCandidates(response.data.candidates);

      setStats(response.data.stats);
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch candidates");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const statCards = [
    {
      label: "Total Candidates",
      value: stats.totalCandidates || 0,
      icon: <Users size={20} />,
      color: "text-blue-400",
      ring: "from-blue-500/30 to-blue-500/0",
      glow: "bg-blue-500/20",
    },
    {
      label: "Pending Review",
      value: stats.pendingReview || 0,
      icon: <Clock size={20} />,
      color: "text-amber-400",
      ring: "from-amber-500/30 to-amber-500/0",
      glow: "bg-amber-500/20",
    },
    {
      label: "Approved",
      value: stats.approved || 0,
      icon: <CheckCircle2 size={20} />,
      color: "text-emerald-400",
      ring: "from-emerald-500/30 to-emerald-500/0",
      glow: "bg-emerald-500/20",
    },
    {
      label: "Rejected",
      value: stats.rejected || 0,
      icon: <XCircle size={20} />,
      color: "text-rose-400",
      ring: "from-rose-500/30 to-rose-500/0",
      glow: "bg-rose-500/20",
    },
  ];

const dropdownPanel = `${CYBEXEL_THEME.card} absolute top-14 right-0 w-56 rounded-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl`;
  const triggerBtn = `${CYBEXEL_THEME.card} h-12 flex-1 sm:flex-none px-4 rounded-xl border border-white/10 text-sm font-medium flex items-center justify-center gap-2.5 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 text-white/80`;

  return (
    <div className={`min-h-screen ${CYBEXEL_THEME.bg} text-white flex host-grotesk`}>
      <MotionStyles />

      {/* SIDEBAR */}
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

        {/* NAVBAR */}
        <Navbar
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* PAGE CONTENT */}
        <div className="relative p-6 lg:p-10 max-w-[1500px] w-full mx-auto">
          {/* --- TOP ACTION BAR --- */}
          <div
className={`fade-up relative flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 ${isFilterOpen || isSortOpen ? "z-50" : "z-0"}`}            style={{ animationDelay: '0ms' }}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
                <UserCheck size={12} />
                Onboarding
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-2">
                Candidates
              </h1>
              <p className={`${CYBEXEL_THEME.textMuted} text-sm`}>
                Manage uploaded candidate onboarding submissions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* SEARCH */}
              <div className="relative w-full sm:w-80 group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className={`w-full h-12 ${CYBEXEL_THEME.input} border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/15 transition-all text-white placeholder:text-white/25`}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {/* FILTER */}
<div className={`relative flex-1 sm:flex-none ${isFilterOpen ? "z-50" : "z-0"}`}>                  <button
                    onClick={() => {
                      setIsFilterOpen(!isFilterOpen);

                      setIsSortOpen(false);
                    }}
                    className={`${triggerBtn} w-full`}
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
                      {["All", "Pending", "Approved", "Rejected"].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setFilter(item);

                            setIsFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                            filter === item
                              ? 'bg-blue-500/15 text-white'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {item}
                          {filter === item && <Check size={14} className="text-blue-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* SORT */}
                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => {
                      setIsSortOpen(!isSortOpen);

                      setIsFilterOpen(false);
                    }}
                    className={`${triggerBtn} w-full`}
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
                      {["Latest First", "Oldest First", "Name A-Z"].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSort(item);

                            setIsSortOpen(false);
                          }}
                          className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                            sort === item
                              ? 'bg-blue-500/15 text-white'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
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
          </div>

          {/* --- STATS SUMMARY --- */}
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
                      <p className="text-4xl font-bold tracking-tight tabular-nums text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.ring} border border-white/10 ${stat.color} group-hover:scale-110 transition-transform duration-500`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- CANDIDATES TABLE --- */}
          <div
            className="fade-up rounded-3xl p-[1px] bg-gradient-to-b from-white/15 via-white/[0.04] to-white/[0.02] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
            style={{ animationDelay: '520ms' }}
          >
            <div className={`${CYBEXEL_THEME.card} rounded-[23px] overflow-hidden relative`}>
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

              <div className="overflow-x-auto thin-scroll">
                <table className="w-full text-left border-collapse min-w-[860px]">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                      {['Candidate Name', 'Email', 'Position', 'Uploaded Date', 'Status'].map((h) => (
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
                    {filteredCandidates.map((cand, idx) => (
                      <tr
                        key={cand._id}
                        className="fade-up hover:bg-white/[0.035] transition-colors duration-300 group"
                        style={{ animationDelay: `${600 + idx * 50}ms` }}
                      >
                        <td className="px-7 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/15 border border-white/10 group-hover:border-blue-400/50 flex items-center justify-center text-blue-300 font-bold text-xs transition-colors">
                              {cand.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-semibold text-white/90 group-hover:text-blue-300 transition-colors">
                              {cand.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-7 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm text-white/75">{cand.email}</span>
                            <span className="text-[11px] text-white/35 font-mono tracking-tight mt-0.5">
                              {cand.phone}
                            </span>
                          </div>
                        </td>
                        <td className="px-7 py-5 text-sm text-white/60">{cand.positionApplied}</td>
                        <td className="px-7 py-5 text-xs text-white/45 font-mono">
                          {new Date(cand.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-7 py-5">
                          <span className={`inline-flex items-center gap-2 ${getStatusBadge(cand.status)}`}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[cand.status] || 'bg-white/40'}`}
                            />
                            {cand.status}
                          </span>
                        </td>
                        <td className="px-7 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="group/btn flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border border-blue-500/20 hover:border-blue-400 hover:shadow-[0_8px_24px_-8px_rgba(37,99,235,0.8)] active:scale-95"
                              onClick={() =>
                                navigate(
                                  `/admin/candidate-details/${cand._id}`
                                )
                              }
                            >
                              <Eye size={14} />
                              View
                              <ArrowUpRight
                                size={12}
                                className="opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* EMPTY STATE */}
                {filteredCandidates.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">
                      <Inbox size={26} className="text-white/30" />
                    </div>
                    <p className="font-semibold text-lg">No candidates found</p>
                    <p className="text-sm text-white/40 mt-1.5 max-w-xs">
                      Try a different search or filter.
                    </p>
                  </div>
                )}
              </div>

              {/* --- PAGINATION FOOTER --- */}
              <div className="px-8 py-6 border-t border-white/[0.06] bg-white/[0.015] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-white/35 font-medium uppercase tracking-widest">
                  Showing <span className="text-white font-bold">1-5</span> of{' '}
                  <span className="text-white font-bold">2,840</span> Candidates
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2.5 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-20 disabled:hover:bg-transparent"
                    disabled
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex gap-1">
                    {Array.from(
                      { length: Math.ceil(filteredCandidates.length / 5) },
                      (_, i) => i + 1
                    ).map((num) => (
                      <button
                        key={num}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                          num === 1
                            ? "bg-gradient-to-b from-[#3b74f5] to-[#2563EB] border-blue-400/50 text-white shadow-[0_6px_18px_-6px_rgba(37,99,235,0.8)]"
                            : "hover:bg-white/10 border-transparent text-white/45 hover:text-white"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button className="p-2.5 text-white/30 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- EXPORT CTA --- */}
          <div className="mt-8 flex justify-end">
            <button className="shine relative overflow-hidden flex items-center gap-2.5 px-5 h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all text-xs font-bold uppercase tracking-[0.18em] group">
              <Download
                size={14}
                className="group-hover:translate-y-0.5 transition-transform"
              />
              Export Candidate List (.csv)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidatesLayout;