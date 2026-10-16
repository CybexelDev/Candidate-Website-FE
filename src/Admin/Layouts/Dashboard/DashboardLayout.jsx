import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Send,
  Users,
  Search,
  Bell,
  LogOut,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Menu,
  X,
  FileUp,
  Link as LinkIcon,
  ChevronRight,
  Eye,
  ArrowUpRight,
  Inbox,
} from 'lucide-react';
import Sidebar from '../../Components/Sidebar/Sidebar';
const CYBEXEL_THEME = {
  bg: 'bg-[#0B1240]',
  sidebar: 'bg-[#111936]',
  card: 'bg-[#1C2452]',
  input: 'bg-[#2A3260]',
  border: 'border-white/10',
  accent: 'bg-[#2563EB]',
};
import Navbar from '../../Components/Navbar/Navbar';
import { useNavigate, useNavigation } from 'react-router-dom';
import { getDashboardApi } from '../../../Api/adminApi';

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
    @keyframes pulseDot {
      0%   { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.55); }
      70%  { box-shadow: 0 0 0 7px rgba(74, 222, 128, 0); }
      100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    }
    @keyframes shimmer {
      from { transform: translateX(-100%); }
      to   { transform: translateX(100%); }
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

const STAT_STYLES = {
  blue: {
    text: 'text-blue-400',
    ring: 'from-blue-500/30 to-blue-500/0',
    glow: 'bg-blue-500/20',
    chip: 'bg-blue-500/10 text-blue-300 border-blue-400/20',
  },
  amber: {
    text: 'text-amber-400',
    ring: 'from-amber-500/30 to-amber-500/0',
    glow: 'bg-amber-500/20',
    chip: 'bg-amber-500/10 text-amber-300 border-amber-400/20',
  },
  green: {
    text: 'text-emerald-400',
    ring: 'from-emerald-500/30 to-emerald-500/0',
    glow: 'bg-emerald-500/20',
    chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20',
  },
  red: {
    text: 'text-rose-400',
    ring: 'from-rose-500/30 to-rose-500/0',
    glow: 'bg-rose-500/20',
    chip: 'bg-rose-500/10 text-rose-300 border-rose-400/20',
  },
};

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState({});

  const [recentUploads, setRecentUploads] = useState([]);
  const fetchDashboard = async () => {
    try {
      const response = await getDashboardApi();

      setStats(response.data.stats);

      setRecentUploads(response.data.recentUploads);
    } catch (error) {
      console.log(error);
    }
  };
  const navigate=useNavigate()
  useEffect(() => {
    fetchDashboard();
  }, []);
  const statsCards = [
    {
      label: 'Total Candidates',

      value: stats.totalCandidates || 0,

      icon: <Users size={20} />,

      trend: '+12%',

      color: 'blue',
    },

    {
      label: 'Pending Reviews',

      value: stats.pending || 0,

      icon: <Clock size={20} />,

      trend: 'High Priority',

      color: 'amber',
    },

    {
      label: 'Approved',

      value: stats.approved || 0,

      icon: <CheckCircle2 size={20} />,

      trend: 'Completed',

      color: 'green',
    },

    {
      label: 'Rejected',

      value: stats.rejected || 0,

      icon: <AlertCircle size={20} />,

      trend: 'Last 30 days',

      color: 'red',
    },
  ];

  return (
    <div className={`min-h-screen ${CYBEXEL_THEME.bg} text-white flex host-grotesk`}>
      <MotionStyles />

      {/* --- SIDEBAR --- */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
      />

      {/* --- MAIN CONTENT --- */}
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

        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dashboard View */}
        <div className="relative p-6 lg:p-10 space-y-10 max-w-[1500px] w-full mx-auto">
          {/* Welcome Section */}
          <div
            className="fade-up flex flex-col md:flex-row md:items-end justify-between gap-4"
            style={{ animationDelay: '0ms' }}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
                Live Overview
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-2">
                Welcome back, Admin
              </h3>
              <p className="text-white/45 text-sm max-w-lg">
                Monitor candidate onboarding activities and secure upload campaigns.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statsCards.map((stat, i) => {
              const s = STAT_STYLES[stat.color] || STAT_STYLES.blue;
              return (
                <div
                  key={i}
                  className="fade-up group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-b from-white/15 to-white/[0.03] hover:from-white/30 transition-all duration-500 hover:-translate-y-1"
                  style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                  <div className={`${CYBEXEL_THEME.card} relative rounded-[15px] p-6 h-full overflow-hidden`}>
                    <div
                      className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${s.glow}`}
                    />

                    <div className="relative flex justify-between items-start mb-6">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${s.ring} border border-white/10 ${s.text} group-hover:scale-110 transition-transform duration-500`}
                      >
                        {stat.icon}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.chip}`}
                      >
                        {stat.trend}
                      </span>
                    </div>

                    <h4 className="relative text-4xl font-bold tracking-tight tabular-nums mb-1">
                      {stat.value}
                    </h4>
                    <p className="relative text-[11px] text-white/40 font-semibold uppercase tracking-[0.18em]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table & Campaign Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Uploads Table */}
            <div
              className="fade-up xl:col-span-2 rounded-3xl p-[1px] bg-gradient-to-b from-white/15 via-white/[0.04] to-white/[0.02] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
              style={{ animationDelay: '520ms' }}
            >
              <div className={`${CYBEXEL_THEME.card} rounded-[23px] overflow-hidden h-full`}>
                <div className="px-7 py-6 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/15 flex items-center justify-center text-blue-400">
                      <FileUp size={18} />
                    </div>
                    <h4 className="font-bold tracking-wide">Recent Document Uploads</h4>
                  </div>
                  <button className="group inline-flex items-center gap-1 text-xs text-blue-300 font-semibold hover:text-white transition-colors" onClick={()=>navigate("/admin/candidate")}>
                    View All
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                </div>

                <div className="overflow-x-auto thin-scroll">
                  <table className="w-full text-left min-w-[640px]">
                    <thead className="bg-white/[0.03] text-white/35 text-[11px] uppercase tracking-[0.2em] font-semibold">
                      <tr>
                        <th className="px-7 py-4">Candidate</th>
                        <th className="px-7 py-4">Position</th>
                        <th className="px-7 py-4">Date</th>
                        <th className="px-7 py-4">Status</th>
                        <th className="px-7 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {recentUploads.map((row, idx) => (
                        <tr
                          key={row._id ?? row.id}
                          className="fade-up hover:bg-white/[0.035] transition-colors duration-300 group"
                          style={{ animationDelay: `${600 + idx * 55}ms` }}
                        >
                          <td className="px-7 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/20 flex items-center justify-center text-xs font-bold border border-white/10 group-hover:border-blue-400/50 transition-colors">
                                {row.fullName.charAt(0)}
                              </div>
                              <span className="text-sm font-medium">{row.fullName}</span>
                            </div>
                          </td>
                          <td className="px-7 py-4 text-sm text-white/60">{row.positionApplied}</td>
                          <td className="px-7 py-4 text-xs text-white/45 font-mono">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-7 py-4">
                            <span
                              className={`inline-flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider ${
                                row.status === 'Approved'
                                  ? 'text-green-400 bg-green-500/10 border-green-500/20'
                                  : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  row.status === 'Approved' ? 'bg-green-400' : 'bg-amber-400'
                                }`}
                              />
                              {row.status}
                            </span>
                          </td>
                          <td className="px-7 py-4 text-right">
                            <button className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all active:scale-90">
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* EMPTY STATE */}
                  {recentUploads.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
                        <Inbox size={24} className="text-white/30" />
                      </div>
                      <p className="font-semibold">No recent uploads</p>
                      <p className="text-sm text-white/40 mt-1">
                        New candidate documents will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Campaign Summary Section */}
            <div className="space-y-6">
              <div
                className="fade-up rounded-3xl p-[1px] bg-gradient-to-b from-white/15 via-white/[0.04] to-white/[0.02] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
                style={{ animationDelay: '600ms' }}
              >
                <div className={`${CYBEXEL_THEME.card} relative p-7 rounded-[23px] overflow-hidden`}>
                  <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl" />

                  <div className="relative flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/15 flex items-center justify-center text-indigo-300">
                      <LinkIcon size={18} />
                    </div>
                    <h4 className="font-bold tracking-wide">Total Links</h4>
                  </div>

                  <div className="relative space-y-3">
                    {[
                      { label: 'Active Upload Links', count: stats.activeLinks || 0, color: 'bg-blue-500', icon: <LinkIcon size={14} /> },
                      { label: 'Expired Links', count: stats.expiredLinks || 0, color: 'bg-white/10', icon: <X size={14} /> },
                      { label: 'Total Upload Sessions', count: stats.totalUploadSessions, color: 'bg-indigo-500', icon: <CheckCircle2 size={14} /> },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-semibold text-white/40 tracking-[0.18em]">
                            {item.label}
                          </p>
                          <p className="text-xl font-bold tabular-nums">{item.count}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security Status Card */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative mt-auto px-10 py-6 text-white/25 text-[10px] font-medium tracking-[0.2em] flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-white/[0.06] bg-white/[0.01] backdrop-blur-sm">
          <span>© 2026 CYBEXEL TECHNOLOGIES PVT LIMITED.</span>
          <div className="flex gap-6">
            <span className="hover:text-white/60 cursor-pointer transition-colors">PRIVACY</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">SECURITY</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">SUPPORT</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Internal Lucide Helper
const ShieldCheck = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default DashboardLayout;