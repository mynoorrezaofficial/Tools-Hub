import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, CheckCircle, ExternalLink, Settings, Layout } from 'lucide-react';

const AdBlocker = () => {
  const steps = [
    {
      title: "Download Extension",
      desc: "Click the button below to download the toolshub-adblocker.zip file.",
      icon: Download
    },
    {
      title: "Extract Content",
      desc: "Unzip the downloaded folder on your computer.",
      icon: Layout
    },
    {
      title: "Enable Developer Mode",
      desc: "Open chrome://extensions/ in your browser and toggle 'Developer mode' (top right).",
      icon: Settings
    },
    {
      title: "Load Extension",
      desc: "Click 'Load unpacked' and select the extracted folder.",
      icon: CheckCircle
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl mb-6 shadow-xl shadow-blue-500/10"
        >
          <Shield size={40} />
        </motion.div>
        <h1 className="text-5xl font-black mb-6">ToolsHub <span className="text-blue-600">AdBlocker</span></h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Experience a faster, cleaner, and safer web. Block annoying ads, popups, and trackers with our premium browser extension.
        </p>
      </div>

      {/* Main Action */}
      <div className="glass-card p-10 mb-20 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none" />
        <h2 className="text-3xl font-bold mb-4">Ready to block ads?</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Download the latest version of ToolsHub AdBlocker for Chrome and Edge.</p>
        <a 
          href="/toolshub-adblocker.zip" 
          download 
          className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <Download size={24} /> Download Extension (v1.0)
        </a>
      </div>

      {/* Installation Guide */}
      <div>
        <h2 className="text-3xl font-black mb-12 flex items-center gap-3">
          How to Install <span className="text-slate-400 text-lg font-medium px-3 py-1 bg-slate-100 rounded-lg">4 Easy Steps</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-6 p-6 rounded-3xl border border-slate-100 bg-white/50 hover:border-blue-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-xl">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <step.icon size={20} className="text-blue-600" />
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div className="mt-16 p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
          <ExternalLink size={20} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Developer Mode Required</h4>
          <p className="text-amber-800 text-sm opacity-80">
            As this is a premium tool distributed outside the Chrome Web Store, you must enable "Developer Mode" in your extensions settings to load the unpacked project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdBlocker;
