import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Loader2, Lock, ArrowRight, Mail, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
const AuthenticationLayout = () => {
const { token } = useParams();
  const [status, setStatus] = useState('validating');
const navigate=useNavigate()
  useEffect(() => {

  const validateToken = async () => {

    try {

      const response = await fetch(
`http://localhost:5000/api/user/validate/${token}`
      );

      const data =
        await response.json();

      if (data.success) {

        setStatus("valid");

      } else {

        setStatus("invalid");
      }

    } catch (error) {

      console.log(error);

      setStatus("invalid");
    }
  };

  validateToken();

}, [token]);

  const renderContent = () => {
    switch (status) {
      case 'validating':
        return (
          <div className="flex flex-col items-center animate-in fade-in duration-700 host-grotesk">
            <div className="relative flex items-center justify-center mb-6">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <Lock className="w-4 h-4 text-white absolute" />
            </div>
            <h2 className="text-xl font-medium text-white mb-2">
              Validating secure upload link...
            </h2>
            <p className="text-white/60 text-sm text-center max-w-xs">
              Our system is verifying your credentials and session security.
            </p>
          </div>
        );

      case 'valid':
        return (
          <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500 host-grotesk">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Upload Link Verified Successfully
            </h2>
            <p className="text-white/70 mb-8 max-w-sm leading-relaxed">
              Your secure upload session is active. You may now proceed to submit your documents securely to the HR portal.
            </p>
            <button 
              className="group flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-[0.98]" onClick={()=>navigate(`/submit-form/${token}`)}
            >
              Continue to Submission
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );

      case 'invalid':
        return (
          <div className="flex flex-col items-center text-center animate-in slide-in-from-bottom-4 duration-500 host-grotesk">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Upload Link Expired
            </h2>
            <p className="text-white/70 mb-8 max-w-sm leading-relaxed">
              For security reasons, this upload session is no longer active. Please contact the HR team to request a new secure link.
            </p>
            <div className="flex flex-col w-full gap-3">
              <button className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium transition-all duration-300">
                <Mail className="w-4 h-4" />
                Contact HR Team
              </button>
            
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B1240] font-sans selection:bg-blue-500/30 px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Brand Header */}
      <div className="mb-10 text-center relative z-10">
       <div className="flex justify-center mb-4">

  <img
    src="/logo.png"
    alt="CYBEXEL Logo"
    className="w-[180px] object-contain"
  />

</div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-white/90">
            Secure Candidate Document Portal
          </h3>
          <p className="text-white/50 text-sm">
            Powered by Cybexel Technologies
          </p>
        </div>
      </div>

      {/* Main Validation Card */}
      <main className="relative w-full max-w-md z-10">
        <div className="bg-[#1C2452] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          
          {renderContent()}
        </div>

      
      </main>

      {/* Footer Legal */}
      <footer className="mt-16 text-white/30 text-[11px] font-medium tracking-wide">
        © 2024 CYBEXEL TECHNOLOGIES PRIVATE LIMITED. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default AuthenticationLayout;