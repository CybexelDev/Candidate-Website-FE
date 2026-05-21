import React, { useState,useEffect } from 'react';
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
  Eye
} from 'lucide-react';
import Sidebar from '../../Components/Sidebar/Sidebar';
const CYBEXEL_THEME = {
  bg: 'bg-[#0B1240]',
  sidebar: 'bg-[#111936]',
  card: 'bg-[#1C2452]',
  input: 'bg-[#2A3260]',
  border: 'border-white/10',
  accent: 'bg-[#2563EB]'
};
import Navbar from '../../Components/Navbar/Navbar';
import { getDashboardApi } from '../../../Api/adminApi';

const  DashboardLayout= () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
const [stats, setStats] =
useState({});

const [recentUploads,
setRecentUploads] =
useState([]);
const fetchDashboard =
async () => {

  try {

    const response =
      await getDashboardApi();

    setStats(
      response.data.stats
    );

    setRecentUploads(
      response.data.recentUploads
    );

  } catch (error) {

    console.log(error);
  }
};
useEffect(() => {

  fetchDashboard();

}, []);
const statsCards = [

  {
    label:
      "Total Candidates",

    value:
      stats.totalCandidates || 0,

    icon:
      <Users size={20}/>,

    trend: "+12%",

    color: "blue",
  },

  {
    label:
      "Pending Reviews",

    value:
      stats.pending || 0,

    icon:
      <Clock size={20}/>,

    trend: "High Priority",

    color: "amber",
  },

  {
    label:
      "Approved",

    value:
      stats.approved || 0,

    icon:
      <CheckCircle2 size={20}/>,

    trend: "Completed",

    color: "green",
  },

  {
    label:
      "Rejected",

    value:
      stats.rejected || 0,

    icon:
      <AlertCircle size={20}/>,

    trend: "Last 30 days",

    color: "red",
  },

];

  return (
    <div className={`min-h-screen ${CYBEXEL_THEME.bg} text-white flex host-grotesk`}>
      {/* --- SIDEBAR --- */}
     <Sidebar
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  isSidebarOpen={isSidebarOpen}
/>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Navbar */}
       <Navbar
  activeTab={activeTab}
  isSidebarOpen={isSidebarOpen}
  setSidebarOpen={setSidebarOpen}
/>

        {/* Dashboard View */}
        <div className="p-6 lg:p-10 space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">Welcome back, Admin</h3>
              <p className="text-white/50 text-sm">Monitor candidate onboarding activities and secure upload campaigns.</p>
            </div>
         
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, i) => (
              <div key={i} className={`${CYBEXEL_THEME.card} p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${stat.color === 'green' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'}`}>
                    {stat.trend}
                  </span>
                </div>
                <h4 className="text-3xl font-bold mb-1">{stat.value}</h4>
                <p className="text-sm text-white/40 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Table & Campaign Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Uploads Table */}
            <div className={`${CYBEXEL_THEME.card} xl:col-span-2 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl`}>
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h4 className="font-bold tracking-wide">Recent Document Uploads</h4>
                <button className="text-xs text-blue-400 font-semibold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] text-white/40 text-[10px] uppercase tracking-[0.15em] font-bold">
                    <tr>
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentUploads.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold border border-white/10 group-hover:border-blue-500/50 transition-colors">
                              {row.fullName.charAt(0)}
                            </div>
                            <span className="text-sm font-medium">{row.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">{row.positionApplied}</td>
                        <td className="px-6 py-4 text-xs text-white/40 font-mono">{
new Date(
  row.createdAt
).toLocaleDateString()
}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${row.status === 'Approved' ? 'text-green-400 bg-green-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-all">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Campaign Summary Section */}
            <div className="space-y-6">
              <div className={`${CYBEXEL_THEME.card} p-6 rounded-[2rem] border border-white/5 shadow-xl`}>
                <h4 className="font-bold tracking-wide mb-6">Total Links</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Active Upload Links', count: stats.activeLinks || 0, color: 'bg-blue-500', icon: <LinkIcon size={14}/> },
                    { label: 'Expired Links', count: stats.expiredLinks || 0, color: 'bg-white/10', icon: <X size={14}/> },
                    { label: 'Total Upload Sessions', count: stats.totalUploadSessions , color: 'bg-indigo-500', icon: <CheckCircle2 size={14}/> },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className={`p-2 rounded-lg ${item.color} text-white`}>{item.icon}</div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{item.label}</p>
                        <p className="text-lg font-bold">{item.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Status Card */}
          
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto px-10 py-6 text-white/20 text-[10px] font-medium tracking-[0.2em] flex justify-between items-center border-t border-white/5">
          <span>© 2026 CYBEXEL TECHNOLOGIES PVT LIMITED.</span>
          <div className="flex gap-4">
            <span className="hover:text-white/40 cursor-pointer">PRIVACY</span>
            <span className="hover:text-white/40 cursor-pointer">SECURITY</span>
            <span className="hover:text-white/40 cursor-pointer">SUPPORT</span>
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