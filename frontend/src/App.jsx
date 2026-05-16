import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { Scissors, FileText, ChevronRight, Upload, Settings, Download, Zap, Sparkles, PlayCircle, Shield, Palette, Menu, X } from "lucide-react";
import BgRemove from "./pages/BgRemove";
import Converter from "./pages/Converter";
import MediaDownloader from "./pages/MediaDownloader";
import AdBlocker from "./pages/AdBlocker";
import CVMaker from "./pages/CVMaker";
import ThemeExtension from "./pages/ThemeExtension";
import HeroCard3D from "./components/HeroCard3D";

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
          <h1 className="text-4xl md:text-8xl font-black tracking-tight mb-6 md:mb-8 leading-[1.05] text-slate-900 px-2">
            All-in-One <br />
            <span className="text-gradient">Tool Hub</span> <br />
            for Students
          </h1>
          <p className="text-base md:text-2xl text-slate-500 mb-10 md:mb-12 max-w-xl leading-relaxed px-4 mx-auto lg:mx-0">
            Convert files, remove backgrounds, and more. The essential productivity toolkit designed specifically for modern student workflows.
          </p>
          <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
            <a href="#tools" onClick={() => { document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 md:px-10 md:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-bold shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              Explore All Tools <ChevronRight size={20} />
            </a>
          </div>
        </motion.div>

        {/* ── 3D Glassmorphism Hero Cards ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex-1 relative hidden lg:flex items-center justify-center"
          style={{ minHeight: '520px' }}
        >
          {/* Colorful blobs — glass needs a vivid background to look like glass */}
          <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
            <div style={{ position:'absolute', top:'15%', left:'25%', width:'320px', height:'320px', borderRadius:'50%', background:'linear-gradient(135deg, rgba(139,92,246,0.38), rgba(59,130,246,0.28))', filter:'blur(80px)' }} />
            <div style={{ position:'absolute', top:'45%', left:'5%',  width:'200px', height:'200px', borderRadius:'50%', background:'linear-gradient(135deg, rgba(236,72,153,0.22), rgba(139,92,246,0.22))', filter:'blur(60px)' }} />
            <div style={{ position:'absolute', bottom:'8%', right:'8%', width:'240px', height:'240px', borderRadius:'50%', background:'linear-gradient(135deg, rgba(59,130,246,0.26), rgba(16,185,129,0.22))', filter:'blur(70px)' }} />
            <div style={{ position:'absolute', top:'5%',  right:'15%', width:'160px', height:'160px', borderRadius:'50%', background:'linear-gradient(135deg, rgba(249,115,22,0.2),  rgba(236,72,153,0.18))', filter:'blur(50px)' }} />
          </div>

          {/* Platform shadow glow */}
          <div style={{ position:'absolute', bottom:'12%', left:'50%', transform:'translateX(-50%)', width:'65%', height:'28px', borderRadius:'50%', background:'rgba(139,92,246,0.22)', filter:'blur(18px)', pointerEvents:'none' }} />

          {/* Card: Background Remover — top center-right */}
          <motion.div animate={{ y:[0,-12,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:0 }}
            style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-15%)', zIndex:20 }}>
            <HeroCard3D icon={Scissors} title="Background Remover" description="Remove background in one click with AI"
              width={205} iconGradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" glowColor="rgba(59,130,246,0.5)" shadowColor="rgba(59,130,246,0.22)" />
          </motion.div>

          {/* Card: File Converter — middle left (staggered higher than first) */}
          <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut', delay:0.8 }}
            style={{ position:'absolute', top:'45%', left:0, transform:'translateY(-55%)', zIndex:20, marginTop: '-20px' }}>
            <HeroCard3D icon={FileText} title="File Converter" description="Convert documents and images instantly"
              width={188} iconGradient="linear-gradient(135deg,#8b5cf6,#6d28d9)" glowColor="rgba(139,92,246,0.5)" shadowColor="rgba(139,92,246,0.22)" />
          </motion.div>

          {/* Card: Media Downloader — center (most prominent) */}
          <motion.div animate={{ y:[0,-16,0] }} transition={{ duration:5.5, repeat:Infinity, ease:'easeInOut', delay:0.4 }}
            style={{ position:'absolute', top:'55%', left:'50%', transform:'translate(-50%,-50%)', zIndex:30 }}>
            <HeroCard3D icon={Zap} title="Media Downloader" description="Download videos and audio in high quality"
              width={215} iconGradient="linear-gradient(135deg,#10b981,#059669)" glowColor="rgba(16,185,129,0.5)" shadowColor="rgba(16,185,129,0.25)" />
          </motion.div>

          {/* Card: CV Maker — right */}
          <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:6.5, repeat:Infinity, ease:'easeInOut', delay:1.2 }}
            style={{ position:'absolute', top:'35%', right:0, transform:'translateY(-50%)', zIndex:20 }}>
            <HeroCard3D icon={Sparkles} title="CV Maker" description="Create professional resumes in minutes"
              width={178} iconGradient="linear-gradient(135deg,#f97316,#ea580c)" glowColor="rgba(249,115,22,0.5)" shadowColor="rgba(249,115,22,0.22)" />
          </motion.div>

          {/* Decorative floating geometry */}
          <motion.div animate={{ scale:[1,1.2,1], rotate:[0,180,360] }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}
            style={{ position:'absolute', top:'10%', left:'22%', width:'28px', height:'28px', borderRadius:'8px', background:'linear-gradient(135deg,rgba(139,92,246,0.55),rgba(59,130,246,0.55))', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.45)', boxShadow:'0 4px 14px rgba(139,92,246,0.3)', zIndex:10 }} />
          <motion.div animate={{ scale:[1,1.35,1] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut', delay:1 }}
            style={{ position:'absolute', bottom:'26%', left:'18%', width:'16px', height:'16px', borderRadius:'50%', background:'rgba(236,72,153,0.55)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.4)', zIndex:10 }} />
          <motion.div animate={{ y:[0,-9,0] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut', delay:0.6 }}
            style={{ position:'absolute', bottom:'18%', right:'16%', width:'20px', height:'20px', borderRadius:'50%', background:'rgba(99,102,241,0.55)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.4)', zIndex:10 }} />
          <motion.div animate={{ rotate:[0,-360] }} transition={{ duration:12, repeat:Infinity, ease:'linear' }}
            style={{ position:'absolute', top:'60%', right:'12%', width:'14px', height:'14px', borderRadius:'3px', background:'rgba(16,185,129,0.5)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.4)', zIndex:10 }} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="tools" className="py-20 md:py-32 w-full bg-white/50 backdrop-blur-3xl scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">Powerful Tools</h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">Everything you need to handle your academic files in one clean, lightning-fast platform.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
            {/* Feature 1 */}
            <Link to="/bg-remove" className="group glass-card p-4 md:p-10 hover:shadow-blue-500/10 hover:border-blue-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-blue-600 mb-4 md:mb-8 group-hover:rotate-6 transition-transform">
                <Scissors size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Background Remover</h3>
              <p className="text-xs md:text-base text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-none">Instantly strip backgrounds from photos. Perfect for professional profile pictures and slide decks.</p>
              <div className="mt-4 md:mt-8 flex items-center text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 2 */}
            <Link to="/converter" className="group glass-card p-4 md:p-10 hover:shadow-purple-500/10 hover:border-purple-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-purple-600 mb-4 md:mb-8 group-hover:rotate-6 transition-transform">
                <FileText size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">File Converter</h3>
              <p className="text-xs md:text-base text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-none">Convert images to PDFs or strip PDFs into images. High-fidelity output for all your assignments.</p>
              <div className="mt-4 md:mt-8 flex items-center text-purple-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 3 */}
            <Link to="/media-downloader" className="group glass-card p-4 md:p-10 hover:shadow-red-500/10 hover:border-red-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-red-600 mb-4 md:mb-8 group-hover:rotate-6 transition-transform">
                <PlayCircle size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Media Downloader</h3>
              <p className="text-xs md:text-base text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-none">Extract and save high-quality MP4 videos and Audio easily. Supports YouTube, Twitter, TikTok, and more.</p>
              <div className="mt-4 md:mt-8 flex items-center text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 4 */}
            <Link to="/ad-blocker" className="group glass-card p-4 md:p-10 hover:shadow-green-500/10 hover:border-green-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-green-600 mb-4 md:mb-8 group-hover:rotate-6 transition-transform">
                <Shield size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Ad Blocker</h3>
              <p className="text-xs md:text-base text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-none">Clean your web browsing experience. Block malicious ads and trackers with our premium extension.</p>
              <div className="mt-4 md:mt-8 flex items-center text-green-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 5 */}
            <Link to="/cv-maker" className="group glass-card p-4 md:p-10 hover:shadow-orange-500/10 hover:border-orange-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-orange-600 mb-4 md:mb-8 group-hover:rotate-6 transition-transform">
                <FileText size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">CV Maker</h3>
              <p className="text-xs md:text-base text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-none">Build a professional, ATS-friendly resume in minutes. Export to PDF and Word with premium templates.</p>
              <div className="mt-4 md:mt-8 flex items-center text-orange-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>

            {/* Feature 6 */}
            <Link to="/theme-extension" className="group glass-card p-4 md:p-10 hover:shadow-purple-500/10 hover:border-purple-200">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-purple-600 mb-4 md:mb-8 group-hover:rotate-6 transition-transform">
                <Palette size={24} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Theme Extension</h3>
              <p className="text-xs md:text-base text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-none">Customize your Chrome new tab with a beautiful glassmorphism design and widgets.</p>
              <div className="mt-4 md:mt-8 flex items-center text-purple-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tool <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 w-full px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <div className="text-blue-600 font-black text-sm uppercase tracking-widest mb-4">The Process</div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-16 relative">
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/#tools' },
  ];

  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    if (path === '/#tools') {
      if (location.pathname === "/") {
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Glow Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/30 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all">
        <nav className="flex items-center justify-between px-6 md:px-10 py-4 md:py-5 w-full">
          {/* Left Edge */}
          <div className="flex items-center gap-12">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 group">
              <img src="/logo.svg" alt="ToolsHub Icon" className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-slate-900 ml-1">ToolsHub<span className="text-blue-600">.</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8 font-semibold text-slate-500 text-[15px]">
              {navLinks.map(link => (
                <button 
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Edge */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <button className="text-[15px] font-semibold text-slate-500 hover:text-slate-900 transition-colors">Log in</button>
              <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[20px] text-[15px] font-bold transition-colors">Sign up</button>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4 font-bold text-slate-600">
                {navLinks.map(link => (
                  <button 
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all text-left"
                  >
                    {link.name}
                    <ChevronRight size={18} />
                  </button>
                ))}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button className="py-4 bg-slate-100 rounded-2xl text-slate-700">Log in</button>
                  <button className="py-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">Sign up</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-24 md:pt-40 max-w-7xl mx-auto relative z-10">
        {children}
      </main>

      {/* Footer Section */}
      <footer className="w-full pt-20 pb-12 md:pt-32 md:pb-16 bg-slate-900 text-white relative z-10 mt-20 rounded-t-[40px] md:rounded-t-[80px]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-12">
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
          <Route path="/theme-extension" element={<ThemeExtension />} />
          <Route path="/cv-maker" element={<CVMaker />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
