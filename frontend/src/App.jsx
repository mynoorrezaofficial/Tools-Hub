import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { Scissors, FileText, ChevronRight, Upload, Settings, Download, Zap, Sparkles, PlayCircle, Shield } from "lucide-react";
import BgRemove from "./pages/BgRemove";
import Converter from "./pages/Converter";
import MediaDownloader from "./pages/MediaDownloader";
import AdBlocker from "./pages/AdBlocker";
import CVMaker from "./pages/CVMaker";

function Home() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between text-center lg:text-left px-6 w-full max-w-7xl mx-auto gap-16 py-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100 shadow-sm"
          >
            <Sparkles size={14} /> The All-in-One Student Toolkit
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05] text-slate-900">
            All-in-One <br />
            <span className="text-gradient">Tool Hub</span> <br />
            for Students
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-xl leading-relaxed">
            Convert files, remove backgrounds, and more. The essential productivity toolkit designed specifically for modern student workflows.
          </p>
          <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
            <a href="#tools" onClick={() => { document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-bold shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              Explore All Tools <ChevronRight size={20} />
            </a>
          </div>
        </motion.div>

        {/* 3D Floating Tool Cards */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex-1 relative hidden lg:flex items-center justify-center"
          style={{ minHeight: '480px' }}
        >
          {/* Glow Backdrop */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-200/40 via-purple-100/20 to-transparent blur-3xl rounded-full" />
          <div className="absolute w-72 h-72 bg-blue-300/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Card: Background Remover — top center */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            className="absolute top-0 left-1/2 -translate-x-1/4 bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-blue-200/40 rounded-3xl p-5 w-52 z-20"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-400/40 flex-shrink-0">
                <Scissors size={18} />
              </div>
              <span className="font-black text-slate-800 text-sm leading-tight">Background Remover</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Remove background in one click with AI</p>
            <div className="mt-3 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <ChevronRight size={14} className="text-slate-500" />
            </div>
          </motion.div>

          {/* Card: File Converter — middle left */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-purple-200/40 rounded-3xl p-5 w-48 z-20"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-purple-400/40 flex-shrink-0">
                <FileText size={18} />
              </div>
              <span className="font-black text-slate-800 text-sm leading-tight">File Converter</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Convert documents and images instantly</p>
            <div className="mt-3 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <ChevronRight size={14} className="text-slate-500" />
            </div>
          </motion.div>

          {/* Card: Media Downloader — center */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-slate-300/50 rounded-3xl p-5 w-52 z-30"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-400/40 flex-shrink-0">
                <Zap size={18} />
              </div>
              <span className="font-black text-slate-800 text-sm leading-tight">Media Downloader</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Download videos and audio in high quality</p>
            <div className="mt-3 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <ChevronRight size={14} className="text-slate-500" />
            </div>
          </motion.div>

          {/* Card: CV Maker — right */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute top-1/2 right-0 -translate-y-2/3 bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-orange-200/40 rounded-3xl p-5 w-44 z-20"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-400/40 flex-shrink-0">
                <Sparkles size={18} />
              </div>
              <span className="font-black text-slate-800 text-sm leading-tight">CV Maker</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Create professional resumes in minutes</p>
            <div className="mt-3 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <ChevronRight size={14} className="text-slate-500" />
            </div>
          </motion.div>

          {/* Floating Decorative Orbs */}
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-8 left-1/4 w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-300/60 to-purple-300/60 backdrop-blur-sm border border-white/50 shadow-lg z-10" />
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-16 left-1/3 w-5 h-5 rounded-full bg-purple-300/60 backdrop-blur-sm border border-white/50 shadow-md z-10" />
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-8 right-1/4 w-6 h-6 rounded-full bg-blue-200/80 backdrop-blur-sm border border-white/50 shadow-md z-10" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="tools" className="py-32 w-full bg-white/50 backdrop-blur-3xl scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Powerful Tools</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Everything you need to handle your academic files in one clean, lightning-fast platform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <Link to="/bg-remove" className="group glass-card p-10 hover:shadow-blue-500/10 hover:border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-8 group-hover:rotate-6 transition-transform">
                <Scissors size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Background Remover</h3>
              <p className="text-slate-500 leading-relaxed">Instantly strip backgrounds from photos. Perfect for professional profile pictures and slide decks.</p>
              <div className="mt-8 flex items-center text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 2 */}
            <Link to="/converter" className="group glass-card p-10 hover:shadow-purple-500/10 hover:border-purple-200">
              <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 mb-8 group-hover:rotate-6 transition-transform">
                <FileText size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">File Converter</h3>
              <p className="text-slate-500 leading-relaxed">Convert images to PDFs or strip PDFs into images. High-fidelity output for all your assignments.</p>
              <div className="mt-8 flex items-center text-purple-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 3 */}
            <Link to="/media-downloader" className="group glass-card p-10 hover:shadow-red-500/10 hover:border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mb-8 group-hover:rotate-6 transition-transform">
                <PlayCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Media Downloader</h3>
              <p className="text-slate-500 leading-relaxed">Extract and save high-quality MP4 videos and Audio easily. Supports YouTube, Twitter, TikTok, and more.</p>
              <div className="mt-8 flex items-center text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 4 */}
            <Link to="/ad-blocker" className="group glass-card p-10 hover:shadow-green-500/10 hover:border-green-200">
              <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 mb-8 group-hover:rotate-6 transition-transform">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ad Blocker</h3>
              <p className="text-slate-500 leading-relaxed">Clean your web browsing experience. Block malicious ads and trackers with our premium extension.</p>
              <div className="mt-8 flex items-center text-green-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 5 */}
            <Link to="/cv-maker" className="group glass-card p-10 hover:shadow-orange-500/10 hover:border-orange-200">
              <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mb-8 group-hover:rotate-6 transition-transform">
                <FileText size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">CV Maker</h3>
              <p className="text-slate-500 leading-relaxed">Build a professional, ATS-friendly resume in minutes. Export to PDF and Word with premium templates.</p>
              <div className="mt-8 flex items-center text-orange-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 w-full px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="text-blue-600 font-black text-sm uppercase tracking-widest mb-4">The Process</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-16 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-20 right-20 h-[2px] bg-slate-100 z-0" />

          {[
            { step: 1, icon: Upload, title: "Upload File", desc: "Select your image or document from your device.", color: "bg-blue-600" },
            { step: 2, icon: Settings, title: "Process", desc: "Our local AI engine handles the conversion instantly.", color: "bg-indigo-600" },
            { step: 3, icon: Download, title: "Download", desc: "Grab your high-quality result and get back to work.", color: "bg-purple-600" }
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 border-4 border-slate-50 shadow-2xl transition-all group-hover:scale-110">
                <item.icon size={36} className="text-slate-900 group-hover:text-blue-600 transition-colors" />
                <div className={`absolute -top-1 -right-1 w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg`}>
                  {item.step}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-[250px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Glow Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/30 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all">
        <nav className="flex items-center justify-between px-10 py-5 w-full">
          {/* Left Edge */}
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
              <img src="/logo.svg" alt="ToolsHub Icon" className="w-10 h-10 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-slate-900 ml-1">ToolsHub<span className="text-blue-600">.</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8 font-semibold text-slate-500 text-[15px]">
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-900 transition-colors">Home</Link>
              <button 
                onClick={() => {
                  if (location.pathname === "/") {
                    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }} 
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Tools
              </button>
            </div>
          </div>

          {/* Right Edge */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-[15px] font-semibold text-slate-500 hover:text-slate-900 transition-colors">Log in</button>
            <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[20px] text-[15px] font-bold transition-colors">Sign up</button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-40 max-w-7xl mx-auto relative z-10">
        {children}
      </main>

      {/* Footer Section */}
      <footer className="w-full pt-32 pb-16 bg-slate-900 text-white relative z-10 mt-20 rounded-t-[80px]">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-3 group">
              <img src="/logo.svg" alt="ToolsHub Icon" className="w-8 h-8 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500" />
              ToolsHub.
            </Link>
            <p className="text-slate-400 text-sm max-w-xs text-center md:text-left">The ultimate toolkit for high-performance students. 100% free and open source.</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6 text-sm">
            <div className="flex gap-8 font-bold text-slate-400">
              <a href="https://x.com/MynoorReza" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
              <a href="https://www.linkedin.com/in/mynoor-reza/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://github.com/mynoorrezaofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Github</a>
            </div>
            <p className="text-slate-500 font-medium">© 2026 Tools Hub by Mynoor Reza</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bg-remove" element={<BgRemove />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/media-downloader" element={<MediaDownloader />} />
          <Route path="/ad-blocker" element={<AdBlocker />} />
          <Route path="/cv-maker" element={<CVMaker />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
