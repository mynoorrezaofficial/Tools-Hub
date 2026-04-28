import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Code, Award, ChevronRight, 
  ChevronLeft, Download, Eye, Layout as LayoutIcon, Plus, Trash2, FileText, 
  Sparkles, ShieldCheck, Mail, Phone, MapPin, Link as LinkIcon
} from 'lucide-react';
import axios from 'axios';

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'skills', title: 'Skills & Others', icon: Code },
  { id: 'preview', title: 'Final Preview', icon: Eye },
];

const TEMPLATES = [
  { id: 'classic', name: 'Classic', color: 'bg-slate-800' },
  { id: 'modern', name: 'Modern', color: 'bg-blue-600' },
  { id: 'creative', name: 'Creative', color: 'bg-purple-600' },
  { id: 'minimalist', name: 'Minimal', color: 'bg-emerald-600' },
];

export default function CVMaker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [cvData, setCvData] = useState({
    personal: { name: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    education: [{ school: '', degree: '', startDate: '', endDate: '' }],
    skills: [''],
    achievements: [''],
  });

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      const newList = [...cvData[section]];
      newList[index][field] = value;
      setCvData({ ...cvData, [section]: newList });
    } else if (field) {
      setCvData({ ...cvData, [section]: { ...cvData[section], [field]: value } });
    } else {
      setCvData({ ...cvData, [section]: value });
    }
  };

  const addItem = (section, template) => {
    setCvData({ ...cvData, [section]: [...cvData[section], template] });
  };

  const removeItem = (section, index) => {
    const newList = cvData[section].filter((_, i) => i !== index);
    setCvData({ ...cvData, [section]: newList });
  };

  const handleDownload = async (format) => {
    setLoading(true);
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tools-hub-9q7i.onrender.com';
    
    try {
      const response = await axios.post(`${API_BASE}/api/cv/generate`, {
        ...cvData,
        format: format,
        template: selectedTemplate
      }, { responseType: 'blob' });
      
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `My_CV.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to generate CV. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormStep = () => {
    const stepId = STEPS[currentStep].id;
    
    switch (stepId) {
      case 'personal':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Full Name" value={cvData.personal.name} onChange={(v) => handleInputChange('personal', 'name', v)} icon={User} placeholder="John Doe" />
              <InputField label="Email Address" value={cvData.personal.email} onChange={(v) => handleInputChange('personal', 'email', v)} icon={Mail} placeholder="john@example.com" />
              <InputField label="Phone Number" value={cvData.personal.phone} onChange={(v) => handleInputChange('personal', 'phone', v)} icon={Phone} placeholder="+1 234 567 890" />
              <InputField label="Location" value={cvData.personal.location} onChange={(v) => handleInputChange('personal', 'location', v)} icon={MapPin} placeholder="New York, USA" />
              <InputField label="LinkedIn URL" value={cvData.personal.linkedin} onChange={(v) => handleInputChange('personal', 'linkedin', v)} icon={LinkIcon} placeholder="linkedin.com/in/johndoe" />
              <InputField label="Portfolio/Website" value={cvData.personal.website} onChange={(v) => handleInputChange('personal', 'website', v)} icon={LinkIcon} placeholder="johndoe.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Professional Summary</label>
              <textarea 
                className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all min-h-[120px] bg-slate-50/50"
                placeholder="Briefly describe your career goals and key strengths..."
                value={cvData.summary}
                onChange={(e) => handleInputChange('summary', null, e.target.value)}
              />
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            {cvData.experience.map((exp, index) => (
              <div key={index} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 relative group">
                {cvData.experience.length > 1 && (
                  <button onClick={() => removeItem('experience', index)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <InputField label="Company" value={exp.company} onChange={(v) => handleInputChange('experience', 'company', v, index)} placeholder="Google" />
                  <InputField label="Job Role" value={exp.role} onChange={(v) => handleInputChange('experience', 'role', v, index)} placeholder="Software Engineer" />
                  <InputField label="Start Date" value={exp.startDate} onChange={(v) => handleInputChange('experience', 'startDate', v, index)} placeholder="Jan 2022" />
                  <InputField label="End Date" value={exp.endDate} onChange={(v) => handleInputChange('experience', 'endDate', v, index)} placeholder="Present" />
                </div>
                <textarea 
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all min-h-[100px] text-sm"
                  placeholder="Key responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                />
              </div>
            ))}
            <button onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              <Plus size={20} /> Add Work Experience
            </button>
          </motion.div>
        );

      case 'education':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            {cvData.education.map((edu, index) => (
              <div key={index} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 relative group">
                {cvData.education.length > 1 && (
                  <button onClick={() => removeItem('education', index)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="School/University" value={edu.school} onChange={(v) => handleInputChange('education', 'school', v, index)} placeholder="Stanford University" />
                  <InputField label="Degree/Major" value={edu.degree} onChange={(v) => handleInputChange('education', 'degree', v, index)} placeholder="B.Sc in Computer Science" />
                  <InputField label="Start Date" value={edu.startDate} onChange={(v) => handleInputChange('education', 'startDate', v, index)} placeholder="2018" />
                  <InputField label="End Date" value={edu.endDate} onChange={(v) => handleInputChange('education', 'endDate', v, index)} placeholder="2022" />
                </div>
              </div>
            ))}
            <button onClick={() => addItem('education', { school: '', degree: '', startDate: '', endDate: '' })} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              <Plus size={20} /> Add Education
            </button>
          </motion.div>
        );

      case 'skills':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 ml-1">Key Skills (comma separated)</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold border border-blue-100">
                    <input 
                      type="text" 
                      value={skill} 
                      onChange={(e) => {
                        const newSkills = [...cvData.skills];
                        newSkills[index] = e.target.value;
                        setCvData({...cvData, skills: newSkills});
                      }}
                      className="bg-transparent outline-none w-24 text-sm"
                    />
                    <button onClick={() => removeItem('skills', index)} className="hover:text-red-500"><Trash2 size={12} /></button>
                  </div>
                ))}
                <button onClick={() => addItem('skills', '')} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Plus size={16}/></button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 ml-1">Achievements / Certifications</label>
              {cvData.achievements.map((ach, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={ach} 
                    onChange={(e) => {
                      const newAch = [...cvData.achievements];
                      newAch[index] = e.target.value;
                      setCvData({...cvData, achievements: newAch});
                    }}
                    placeholder="E.g. AWS Certified Solutions Architect"
                    className="flex-1 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                  />
                  <button onClick={() => removeItem('achievements', index)} className="p-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                </div>
              ))}
              <button onClick={() => addItem('achievements', '')} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50 transition-all">+ Add Achievement</button>
            </div>
          </motion.div>
        );

      case 'preview':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Template Selection */}
              <div className="md:w-1/3 space-y-6">
                <h3 className="font-black text-slate-900 flex items-center gap-2"><LayoutIcon size={20} className="text-blue-600" /> Choose Template</h3>
                <div className="grid grid-cols-2 gap-4">
                  {TEMPLATES.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${selectedTemplate === t.id ? 'border-blue-600 bg-blue-50/50 shadow-xl' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <div className={`w-full h-12 rounded-xl ${t.color} opacity-40 shadow-inner`} />
                      <span className="font-bold text-sm">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Visual Preview */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedTemplate}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white border border-slate-200 rounded-[32px] shadow-2xl min-h-[750px] overflow-hidden relative"
                  >
                    {selectedTemplate === 'modern' && <ModernTemplate data={cvData} />}
                    {selectedTemplate === 'minimalist' && <MinimalTemplate data={cvData} />}
                    {selectedTemplate === 'classic' && <ClassicTemplate data={cvData} />}
                    {selectedTemplate === 'creative' && <CreativeTemplate data={cvData} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Export Actions */}
            <div className="bg-slate-900 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-white text-2xl font-black mb-2 flex items-center gap-3"><ShieldCheck className="text-blue-400" /> Export Professional Resume</h3>
                <p className="text-slate-400 font-medium">Your data is processed securely and ready for download.</p>
              </div>
              <div className="flex gap-4">
                 <button 
                  onClick={() => handleDownload('docx')}
                  disabled={loading}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-3xl font-bold flex items-center gap-3 transition-all backdrop-blur-xl border border-white/10"
                 >
                   <FileText size={20} /> Word (Docx)
                 </button>
                 <button 
                  onClick={() => handleDownload('pdf')}
                  disabled={loading}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black flex items-center gap-3 transition-all shadow-2xl shadow-blue-500/40"
                 >
                   {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={22} />}
                   {loading ? 'Generating...' : 'Download PDF'}
                 </button>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 py-12 bg-slate-50">
      <div className="w-full max-w-6xl">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto overflow-x-auto pb-4 gap-4 px-2 no-scrollbar">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${currentStep >= idx ? 'bg-blue-600 text-white shadow-blue-500/20 scale-110' : 'bg-white text-slate-400 border border-slate-100'}`}>
                <step.icon size={20} />
              </div>
              <div className="hidden sm:block">
                <p className={`text-xs font-black uppercase tracking-widest ${currentStep >= idx ? 'text-slate-900' : 'text-slate-300'}`}>{step.title}</p>
                <div className={`h-1 w-full rounded-full mt-1 ${currentStep >= idx ? 'bg-blue-600/30' : 'bg-slate-100'}`} />
              </div>
              {idx < STEPS.length - 1 && <ChevronRight className="text-slate-200 ml-2 hidden sm:block" size={16} />}
            </div>
          ))}
        </div>

        {/* Dynamic Form Area */}
        <div className="glass-card bg-white/80 p-8 md:p-12 shadow-2xl shadow-slate-200/50 min-h-[500px]">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                {STEPS[currentStep].title} 
                <Sparkles className="text-blue-400 animate-pulse" size={24} />
              </h2>
              <p className="text-slate-500 font-medium mt-1">Step {currentStep + 1} of {STEPS.length}</p>
            </div>
          </div>

          {renderFormStep()}

          {/* Navigation Controls */}
          {currentStep < STEPS.length - 1 && (
            <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
              <button 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all ${currentStep === 0 ? 'opacity-0' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <ChevronLeft size={20} /> Previous Step
              </button>
              <button 
                onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black flex items-center gap-2 shadow-2xl transition-all active:scale-95"
              >
                Next Section <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Template Components ---

function ModernTemplate({ data }) {
  return (
    <div className="h-full flex flex-col">
      {/* Dark Header */}
      <div className="bg-[#1a1a2e] p-8 text-white flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black">{data.personal.name || 'YOUR NAME'}</h2>
          <p className="text-purple-400 font-bold mt-1 text-lg uppercase tracking-wider">{data.experience[0]?.role || 'Professional Title'}</p>
        </div>
        <div className="text-right text-[10px] space-y-1 font-medium opacity-80">
          <p>{data.personal.email}</p>
          <p>{data.personal.phone}</p>
          <p>{data.personal.location}</p>
        </div>
      </div>
      <div className="flex flex-1">
        {/* Sidebar 30% */}
        <div className="w-[30%] bg-slate-50 p-6 space-y-8 border-r border-slate-100">
          <Section title="Skills" accent="bg-purple-500">
            <div className="flex flex-wrap gap-2">
              {data.skills.filter(s => s).map((s, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-600">{s}</span>
              ))}
            </div>
          </Section>
          <Section title="Education" accent="bg-purple-500">
            {data.education.map((edu, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <p className="text-[11px] font-bold text-slate-800">{edu.degree}</p>
                <p className="text-[10px] text-slate-500">{edu.school}</p>
              </div>
            ))}
          </Section>
        </div>
        {/* Main 70% */}
        <div className="flex-1 p-8 space-y-8">
          <Section title="Work Experience" accent="bg-purple-500">
            {data.experience.map((exp, i) => (
              <div key={i} className="pl-4 border-l-2 border-purple-200 mb-6 relative">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-purple-500" />
                <p className="font-black text-slate-900">{exp.role} <span className="text-slate-400 font-normal">| {exp.company}</span></p>
                <p className="text-[10px] text-purple-600 font-bold mb-2 uppercase tracking-tighter">{exp.startDate} — {exp.endDate}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

function MinimalTemplate({ data }) {
  return (
    <div className="h-full flex">
      {/* Deep Color Sidebar 35% */}
      <div className="w-[35%] bg-indigo-900 p-8 text-white flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-indigo-800 border-4 border-indigo-700/50 flex items-center justify-center mb-6">
          <User size={40} className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black text-center leading-tight">{data.personal.name || 'YOUR NAME'}</h2>
        <p className="text-indigo-300 text-sm font-medium mt-2 mb-10">{data.experience[0]?.role || 'Professional Title'}</p>
        
        <div className="w-full space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Skills</h4>
            {data.skills.filter(s => s).map((s, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>{s}</span>
                  <span>85%</span>
                </div>
                <div className="h-1 bg-indigo-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 w-[85%]" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Contact</h4>
            <div className="space-y-2 text-[10px] text-indigo-200">
              <p className="flex items-center gap-2"><Mail size={12} /> {data.personal.email}</p>
              <p className="flex items-center gap-2"><Phone size={12} /> {data.personal.phone}</p>
              <p className="flex items-center gap-2"><MapPin size={12} /> {data.personal.location}</p>
            </div>
          </div>
        </div>
      </div>
      {/* White Main Area 65% */}
      <div className="flex-1 p-10 bg-white space-y-10">
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-6 pb-2 border-b-2 border-indigo-600 inline-block">Experience</h4>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-8">
              <h5 className="text-lg font-black text-slate-800">{exp.role}</h5>
              <p className="text-indigo-600 font-bold text-xs mb-3">{exp.company} <span className="text-slate-300 mx-2">/</span> {exp.startDate} - {exp.endDate}</p>
              <p className="text-xs text-slate-500 leading-relaxed italic">"{exp.description}"</p>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-6 pb-2 border-b-2 border-indigo-600 inline-block">Education</h4>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-4">
              <h5 className="text-sm font-bold text-slate-800">{edu.degree}</h5>
              <p className="text-xs text-slate-500">{edu.school} • {edu.endDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassicTemplate({ data }) {
  return (
    <div className="p-10 h-full flex flex-col bg-white">
      {/* Elevated Header */}
      <div className="flex justify-between items-end pb-4 border-b-4 border-blue-600 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900">{data.personal.name || 'YOUR NAME'}</h2>
          <p className="text-blue-600 font-bold text-xl mt-1 uppercase tracking-widest">{data.experience[0]?.role || 'Professional Title'}</p>
        </div>
        <div className="text-right text-[11px] text-slate-400 font-bold space-y-1">
          <p>{data.personal.email}</p>
          <p>{data.personal.phone}</p>
          <p>{data.personal.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-12 flex-1">
        <div className="space-y-10">
          <Section title="Education" accent="bg-blue-600">
            {data.education.map((edu, i) => (
              <div key={i} className="mb-4">
                <p className="text-sm font-black text-slate-800">{edu.degree}</p>
                <p className="text-xs text-slate-500 font-medium">{edu.school}</p>
                <p className="text-[10px] text-slate-400 mt-1">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </Section>
          <Section title="Skills" accent="bg-blue-600">
            <div className="flex flex-wrap gap-2">
              {data.skills.filter(s => s).map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded-lg border border-slate-200">{s}</span>
              ))}
            </div>
          </Section>
        </div>
        <div className="col-span-2 space-y-10">
          <Section title="Work Experience" accent="bg-blue-600">
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-6">
                <div className="flex justify-between items-baseline mb-1">
                  <h5 className="text-lg font-black text-slate-900">{exp.role}</h5>
                  <span className="text-[10px] font-black text-slate-400">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-blue-600 font-bold text-sm mb-3">{exp.company}</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{exp.description}</p>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

function CreativeTemplate({ data }) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Banner */}
      <div className="bg-slate-800 p-12 text-white text-center">
        <h2 className="text-4xl font-black mb-2">{data.personal.name || 'YOUR NAME'}</h2>
        <p className="text-teal-400 font-bold text-lg mb-6">{data.experience[0]?.role || 'Professional Title'}</p>
        <div className="flex justify-center items-center gap-4 text-xs font-medium text-slate-400">
          <span>{data.personal.email}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span>{data.personal.phone}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span>{data.personal.location}</span>
        </div>
      </div>

      <div className="p-10 flex-1 flex flex-col">
        {/* Timeline Experience */}
        <div className="max-w-3xl mx-auto w-full mb-12">
          <h4 className="text-center text-sm font-black uppercase tracking-[0.3em] text-slate-300 mb-10">Timeline</h4>
          <div className="relative space-y-12">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2" />
            {data.experience.map((exp, i) => (
              <div key={i} className={`flex items-center w-full ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                <div className="w-1/2 px-8 text-right">
                  {i % 2 === 0 ? (
                    <div>
                       <h5 className="text-sm font-black text-slate-800 text-left">{exp.role}</h5>
                       <p className="text-teal-600 font-bold text-[10px] text-left">{exp.company}</p>
                       <p className="text-[10px] text-slate-400 text-left mt-2">{exp.description}</p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-300 uppercase">{exp.startDate} - {exp.endDate}</p>
                    </div>
                  )}
                </div>
                <div className="w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-lg relative z-10" />
                <div className="w-1/2 px-8">
                  {i % 2 !== 0 ? (
                    <div>
                       <h5 className="text-sm font-black text-slate-800">{exp.role}</h5>
                       <p className="text-teal-600 font-bold text-[10px]">{exp.company}</p>
                       <p className="text-[10px] text-slate-400 mt-2">{exp.description}</p>
                    </div>
                  ) : (
                    <div className="text-left">
                      <p className="text-xs font-black text-slate-300 uppercase">{exp.startDate} - {exp.endDate}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Education side by side */}
        <div className="grid grid-cols-2 gap-8 mt-auto pt-8 border-t border-slate-50">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Core Skills</h4>
             <div className="flex flex-wrap gap-2">
               {data.skills.filter(s => s).map((s, i) => (
                 <span key={i} className="px-2 py-1 bg-white text-slate-600 text-[10px] font-bold rounded-md border border-slate-200">{s}</span>
               ))}
             </div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Academic Background</h4>
             {data.education.map((edu, i) => (
               <div key={i} className="mb-2 last:mb-0">
                 <p className="text-[11px] font-black text-slate-700">{edu.degree}</p>
                 <p className="text-[10px] text-slate-400">{edu.school}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div className="space-y-4">
      <div className="inline-block">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
        <div className={`h-1 w-8 rounded-full ${accent}`} />
      </div>
      <div>{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange, icon: Icon, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />}
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-12' : 'px-4'} py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-slate-50/50 font-medium text-slate-900 placeholder:text-slate-300`}
        />
      </div>
    </div>
  );
}
