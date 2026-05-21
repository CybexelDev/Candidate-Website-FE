import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  X, 
  Clock, 
  Hash, 
  FileCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const SuccessModal = ({ isOpen = true, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowModal(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const uploadedDocs = [
    "SSLC Certificate",
    "Aadhaar Card",
    "Resume / CV",
    "Degree Certificate",
    "Passport Photo"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop with Blur */}
      <div 
        className={`absolute inset-0 bg-[#0B1240]/80 backdrop-blur-md transition-opacity duration-500 ${showModal ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-lg bg-[#1C2452] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 transform ${showModal ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
      >
        {/* Top Success Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-green-500/10 blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          {/* Success Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 animate-in zoom-in duration-700" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              Documents Submitted Successfully
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Your onboarding documents have been securely uploaded to the <span className="text-white font-medium italic">CYBEXEL</span> HR portal.
            </p>
          </div>

          {/* Submission Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#2A3260]/40 border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">
                <Hash size={12} /> Ref ID
              </div>
              <div className="text-white font-mono text-sm tracking-tighter">CYB-2026-00124</div>
            </div>
            <div className="bg-[#2A3260]/40 border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">
                <Clock size={12} /> Timestamp
              </div>
              <div className="text-white text-sm">14 May 2026, 14:24</div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Uploaded Inventory</h4>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">5 Files</span>
            </div>
            <div className="bg-[#2A3260]/20 rounded-2xl border border-white/5 p-2 max-h-40 overflow-y-auto custom-scrollbar">
              {uploadedDocs.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                    <FileCheck size={16} />
                  </div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">{doc}</span>
                  <div className="ml-auto flex items-center gap-1 text-[10px] text-green-400/60 font-semibold uppercase italic">
                    Verified
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Next Steps Info */}
          <p className="text-center text-xs text-white/40 mb-8 px-4">
            Our hiring team will review your documents and contact you shortly regarding the next steps in your onboarding process.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
           
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-[#2563EB] hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 text-sm"
            >
              Close Portal
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 opacity-50" />
      </div>
    </div>
  );
};

export default SuccessModal;