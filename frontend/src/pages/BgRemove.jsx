import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Download, Scissors, AlertCircle, Loader, Sparkles, Palette, SlidersHorizontal, Undo, Eraser, Move, ZoomIn, ZoomOut, RotateCcw, PencilIcon } from 'lucide-react';
import axios from 'axios';

const COLOR_GROUPS = [
  { name: 'Transparent', icon: '✨', colors: ['transparent'] },
  { name: 'Blue Group', icon: '🔵', colors: ['#E3F2FD', '#90CAF9', '#2196F3', '#1565C0', '#0D47A1'] },
  { name: 'Red Group', icon: '🔴', colors: ['#FFEBEE', '#EF9A9A', '#F44336', '#C62828', '#B71C1C'] },
  { name: 'Green Group', icon: '🟢', colors: ['#E8F5E9', '#A5D6A7', '#4CAF50', '#2E7D32', '#1B5E20'] },
  { name: 'Gray Group', icon: '🔘', colors: ['#ffffff', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#616161', '#212121', '#000000'] },
  { name: 'Purple Group', icon: '🟣', colors: ['#F3E5F5', '#CE93D8', '#9C27B0', '#7B1FA2', '#4A148C'] },
  { name: 'Orange Group', icon: '🟠', colors: ['#FFF3E0', '#FFB74D', '#FF9800', '#F57C00', '#E65100'] },
  { name: 'Yellow Group', icon: '🟡', colors: ['#FFFDE7', '#FFF176', '#FFEB3B', '#FBC02D', '#F57F17'] },
  { name: 'Brown Group', icon: '🟤', colors: ['#EFEBE9', '#A1887F', '#795548', '#5D4037', '#3E2723'] },
];

export default function BgRemove() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Editor State
  const [activeTab, setActiveTab] = useState('cutout'); // 'cutout', 'background', 'adjust'
  const [bgColor, setBgColor] = useState('transparent');
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });

  const canvasRef = useRef(null);
  const hiddenOriginalCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [cutoutMode, setCutoutMode] = useState('erase'); // 'erase', 'restore', 'view'
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState([]);

  // Initialize Canvas when resultImg changes
  useEffect(() => {
    if (resultImg && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, 0, 0);
        saveHistory();
      };
      img.src = resultImg;
    }
  }, [resultImg]);

  // Load original image into hidden canvas for 'restore' functionality
  useEffect(() => {
    if (preview) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        hiddenOriginalCanvasRef.current = canvas;
      };
      img.src = preview;
    }
  }, [preview]);

  const saveHistory = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setHistory(prev => [...prev.slice(-19), canvas.toDataURL()]);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // Remove current state
    const prevState = newHistory[newHistory.length - 1];
    
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, 0);
      setHistory(newHistory);
    };
    img.src = prevState;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResultImg(null);
      setError(null);
      resetEditor();
    } else {
      setError('Please select a valid image file (JPG, PNG, or WEBP).');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResultImg(null);
      setError(null);
      resetEditor();
    } else {
      setError('Please drop a valid image file.');
    }
  };

  const resetEditor = () => {
    setBgColor('transparent');
    setAdjustments({ brightness: 100, contrast: 100, saturation: 100, blur: 0 });
    setActiveTab('cutout');
    setCutoutMode('erase');
    setBrushSize(30);
    // Reload canvas from resultImg
    if (resultImg && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, 0, 0);
      };
      img.src = resultImg;
    }
  };

  const handleRemoveBackground = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    try {
      const response = await axios.post(`${API_BASE}/api/remove-bg`, formData, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      setResultImg(url);
    } catch (err) {
      console.error(err);
      setError('Failed to remove background. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Canvas Drawing Logic
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if ((cutoutMode !== 'erase' && cutoutMode !== 'restore') || activeTab !== 'cutout') return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing || (cutoutMode !== 'erase' && cutoutMode !== 'restore') || activeTab !== 'cutout') return;
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    
    if (cutoutMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (cutoutMode === 'restore' && hiddenOriginalCanvasRef.current) {
      ctx.globalCompositeOperation = 'source-over';
      const r = brushSize / 2;
      
      // We use a temporary circle path to clip where we draw from the original image
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(hiddenOriginalCanvasRef.current, 0, 0);
      ctx.restore();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) saveHistory();
    setIsDrawing(false);
  };

  const handleDownload = () => {
    if (!resultImg || !canvasRef.current) return;
    
    const downloadCanvas = document.createElement('canvas');
    const ctx = downloadCanvas.getContext('2d');
    
    downloadCanvas.width = canvasRef.current.width;
    downloadCanvas.height = canvasRef.current.height;
    
    // 1. Draw Background
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
    }
    
    // 2. Apply Filters
    ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px)`;
    
    // 3. Draw Cutout/Erased Image
    ctx.drawImage(canvasRef.current, 0, 0);
    
    // 4. Download
    const link = document.createElement('a');
    link.download = 'tools_hub_edited.png';
    link.href = downloadCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSliderChange = (e, field) => {
    setAdjustments(prev => ({ ...prev, [field]: parseInt(e.target.value) }));
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-6 py-12 font-['Inter'] bg-slate-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        
        {/* Header - Only show if not in editor mode */}
        {!resultImg && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[32px] bg-blue-100 text-blue-600 mb-8 shadow-xl shadow-blue-500/10">
              <Scissors size={40} />
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight text-slate-900">Background Remover</h1>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">
              Powered by AI. Instantly strip backgrounds and download high-resolution transparent PNGs.
            </p>
          </div>
        )}

        <div className={`glass-card bg-white/80 border-slate-100 shadow-2xl transition-all duration-500 ${resultImg ? 'p-0 overflow-hidden rounded-[32px]' : 'p-10'}`}>
          {error && (
            <div className="m-8 p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600">
              <AlertCircle size={24} />
              <p className="font-bold">{error}</p>
            </div>
          )}

          {!resultImg ? (
            /* =========================================
               UPLOAD VIEW
            ========================================= */
            <div className="grid md:grid-cols-2 gap-10">
              {/* Upload Section */}
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <ImageIcon size={18} /> Original Image
                </h3>
                
                {!preview ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className="flex-1 min-h-[350px] border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud size={32} className="text-slate-300 group-hover:text-blue-500" />
                    </div>
                    <p className="text-lg font-bold text-slate-900">Drop Image Here</p>
                    <p className="text-sm font-medium opacity-60">or click to browse files</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                ) : (
                  <div className="relative group rounded-[40px] overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center min-h-[350px] shadow-inner p-4">
                    <img src={preview} alt="Original" className="max-w-full max-h-[400px] object-contain rounded-2xl" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button onClick={() => fileInputRef.current.click()} className="px-8 py-3 bg-white text-slate-900 rounded-2xl hover:bg-slate-50 transition-all font-bold shadow-2xl active:scale-95">
                        Change Image
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Section */}
              <div className="flex flex-col justify-center items-center h-full border-l border-slate-100 pl-10">
                 <div className="text-center w-full max-w-sm">
                    <div className="mb-8">
                       <Sparkles size={48} className="mx-auto text-blue-400 mb-4" />
                       <h3 className="text-2xl font-black text-slate-900 mb-2">Ready to Isolate</h3>
                       <p className="text-slate-500 font-medium">Click the button below to flawlessly separate the foreground from the background.</p>
                    </div>
                    <button
                      onClick={handleRemoveBackground}
                      disabled={!file || loading}
                      className={`w-full py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-500/20 ${!file || loading
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
                        }`}
                    >
                      {loading ? <Loader size={24} className="animate-spin" /> : <Scissors size={24} />}
                      {loading ? 'Processing AI...' : 'Remove Background'}
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            /* =========================================
               EDITOR VIEW
            ========================================= */
            <div className="flex flex-col bg-slate-100 relative min-h-[600px]">
              
              {/* TOP TOOLBAR */}
              <div className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-20 sticky top-0">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveTab('cutout')}
                    className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === 'cutout' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                  >
                    <Scissors size={18} /> Cutout
                  </button>
                  <button 
                    onClick={() => setActiveTab('background')}
                    className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === 'background' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                  >
                    <Palette size={18} /> Background
                  </button>
                  <button 
                    onClick={() => setActiveTab('adjust')}
                    className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === 'adjust' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                  >
                    <SlidersHorizontal size={18} /> Adjust
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-full px-2 py-1">
                    <button onClick={() => setZoom(Math.max(0.2, zoom - 0.2))} className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"><ZoomOut size={16} /></button>
                    <span className="text-[10px] font-black w-10 text-center text-slate-500">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(Math.min(5, zoom + 0.2))} className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"><ZoomIn size={16} /></button>
                  </div>

                  <div className="flex gap-2">
                     <button onClick={handleUndo} disabled={history.length <= 1} className={`p-2 rounded-full transition-all ${history.length <= 1 ? 'text-slate-200' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`} title="Undo Brush Stroke"><Undo size={18} /></button>
                     <button onClick={resetEditor} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" title="Reset All Edits"><RotateCcw size={18} /></button>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  
                  <button onClick={() => {
                     setResultImg(null);
                     setPreview(null);
                     setFile(null);
                  }} className="text-sm font-bold text-slate-500 hover:text-slate-900 pr-2 transition-colors">Start Over</button>

                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>

              {/* EDITOR WORKSPACE AND PANELS */}
              <div 
                 className="flex flex-1 overflow-hidden relative p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWRlOWZlIi8+PHJlY3QgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2Y4ZmFmYyIvPjxyZWN0IHk9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjhmYWZjIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlZGU5ZmUiLz48L3N2Zz4=')]"
                 onMouseUp={stopDrawing} 
                 onMouseLeave={stopDrawing}
              >
                
                {/* TOOL PANELS */}
                <AnimatePresence>
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                      className="absolute top-6 left-6 z-10 w-72 bg-white/95 backdrop-blur-xl p-6 rounded-[24px] shadow-2xl border border-slate-100"
                    >
                      {activeTab === 'cutout' && (
                        <div>
                           <h4 className="font-black text-slate-900 mb-5 flex items-center gap-2"><Scissors size={18}/> Manual Cutout</h4>
                           <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                <button 
                                  onClick={() => setCutoutMode('erase')} 
                                  className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${cutoutMode === 'erase' ? 'bg-red-100 text-red-700 shadow-inner' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                   <Eraser size={16}/> Erase
                                </button>
                                <button 
                                  onClick={() => setCutoutMode('restore')} 
                                  className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${cutoutMode === 'restore' ? 'bg-emerald-100 text-emerald-700 shadow-inner' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                   <PencilIcon size={16}/> Restore
                                </button>
                                <button 
                                  onClick={() => setCutoutMode('view')} 
                                  className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 col-span-2 ${cutoutMode === 'view' ? 'bg-blue-100 text-blue-700 shadow-inner' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                   <Move size={16}/> View & Pan
                                </button>
                              </div>

                              {(cutoutMode === 'erase' || cutoutMode === 'restore') && (
                                 <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-3">
                                       <span>Brush Size</span><span>{brushSize}px</span>
                                    </div>
                                    <input 
                                      type="range" min="5" max="100" 
                                      value={brushSize} 
                                      onChange={(e) => setBrushSize(parseInt(e.target.value))} 
                                      className="w-full accent-blue-600 block mb-4" 
                                    />
                                    <p className="text-[10px] font-medium text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 italic leading-tight">
                                       {cutoutMode === 'erase' ? 'Swipe to delete pixels.' : 'Swipe to bring back pixels from the original image.'}
                                    </p>
                                 </motion.div>
                              )}
                              {cutoutMode === 'view' && (
                                 <p className="text-[11px] font-medium text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                    Pan mode active. Brushes are disabled to prevent accidental strokes.
                                 </p>
                              )}
                           </div>
                        </div>
                      )}

                      {activeTab === 'background' && (
                        <div className="flex flex-col h-full max-h-[400px]">
                           <h4 className="font-black text-slate-900 mb-1 flex items-center gap-2 sticky top-0 bg-white/95 py-1 z-10 text-xs"><Palette size={14}/> Background Color</h4>
                           <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                              {COLOR_GROUPS.map(group => (
                                 <div key={group.name}>
                                    <div className="flex items-center gap-1.5 mb-1">
                                       <span className="text-[10px]">{group.icon}</span>
                                       <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">{group.name}</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                       {group.colors.map(c => (
                                          <button 
                                            key={c}
                                            onClick={() => setBgColor(c)}
                                            className={`w-7 h-7 rounded-lg border-2 transition-all ${bgColor === c ? 'border-blue-500 scale-110 shadow-lg' : 'border-slate-100 hover:scale-105 hover:border-slate-300'}`}
                                            style={{ 
                                               background: c === 'transparent' ? 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iI2QxZDVkYiIvPjxyZWN0IHg9IjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9IndoaXRlIi8+PHJlY3QgeT0iNSIgeT0iNSIgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZDFkNWRiIi8+PC9zdmc+")' : c 
                                            }}
                                            title={c}
                                          />
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {activeTab === 'adjust' && (
                        <div>
                           <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2"><SlidersHorizontal size={18}/> Image Adjustments</h4>
                           
                           <div className="space-y-6">
                             <div>
                               <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                 <span>Brightness</span><span>{adjustments.brightness}%</span>
                               </div>
                               <input type="range" min="0" max="200" value={adjustments.brightness} onChange={(e) => handleSliderChange(e, 'brightness')} className="w-full accent-blue-600 block" />
                             </div>
                             
                             <div>
                               <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                 <span>Contrast</span><span>{adjustments.contrast}%</span>
                               </div>
                               <input type="range" min="0" max="200" value={adjustments.contrast} onChange={(e) => handleSliderChange(e, 'contrast')} className="w-full accent-blue-600 block" />
                             </div>

                             <div>
                               <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                 <span>Saturation</span><span>{adjustments.saturation}%</span>
                               </div>
                               <input type="range" min="0" max="200" value={adjustments.saturation} onChange={(e) => handleSliderChange(e, 'saturation')} className="w-full accent-blue-600 block" />
                             </div>

                             <div>
                               <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                 <span>Blur</span><span>{adjustments.blur}px</span>
                               </div>
                               <input type="range" min="0" max="20" value={adjustments.blur} onChange={(e) => handleSliderChange(e, 'blur')} className="w-full accent-blue-600 block" />
                             </div>
                           </div>
                        </div>
                      )}
                    </motion.div>
                </AnimatePresence>

                {/* CANVAS VIEWPORT */}
                <div className="flex-1 flex justify-center items-center overflow-auto drop-shadow-2xl z-0 p-10 cursor-grab active:cursor-grabbing">
                   <div 
                     className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-200/50 transition-all origin-center"
                     style={{ 
                       background: bgColor === 'transparent' ? 'transparent' : bgColor,
                       transform: `scale(${zoom})`,
                     }}
                   >
                     {/* The interactive canvas replaces the <img> tag */}
                     <canvas 
                       ref={canvasRef}
                       onMouseDown={startDrawing}
                       onMouseMove={draw}
                       className="max-w-[800px] max-h-[500px] object-contain transition-all duration-75 block"
                       style={{
                         filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px)`,
                         cursor: activeTab === 'cutout' && cutoutMode !== 'view' ? 'crosshair' : 'grab'
                       }}
                     />
                   </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
