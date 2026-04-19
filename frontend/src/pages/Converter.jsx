import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, Download, Trash2, FileUp,
  Loader, AlertCircle, FileType, CheckCircle2, ListRestart,
  Settings2, ArrowRight, Image as ImageIcon, Table, Presentation,
  Code, Database, FileCode
} from 'lucide-react';
import axios from 'axios';

const STEPS = [
  { id: 1, name: 'Select Format', icon: Settings2 },
  { id: 2, name: 'Upload Files',  icon: UploadCloud },
  { id: 3, name: 'Converting',   icon: Loader },
  { id: 4, name: 'Result',        icon: Download }
];

const FORMAT_GROUPS = [
  {
    label: 'Images',
    color: 'blue',
    options: [
      { id: 'jpg',  name: 'JPG',  desc: 'Compressed photo format',          icon: ImageIcon },
      { id: 'jpeg', name: 'JPEG', desc: 'Standard joint photo expert format', icon: ImageIcon },
      { id: 'png',  name: 'PNG',  desc: 'Lossless, supports transparency',   icon: ImageIcon },
      { id: 'webp', name: 'WEBP', desc: 'Modern web-optimized image format', icon: ImageIcon },
      { id: 'zip',  name: 'ZIP (PDF pages)', desc: 'Extract all PDF pages as images', icon: ListRestart },
    ]
  },
  {
    label: 'Documents',
    color: 'violet',
    options: [
      { id: 'pdf',  name: 'PDF',  desc: 'Universal document format',         icon: FileText },
      { id: 'docx', name: 'DOCX', desc: 'Microsoft Word document',           icon: FileText },
      { id: 'pptx', name: 'PPTX', desc: 'Microsoft PowerPoint slides',       icon: Presentation },
      { id: 'txt',  name: 'TXT',  desc: 'Plain text file',                   icon: FileType },
      { id: 'html', name: 'HTML', desc: 'Styled web page file',              icon: FileCode },
    ]
  },
  {
    label: 'Data',
    color: 'emerald',
    options: [
      { id: 'xlsx', name: 'XLSX', desc: 'Microsoft Excel spreadsheet',       icon: Table },
      { id: 'csv',  name: 'CSV',  desc: 'Comma-separated values (raw data)', icon: Database },
    ]
  }
];

const ALL_FORMATS = FORMAT_GROUPS.flatMap(g => g.options);

const GROUP_COLORS = {
  blue:   { ring: 'border-blue-600 bg-blue-50/50 shadow-blue-500/10', icon: 'bg-blue-600 text-white', label: 'bg-blue-100 text-blue-700', btn: 'bg-blue-600 hover:bg-blue-500' },
  violet: { ring: 'border-violet-600 bg-violet-50/50 shadow-violet-500/10', icon: 'bg-violet-600 text-white', label: 'bg-violet-100 text-violet-700', btn: 'bg-violet-600 hover:bg-violet-500' },
  emerald:{ ring: 'border-emerald-600 bg-emerald-50/50 shadow-emerald-500/10', icon: 'bg-emerald-600 text-white', label: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-500' },
};

export default function Converter() {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const fileInputRef = useRef(null);

  const selectedInfo = ALL_FORMATS.find(f => f.id === targetFormat) || ALL_FORMATS[0];
  const selectedGroup = FORMAT_GROUPS.find(g => g.options.some(o => o.id === targetFormat));
  const colors = GROUP_COLORS[selectedGroup?.color || 'blue'];

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 0) {
      const mapped = selected.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size > 1048576
          ? (file.size / 1048576).toFixed(1) + ' MB'
          : (file.size / 1024).toFixed(1) + ' KB',
        ext: file.name.split('.').pop().toLowerCase()
      }));
      setFiles(prev => [...prev, ...mapped]);
      setError(null);
    }
  };

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please upload at least one file.');
      return;
    }
    setLoading(true);
    setError(null);
    setCurrentStep(3);

    const formData = new FormData();
    files.forEach(f => formData.append('files', f.file));
    formData.append('target_format', targetFormat);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    try {
      const response = await axios.post(`${API_BASE}/api/convert`, formData, {
        responseType: 'blob',
      });
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      setResultUrl(URL.createObjectURL(fileBlob));
      setCurrentStep(4);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Conversion failed. Check your files and format combination.';
      setError(msg);
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `tools_hub_result.${targetFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFiles([]);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setCurrentStep(1);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-6 py-12 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-black mb-3 tracking-tighter text-slate-900">File Converter</h1>
        <p className="text-slate-500 font-medium">11 Formats · Multi-file · Instant Download</p>
      </div>

      {/* Step Indicator */}
      <div className="w-full flex justify-between mb-14 relative">
        <div className="absolute top-[26px] left-0 w-full h-1 bg-slate-100 z-0 rounded-full" />
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-4 ${
                isActive ? 'bg-blue-600 border-blue-100 text-white shadow-xl scale-110' :
                isDone   ? 'bg-emerald-500 border-emerald-50 text-white' :
                           'bg-white border-slate-100 text-slate-300'
              }`}>
                {isDone ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="w-full glass-card p-10 bg-white/90 border-slate-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]">
        <AnimatePresence mode="wait">

          {/* STEP 1 — FORMAT PICKER */}
          {currentStep === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h3 className="text-xl font-black text-center text-slate-900 mb-8">Choose Output Format</h3>

              <div className="flex flex-col gap-8">
                {FORMAT_GROUPS.map(group => {
                  const gc = GROUP_COLORS[group.color];
                  return (
                    <div key={group.label}>
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 ${gc.label}`}>
                        {group.label}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {group.options.map(opt => {
                          const isSelected = targetFormat === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setTargetFormat(opt.id)}
                              className={`p-4 rounded-[24px] border-2 text-left transition-all ${
                                isSelected ? `${gc.ring} border shadow-lg` : 'border-slate-100 bg-white hover:border-slate-200'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isSelected ? gc.icon : 'bg-slate-100 text-slate-400'}`}>
                                <opt.icon size={20} />
                              </div>
                              <p className="font-black text-slate-900 text-sm">{opt.name}</p>
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{opt.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className={`mt-10 w-full py-5 text-white rounded-3xl font-black shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] ${colors.btn} shadow-blue-500/20`}
              >
                Continue — Convert to {selectedInfo.name} <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {/* STEP 2 — UPLOAD */}
          {currentStep === 2 && (
            <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Upload Your Files</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Output: <span className="font-black text-slate-700">{selectedInfo.name}</span></p>
                </div>
                <button onClick={() => setCurrentStep(1)} className="text-xs font-black uppercase tracking-widest text-blue-600 hover:underline">
                  ← Change Format
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files } }); }}
                onClick={() => fileInputRef.current.click()}
                className="w-full min-h-[220px] border-4 border-dashed border-slate-100 rounded-[36px] flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group"
              >
                <UploadCloud size={52} className="mb-3 text-slate-200 group-hover:text-blue-500 transition-colors" />
                <p className="text-xl font-black text-slate-900">Drop Files Here</p>
                <p className="text-sm font-medium text-slate-400 mt-1">or click to browse · Multi-file supported</p>
                <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>

              {/* File Queue */}
              {files.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{files.length} file{files.length > 1 ? 's' : ''} queued</span>
                    <button onClick={() => setFiles([])} className="text-xs font-bold text-red-400 hover:text-red-600">Clear All</button>
                  </div>

                  <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1">
                    {files.map(f => (
                      <div key={f.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm text-xs font-black text-blue-500 uppercase">
                            {f.ext}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[260px]">{f.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{f.size}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFile(f.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 border border-red-100 mt-2">
                      <AlertCircle size={18} />
                      <p className="text-sm font-bold">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleConvert}
                    className={`mt-4 w-full py-5 text-white rounded-3xl font-black shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] ${colors.btn}`}
                  >
                    Convert to {selectedInfo.name} <FileUp size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3 — PROCESSING */}
          {currentStep === 3 && (
            <motion.div key="s3" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="relative">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                  <Loader size={80} className="text-blue-600" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black uppercase text-blue-300">{selectedInfo.name}</span>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">Converting…</p>
              <p className="text-slate-400 font-medium">Building your {selectedInfo.name} file right now.</p>
            </motion.div>
          )}

          {/* STEP 4 — RESULT */}
          {currentStep === 4 && (
            <motion.div key="s4" initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} className="flex flex-col items-center text-center py-6">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[32px] flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">Done!</h3>
              <p className="text-slate-500 font-medium mb-8">
                Your <span className="font-black text-slate-900">{selectedInfo.name}</span> file is ready to download.
              </p>

              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={handleDownload}
                  className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 hover:bg-emerald-500 hover:-translate-y-1 transition-all"
                >
                  <Download size={22} /> Download {selectedInfo.name}
                </button>
                <button onClick={reset} className="w-full py-4 bg-slate-100 text-slate-600 rounded-3xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                  <ListRestart size={18} /> Convert Another
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
