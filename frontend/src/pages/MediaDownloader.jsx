import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, AlertCircle, Loader, PlayCircle, Music, Video, Search } from 'lucide-react';
import axios from 'axios';

export default function MediaDownloader() {
  const [url, setUrl] = useState('');
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [downloading, setDownloading] = useState(null); // '1080p', '720p', 'audio', null
  const [mediaInfo, setMediaInfo] = useState(null);
  const [error, setError] = useState(null);

  const formatDuration = (seconds) => {
    if (!seconds) return "Unknown duration";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleFetchInfo = async () => {
    if (!url.trim()) return;
    setLoadingInfo(true);
    setError(null);
    setMediaInfo(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    try {
      const response = await axios.post(`${API_BASE}/api/media/info`, { url });
      setMediaInfo(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch media info. Ensure URL is valid.');
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleDownload = async (format, quality) => {
    setDownloading(format === 'audio' ? 'audio' : quality);
    setError(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    try {
      const response = await axios.post(`${API_BASE}/api/media/download`, 
        { url, format, quality },
        { responseType: 'blob' }
      );
      
      // Determine file extension
      const contentType = response.headers['content-type'];
      const ext = contentType.includes('audio') ? 'm4a' : 'mp4';
      
      // Attempt to extract filename from headers, fallback to safe name
      let filename = `media_download.${ext}`;
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const blobUrl = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

    } catch (err) {
      console.error(err);
      setError('Failed to download media. Please try another quality or URL.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-6 py-12 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Title Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[32px] bg-red-100 text-red-600 mb-8 shadow-xl shadow-red-500/10">
            <PlayCircle size={40} />
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight text-slate-900">Media Downloader</h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Extract high-quality video and audio from anywhere on the web.
          </p>
        </div>

        <div className="glass-card p-10 bg-white/80 border-slate-100 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600"
            >
              <AlertCircle size={24} />
              <p className="font-bold">{error}</p>
            </motion.div>
          )}

          {/* URL Input & Fetch */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Paste video URL here (YouTube, Twitter, TikTok, etc.)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:outline-none focus:border-red-400 focus:bg-white transition-all text-lg font-medium text-slate-900 placeholder:text-slate-400"
                onKeyDown={(e) => e.key === 'Enter' && handleFetchInfo()}
              />
            </div>
            <button
              onClick={handleFetchInfo}
              disabled={loadingInfo || !url.trim()}
              className={`px-10 py-5 rounded-[24px] font-black text-lg flex items-center gap-3 transition-all ${
                loadingInfo || !url.trim()
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20'
              }`}
            >
              {loadingInfo ? <Loader className="animate-spin" size={24} /> : <Search size={24} />}
              {loadingInfo ? 'Searching...' : 'Fetch Media'}
            </button>
          </div>

          {/* Video Info & Download Options */}
          {mediaInfo && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-5 gap-8 bg-slate-50 p-6 rounded-[32px] border border-slate-100 shadow-inner"
            >
              {/* Thumbnail & Title */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-200">
                  {mediaInfo.thumbnail ? (
                    <img src={mediaInfo.thumbnail} alt={mediaInfo.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <PlayCircle size={48} className="text-slate-300" />
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                    {formatDuration(mediaInfo.duration)}
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight line-clamp-2" title={mediaInfo.title}>
                    {mediaInfo.title}
                  </h3>
                </div>
              </div>

              {/* Download Options */}
              <div className="md:col-span-3 flex flex-col justify-center">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                  <Download size={16} /> Download Options
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => handleDownload('video', '1080p')}
                    disabled={downloading !== null}
                    className="p-5 bg-white border border-slate-200 hover:border-red-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all group disabled:opacity-50 disabled:hover:transform-none"
                  >
                    {downloading === '1080p' ? <Loader className="animate-spin text-red-500" size={28} /> : <Video size={28} className="text-red-500 group-hover:scale-110 transition-transform" />}
                    <span className="font-bold text-slate-900">MP4 Video</span>
                    <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">1080p HQ</span>
                  </button>

                  <button
                    onClick={() => handleDownload('video', '720p')}
                    disabled={downloading !== null}
                    className="p-5 bg-white border border-slate-200 hover:border-orange-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all group disabled:opacity-50 disabled:hover:transform-none"
                  >
                    {downloading === '720p' ? <Loader className="animate-spin text-orange-500" size={28} /> : <Video size={28} className="text-orange-500 group-hover:scale-110 transition-transform" />}
                    <span className="font-bold text-slate-900">MP4 Video</span>
                    <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">720p STD</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDownload('audio', 'best')}
                  disabled={downloading !== null}
                  className="w-full p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                >
                  {downloading === 'audio' ? <Loader className="animate-spin" size={20} /> : <Music size={20} className="text-blue-400" />}
                  <span className="font-bold">Download Audio (M4A)</span>
                </button>
                
                {downloading && (
                  <p className="text-center text-sm font-bold text-slate-500 mt-4 animate-pulse">
                    Processing your download. This may take a minute...
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
