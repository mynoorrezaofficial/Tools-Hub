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
import { Scissors, FileText, ChevronRight, Upload, Settings, Download, Shield, Palette, Menu, X, Search, PlayCircle } from "lucide-react";
import BgRemove from "./pages/BgRemove";
import Converter from "./pages/Converter";
import MediaDownloader from "./pages/MediaDownloader";
import AdBlocker from "./pages/AdBlocker";
import CVMaker from "./pages/CVMaker";
import ThemeExtension from "./pages/ThemeExtension";
import MetadataReader from "./pages/MetadataReader";

function Home() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* 3D Space — Tools floating in space */}
      <section id="tools" className="relative py-16 md:py-28 w-full min-h-screen">
        {/* Floating decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[8%] w-48 h-48 rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/30 blur-[80px]" />
          <div className="absolute top-[60%] right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/20 blur-[100px]" />
          <div className="absolute bottom-[15%] left-[30%] w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200/30 to-blue-200/20 blur-[70px]" />
          <div className="absolute top-[30%] right-[25%] w-32 h-32 rounded-full bg-gradient-to-br from-green-200/25 to-teal-200/20 blur-[60px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Floating geometry decorations */}
          <div className="absolute top-12 left-[10%] w-3 h-3 rounded-full bg-blue-400/50 animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-24 right-[15%] w-2 h-2 rounded-full bg-purple-400/50 animate-[float_5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute bottom-32 left-[20%] w-4 h-4 rounded-sm bg-indigo-400/40 rotate-45 animate-[float_6s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[50%] right-[8%] w-2.5 h-2.5 rounded-full bg-pink-400/40 animate-[float_3.5s_ease-in-out_infinite_0.3s]" />
          <div className="absolute top-[70%] left-[5%] w-3 h-3 rounded-full bg-green-400/40 animate-[float_4.5s_ease-in-out_infinite_0.8s]" />
          <div className="absolute top-[15%] left-[45%] w-2 h-2 rounded-full bg-blue-300/50 animate-[float_5.5s_ease-in-out_infinite_1.2s]" />
          <div className="absolute bottom-[20%] right-[30%] w-3.5 h-3.5 rounded-sm bg-purple-300/40 rotate-12 animate-[float_4s_ease-in-out_infinite_0.6s]" />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10" style={{ perspective: '1200px' }}>
            {[
              { to: '/bg-remove', icon: Scissors, color: 'blue', title: 'Background Remover', desc: 'Instantly strip backgrounds from photos.', gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20', border: 'hover:border-blue-200', delay: '0s' },
              { to: '/converter', icon: FileText, color: 'purple', title: 'File Converter', desc: 'Convert images to PDFs or strip PDFs into images.', gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20', border: 'hover:border-purple-200', delay: '0.3s' },
              { to: '/media-downloader', icon: PlayCircle, color: 'red', title: 'Media Downloader', desc: 'Extract and save high-quality MP4 and Audio.', gradient: 'from-red-500 to-red-600', shadow: 'shadow-red-500/20', border: 'hover:border-red-200', delay: '0.6s' },
              { to: '/ad-blocker', icon: Shield, color: 'green', title: 'Ad Blocker', desc: 'Block malicious ads and trackers.', gradient: 'from-green-500 to-green-600', shadow: 'shadow-green-500/20', border: 'hover:border-green-200', delay: '0.9s' },
              { to: '/cv-maker', icon: FileText, color: 'orange', title: 'CV Maker', desc: 'Build a professional, ATS-friendly resume.', gradient: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/20', border: 'hover:border-orange-200', delay: '1.2s' },
              { to: '/theme-extension', icon: Palette, color: 'purple', title: 'Theme Extension', desc: 'Customize Chrome with glassmorphism design.', gradient: 'from-violet-500 to-violet-600', shadow: 'shadow-violet-500/20', border: 'hover:border-violet-200', delay: '1.5s' },
              { to: '/metadata-reader', icon: Search, color: 'indigo', title: 'Metadata', desc: 'Extract, replace, or delete metadata from files.', gradient: 'from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-500/20', border: 'hover:border-indigo-200', delay: '1.8s' },
            ].map((tool, i) => (
              <motion.div
                key={tool.to}
                initial={{ opacity: 0, y: 40, rotateX: 15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                style={{ transformStyle: 'preserve-3d', animationDelay: tool.delay }}
                className="group"
              >
                <Link
                  to={tool.to}
                  className="glass-card block p-5 md:p-8 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 hover:rotate-x-2"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-lg ${tool.shadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <tool.icon size={22} />
                  </div>
                  <h3 className="text-base md:text-xl font-bold mb-2 text-slate-900">{tool.title}</h3>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-2">{tool.desc}</p>
                  <div className="mt-4 md:mt-6 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore Tool <ChevronRight size={16} className="ml-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
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
          <Route path="/metadata-reader" element={<MetadataReader />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
