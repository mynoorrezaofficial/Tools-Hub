import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Download, CheckCircle, ExternalLink, Settings, Layout, Sparkles, Clock, Cloud, Search } from 'lucide-react';

const ThemeExtension = () => {
  const steps = [
    {
      title: "Download Extension",
      desc: "Click the button below to download the theme-extension.zip file.",
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

  const features = [
    { icon: Palette, title: "Dynamic Themes", desc: "Adaptive glass UI that matches your accent color." },
    { icon: Clock, title: "Advanced Clocks", desc: "Minimalist analog and bold digital clocks." },
    { icon: Search, title: "Voice Search", desc: "Hands-free searching with integrated Web Speech API." },
    { icon: Cloud, title: "Weather Widgets", desc: "Real-time updates directly on your new tab." }
  ];

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 md:text-center md:mb-16">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-purple-100 text-purple-600 rounded-3xl mb-6 shadow-xl shadow-purple-500/10"
        >
          <Palette size={32} className="md:w-10 md:h-10" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-6">ToolsHub <span className="text-purple-600">Theme Extension</span></h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          Elevate your browser with a premium, glassmorphism New Tab experience. Features dynamic themes, productivity widgets, and sleek animations.
        </p>
      </div>

      {/* Main Action */}
      <div className="glass-card p-6 md:p-10 mb-16 md:mb-20 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Elevate your workspace</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm md:text-base">Download the ToolsHub Aesthetic New Tab extension for Chrome and Edge.</p>
          <a 
            href="/theme-extension.zip" 
            download 
            className="inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-3xl font-bold text-base md:text-lg shadow-2xl shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Download size={20} className="md:w-6 md:h-6" /> Download Extension (v1.0)
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
        {features.map((f, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-sm">
            <f.icon size={24} className="text-purple-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Visual Preview */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
            <Sparkles size={24} className="text-purple-600" /> Visual Preview
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">Get a glimpse of the premium glassmorphism interface and interactive widgets you'll get with the extension.</p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group rounded-[32px] md:rounded-[48px] overflow-hidden border-8 border-white/60 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] bg-slate-100"
        >
          <img 
            src="/extension-preview.png" 
            alt="Theme Extension Preview" 
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Installation Guide */}
      <div>
        <h2 className="text-3xl font-black mb-12 flex items-center gap-3">
          How to Install <span className="text-slate-400 text-lg font-medium px-3 py-1 bg-slate-100 rounded-lg">4 Easy Steps</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 rounded-3xl border border-slate-100 bg-white/50 hover:border-purple-100 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-lg md:text-xl">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
                  <step.icon size={18} className="text-purple-600 md:w-5 md:h-5" />
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">{step.desc}</p>
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

export default ThemeExtension;
