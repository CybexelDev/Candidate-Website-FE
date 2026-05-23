import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  AlertCircle,
  Camera,
  Heart
} from 'lucide-react';
import SuccessModal from '../../Layouts/SuccessModal/SuccessModal';
import axios from "axios";

import { useParams } from
"react-router-dom";

import { toast } from "sonner";
const CYBEXEL_THEME = {
  bg: 'bg-[#0B1240]',
  card: 'bg-[#1C2452]',
  input: 'bg-[#2A3260]',
  border: 'border-white/20',
  primary: 'bg-[#2563EB]',
  textMuted: 'text-white/70'
};

const SubmitLayout = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] =
  useState({});
  const { token } = useParams();

const [formData, setFormData] =
useState({

  fullName: "",

  mobileNumber: "",

  email: "",

  positionApplied: "",

  emergencyContactName: "",

  emergencyContactNumber: "",

  relationshipWithEmergency: "",

});
const handleInputChange = (e) => {

  setFormData({

    ...formData,

    [e.target.name]:
      e.target.value,

  });
};

  // Mandatory documents list
  const docTypes = [
    { id: 'sslc', label: 'SSLC Certificate', required: true },
    { id: 'hsc', label: 'Higher Secondary Certificate', required: true },
    { id: 'degree', label: 'Degree / Diploma Certificate', required: true },
    { id: 'aadhaar', label: 'Aadhaar Card', required: true },
    { id: 'photo', label: 'Passport Size Photo', required: true, icon: <Camera size={18} /> },
    { id: 'resume', label: 'Resume / CV', required: true },
    { id: 'pan', label: 'PAN Card', required: false },
  ];

  const requiredDocs =
  docTypes.filter(doc => doc.required);

const uploadedRequiredDocs =
  requiredDocs.filter(
    doc => files[doc.id]
  ).length;
  const validateRequiredDocuments = () => {

  let newErrors = {};

  requiredDocs.forEach((doc) => {

    if (!files[doc.id]) {

      newErrors[doc.id] =
        `${doc.label} is required`;
    }
  });

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};


 const handleFileChange = (id, file) => {

  if (!file) return;
  alert(file.type);

  // FILE SIZE VALIDATION
  if (file.size > 5 * 1024 * 1024) {

    setErrors(prev => ({
      ...prev,
      [id]: 'File size exceeds 5MB'
    }));

    return;
  }

  // CLEAR ERRORS
  setErrors(prev => ({
    ...prev,
    [id]: null
  }));


  // START PROGRESS
  let progress = 0;

  const interval = setInterval(() => {

    progress += 10;

    setUploadProgress(prev => ({
      ...prev,
      [id]: progress
    }));


    // COMPLETE
    if (progress >= 100) {

      clearInterval(interval);

      const previewUrl =
  URL.createObjectURL(file);

setFiles(prev => ({
  ...prev,
  [id]: {
    file,
    previewUrl
  }
}));
    }

  }, 120);
};

const handleSubmit =
async (e) => {

  e.preventDefault();

  const isValid =
    validateRequiredDocuments();

  if (!isValid) return;

  try {

    setIsUploading(true);

    const submitData =
      new FormData();

    // TEXT DATA
    Object.keys(formData)
    .forEach((key) => {

      submitData.append(
        key,
        formData[key]
      );
    });

    // FILES
    if (files.sslc) {

      submitData.append(
        "sslcCertificate",
        files.sslc.file
      );
    }

    if (files.hsc) {

      submitData.append(
        "higherSecondaryCertificate",
        files.hsc.file
      );
    }

    if (files.degree) {

      submitData.append(
        "degreeCertificate",
        files.degree.file
      );
    }

    if (files.aadhaar) {

      submitData.append(
        "aadhaarCard",
        files.aadhaar.file
      );
    }

    if (files.photo) {

      submitData.append(
        "passportPhoto",
        files.photo.file
      );
    }

    if (files.resume) {

      submitData.append(
        "resume",
        files.resume.file
      );
    }

    if (files.pan) {

      submitData.append(
        "panCard",
        files.pan.file
      );
    }

    const response =
      await axios.post(

`https://candidate-website-be.onrender.com/api/user/submit-documents/${token}`,
        submitData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    toast.success(
      response.data.message
    );

    setIsSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  } catch (error) {

  console.log(error);

  console.log(
    error.response?.data
  );

  toast.error(

    error.response?.data?.message ||

    error.message ||

    "Submission failed"
  );
} finally {

    setIsUploading(false);
  }
};

if (isSubmitted) {
  return (
    <div
      className={`min-h-screen ${CYBEXEL_THEME.bg} flex items-center justify-center p-6 host-grotesk relative`}
    >

      {/* TOP CENTER LOGO */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2">

        <img
          src="/logo.png"
          alt="CYBEXEL Logo"
          className="w-[170px] object-contain"
        />

      </div>

      {/* SUCCESS CARD */}
      <div
        className={`${CYBEXEL_THEME.card} max-w-lg w-full rounded-3xl p-10 border ${CYBEXEL_THEME.border} text-center shadow-2xl animate-in fade-in zoom-in duration-500`}
      >

        {/* SUCCESS ICON */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">

          <CheckCircle2
            className="text-green-400 w-12 h-12"
          />

        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Submission Successful
        </h2>

        {/* DESCRIPTION */}
        <p className="text-white/70 leading-relaxed mb-8">
          Your onboarding documents have been securely uploaded
          to the CYBEXEL HR portal. Our hiring team will review
          your submission and contact you shortly.
        </p>

        {/* BUTTON */}
        <button
          onClick={() =>  window.location.href =
    "https://cybexel.com"}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all border border-white/10"
        >
          Close Portal
        </button>

      </div>

    </div>
  );
}
  return (
    <div className={`min-h-screen ${CYBEXEL_THEME.bg} text-white p-4 md:px-12 host-grotesk selection:bg-blue-500/30`}>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <div className="flex justify-center ">

  <img
    src="/logo.png"
    alt="CYBEXEL Logo"
    className="w-[150px] object-contain"
  />

</div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-3">Candidate Document Submission</h2>
        <p className={CYBEXEL_THEME.textMuted}>Please complete the form and upload all required documents securely.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        {/* Personal & Emergency Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section: Personal Details */}
          <section className={`bg-[#1C2452] p-8 rounded-3xl border ${CYBEXEL_THEME.border} shadow-xl`}>
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
              <User className="text-blue-400" size={20} />
              <h3 className="text-xl font-medium tracking-tight">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField   name="fullName"
 label="Full Name"   value={formData.fullName}
  onChange={handleInputChange} icon={<User size={16}/>} placeholder="John Doe" required />
              <InputField    name="mobileNumber"
   value={formData.mobileNumber}
  onChange={handleInputChange} label="Mobile Number" icon={<Phone size={16}/>} placeholder="+91 00000 00000" required />
              <InputField   value={formData.email}   name="email"

  onChange={handleInputChange} label="Email ID" icon={<Mail size={16}/>} placeholder="john@example.com" type="email" required />
              <InputField   name="positionApplied"
 value={formData.positionApplied}
  onChange={handleInputChange}
 label="Position Applied" icon={<Briefcase size={16}/>} placeholder="Software Engineer" required />
            </div>
          </section>

          {/* Section: Emergency Contacts */}
          <section className={`${CYBEXEL_THEME.card} p-8 rounded-3xl border ${CYBEXEL_THEME.border} shadow-xl`}>
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
              <Phone className="text-red-400" size={20} />
              <h3 className="text-xl font-medium tracking-tight">Emergency Contact Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField   name="emergencyContactName"
  value={formData.emergencyContactName}
  onChange={handleInputChange}  label="Contact Name" placeholder="Guardian Name" required />
              <InputField   name="emergencyContactNumber"
  value={formData.emergencyContactNumber}
  onChange={handleInputChange} label="Contact Number" placeholder="+91 00000 00000" required />
              <div className="md:col-span-2">
                <InputField  
                  name="relationshipWithEmergency"
                value={formData.relationshipWithEmergency}
  onChange={handleInputChange}  label="Relationship" placeholder="e.g. Father, Spouse" required />
              </div>
            </div>
          </section>
        </div>

        {/* Section: Document Uploads */}
        <section className={`${CYBEXEL_THEME.card} p-8 rounded-3xl border ${CYBEXEL_THEME.border} shadow-xl`}>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <FileText className="text-blue-400" size={20} />
            <h3 className="text-xl font-medium tracking-tight">Document Upload Section</h3>
            <div className="mt-4">

  <div className="flex items-center justify-between mb-2 gap-2">

    <span className="text-sm text-white/60">
      Upload Progress
    </span>

    <span className="text-sm font-semibold text-blue-400">
      {uploadedRequiredDocs} / {requiredDocs.length}
    </span>

  </div>

  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">

    <div
      className="bg-blue-500 h-full rounded-full transition-all duration-500"
      style={{
        width: `${
          (uploadedRequiredDocs /
          requiredDocs.length) * 100
        }%`
      }}
    />

  </div>

</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docTypes.map((doc) => (
              <div key={doc.id} className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                    {doc.label}
                    {doc.required && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 uppercase tracking-tighter font-bold">Required</span>}
                    {!doc.required && <span className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-tighter">Optional</span>}
                  </label>
                </div>
                
                <div className={`relative group transition-all duration-300 ${files[doc.id] ? 'border-blue-500/50 bg-blue-500/5' : 'border-dashed border-white/10 hover:border-blue-500/30' } border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 min-h-[120px]`}>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                {files[doc.id] ? (

  <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-2">

    {/* IMAGE PREVIEW */}
    {
      files[doc.id]?.file?.type?.startsWith("image/")
      ? (
        <img
src={files[doc.id].previewUrl}
          alt="preview"
          className="w-20 h-20 rounded-xl object-cover border border-white/10 mb-3"
        />
      )
      : (
        <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">

          <FileText
            className="text-blue-400"
            size={32}
          />

        </div>
      )
    }

    {/* FILE NAME */}
    <span className="text-xs font-medium text-blue-200 truncate max-w-[170px]">
{files[doc.id].file.name}    </span>

    {/* VIEW FILE BUTTON */}
    <button
      type="button"
      onClick={() =>
       window.open(
  files[doc.id].previewUrl,
  "_blank"
)
      }
      className="mt-3 text-[11px] text-blue-400 hover:text-blue-300 transition z-10"
    >
      View File
    </button>

    {/* PROGRESS */}
    <div className="w-full bg-white/10 rounded-full h-2 mt-4 overflow-hidden">

      <div
        className="bg-blue-500 h-full rounded-full transition-all duration-300"
        style={{
          width: `${uploadProgress[doc.id] || 100}%`
        }}
      />

    </div>

    <span className="text-[10px] text-white/40 mt-2">
      Uploaded Successfully
    </span>

    {/* REMOVE */}
    <button
      onClick={(e) => {

        e.preventDefault();

        setFiles(prev => ({
          ...prev,
          [doc.id]: null
        }));

        setUploadProgress(prev => ({
          ...prev,
          [doc.id]: 0
        }));
      }}

      className="mt-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors z-10"
    >
      Remove
    </button>

  </div>

) :  uploadProgress[doc.id] > 0 ? (

  <div className="w-full flex flex-col items-center">

    <div className="w-full flex items-center justify-between mb-3">

      <span className="text-xs text-blue-200 truncate">
        Uploading...
      </span>

      <span className="text-xs text-blue-400 font-semibold">
        {uploadProgress[doc.id]}%
      </span>

    </div>

    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">

      <div
        className="bg-blue-500 h-full rounded-full transition-all duration-300"
        style={{
          width: `${uploadProgress[doc.id]}%`
        }}
      />

    </div>

  </div>

) : (
                    <>
                      <div className="p-3 rounded-full bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                        {doc.icon || <Upload className="text-white/40 group-hover:text-blue-400" size={20} />}
                      </div>
                      <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors text-center">
                        PDF, JPG, PNG (Max 5MB)
                      </span>
                    </>
                  )}
                </div>
                {errors[doc.id] && <p className="text-red-400 text-[11px] flex items-center gap-1"><AlertCircle size={12}/> {errors[doc.id]}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-8 pt-4">
       

          <button 
            type="submit"
            disabled={isUploading}
            className={`w-full max-w-md py-5 ${CYBEXEL_THEME.primary} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-lg tracking-wide shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3`}
          >
            {isUploading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin host-grotesk" /> Processing...</>
            ) : (
              <><ShieldCheck size={20} /> Submit Documents </>
            )}
          </button>
          
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold">
            © 2026 CYBEXEL TECHNOLOGIES PRIVATE LIMITED
          </p>
        </div>
      </form>
    </div>
  );
};

// Reusable Input Sub-component
const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white/80 ml-1">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors">{icon}</div>}
      <input 
        className={`w-full ${CYBEXEL_THEME.input} border border-white/5 rounded-xl py-3.5 ${icon ? 'pl-11' : 'px-5'} pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-white/20`}
        {...props}
      />
    </div>
  </div>
);

export default SubmitLayout;