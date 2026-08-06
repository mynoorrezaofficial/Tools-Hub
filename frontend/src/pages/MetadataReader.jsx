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

const VIEW_FIELDS = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer'];
const IMAGE_FIELDS = ['ImageDescription', 'Artist', 'Copyright', 'Software', 'DateTime'];

const HUB_OPTIONS = [
  {
    key: 'viewer',
    title: 'Metadata Viewer',
    icon: Search,
    description: 'Open and inspect hidden metadata from PDFs, images, audio, video, and documents.',
    accent: 'text-teal-700',
    badge: 'VIEW',
  },
  {
    key: 'editor',
    title: 'Metadata Editor',
    icon: Edit3,
    description: 'Replace or delete metadata in PDF and JPEG files with a clean editing panel.',
    accent: 'text-blue-700',
    badge: 'EDIT',
  },
  {
    key: 'extract',
    title: 'Extract Metadata',
    icon: Download,
    description: 'Extract and export metadata as raw JSON for quick copy, save, or review.',
    accent: 'text-slate-700',
    badge: 'RAW',
  },
];

const getApiBase = () => {
  let apiBase = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tools-hub-9q7i.onrender.com');
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

const buildEditableMetadata = (fileType, source = {}) => {
  const fields = fileType === 'JPEG' || fileType === 'JPG' ? IMAGE_FIELDS : VIEW_FIELDS;
  const next = {};
  fields.forEach((field) => {
    next[field] = source[field] || '';
  });
  return next;
};

export default function MetadataReader() {
  const [mode, setMode] = useState(null);
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [editableMetadata, setEditableMetadata] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [rawCopied, setRawCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ basic: true, metadata: true, edit: true, raw: true });
  const fileInputRef = useRef(null);

  const isPdf = metadata?.file_type === 'PDF';
  const isJpeg = ['JPEG', 'JPG'].includes(metadata?.file_type);
  const editableFields = isJpeg ? IMAGE_FIELDS : VIEW_FIELDS;
  const canEdit = isPdf || isJpeg;

  const resetAll = () => {
    setMode(null);
    setFile(null);
    setMetadata(null);
    setEditableMetadata({});
    setLoading(false);
    setSaving(false);
    setError(null);
    setCopied(false);
    setRawCopied(false);
  };

  const resetFileState = () => {
    setFile(null);
    setMetadata(null);
    setEditableMetadata({});
    setError(null);
    setCopied(false);
    setRawCopied(false);
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
    setRawCopied(false);
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
    setRawCopied(false);
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
      const response = await axios.post(`${getApiBase()}/api/metadata`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMetadata(response.data);
      setEditableMetadata(buildEditableMetadata(response.data.file_type, response.data.metadata || {}));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to extract metadata. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataAction = async (action) => {
    if (!file) return;

    if (!canEdit) {
      setError('Metadata editing is currently supported for PDF and JPEG image files only.');
      return;
    }

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', action);
    if (action === 'replace') {
      formData.append('metadata', JSON.stringify(editableMetadata));
    }

    try {
      const response = await axios.post(`${getApiBase()}/api/metadata/update`, formData, {
        responseType: 'blob',
      });

      const disposition = response.headers['content-disposition'] || '';
      const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
      const filename = decodeURIComponent(match?.[1] || match?.[2] || `metadata_${action}.bin`);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      let msg = 'Failed to update metadata. Please ensure the backend is running.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          msg = json.error || msg;
        } catch {
          // ignore parse failures
        }
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
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
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    setRawCopied(true);
    setTimeout(() => setRawCopied(false), 1800);
  };

  const sectionTitle = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!mode) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-indigo-100 text-indigo-600 mb-6 shadow-xl shadow-indigo-500/10">
              <Search size={34} className="md:w-10 md:h-10" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Metadata</h1>
            <p className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto px-4">
              Choose a metadata tool to view, edit, or extract file data.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {HUB_OPTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setMode(item.key)}
                  className="group text-left rounded-[28px] border border-slate-100 bg-white p-6 md:p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ${item.accent}`}>
                      <Icon size={30} />
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black tracking-widest text-blue-600">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>
                  <div className="mt-6 text-sm font-bold text-slate-700 group-hover:text-blue-600">Open tool</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-6 py-12 bg-slate-50 font-['Inter']">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          >
            <ChevronLeft size={18} /> Back
          </button>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            {mode === 'viewer' ? 'View Metadata' : mode === 'editor' ? 'Edit Metadata' : 'Extract Data'}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {HUB_OPTIONS.map((item) => {
            const Icon = item.icon;
            const active = mode === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setMode(item.key)}
                className={`rounded-[24px] border p-5 text-left transition-all ${active ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-white text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-widest text-slate-400">{item.badge}</div>
                    <div className="text-base font-bold text-slate-900">{item.title}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="glass-card rounded-[32px] bg-white/80 border border-slate-100 shadow-2xl p-6 md:p-8">
          {error && (
            <div className="mb-6 flex items-center gap-4 rounded-3xl border border-red-100 bg-red-50 p-4 text-red-600">
              <AlertCircle size={24} />
              <p className="font-bold">{error}</p>
            </div>
          )}

          <div className="grid gap-10 md:grid-cols-2">
            <div className="flex flex-col">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                <File size={18} /> Upload File
              </h3>

              {!file ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[32px] border-4 border-dashed border-slate-100 p-6 text-center text-slate-400 transition-all hover:border-blue-300 hover:bg-blue-50/30"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 transition-transform group-hover:scale-110">
                    <UploadCloud size={32} className="text-slate-300" />
                  </div>
                  <p className="text-lg font-bold text-slate-900">Drop File Here</p>
                  <p className="text-sm font-medium opacity-60">or click to browse files</p>
                  <p className="mt-2 text-xs font-medium opacity-40">PDF, JPG, PNG, DOCX, MP3, MP4 and more</p>
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
                </div>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[32px] border border-slate-100 bg-slate-50 p-8">
                  <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${getFileIcon(metadata?.file_type || file.name.split('.').pop()).bg}`}>
                    {(() => {
                      const Icon = getFileIcon(metadata?.file_type || file.name.split('.').pop()).icon;
                      return <Icon size={40} className={getFileIcon(metadata?.file_type || file.name.split('.').pop()).color} />;
                    })()}
                  </div>
                  <p className="mb-2 break-all text-center text-lg font-bold text-slate-900">{file.name}</p>
                  <p className="text-sm font-medium text-slate-500">{formatFileSize(file.size)}</p>
                  <button
                    onClick={resetFileState}
                    className="mt-6 text-sm font-bold text-slate-400 underline underline-offset-2 hover:text-slate-900"
                  >
                    Choose a different file
                  </button>
                </div>
              )}
            </div>

            <div className="flex h-full flex-col justify-center border-t border-slate-100 pt-10 md:border-t-0 md:border-l md:pl-10 md:pt-0">
              {!metadata ? (
                <div className="w-full text-center">
                  <div className="mb-8">
                    <Search size={48} className="mx-auto mb-4 text-blue-400" />
                    <h3 className="mb-2 text-2xl font-black text-slate-900">
                      {mode === 'viewer' ? 'View Metadata' : mode === 'editor' ? 'Edit Metadata' : 'Extract Data'}
                    </h3>
                    <p className="font-medium text-slate-500">
                      {mode === 'viewer'
                        ? 'Upload a file to inspect hidden metadata.'
                        : mode === 'editor'
                          ? 'Upload a PDF or JPEG to replace or delete metadata.'
                          : 'Upload a file to extract the raw metadata payload.'}
                    </p>
                  </div>
                  <button
                    onClick={handleExtractMetadata}
                    disabled={!file || loading}
                    className={`inline-flex w-full items-center justify-center gap-3 rounded-[24px] py-5 text-lg font-black transition-all shadow-2xl ${!file || loading ? 'cursor-not-allowed bg-slate-100 text-slate-300' : 'bg-blue-600 text-white shadow-blue-500/20 hover:scale-105 hover:bg-blue-700 active:scale-95'}`}
                  >
                    {loading ? <Loader size={24} className="animate-spin" /> : <Search size={24} />}
                    {loading ? 'Scanning...' : mode === 'viewer' ? 'View Metadata' : mode === 'editor' ? 'Load Editor' : 'Extract Metadata'}
                  </button>
                </div>
              ) : (
                <div className="w-full space-y-6">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
                      <Check size={22} className="text-green-500" /> Metadata Found
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyMetadata}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      {mode === 'extract' && (
                        <button
                          onClick={handleCopyRaw}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                        >
                          {rawCopied ? <Check size={16} className="text-green-500" /> : <Download size={16} />}
                          {rawCopied ? 'Copied Raw' : 'Raw JSON'}
                        </button>
                      )}
                    </div>
                  </div>

                  {metadata.sections && Object.keys(metadata.sections).length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {Object.entries(metadata.sections).map(([sectionName, sectionData]) => (
                        <div key={sectionName} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm md:col-span-1">
                          <button
                            onClick={() => toggleSection(sectionName)}
                            className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"
                          >
                            <span className="flex items-center gap-2 font-bold text-slate-700">
                              <Info size={18} /> {sectionTitle(sectionName)}
                            </span>
                            {expandedSections[sectionName] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <AnimatePresence>
                            {expandedSections[sectionName] && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="space-y-2 px-5 pb-4">
                                  {Object.entries(sectionData || {}).map(([key, value]) => (
                                    <div key={key} className="flex flex-col border-b border-slate-50 py-2 last:border-b-0 sm:flex-row sm:justify-between">
                                      <span className="mb-1 text-sm font-medium text-slate-500 sm:mb-0">{key}</span>
                                      <span className="max-w-[260px] break-all text-right text-sm font-bold text-slate-900">{String(value ?? '')}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <button
                      onClick={() => toggleSection('basic')}
                      className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2 font-bold text-slate-700">
                        <Info size={18} /> Basic Info
                      </span>
                      {expandedSections.basic ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <AnimatePresence>
                      {expandedSections.basic && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="space-y-2 px-5 pb-4">
                            <div className="flex justify-between border-b border-slate-50 py-2">
                              <span className="text-sm font-medium text-slate-500">File Type</span>
                              <span className="text-sm font-bold text-slate-900">{metadata.file_type}</span>
                            </div>
                            {metadata.pages !== undefined && (
                              <div className="flex justify-between border-b border-slate-50 py-2">
                                <span className="text-sm font-medium text-slate-500">Pages</span>
                                <span className="text-sm font-bold text-slate-900">{metadata.pages}</span>
                              </div>
                            )}
                            <div className="flex justify-between py-2">
                              <span className="text-sm font-medium text-slate-500">File Name</span>
                              <span className="max-w-[220px] truncate text-right text-sm font-bold text-slate-900">{file.name}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <button
                      onClick={() => toggleSection('metadata')}
                      className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2 font-bold text-slate-700">
                        <Hash size={18} /> Metadata Fields
                      </span>
                      {expandedSections.metadata ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <AnimatePresence>
                      {expandedSections.metadata && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="space-y-2 px-5 pb-4">
                            {Object.entries(metadata.metadata || {}).map(([key, value], idx) => (
                              <div key={idx} className="flex flex-col border-b border-slate-50 py-2 last:border-b-0 sm:flex-row sm:justify-between">
                                <span className="mb-1 text-sm font-medium text-slate-500 sm:mb-0">{key}</span>
                                <span className="max-w-[260px] break-all text-right text-sm font-bold text-slate-900">{value}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {mode === 'extract' && (
                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <button
                        onClick={() => toggleSection('raw')}
                        className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-2 font-bold text-slate-700">
                          <Download size={18} /> Raw Data
                        </span>
                        {expandedSections.raw ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <AnimatePresence>
                        {expandedSections.raw && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-5 pb-5">
                              <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                                {JSON.stringify(metadata, null, 2)}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {mode === 'editor' && (
                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <button
                        onClick={() => toggleSection('edit')}
                        className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-2 font-bold text-slate-700">
                          <Edit3 size={18} /> Edit Metadata
                        </span>
                        {expandedSections.edit ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <AnimatePresence>
                        {expandedSections.edit && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="space-y-4 px-5 pb-5">
                              {!canEdit ? (
                                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                                  Editing is supported for PDF and JPEG image files only. You can still inspect metadata for other file types.
                                </div>
                              ) : (
                                <>
                                  <div className="grid gap-4">
                                    {editableFields.map((field) => (
                                      <label key={field} className="block">
                                        <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">{field}</span>
                                        <input
                                          value={editableMetadata[field] || ''}
                                          onChange={(e) => setEditableMetadata((prev) => ({ ...prev, [field]: e.target.value }))}
                                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                          placeholder={`Enter ${field.toLowerCase()}`}
                                        />
                                      </label>
                                    ))}
                                  </div>

                                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                                    <button
                                      onClick={() => handleMetadataAction('replace')}
                                      disabled={saving}
                                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {saving ? <Loader size={18} className="animate-spin" /> : <Edit3 size={18} />}
                                      Replace Metadata
                                    </button>
                                    <button
                                      onClick={() => handleMetadataAction('delete')}
                                      disabled={saving}
                                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {saving ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                      Delete Metadata
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <button onClick={resetFileState} className="mt-4 w-full rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200">
                    Scan Another File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
