import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Plus,
    Search,
    Filter,
    Copy,
    MoreVertical,
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
    FileText
} from 'lucide-react';

const CYBEXEL_THEME = {
    bg: 'bg-[#0B1240]',
    card: 'bg-[#1C2452]',
    input: 'bg-[#2A3260]',
    border: 'border-white/10',
    accent: 'bg-[#2563EB]',
    textMuted: 'text-white/60'
};

import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { createUploadLinkApi, getUploadCampaignsApi, deleteUploadCampaignApi } from '../../../Api/adminApi';
const UploadCampaignsLayout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setSidebarOpen] =
        useState(true);

    const [activeTab, setActiveTab] =
        useState("Upload Links");
    const [campaigns, setCampaigns] =
        useState([]);
  const getCampaignStatus = (
  campaign
) => {

  return new Date(
    campaign.expiresAt
  ) < new Date()

    ? "Expired"

    : "Active";
};
useEffect(() => {

  const interval = setInterval(() => {

    setCampaigns((prev) => [...prev]);

  }, 60000);

  return () => clearInterval(interval);

}, []);
    const [stats, setStats] =
        useState({});

    const [expiryDate, setExpiryDate] =
        useState("");

    const [expiryTime, setExpiryTime] =
        useState("");

    const [notes, setNotes] =
        useState("");

    const [loading, setLoading] =
        useState(false);
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
   let filteredCampaigns =
  [...campaigns];

if (filter !== "All") {

  filteredCampaigns =
    filteredCampaigns.filter(

      (item) =>

        getCampaignStatus(item)
        === filter
    );
}
    if (sort === "Latest First") {

  filteredCampaigns.sort(

    (a, b) =>

      new Date(b.createdAt) -

      new Date(a.createdAt)
  );
}

if (sort === "Oldest First") {

  filteredCampaigns.sort(

    (a, b) =>

      new Date(a.createdAt) -

      new Date(b.createdAt)
  );
}

if (sort === "Name A-Z") {

  filteredCampaigns.sort(

    (a, b) =>

      a.fullName.localeCompare(
        b.fullName
      )
  );
}

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Expired': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Scheduled': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-white/5 text-white/40 border-white/10';
        }
    };
    const fetchCampaigns = async () => {

        try {

            const response =
                await getUploadCampaignsApi();

            setCampaigns(
                response.data.campaigns
            );

            setStats(
                response.data.stats
            );

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to fetch campaigns"
            );
        }
    };
  

    const handleGenerateLink = async () => {

        try {

            setLoading(true);

            if (!expiryDate || !expiryTime) {

                return toast.error(
                    "Expiry date & time required"
                );
            }

            const expiresAt =
                `${expiryDate}T${expiryTime}:00`;

            const response =
                await createUploadLinkApi({

                    expiresAt,
                    notes,

                });

            toast.success(
                "Secure link generated"
            );

            navigator.clipboard.writeText(
                response.data.uploadLink
            );

            setIsModalOpen(false);

            setExpiryDate("");
            setExpiryTime("");
            setNotes("");

            fetchCampaigns();

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };
    const handleDeleteCampaign =
        async (id) => {

            try {

                await deleteUploadCampaignApi(id);

                toast.success(
                    "Campaign deleted"
                );

                fetchCampaigns();

            } catch (error) {

                console.log(error);

                toast.error(
                    "Delete failed"
                );
            }
        };


    useEffect(() => {

        fetchCampaigns();

    }, []);
    const handleCopyLink = (token) => {

        const fullUrl =
            `${window.location.origin}/upload/${token}`;

        navigator.clipboard.writeText(
            fullUrl
        );

        toast.success(
            "Link copied successfully"
        );
    };
    return (
        <div
            className={`min-h-screen ${CYBEXEL_THEME.bg} text-white flex host-grotesk`}
        >
            {/* --- HEADER --- */}
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


                <div className="p-6 lg:p-10 font-sans selection:bg-blue-500/30">
                    {/* --- STATS SUMMARY --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                        {[
                            {
                                label: "Total Campaigns",
                                value: stats.totalCampaigns || 0,
                                icon: <FileText size={18} />,
                                color: "text-blue-400",
                            },

                            {
                                label: "Active Links",
                                value: stats.activeLinks || 0,
                                icon: <CheckCircle2 size={18} />,
                                color: "text-green-400",
                            },

                            {
                                label: "Expired Links",
                                value: stats.expiredLinks || 0,
                                icon: <AlertCircle size={18} />,
                                color: "text-red-400",
                            },

                            {
                                label: "Total Uploads",
                                value: stats.totalUploads || 0,
                                icon: <LinkIcon size={18} />,
                                color: "text-purple-400",
                            },

                        ].map((stat, i) => (

                            <div
                                key={i}
                                className={`${CYBEXEL_THEME.card} p-6 rounded-3xl border border-white/5 relative group overflow-hidden transition-all hover:border-white/20`}
                            >

                                <div className="flex items-center gap-4">

                                    <div className={`p-3 bg-white/5 rounded-2xl ${stat.color}`}>
                                        {stat.icon}
                                    </div>

                                    <div>

                                        <p className="text-3xl font-bold tracking-tighter">
                                            {stat.value}
                                        </p>

                                        <p className="text-xs font-bold uppercase tracking-widest text-white/30">
                                            {stat.label}
                                        </p>

                                    </div>

                                </div>

                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-500/5 transition-colors" />

                            </div>

                        ))}

                    </div>

                    {/* TOP ACTION BAR */}
                    <div className="flex items-center justify-between mb-8">

                        <div>

                            <h2 className="text-2xl font-bold tracking-tight">
                                Link Management
                            </h2>

                            <p className="text-white/40 text-sm mt-1">
                                Manage secure upload links and onboarding sessions.
                            </p>

                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={`${CYBEXEL_THEME.accent} hover:bg-blue-500 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/30`}
                        >

                            <Plus size={18} />

                            Generate Link

                        </button>

                    </div>
                    {/* --- FILTERS & SEARCH --- */}
                    <div className="flex justify-end gap-3 mb-6 relative">

                        {/* FILTER */}
                        <div className="relative">

                            <button

                                onClick={() => {

                                    setIsFilterOpen(
                                        !isFilterOpen
                                    );

                                    setIsSortOpen(false);
                                }}

                                className={`${CYBEXEL_THEME.card} px-5 py-3.5 rounded-2xl border border-white/5 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-all`}
                            >

                                <Filter
                                    size={18}
                                    className="text-white/40"
                                />

                                {filter}

                            </button>

                            {/* FILTER DROPDOWN */}
                            {

                                isFilterOpen && (

                                    <div className={`${CYBEXEL_THEME.card} absolute top-16 right-0 w-56 rounded-2xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200`}>

                                        {

                                           [
  "All",
  "Active",
  "Expired",
].map((item) => (

                                                <button

                                                    key={item}

                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-sm transition-all"

                                                    onClick={() => {

                                                        setFilter(item);

                                                        setIsFilterOpen(
                                                            false
                                                        );
                                                    }}
                                                >

                                                    {item}

                                                </button>
                                            ))
                                        }

                                    </div>
                                )
                            }

                        </div>

                        {/* SORT */}
                        <div className="relative">

                            <button

                                onClick={() => {

                                    setIsSortOpen(
                                        !isSortOpen
                                    );

                                    setIsFilterOpen(false);
                                }}

                                className={`${CYBEXEL_THEME.card} px-5 py-3.5 rounded-2xl border border-white/5 text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-all`}
                            >

                                <ArrowUpDown
                                    size={18}
                                    className="text-white/40"
                                />

                                {sort}

                            </button>

                            {/* SORT DROPDOWN */}
                            {

                                isSortOpen && (

                                    <div className={`${CYBEXEL_THEME.card} absolute top-16 right-0 w-56 rounded-2xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200`}>

                                        {

                                           [
  "Latest First",
  "Oldest First",
  "Most Uploads",
].map((item) => (

                                                <button

                                                    key={item}

                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-sm transition-all"

                                                    onClick={() => {

                                                        setSort(item);

                                                        setIsSortOpen(
                                                            false
                                                        );
                                                    }}
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

                    {/* --- CAMPAIGNS TABLE --- */}
                    <div className={`${CYBEXEL_THEME.card} rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/5">
                                        <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Upload Link</th>
                                        <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Expiry</th>
                                        <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Status</th>
                                        <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Uploads</th>
                                        <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCampaigns.map((camp) => (
                                        <tr key={camp.id} className="hover:bg-white/[0.02] transition-colors group">

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 group/link">
                                                    <span className="text-xs font-mono text-blue-400/80 truncate max-w-[140px]">{

                                                        `${window.location.origin}/upload/${camp.token}`
                                                    }</span>
                                                    <button className="p-1.5 rounded-lg hover:bg-blue-500/20 text-white/20 hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 group-hover/link:opacity-100" onClick={() =>
                                                        handleCopyLink(camp.token)
                                                    }
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs text-white/50">{
                                                    new Date(
                                                        camp.expiresAt
                                                    ).toLocaleDateString()
                                                }</span>
                                            </td>
                                            <td className="px-6 py-5">
<span
  className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getStatusStyle(
    new Date(camp.expiresAt) < new Date()
      ? "Expired"
      : "Active"
  )} uppercase tracking-wider`}
>                                                    {
                                                        new Date(camp.expiresAt) <
                                                            new Date()

                                                            ? "Expired"

                                                            : "Active"
                                                    }                    </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium">{camp.uploadCount}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-all" title="View Details">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-all" title="Copy Link" onClick={() =>
                                                        handleCopyLink(camp.token)
                                                    }
                                                    >
                                                        <ExternalLink size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteCampaign(camp._id)
                                                        } className="p-2 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400 transition-all" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- CREATE CAMPAIGN MODAL --- */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-[#0B1240]/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

                            {/* Modal Card */}
                            <div className={`${CYBEXEL_THEME.card} w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300`}>
                                <div className="p-8 md:p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1">Create Campaign</h2>
                                            <p className="text-sm text-white/40">Set parameters for the secure upload session.</p>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">


                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2"><Calendar size={14} /> Expiry Date</label>
                                                <input type="date" value={expiryDate}
                                                    onChange={(e) =>
                                                        setExpiryDate(e.target.value)
                                                    }
                                                    className={`w-full ${CYBEXEL_THEME.input} border border-white/5 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all [color-scheme:dark]`} />
                                            </div>
                                            <div className="space-y-2">

                                                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">

                                                    <Clock size={14} />

                                                    Expiry Time

                                                </label>

                                                <input
                                                    type="time"
                                                    value={expiryTime}
                                                    onChange={(e) =>
                                                        setExpiryTime(e.target.value)
                                                    }

                                                    className={`w-full ${CYBEXEL_THEME.input} border border-white/5 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all [color-scheme:dark]`}
                                                />

                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Administrative Notes</label>
                                            <textarea rows="3" value={notes}
                                                onChange={(e) =>
                                                    setNotes(e.target.value)
                                                } placeholder="Optional notes for the HR team..." className={`w-full ${CYBEXEL_THEME.input} border border-white/5 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none`}></textarea>
                                        </div>

                                        <button
                                            onClick={handleGenerateLink}
                                            disabled={loading}
                                            className={`w-full py-5 ${CYBEXEL_THEME.accent} hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/40 active:scale-95 flex items-center justify-center gap-3 mt-4 disabled:opacity-50`}
                                        >

                                            <LinkIcon size={20} />

                                            {
                                                loading
                                                    ? "Generating..."
                                                    : "Generate Secure Link"
                                            }

                                        </button>
                                    </div>
                                </div>

                                {/* Bottom Glow */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                            </div>
                        </div>
                    )}
                </div>

            </main>

        </div>);
};

export default UploadCampaignsLayout;