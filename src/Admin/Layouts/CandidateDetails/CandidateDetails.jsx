import React, { useState, useEffect } from 'react';
import {
  User, Phone, Mail, Briefcase, Heart, ShieldCheck, Lock,
  FileText, Download, Eye, CheckCircle2, AlertCircle,
  Clock, MessageSquare, Save, ChevronRight, Image as ImageIcon,
  MoreVertical, ShieldAlert, FileSearch, Trash2, Camera,
  XCircle, Sparkles, Send
} from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import {
  getCandidateDetailsApi,
  updateCandidateStatusApi,
  addRemarkApi
} from "../../../Api/adminApi";

import { useParams } from "react-router-dom";

import { toast } from "sonner";
const CYBEXEL_THEME = {
  bg: 'bg-[#0B1240]',

  card: 'bg-[#1C2452]',
  input: 'bg-[#2A3260]',
  border: 'border-white/10',
  accent: 'bg-[#2563EB]',
  textMuted: 'text-white/60'
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
    @keyframes pulseDot {
      0%   { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.55); }
      70%  { box-shadow: 0 0 0 7px rgba(96, 165, 250, 0); }
      100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
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

const STATUS_DOT = {
  Approved: 'bg-green-400',
  Rejected: 'bg-red-400',
  Reviewing: 'bg-blue-400 pulse-dot',
};

/* gradient-border card wrapper */
const GlassCard = ({ children, className = '', delay = 0 }) => (
  <div
    className={`fade-up rounded-3xl p-[1px] bg-gradient-to-b from-white/15 via-white/[0.04] to-white/[0.02] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`${CYBEXEL_THEME.card} relative rounded-[23px] overflow-hidden h-full`}>
      {children}
    </div>
  </div>
);

const SectionTitle = ({ icon, children, tone = 'text-blue-400', toneBg = 'bg-blue-500/10 border-blue-400/15' }) => (
  <h3 className="flex items-center gap-3 mb-6">
    <span className={`w-9 h-9 rounded-xl border flex items-center justify-center ${toneBg} ${tone}`}>
      {icon}
    </span>
    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">
      {children}
    </span>
  </h3>
);

const CandidateDetailsLayout = () => {
  const [status, setStatus] = useState('Reviewing');
  const [remarks, setRemarks] = useState('');
  const [candidate, setCandidate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Candidates");
  const getFileUrl = (file) => {

    if (!file) return "";

    if (file.startsWith("http")) {
      return file;
    }

    return `https://candidate-website-be.onrender.com${
      file.startsWith("/") ? "" : "/"
    }${file}`;
  };

  const getStatusBadge = (s) => {
    const base = "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ";
    if (s === 'Approved') return base + "bg-green-500/10 text-green-400 border-green-500/20";
    if (s === 'Rejected') return base + "bg-red-500/10 text-red-400 border-red-500/20";
    if (s === 'Reviewing') return base + "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return base + "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };
  const fetchCandidate = async () => {

    try {

      const response = await getCandidateDetailsApi(id);

      setCandidate(response.data.candidate);

      setStatus(response.data.candidate.status);

    } catch (error) {

      console.log(error);

      toast.error("Failed to fetch candidate");

    } finally {

      setLoading(false);
    }
  };
  useEffect(() => {

    fetchCandidate();

  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1240] flex flex-col items-center justify-center gap-5">
        <MotionStyles />
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute -inset-6 rounded-full bg-blue-500/20 blur-2xl float-glow" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-semibold">
          Loading candidate
        </p>
      </div>
    );
  }
  const documents = [

    {
      type: "SSLC Certificate",
      file: candidate?.documents?.sslcCertificate,
    },

    {
      type: "Higher Secondary",
      file: candidate?.documents?.higherSecondaryCertificate,
    },

    {
      type: "Degree / Diploma",
      file: candidate?.documents?.degreeCertificate,
    },

    {
      type: "Aadhaar Card",
      file: candidate?.documents?.aadhaarCard,
    },

    {
      type: "Passport Photo",
      file: candidate?.documents?.passportPhoto,
      isImage: true,
    },

    {
      type: "Resume / CV",
      file: candidate?.documents?.resume,
    },

    {
      type: "PAN Card",
      file: candidate?.documents?.panCard,
    },

  ];

  const checklist = [

    {
      label: "Basic Information",

      checked:
        candidate?.fullName &&
        candidate?.email &&
        candidate?.mobileNumber,
    },

    {
      label: "Emergency Contact",

      checked:
        candidate?.emergencyContactName &&
        candidate?.emergencyContactNumber,
    },

    {
      label: "SSLC Uploaded",

      checked: candidate?.documents?.sslcCertificate,
    },

    {
      label: "Aadhaar Uploaded",

      checked: candidate?.documents?.aadhaarCard,
    },

    {
      label: "Resume Uploaded",

      checked: candidate?.documents?.resume,
    },

    {
      label: "Degree Certificate",

      checked: candidate?.documents?.degreeCertificate,
    },

    {
      label: "PAN Card Upload",

      checked: candidate?.documents?.panCard,

      optional: true,
    },

  ];


  const completedItems = checklist.filter(
    (item) => item.checked
  ).length;

  const progress = Math.round(
    (completedItems / checklist.length) * 100
  );
  return (
    <div className="min-h-screen bg-[#0B1240] text-white flex host-grotesk">
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
        <div className="relative p-6 lg:p-10 host-grotesk max-w-[1500px] w-full mx-auto">

          {/* --- TOP HEADER SECTION --- */}
          <div
            className="fade-up flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10"
            style={{ animationDelay: '0ms' }}
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-blue-500/30 blur-xl" />
                <div className="relative w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-blue-900/30 ring-1 ring-white/25">
                  {candidate?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                    {candidate.fullName}
                  </h1>
                  <span className={getStatusBadge(status)}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || 'bg-amber-400'}`} />
                    {status}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-white/50 text-sm">
                  <Briefcase size={16} /> {candidate.positionApplied}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              {status !== "Rejected" && (

                <button

                  onClick={async () => {

                    try {

                      await updateCandidateStatusApi(

                        candidate._id,

                        {
                          status: "Rejected"
                        }

                      );

                      toast.success("Candidate rejected");

                      fetchCandidate();

                    } catch (error) {

                      toast.error("Update failed");
                    }
                  }}

                  className="flex items-center gap-2 px-5 h-12 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 border border-red-500/20 hover:border-red-400 hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.8)] active:scale-95"
                >
                  <XCircle size={16} />
                  Reject
                </button>

              )}

              {status !== "Approved" && (

                <button

                  onClick={async () => {

                    try {

                      await updateCandidateStatusApi(

                        candidate._id,

                        {
                          status: "Approved"
                        }

                      );

                      toast.success("Candidate approved");

                      fetchCandidate();

                    } catch (error) {

                      toast.error("Update failed");
                    }
                  }}

                  className="shine relative overflow-hidden flex items-center gap-2 px-6 h-12 bg-gradient-to-b from-[#3b74f5] to-[#2563EB] hover:from-[#4f83ff] hover:to-[#2f6df0] text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-[0_10px_30px_-8px_rgba(37,99,235,0.7)] hover:shadow-[0_14px_40px_-8px_rgba(37,99,235,0.9)] hover:-translate-y-0.5 active:translate-y-0 ring-1 ring-white/20"
                >
                  <CheckCircle2 size={16} />
                  Approve Candidate
                </button>

              )}

            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* --- LEFT COLUMN: DETAILS & DOCUMENTS --- */}
            <div className="xl:col-span-2 space-y-8">

              {/* Section 1 & 2: Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Candidate Information */}
                <GlassCard delay={120}>
                  <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />
                  <div className="relative p-7">
                    <SectionTitle icon={<User size={16} />}>
                      Candidate Information
                    </SectionTitle>
                    <div className="space-y-1">
                      <InfoRow label="Full Name" value={candidate?.fullName} icon={<User size={14} />} />
                      <InfoRow label="Mobile Number" value={candidate?.mobileNumber} icon={<Phone size={14} />} />
                      <InfoRow label="Email Address" value={candidate.email} icon={<Mail size={14} />} />
                      <InfoRow label="Applied Role" value={candidate?.positionApplied} icon={<Briefcase size={14} />} />
                    </div>
                  </div>
                </GlassCard>

                {/* Emergency Contact */}
                <GlassCard delay={200}>
                  <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-rose-500/15 blur-3xl" />
                  <div className="relative p-7">
                    <SectionTitle
                      icon={<Phone size={16} />}
                      tone="text-rose-400"
                      toneBg="bg-rose-500/10 border-rose-400/15"
                    >
                      Emergency Contact
                    </SectionTitle>
                    <div className="space-y-1">
                      <InfoRow label="Contact Name" value={candidate.emergencyContactName} />
                      <InfoRow label="Contact Number" value={candidate.emergencyContactNumber} />
                      <InfoRow label="Relationship" value={candidate.relationshipWithEmergency} />
                    </div>
                  </div>
                </GlassCard>
              </div>


              {/* Section 4: Uploaded Documents */}
              <div className="space-y-6">
                <div
                  className="fade-up flex items-center justify-between px-1"
                  style={{ animationDelay: '280ms' }}
                >
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-400/15 flex items-center justify-center text-violet-300">
                      <FileSearch size={16} />
                    </span>
                    Uploaded Documents
                  </h3>
                  <span className="text-[11px] text-white/40 uppercase tracking-[0.18em] font-semibold bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded-full">
                    {documents.length} Files Total
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc, dIdx) => {
                    console.log(doc)
                    return (
                      <div
                        key={doc.type}
                        className={`fade-up ${CYBEXEL_THEME.card} group p-5 rounded-2xl border ${!doc.file ? 'border-red-500/20 bg-red-500/[0.06]' : 'border-white/[0.07] hover:border-blue-400/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.45)]'} transition-all duration-300 relative overflow-hidden`}
                        style={{ animationDelay: `${340 + dIdx * 60}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-16 rounded-xl flex items-center justify-center shrink-0 border ${!doc.file ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-300 border-blue-400/15'}`}>
                            {doc.isImage ? <Camera size={24} /> : <FileText size={24} />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-1.5">{doc.type}</p>
                              {doc.file && <CheckCircle2 size={15} className="text-green-400" />}
                            </div>
                            <h4 className={`text-sm font-semibold truncate ${!doc.file ? 'text-red-400' : 'text-white/90'}`}>
                              {
                                doc.file
                                  ? doc.file
                                    .split("/")
                                    .pop()
                                  : "Not Uploaded"
                              }
                            </h4>
                            <div className="flex items-center gap-3 mt-2.5 text-[10px] text-white/30 font-medium uppercase tracking-tight">
                              <span>Uploaded Document</span>
                              <span>•</span>
                              <span>
                                {
                                  new Date(
                                    candidate?.createdAt
                                  ).toLocaleDateString()
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Overlay */}
                        {doc.file && (
                          <div className="absolute inset-0 bg-[#0B1240]/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                            <a
                              href={doc.file} target="_blank"
                              rel="noopener noreferrer"

                              className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-xl hover:scale-110 active:scale-95 border border-white/10"

                              title="Preview"
                            >

                              <Eye size={20} />

                            </a>
                            <button

                              onClick={async () => {

                                try {

                                  const response = await fetch(doc.file);

                                  const blob = await response.blob();

                                  const url = window.URL.createObjectURL(blob);

                                  const link = document.createElement("a");

                                  link.href = url;

                                  link.download = doc.file.split("/").pop();

                                  document.body.appendChild(link);

                                  link.click();

                                  link.remove();

                                  window.URL.revokeObjectURL(url);

                                } catch (error) {

                                  console.log(error);

                                  toast.error("Download failed");
                                }
                              }}

                              className="w-12 h-12 flex items-center justify-center bg-gradient-to-b from-[#3b74f5] to-[#2563EB] hover:from-[#4f83ff] hover:to-[#2f6df0] rounded-full text-white transition-all shadow-[0_10px_30px_-8px_rgba(37,99,235,0.8)] hover:scale-110 active:scale-95 ring-1 ring-white/20"

                              title="Download"
                            >

                              <Download size={20} />

                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-xl hover:scale-110 active:scale-95 border border-white/10">
                              <CheckCircle2 size={20} className="text-green-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: SIDEBAR DASHBOARD --- */}
            <div className="space-y-8">

              {/* Section 5: Progress & Checklist */}
              <GlassCard delay={200}>
                <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold">Onboarding Status</h3>
                      <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] font-semibold mt-1">
                        {completedItems} of {checklist.length} complete
                      </p>
                    </div>
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                        <defs>
                          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#818cf8" />
                          </linearGradient>
                        </defs>
                        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                        <circle
                          cx="28" cy="28" r="24"
                          stroke="url(#ringGrad)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          fill="transparent"
                          strokeDasharray="150"
                          strokeDashoffset={150 - (150 * progress) / 100}
                          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums">{progress}%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {

                      checklist.map(

                        (item, index) => (

                          <CheckItem

                            key={index}

                            label={item.label}

                            checked={item.checked}

                            isError={
                              !item.checked &&
                              !item.optional
                            }

                          />

                        )
                      )
                    }
                  </div>

                </div>
              </GlassCard>

              {/* Section 6: Internal Remarks */}
              <GlassCard delay={300}>
                <div className="pointer-events-none absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-blue-500/15 blur-3xl" />
                <div className="relative p-8">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/15 flex items-center justify-center text-blue-400">
                      <MessageSquare size={18} />
                    </div>
                    <h3 className="text-lg font-bold">Internal Remarks</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Existing Timeline */}
                    <div className="space-y-5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-blue-400/40 before:to-white/5">

                      {

                        candidate?.remarks?.length > 0

                          ? (

                            candidate.remarks.map(

                              (remark, index) => (

                                <div
                                  key={index}
                                  className="relative pl-9"
                                >

                                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#1C2452] border border-blue-400/40 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                  </div>

                                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3">
                                    <p className="text-xs text-white/80 leading-relaxed italic">

                                      "{remark.text}"

                                    </p>

                                    <p className="text-[10px] text-white/30 mt-2 uppercase font-bold tracking-wider">

                                      {remark.addedBy}

                                      {" • "}

                                      {

                                        new Date(
                                          remark.createdAt
                                        ).toLocaleString()

                                      }

                                    </p>
                                  </div>

                                </div>
                              )
                            )

                          ) : (

                            <div className="flex flex-col items-center text-center py-6">
                              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3">
                                <MessageSquare size={20} className="text-white/25" />
                              </div>
                              <p className="text-xs text-white/35">
                                No remarks added yet
                              </p>
                            </div>
                          )
                      }

                    </div>

                    {/* New Remark Input */}
                    <div className="pt-5 border-t border-white/[0.06]">
                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add internal note..."
                        className="w-full bg-[#2A3260] border border-white/10 rounded-xl p-4 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/15 resize-none h-28 transition-all"
                      />
                      <button

                        onClick={async () => {

                          try {

                            await addRemarkApi(

                              candidate._id,

                              {
                                text: remarks
                              }

                            );

                            toast.success("Remark added");

                            setRemarks("");

                            fetchCandidate();

                          } catch (error) {

                            toast.error("Failed to add remark");
                          }
                        }}

                        className="shine relative overflow-hidden w-full mt-3 h-12 bg-white/[0.06] hover:bg-gradient-to-b hover:from-[#3b74f5] hover:to-[#2563EB] border border-white/10 hover:border-blue-400/50 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_10px_30px_-8px_rgba(37,99,235,0.7)] active:scale-[0.98]"
                      >
                        <Save size={14} /> Save Remark
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Page Footer */}
          <div className="mt-14 flex flex-col sm:flex-row gap-3 justify-between items-center px-2 py-6 border-t border-white/[0.06] text-[10px] text-white/25 font-bold tracking-[0.3em] uppercase">
            <span>Cybexel Secure Onboarding Portal</span>
            <span className="flex items-center gap-2">
              <Lock size={11} className="text-green-400/70" />
              AES-256 Bit Encryption Verified
            </span>
          </div>
        </div>

      </main>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between gap-4 py-3.5 border-b border-white/[0.05] last:border-0 group/row">
    <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/35 shrink-0">
      {icon && (
        <span className="text-white/25 group-hover/row:text-blue-400 transition-colors">{icon}</span>
      )}
      {label}
    </div>
    <div className="text-sm font-medium text-white/90 text-right truncate">{value}</div>
  </div>
);

const CheckItem = ({ label, checked, isError, isPending }) => (
  <div className="flex items-center justify-between group px-3 py-3 -mx-3 rounded-xl hover:bg-white/[0.04] transition-colors">
    <span className={`text-sm ${checked ? 'text-white/85' : 'text-white/35'} group-hover:text-white transition-colors`}>{label}</span>
    {checked ? (
      <span className="w-6 h-6 rounded-full bg-green-500/15 border border-green-400/25 flex items-center justify-center">
        <CheckCircle2 size={14} className="text-green-400" />
      </span>
    ) : isError ? (
      <span className="w-6 h-6 rounded-full bg-red-500/15 border border-red-400/25 flex items-center justify-center">
        <ShieldAlert size={14} className="text-red-400" />
      </span>
    ) : (
      <span className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center">
        <Clock size={14} className="text-white/30" />
      </span>
    )}
  </div>
);

export default CandidateDetailsLayout;