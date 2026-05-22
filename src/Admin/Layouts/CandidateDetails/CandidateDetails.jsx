import React, { useState ,useEffect} from 'react';
import { 
  User, Phone, Mail, Briefcase, Heart, ShieldCheck, Lock, 
  FileText, Download, Eye, CheckCircle2, AlertCircle, 
  Clock, MessageSquare, Save, ChevronRight, Image as ImageIcon,
  MoreVertical, ShieldAlert, FileSearch, Trash2, Camera
} from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import {
  getCandidateDetailsApi,
  updateCandidateStatusApi,
  addRemarkApi
} from "../../../Api/adminApi";

import {
  useParams
} from "react-router-dom";

import { toast }
from "sonner";
const CYBEXEL_THEME = {
          bg: 'bg-[#0B1240]',

  card: 'bg-[#1C2452]',
  input: 'bg-[#2A3260]',
  border: 'border-white/10',
  accent: 'bg-[#2563EB]',
  textMuted: 'text-white/60'
};

const CandidateDetailsLayout = () => {
  const [status, setStatus] = useState('Reviewing');
  const [remarks, setRemarks] = useState('');
  const [candidate, setCandidate] =
useState(null);

const [loading, setLoading] =
useState(true);
  const [isSidebarOpen, setSidebarOpen] =
  useState(true);
const { id } =
useParams();
const [activeTab, setActiveTab] =
  useState("Candidates");
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
    const base = "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ";
    if (s === 'Approved') return base + "bg-green-500/10 text-green-400 border-green-500/20";
    if (s === 'Rejected') return base + "bg-red-500/10 text-red-400 border-red-500/20";
    if (s === 'Reviewing') return base + "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return base + "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };
  const fetchCandidate =
async () => {

  try {

    const response =
      await getCandidateDetailsApi(
        id
      );

    setCandidate(
      response.data.candidate
    );

    setStatus(
      response.data.candidate.status
    );

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to fetch candidate"
    );

  } finally {

    setLoading(false);
  }
};
useEffect(() => {

  fetchCandidate();

}, [id]);


if (loading) {

  return (

    <div className="min-h-screen bg-[#0B1240] flex items-center justify-center text-white">

      Loading Candidate...

    </div>
  );
}
const documents = [

  {
    type: "SSLC Certificate",
    file:
candidate?.documents?.sslcCertificate,
  },

  {
    type:
"Higher Secondary",
    file:
candidate?.documents?.higherSecondaryCertificate,
  },

  {
    type:
"Degree / Diploma",
    file:
candidate?.documents?.degreeCertificate,
  },

  {
    type:
"Aadhaar Card",
    file:
candidate?.documents?.aadhaarCard,
  },

  {
    type:
"Passport Photo",
    file:
candidate?.documents?.passportPhoto,
    isImage: true,
  },

  {
    type:
"Resume / CV",
    file:
candidate?.documents?.resume,
  },

  {
    type:
"PAN Card",
    file:
candidate?.documents?.panCard,
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

    checked:
candidate?.documents?.sslcCertificate,
  },

  {
    label: "Aadhaar Uploaded",

    checked:
candidate?.documents?.aadhaarCard,
  },

  {
    label: "Resume Uploaded",

    checked:
candidate?.documents?.resume,
  },

  {
    label: "Degree Certificate",

    checked:
candidate?.documents?.degreeCertificate,
  },

  {
    label: "PAN Card Upload",

    checked:
candidate?.documents?.panCard,

    optional: true,
  },

];


const completedItems =
checklist.filter(
  (item) => item.checked
).length;

const progress =
Math.round(
  (
    completedItems /
    checklist.length
  ) * 100
);
  return (
 <div
    className="min-h-screen bg-[#0B1240] text-white flex host-grotesk"
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
      <div className="p-6 lg:p-10 animate-in fade-in duration-700 host-grotesk">      {/* --- TOP HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-blue-900/20">
{
  candidate?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
}          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{candidate.fullName}</h1>
              <span className={getStatusBadge(status)}>{status}</span>
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

          toast.success(
            "Candidate rejected"
          );

          fetchCandidate();

        } catch (error) {

          toast.error(
            "Update failed"
          );
        }
      }}

      className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-sm font-semibold transition-all border border-red-500/20"
    >
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

          toast.success(
            "Candidate approved"
          );

          fetchCandidate();

        } catch (error) {

          toast.error(
            "Update failed"
          );
        }
      }}

      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/40"
    >
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
            <div className={`${CYBEXEL_THEME.card} p-6 rounded-[2rem] border border-white/5 shadow-xl`}>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
                <User size={16} /> Candidate Information
              </h3>
              <div className="space-y-4">
                <InfoRow label="Full Name" value={candidate?.fullName} icon={<User size={14}/>} />
                <InfoRow label="Mobile Number" value={candidate?.mobileNumber} icon={<Phone size={14}/>} />
                <InfoRow label="Email Address" value={candidate.email} icon={<Mail size={14}/>} />
                <InfoRow label="Applied Role" value={candidate?.positionApplied} icon={<Briefcase size={14}/>} />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className={`${CYBEXEL_THEME.card} p-6 rounded-[2rem] border border-white/5 shadow-xl`}>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
                <Phone size={16} className="text-red-400" /> Emergency Contact Details
              </h3>
              <div className="space-y-4">
                <InfoRow label="Contact Name" value={candidate.emergencyContactName} />
                <InfoRow label="Contact Number" value={candidate.emergencyContactNumber} />
                <InfoRow label="Relationship" value={candidate.relationshipWithEmergency} />
              </div>
            </div>
          </div>


          {/* Section 4: Uploaded Documents */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xl font-bold text-white">Uploaded Documents</h3>
              <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">{documents.length} Files Total</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) =>{
                console.log(doc)
                return (
                <div key={doc.type} className={`${CYBEXEL_THEME.card} group p-4 rounded-2xl border ${!doc.file? 'border-red-500/20 bg-red-500/5' : 'border-white/5 hover:border-blue-500/30'} transition-all relative overflow-hidden`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-16 rounded-xl flex items-center justify-center shrink-0 ${!doc.file ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-blue-400'}`}>
                      {doc.isImage ? <Camera size={24} /> : <FileText size={24} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{doc.type}</p>
                        {doc.file && <CheckCircle2 size={14} className="text-green-500" />}
                      </div>
                      <h4 className={`text-sm font-semibold truncate ${!doc.file? 'text-red-400' : 'text-white/90'}`}>
{
  doc.file
    ? doc.file
        .split("/")
        .pop()
    : "Not Uploaded"
}                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-white/30 font-medium uppercase tracking-tight">
                        <span>Uploaded Document</span>
                        <span>•</span>
<span>
{
new Date(
candidate?.createdAt
).toLocaleDateString()
}
</span>                      </div>
                    </div>
                  </div>

                  {/* Actions Overlay */}
                  {doc.file && (
                    <div className="absolute inset-0 bg-[#0B1240]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
<a
href={doc.file}  target="_blank"
  rel="noopener noreferrer"

  className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all shadow-xl"

  title="Preview"
>

  <Eye size={20} />

</a>
<button

  onClick={async () => {

    try {

      const response =
        await fetch(
          doc.file
        );

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        doc.file
          .split("/")
          .pop();

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Download failed"
      );
    }
  }}

  className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-all shadow-xl"

  title="Download"
>

  <Download size={20} />

</button>
                      <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all shadow-xl">
                        <CheckCircle2 size={20} className="text-green-400" />
                      </button>
                    </div>
                  )}
                </div>
              )})}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR DASHBOARD --- */}
        <div className="space-y-8">
          
          {/* Section 5: Progress & Checklist */}
          <div className={`${CYBEXEL_THEME.card} p-8 rounded-[2.5rem] border border-white/5 shadow-2xl top-24`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Onboarding Status</h3>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                  <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="150" strokeDashoffset={
  150 - (150 * progress) / 100
}className="text-blue-500" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">{progress}%</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
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

          {/* Section 6: Internal Remarks */}
          <div className={`${CYBEXEL_THEME.card} p-8 rounded-[2.5rem] border border-white/5 shadow-2xl`}>
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-blue-400" />
              <h3 className="text-lg font-bold">Internal Remarks</h3>
            </div>
            
            <div className="space-y-6">
              {/* Existing Timeline */}
             <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/5">

  {

    candidate?.remarks?.length > 0

    ? (

      candidate.remarks.map(

        (remark, index) => (

          <div
            key={index}
            className="relative pl-8"
          >

            <div className="absolute left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full border-4 border-[#1C2452]" />

            <p className="text-xs text-white/80 leading-relaxed italic">

              "{remark.text}"

            </p>

            <p className="text-[10px] text-white/30 mt-1 uppercase font-bold">

              {remark.addedBy}

              {" • "}

              {

                new Date(
                  remark.createdAt
                ).toLocaleString()

              }

            </p>

          </div>
        )
      )

    ) : (

      <div className="text-xs text-white/30 text-center py-4">

        No remarks added yet

      </div>
    )
  }

</div>

              {/* New Remark Input */}
              <div className="pt-4 border-t border-white/5">
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add internal note..."
                  className="w-full bg-[#2A3260] border border-white/5 rounded-xl p-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none h-24 transition-all"
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

    toast.success(
      "Remark added"
    );

    setRemarks("");

    fetchCandidate();

  } catch (error) {

    toast.error(
      "Failed to add remark"
    );
  }
}}

className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
>                  <Save size={14} /> Save Remark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="mt-12 flex justify-between items-center px-2 py-6 border-t border-white/5 text-[10px] text-white/20 font-bold tracking-[0.3em] uppercase">
        <span>Cybexel Secure Onboarding Portal</span>
        <span>AES-256 Bit Encryption Verified</span>
      </div>
      </div>

    </main>

  </div>
  );
};

// --- SUB-COMPONENTS ---

const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between py-1 border-b border-white/[0.03]">
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/30">
      {icon} {label}
    </div>
    <div className="text-sm font-medium text-white/90">{value}</div>
  </div>
);

const CheckItem = ({ label, checked, isError, isPending }) => (
  <div className="flex items-center justify-between group">
    <span className={`text-sm ${checked ? 'text-white/80' : 'text-white/30'} group-hover:text-white transition-colors`}>{label}</span>
    {checked ? (
      <CheckCircle2 size={16} className="text-green-500" />
    ) : isError ? (
      <ShieldAlert size={16} className="text-red-400" />
    ) : (
      <Clock size={16} className="text-white/20" />
    )}
  </div>
);

export default CandidateDetailsLayout;