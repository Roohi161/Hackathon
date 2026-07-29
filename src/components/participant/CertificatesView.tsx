import React, { useState } from 'react';
import { Award, Download, QrCode, ShieldCheck, X } from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<{
    id: string;
    title: string;
    type: string;
    issueDate: string;
    verifyCode: string;
  } | null>(null);

  const certs = [
    { id: 'c1', title: 'Global AI Innovators Hackathon 2026', type: 'Winner - 1st Place', issueDate: 'August 2026', verifyCode: 'HC-2026-89412' },
    { id: 'c2', title: 'Quantum FinTech Challenge', type: 'Participation Certificate', issueDate: 'July 2026', verifyCode: 'HC-2026-78193' },
    { id: 'c3', title: 'HealthTech AI Diagnostic Summit', type: 'Honorable Mention', issueDate: 'June 2026', verifyCode: 'HC-2026-61920' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 shadow-2xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Verified Certificates & Achievements</h2>
            <p className="text-xs font-semibold text-slate-500">Official cryptographic digital certificates with QR verification</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certs.map((cert) => (
          <div key={cert.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 w-fit border border-amber-100">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-700">
                {cert.type}
              </span>
              <h3 className="text-sm font-extrabold text-slate-900">{cert.title}</h3>
              <span className="text-[10px] font-bold text-slate-400 block">Issued: {cert.issueDate}</span>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedCert(cert)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all text-center"
              >
                View Certificate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CERTIFICATE PREVIEW MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600">
                <ShieldCheck className="w-4 h-4" /> Cryptographically Verified Certificate
              </div>
              <button onClick={() => setSelectedCert(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High Res Certificate View */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-4 border-amber-400/80 shadow-2xl text-center space-y-4 relative">
              <div className="flex justify-between items-center text-amber-400 font-extrabold text-xs">
                <span>HACKATHON CENTRAL</span>
                <span>OFFICIAL CREST</span>
              </div>

              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Certificate of Accomplishment</span>
              <h2 className="text-2xl font-black tracking-tight text-white">Roohi</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Has successfully demonstrated technical excellence in <strong className="text-amber-300">{selectedCert.title}</strong> as <strong className="text-emerald-400">{selectedCert.type}</strong>.
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-white/10 text-[10px] text-slate-400 font-mono">
                <span>Verification ID: {selectedCert.verifyCode}</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <QrCode className="w-4 h-4" /> QR Verified
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => alert(`Downloading High-Resolution PDF Certificate (${selectedCert.verifyCode}.pdf)...`)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:bg-indigo-700"
              >
                <Download className="w-4 h-4" /> Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
