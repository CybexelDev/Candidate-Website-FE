import React, {
  useState,
  useEffect
} from "react";
import {
  getCandidatesApi
} from "../../../Api/adminApi";

import { toast } from "sonner";

import { useNavigate }
from "react-router-dom";
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
  Download
} from 'lucide-react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Navbar from '../../Components/Navbar/Navbar';
const CYBEXEL_THEME = {
      bg: 'bg-[#0B1240]',

  card: 'bg-[#1C2452]',
  input: 'bg-[#2A3260]',
  border: 'border-white/10',
  accent: 'bg-[#2563EB]',
  textMuted: 'text-white/60'
};

const CandidatesLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen,
setIsFilterOpen] =
useState(false);

const [isSortOpen,
setIsSortOpen] =
useState(false);

const [filter,
setFilter] =
useState("All");

const [sort,
setSort] =
useState("Latest First");
  const [isSidebarOpen, setSidebarOpen] =
  useState(true);
  
  const navigate=useNavigate()

const [activeTab, setActiveTab] =
  useState("Candidates");
  const [stats, setStats] =
useState({});

const [candidates, setCandidates] =
useState([]);

let filteredCandidates =
  [...candidates];


// SEARCH
filteredCandidates =
  filteredCandidates.filter(

    (cand) =>

      cand.fullName
      ?.toLowerCase()
      .includes(
        searchQuery.toLowerCase()
      )
  );


// FILTER
if (filter !== "All") {

  filteredCandidates =
    filteredCandidates.filter(

      (cand) =>

        cand.status === filter
    );
}


// SORT
if (sort === "Latest First") {

  filteredCandidates.sort(

    (a, b) =>

      new Date(b.createdAt) -

      new Date(a.createdAt)
  );
}

if (sort === "Oldest First") {

  filteredCandidates.sort(

    (a, b) =>

      new Date(a.createdAt) -

      new Date(b.createdAt)
  );
}

if (sort === "Name A-Z") {

  filteredCandidates.sort(

    (a, b) =>

      a.fullName.localeCompare(
        b.fullName
      )
  );
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
  const fetchCandidates =
async () => {

  try {

    const response =
      await getCandidatesApi();

    setCandidates(
      response.data.candidates
    );

    setStats(
      response.data.stats
    );

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to fetch candidates"
    );
  }
};

  useEffect(() => {

  fetchCandidates();

}, []);
  return (
<div
    className={`min-h-screen ${CYBEXEL_THEME.bg} text-white flex host-grotesk`}
  >

    {/* SIDEBAR */}
    <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isSidebarOpen={isSidebarOpen}
    />

    {/* MAIN CONTENT */}
    <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">

      {/* NAVBAR */}
      <Navbar
        activeTab={activeTab}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* PAGE CONTENT */}
      <div className="p-6 lg:p-10 animate-in fade-in duration-700">      {/* --- TOP ACTION BAR --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 px-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Candidates</h1>
          <p className={CYBEXEL_THEME.textMuted}>Manage uploaded candidate onboarding submissions.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className={`w-full ${CYBEXEL_THEME.input} border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-white placeholder:text-white/20`}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative">

  <button

    onClick={() => {

      setIsFilterOpen(
        !isFilterOpen
      );

      setIsSortOpen(false);
    }}

    className={`${CYBEXEL_THEME.card} flex-1 sm:flex-none px-5 py-3.5 rounded-2xl border border-white/5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-white/80`}
  >

    <Filter
      size={18}
      className="text-white/40"
    />

    {filter}

  </button>

  {

    isFilterOpen && (

      <div className={`${CYBEXEL_THEME.card} absolute top-16 right-0 w-56 rounded-2xl border border-white/10 shadow-2xl p-2 z-50`}>

        {

          [
            "All",
            "Pending",
            "Approved",
            "Rejected",
          ].map((item) => (

            <button

              key={item}

              onClick={() => {

                setFilter(item);

                setIsFilterOpen(
                  false
                );
              }}

              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-sm transition-all"
            >

              {item}

            </button>
          ))
        }

      </div>
    )
  }

</div>
          <div className="relative">

  <button

    onClick={() => {

      setIsSortOpen(
        !isSortOpen
      );

      setIsFilterOpen(false);
    }}

    className={`${CYBEXEL_THEME.card} flex-1 sm:flex-none px-5 py-3.5 rounded-2xl border border-white/5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-white/80`}
  >

    <ArrowUpDown
      size={18}
      className="text-white/40"
    />

    {sort}

  </button>

  {

    isSortOpen && (

      <div className={`${CYBEXEL_THEME.card} absolute top-16 right-0 w-56 rounded-2xl border border-white/10 shadow-2xl p-2 z-50`}>

        {

          [
            "Latest First",
            "Oldest First",
            "Name A-Z",
          ].map((item) => (

            <button

              key={item}

              onClick={() => {

                setSort(item);

                setIsSortOpen(
                  false
                );
              }}

              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-sm transition-all"
            >

              {item}

            </button>
          ))
        }

      </div>
    )
  }

</div>
          </div>
        </div>
      </div>

      {/* --- STATS SUMMARY --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
{[
  {
    label: "Total Candidates",
    value:
      stats.totalCandidates || 0,
    icon: <Users size={18} />,
    color: "text-blue-400",
  },

  {
    label: "Pending Review",
    value:
      stats.pendingReview || 0,
    icon: <Clock size={18} />,
    color: "text-amber-400",
  },

  {
    label: "Approved",
    value:
      stats.approved || 0,
    icon: <CheckCircle2 size={18} />,
    color: "text-green-400",
  },

  {
    label: "Rejected",
    value:
      stats.rejected || 0,
    icon: <XCircle size={18} />,
    color: "text-red-400",
  },

].map((stat, i) => (          <div key={i} className={`${CYBEXEL_THEME.card} p-6 rounded-[1.5rem] border border-white/5 relative group overflow-hidden transition-all hover:border-white/20 hover:translate-y-[-2px]`}>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 bg-white/5 rounded-2xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-white">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">{stat.label}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors" />
          </div>
        ))}
      </div>

      {/* --- CANDIDATES TABLE --- */}
      <div className={`${CYBEXEL_THEME.card} rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative`}>
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 sticky top-0">Candidate Name</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Email</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Position</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Uploaded Date</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Status</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCandidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                        {cand.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold text-white/90 group-hover:text-blue-400 transition-colors">{cand.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm text-white/70">{cand.email}</span>
                      <span className="text-[10px] text-white/30 font-mono tracking-tighter mt-0.5">{cand.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-white/60">{cand.positionApplied}</td>
                  <td className="px-6 py-5 text-xs text-white/40 font-mono italic">{
  new Date(
    cand.createdAt
  ).toLocaleDateString()
}</td>
                  <td className="px-6 py-5">
                    <span className={getStatusBadge(cand.status)}>
                      {cand.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border border-blue-500/20"   onClick={() =>
    navigate(
`/admin/candidate-details/${cand._id}`
    )
  }>
                        <Eye size={14} />
                        View
                      </button>
                    
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        <div className="px-8 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/30 font-medium uppercase tracking-widest">
            Showing <span className="text-white font-bold">1-5</span> of <span className="text-white font-bold">2,840</span> Candidates
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all disabled:opacity-20" disabled>
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {[1, 2, 3, '...', 12].map((num, i) => (
                <button 
                  key={i} 
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${num === 1 ? 'bg-blue-600 border-blue-500 text-white' : 'hover:bg-white/5 border-transparent text-white/40 hover:text-white'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- EXPORT CTA --- */}
      <div className="mt-8 flex justify-end">
        <button className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group">
          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
          Export Candidate List (.csv)
        </button>
      </div>
      </div>

    </main>

  </div>  );
};

export default CandidatesLayout;