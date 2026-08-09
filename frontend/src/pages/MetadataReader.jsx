import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Copy,
  Download,
  Edit3,
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Hash,
  Info,
  Loader,
  RotateCcw,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import axios from 'axios';

void motion;

const FILE_ICONS = {
  PDF: { icon: FileText, color: 'text-red-500', bg: 'bg-red-100' },
  DOCX: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
  DOC: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
  PNG: { icon: FileImage, color: 'text-green-500', bg: 'bg-green-100' },
  JPG: { icon: FileImage, color: 'text-orange-500', bg: 'bg-orange-100' },
  JPEG: { icon: FileImage, color: 'text-orange-500', bg: 'bg-orange-100' },
  GIF: { icon: FileImage, color: 'text-purple-500', bg: 'bg-purple-100' },
  MP3: { icon: FileAudio, color: 'text-pink-500', bg: 'bg-pink-100' },
  MP4: { icon: FileVideo, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  default: { icon: File, color: 'text-slate-500', bg: 'bg-slate-100' },
};

const EDITABLE_FIELDS_PDF = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer'];
const EDITABLE_FIELDS_JPEG = ['ImageDescription', 'Artist', 'Copyright', 'Software', 'DateTime'];

const getApiBase = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  let apiBase = isLocalhost ? 'http://localhost:5000' : import.meta.env.VITE_API_BASE_URL;
  apiBase ||= 'https://tools-hub-9q7i.onrender.com';
  if (apiBase && !apiBase.startsWith('http://') && !apiBase.startsWith('https://')) {
    apiBase = `https://${apiBase}`;
  }
  return apiBase;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getFileIcon = (type) => FILE_ICONS[(type || '').toUpperCase()] || FILE_ICONS.default;

const sectionTitle = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const buildOutputFilename = (originalName, suffix = 'metadata_updated') => {
  const dot = originalName.lastIndexOf('.');
  if (dot === -1) return `${originalName}_${suffix}`;
  const base = originalName.slice(0, dot);
  const ext = originalName.slice(dot);
  return `${base}_${suffix}${ext}`;
};

export default function MetadataReader() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [editableMetadata, setEditableMetadata] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [rawDownloading, setRawDownloading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ raw: false });
  const [processedFile, setProcessedFile] = useState(null);
  const [processedFilename, setProcessedFilename] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const fileInputRef = useRef(null);

  const resetFileState = () => {
    setFile(null);
    setMetadata(null);
    setEditableMetadata({});
    setError(null);
    setCopied(false);
    setRawDownloading(false);
    setProcessedFile(null);
    setProcessedFilename('');
    setIsExecuting(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setError('Please select a valid file.');
      return;
    }
    setFile(selectedFile);
    setMetadata(null);
    setEditableMetadata({});
    setError(null);
    setCopied(false);
    setRawDownloading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) {
      setError('Please drop a valid file.');
      return;
    }
    setFile(droppedFile);
    setMetadata(null);
    setEditableMetadata({});
    setError(null);
    setCopied(false);
    setRawDownloading(false);
  };

  const handleExtractMetadata = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setMetadata(null);
    setEditableMetadata({});

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiBase = getApiBase();
      const response = await axios.post(`${apiBase}/api/metadata`, formData);
      setMetadata(response.data);
      const allFields = {};
      Object.entries(response.data.metadata || {}).forEach(([k, v]) => { allFields[k] = String(v ?? ''); });
      Object.values(response.data.sections || {}).forEach((section) => {
        Object.entries(section || {}).forEach(([k, v]) => {
          if (!(k in allFields)) allFields[k] = String(v ?? '');
        });
      });
      setEditableMetadata(allFields);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || `Failed to extract metadata. Please ensure the backend is running at ${getApiBase()}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExecution = async () => {
    if (!file) return;

    setSaving(true);
    setError(null);
    setProcessedFile(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'replace');
    formData.append('metadata', JSON.stringify(editableMetadata));

    try {
      const response = await axios.post(`${getApiBase()}/api/metadata/update`, formData, {
        responseType: 'blob',
      });
      const disposition = response.headers['content-disposition'] || '';
      const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
      const filename = decodeURIComponent(match?.[1] || match?.[2] || buildOutputFilename(file.name));

      setProcessedFile(response.data);
      setProcessedFilename(filename);
      setIsExecuting(true);

      // Update metadata state with edited values
      setMetadata((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, metadata: { ...prev.metadata, ...editableMetadata } };
        // Also update sections that contain edited keys
        if (updated.sections) {
          const newSections = { ...updated.sections };
          Object.keys(newSections).forEach((sec) => {
            const secData = { ...newSections[sec] };
            Object.keys(secData).forEach((k) => {
              if (k in editableMetadata) {
                secData[k] = editableMetadata[k];
              }
            });
            newSections[sec] = secData;
          });
          updated.sections = newSections;
        }
        return updated;
      });
    } catch (err) {
      console.error(err);
      let msg = `Failed to process metadata. Please ensure the backend is running at ${getApiBase()}.`;
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          msg = json.error || msg;
        } catch {
          // ignore
        }
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadFile = () => {
    if (!processedFile) return;
    const url = URL.createObjectURL(processedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = processedFilename && !processedFilename.endsWith('.bin') ? processedFilename : buildOutputFilename(file?.name || 'metadata');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMetadata = () => {
    if (!metadata) return;
    const text = Object.entries(metadata.metadata || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCopyRaw = () => {
    if (!metadata) return;
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(file?.name || 'metadata').replace(/\.[^/.]+$/, '')}_metadata.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const allMetadataEntries = metadata?.metadata ? Object.entries(metadata.metadata) : [];
  const sectionEntries = metadata?.sections ? Object.entries(metadata.sections) : [];

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-4 sm:px-6 py-12 bg-slate-50 font-['Inter']">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          >
            <ChevronLeft size={18} /> Back
          </a>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            Metadata
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
            <AlertCircle size={20} />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        {/* ── TOP: Upload + File Info ── */}
        <div className="grid gap-6 md:grid-cols-[380px_1fr]">
          {/* Upload Panel */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <File size={16} /> Upload File
            </h3>

            {!file ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-slate-400 transition-all hover:border-blue-300 hover:bg-blue-50/30"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
                  <UploadCloud size={28} className="text-slate-300" />
                </div>
                <p className="text-base font-bold text-slate-900">Drop File Here</p>
                <p className="text-xs font-medium opacity-60 mt-1">or click to browse</p>
                <p className="mt-2 text-[11px] font-medium opacity-40">PDF, JPG, PNG, DOCX, MP3, MP4</p>
                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
              </div>
            ) : (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${getFileIcon(metadata?.file_type || file.name.split('.').pop()).bg}`}>
                  {(() => {
                    const Icon = getFileIcon(metadata?.file_type || file.name.split('.').pop()).icon;
                    return <Icon size={32} className={getFileIcon(metadata?.file_type || file.name.split('.').pop()).color} />;
                  })()}
                </div>
                <p className="mb-1 break-all text-center text-sm font-bold text-slate-900">{file.name}</p>
                <p className="text-xs font-medium text-slate-500">{formatFileSize(file.size)}</p>
                <button
                  onClick={resetFileState}
                  className="mt-4 text-xs font-bold text-slate-400 underline underline-offset-2 hover:text-slate-900"
                >
                  Choose a different file
                </button>
              </div>
            )}

            <button
              onClick={metadata ? resetFileState : handleExtractMetadata}
              disabled={!file || loading}
              className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all ${!file || loading ? 'cursor-not-allowed bg-slate-100 text-slate-300' : metadata ? 'bg-slate-700 text-white shadow-lg shadow-slate-500/20 hover:bg-slate-800 active:scale-[0.98]' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98]'}`}
            >
              {loading ? <Loader size={18} className="animate-spin" /> : metadata ? <RotateCcw size={18} /> : <Search size={18} />}
              {loading ? 'Scanning...' : metadata ? 'Scan Another File' : 'View Metadata'}
            </button>
          </div>

          {/* Right: File Info */}
          <div className="flex flex-col gap-4">
            {!metadata ? (
              <div className="flex flex-1 items-center justify-center rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                <div>
                  <Search size={40} className="mx-auto mb-4 text-blue-300" />
                  <h3 className="mb-2 text-xl font-black text-slate-900">View Metadata</h3>
                  <p className="text-sm font-medium text-slate-400">Upload a file to inspect hidden metadata.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header bar */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base font-black text-slate-900">
                    <Check size={18} className="text-green-500" /> Metadata Found
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyMetadata}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200"
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    
                  </div>
                </div>

                {/* File Info sections */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {sectionEntries.map(([sectionName, sectionData]) => (
                    <div key={sectionName} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <button
                        onClick={() => toggleSection(sectionName)}
                        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <Info size={16} /> {sectionTitle(sectionName)}
                        </span>
                        {expandedSections[sectionName] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <AnimatePresence>
                        {expandedSections[sectionName] && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="space-y-1.5 px-4 pb-3">
                              {Object.entries(sectionData || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between border-b border-slate-50 py-1.5 last:border-b-0">
                                  <span className="text-xs font-medium text-slate-500">{key}</span>
                                  <span className="max-w-[180px] truncate text-right text-xs font-bold text-slate-900">{String(value ?? '')}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Raw Data */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <button
                    onClick={() => toggleSection('raw')}
                    className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Download size={16} /> Raw Data
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopyRaw(); }}
                        disabled={rawDownloading}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-60"
                      >
                        <Download size={14} />
                        {rawDownloading ? 'Downloading...' : 'JSON'}
                      </button>
                      {expandedSections.raw ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedSections.raw && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-3">
                          <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-[11px] leading-5 text-slate-100 max-h-[300px] overflow-y-auto">
                            {JSON.stringify(metadata, null, 2)}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Scan Another — integrated into View Metadata button */}
              </>
            )}
          </div>
        </div>

        {/* ── Metadata Tags Table ── */}
        {metadata && allMetadataEntries.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              {/* Title */}
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="flex items-center gap-2 text-base font-black text-slate-900">
                  <Hash size={18} /> Metadata Tags
                </h3>
                <p className="mt-1 text-xs text-slate-400">Editable file tag information, including EXIF, XMP, IPTC and other metadata standards</p>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-[200px_1fr_1fr_220px_40px] gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <span>Tag</span>
                <span>Tag Name - Description</span>
                <span>Original Value</span>
                <span>Edit</span>
                <span></span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-50">
                {allMetadataEntries.map(([key, value], idx) => (
                  <div key={idx} className="grid grid-cols-[200px_1fr_1fr_220px_40px] gap-4 items-center px-6 py-3 hover:bg-slate-50/50 transition-colors">
                    <span className="text-sm font-semibold text-slate-700">{key}</span>
                    <span className="text-sm text-slate-500">{key}</span>
                    <span className="text-sm font-medium text-slate-900 truncate">{String(value ?? '')}</span>
                    <div>
                      {isExecuting ? (
                        <span className="text-sm font-medium text-slate-900 truncate block">{editableMetadata[key] || ''}</span>
                      ) : (
                        <input
                          value={editableMetadata[key] || ''}
                          onChange={(e) => setEditableMetadata((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          placeholder={`Edit ${key.toLowerCase()}`}
                        />
                      )}
                    </div>
                    <div className="flex justify-end">
                      {!isExecuting && (
                        <button
                          onClick={() => setEditableMetadata((prev) => { const n = { ...prev }; delete n[key]; return n; })}
                          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                          title="Remove tag"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── File Parameters Table ── */}
        {metadata && sectionEntries.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              {/* Title */}
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-base font-black text-slate-900">File Parameters</h3>
                <p className="mt-1 text-xs text-slate-400">Technical specifications for file format and data streams &middot; {sectionEntries.length} groups</p>
              </div>

              {sectionEntries.map(([sectionName, sectionData]) => (
                <div key={sectionName}>
                  {/* Group Header */}
                  <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3">
                    <h4 className="flex items-center gap-2 text-sm font-black text-slate-900">
                      {sectionTitle(sectionName)}
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{Object.keys(sectionData || {}).length}</span>
                    </h4>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-[200px_1fr_1fr_220px_40px] gap-4 border-b border-slate-100 px-6 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <span>Tag</span>
                    <span>Tag (English)</span>
                    <span>Original Value</span>
                    <span>Edit</span>
                    <span></span>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-slate-50">
                    {Object.entries(sectionData || {}).map(([key, value], idx) => (
                      <div key={idx} className="grid grid-cols-[200px_1fr_1fr_220px_40px] gap-4 items-center px-6 py-3 hover:bg-slate-50/50 transition-colors">
                        <span className="text-sm font-semibold text-slate-700">{key}</span>
                        <span className="text-sm text-slate-500">{key}</span>
                        <span className="text-sm font-medium text-slate-900 truncate">{String(value ?? '')}</span>
                        <div>
                          {isExecuting ? (
                            <span className="text-sm font-medium text-slate-900 truncate block">{editableMetadata[key] || ''}</span>
                          ) : (
                            <input
                              value={editableMetadata[key] || ''}
                              onChange={(e) => setEditableMetadata((prev) => ({ ...prev, [key]: e.target.value }))}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                              placeholder={`Edit ${key.toLowerCase()}`}
                            />
                          )}
                        </div>
                        <div className="flex justify-end">
                          {!isExecuting && (
                            <button
                              onClick={() => setEditableMetadata((prev) => { const n = { ...prev }; delete n[key]; return n; })}
                              className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                              title="Remove tag"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Action Buttons ── */}
        {metadata && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center justify-center gap-3">
            {!isExecuting ? (
              <>
                <button
                  onClick={() => {
                    const empty = {};
                    Object.keys(editableMetadata).forEach((k) => { empty[k] = ''; });
                    setEditableMetadata(empty);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Clear All Tags
                </button>
                <button
                  onClick={() => {
                    const original = {};
                    allMetadataEntries.forEach(([k, v]) => { original[k] = String(v ?? ''); });
                    setEditableMetadata(original);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancel All Edits
                </button>
                <button
                  onClick={handleStartExecution}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <Loader size={16} className="animate-spin" /> : <Edit3 size={16} />}
                  Start Execution
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsExecuting(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-700"
                >
                  <Download size={16} />
                  Download File
                </button>
              </>
            )}
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
