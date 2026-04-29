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
  { id: 'classic-serif', name: 'Classic Serif', color: 'bg-slate-800' },
  { id: 'atlantic-blue', name: 'Atlantic Blue', color: 'bg-blue-900' },
  { id: 'mercury-flow', name: 'Mercury Flow', color: 'bg-slate-200' },
  { id: 'editorial-rule', name: 'Editorial Rule', color: 'bg-slate-900' },
  { id: 'saffron-line', name: 'Saffron Line', color: 'bg-orange-500' },
  { id: 'steady-form', name: 'Steady Form', color: 'bg-emerald-800' },
];

const DUMMY_DATA = {
  personal: { name: 'Johnathan Doe', email: 'john@example.com', phone: '+1 234 567 890', location: 'New York, USA' },
  summary: 'Experienced professional with a track record of success in high-pressure environments. Strategic thinker and natural leader.',
  experience: [
    { company: 'Tech Corp', role: 'Lead Architect', startDate: '2020', endDate: 'Present', description: 'Driving technical strategy and leading cross-functional teams.' },
    { company: 'Global Solutions', role: 'Senior Developer', startDate: '2016', endDate: '2020', description: 'Developed core systems and mentored junior staff.' }
  ],
  education: [
    { school: 'State University', degree: 'M.Sc. in Computer Science', startDate: '2014', endDate: '2016' }
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'System Design', 'Cloud Architecture'],
  training: [
    { title: 'Advanced React patterns', organization: 'Frontend Masters', year: '2022' },
    { title: 'Cloud Solutions Architect', organization: 'AWS', year: '2021' }
  ],
  languages: [
    { language: 'English', level: 'Native' },
    { language: 'Spanish', level: 'Professional' }
  ],
  references: [
    { name: 'Dr. Jane Smith', company: 'Tech University', contact: 'jane.smith@example.com' }
  ],
  customSections: [
    { title: 'Volunteering', content: 'Organized local tech meetups and taught coding to underprivileged youth.' }
  ],
  achievements: ['Award for Excellence', 'Patent for novel data processing']
};

export default function CVMaker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showForm, setShowForm] = useState(false);
  const [cvData, setCvData] = useState({
    personal: { name: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    education: [{ school: '', degree: '', startDate: '', endDate: '' }],
    skills: [''],
    training: [{ title: '', organization: '', year: '' }],
    languages: [{ language: '', level: 'Native' }],
    references: [{ name: '', company: '', contact: '' }],
    customSections: [{ title: '', content: '' }],
    achievements: [''],
  });

  const [lastAddedIndex, setLastAddedIndex] = useState({ section: '', index: -1 });

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
    const newList = [...cvData[section], template];
    setCvData({ ...cvData, [section]: newList });
    setLastAddedIndex({ section, index: newList.length - 1 });
  };

  const removeItem = (section, index) => {
    const newList = cvData[section].filter((_, i) => i !== index);
    setCvData({ ...cvData, [section]: newList });
  };

  const handleEnterNext = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const parent = e.target.closest('.grid') || e.target.closest('.space-y-8');
      if (parent) {
        const inputs = Array.from(parent.querySelectorAll('input, textarea, select'));
        const index = inputs.indexOf(e.target);
        if (index > -1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    }
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

  const renderTemplateGallery = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-12 max-w-6xl w-full">
      {/* Side Navigation (FlowCV style) */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
        <div className="bg-white/80 p-3 rounded-[32px] border border-slate-100 shadow-sm backdrop-blur-xl">
          <button className="w-full px-6 py-4 bg-blue-600 shadow-xl shadow-blue-500/20 rounded-2xl text-left flex items-center gap-3 border border-blue-500/10 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <FileText size={18} />
            </div>
            <span className="font-black">Resume</span>
          </button>
          <button className="w-full px-6 py-4 text-slate-400 text-left flex items-center gap-3 hover:bg-white hover:text-slate-600 rounded-2xl transition-all mt-2 group">
             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
              <Mail size={18} />
            </div>
            <span className="font-bold">Cover Letter</span>
          </button>
          <button className="w-full px-6 py-4 text-slate-400 text-left flex items-center gap-3 hover:bg-white hover:text-slate-600 rounded-2xl transition-all mt-1 group">
             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all">
              <Briefcase size={18} />
            </div>
            <span className="font-bold">Job Tracker</span>
          </button>
        </div>

        <div className="p-6 bg-slate-900 rounded-[32px] text-white space-y-4 mt-8 shadow-2xl">
          <p className="text-sm font-bold opacity-80">Quick Tips</p>
          <h4 className="text-lg font-black leading-tight">Pick a template to start editing immediately.</h4>
          <div className="h-1 w-12 bg-blue-500 rounded-full" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="mb-12">
          <h3 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Choose a template</h3>
          <p className="text-xl text-slate-500 font-medium">Select a professional layout to start building your CV in minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* New Blank Option */}
          <button 
            onClick={() => { setSelectedTemplate('classic'); setShowForm(true); }}
            className="group relative flex flex-col items-center justify-center aspect-[3/4] rounded-[48px] border-4 border-dashed border-slate-200 hover:border-blue-400 hover:bg-white hover:shadow-2xl transition-all duration-500 bg-slate-50/50"
          >
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-blue-500/40 group-hover:scale-110">
              <Plus size={40} />
            </div>
            <span className="mt-8 text-2xl font-black text-slate-900">New blank</span>
            <p className="text-sm font-bold text-slate-400 mt-2">Start from scratch</p>
          </button>

          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="group relative flex flex-col gap-5">
              <div 
                onClick={() => { setSelectedTemplate(tmpl.id); setShowForm(true); }}
                className={`relative aspect-[3/4] rounded-[48px] overflow-hidden cursor-pointer shadow-xl transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.2)] bg-white border border-slate-100 ${selectedTemplate === tmpl.id ? 'ring-8 ring-blue-500/10' : ''}`}
              >
                {/* Scaled Template Preview */}
                <div className="absolute inset-0 origin-top-left scale-[0.35] w-[285%] h-[285%] pointer-events-none bg-white">
                  {tmpl.id === 'classic-serif' && <ClassicSerifTemplate data={DUMMY_DATA} />}
                  {tmpl.id === 'atlantic-blue' && <AtlanticBlueTemplate data={DUMMY_DATA} />}
                  {tmpl.id === 'mercury-flow' && <MercuryFlowTemplate data={DUMMY_DATA} />}
                  {tmpl.id === 'editorial-rule' && <EditorialRuleTemplate data={DUMMY_DATA} />}
                  {tmpl.id === 'saffron-line' && <SaffronLineTemplate data={DUMMY_DATA} />}
                  {tmpl.id === 'steady-form' && <SteadyFormTemplate data={DUMMY_DATA} />}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                  <button className="w-full py-5 bg-white text-slate-900 rounded-[24px] font-black text-base shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                    Use This Template
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-4">
                <span className="text-xl font-black text-slate-900">{tmpl.name}</span>
                <div className={`w-4 h-4 rounded-full ${tmpl.color} shadow-lg ring-4 ring-white`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderFormStep = () => {
    const stepId = STEPS[currentStep].id;
    
    switch (stepId) {
      case 'personal':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <InputField label="Full Name" value={cvData.personal.name} onChange={(v) => handleInputChange('personal', 'name', v)} onKeyDown={handleEnterNext} icon={User} placeholder="John Doe" />
              <InputField label="Email Address" value={cvData.personal.email} onChange={(v) => handleInputChange('personal', 'email', v)} onKeyDown={handleEnterNext} icon={Mail} placeholder="john@example.com" />
              <InputField label="Phone Number" value={cvData.personal.phone} onChange={(v) => handleInputChange('personal', 'phone', v)} onKeyDown={handleEnterNext} icon={Phone} placeholder="+1 234 567 890" />
              <InputField label="Location" value={cvData.personal.location} onChange={(v) => handleInputChange('personal', 'location', v)} onKeyDown={handleEnterNext} icon={MapPin} placeholder="New York, USA" />
              <InputField label="LinkedIn URL" value={cvData.personal.linkedin} onChange={(v) => handleInputChange('personal', 'linkedin', v)} onKeyDown={handleEnterNext} icon={LinkIcon} placeholder="linkedin.com/in/johndoe" />
              <InputField label="Portfolio/Website" value={cvData.personal.website} onChange={(v) => handleInputChange('personal', 'website', v)} onKeyDown={handleEnterNext} icon={LinkIcon} placeholder="johndoe.com" />
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
                  <InputField label="Company" value={exp.company} onChange={(v) => handleInputChange('experience', 'company', v, index)} autoFocus={lastAddedIndex.section === 'experience' && lastAddedIndex.index === index} placeholder="Google" />
                  <InputField label="Job Role" value={exp.role} onChange={(v) => handleInputChange('experience', 'role', v, index)} placeholder="Software Engineer" />
                  <InputField label="Start Date" value={exp.startDate} onChange={(v) => handleInputChange('experience', 'startDate', v, index)} placeholder="Jan 2022" />
                  <InputField label="End Date" value={exp.endDate} onChange={(v) => handleInputChange('experience', 'endDate', v, index)} onKeyDown={(e) => { if(e.key === 'Enter') addItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' }) }} placeholder="Present" />
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
                  <InputField label="School/University" value={edu.school} onChange={(v) => handleInputChange('education', 'school', v, index)} autoFocus={lastAddedIndex.section === 'education' && lastAddedIndex.index === index} placeholder="Stanford University" />
                  <InputField label="Degree/Major" value={edu.degree} onChange={(v) => handleInputChange('education', 'degree', v, index)} placeholder="B.Sc in Computer Science" />
                  <InputField label="Start Date" value={edu.startDate} onChange={(v) => handleInputChange('education', 'startDate', v, index)} placeholder="2018" />
                  <InputField label="End Date" value={edu.endDate} onChange={(v) => handleInputChange('education', 'endDate', v, index)} onKeyDown={(e) => { if(e.key === 'Enter') addItem('education', { school: '', degree: '', startDate: '', endDate: '' }) }} placeholder="2022" />
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
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 ml-1">Key Skills</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold border border-blue-100">
                    <input 
                      type="text" 
                      autoFocus={lastAddedIndex.section === 'skills' && lastAddedIndex.index === index}
                      value={skill} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem('skills', '');
                        }
                      }}
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

            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
              {/* Training Section */}
              <div className="space-y-6">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Award size={16} /> Training & Certifications</label>
                {cvData.training.map((t, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-2xl bg-slate-50 relative group">
                    <button onClick={() => removeItem('training', index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={10} /></button>
                    <input type="text" value={t.title} onChange={(e) => handleInputChange('training', 'title', e.target.value, index)} autoFocus={lastAddedIndex.section === 'training' && lastAddedIndex.index === index} placeholder="Course Title" className="w-full bg-transparent font-bold text-sm outline-none" />
                    <div className="flex justify-between gap-4">
                      <input type="text" value={t.organization} onChange={(e) => handleInputChange('training', 'organization', e.target.value, index)} placeholder="Organization" className="flex-1 bg-transparent text-xs outline-none opacity-60" />
                      <input type="text" value={t.year} onChange={(e) => handleInputChange('training', 'year', e.target.value, index)} onKeyDown={(e) => { if(e.key === 'Enter') addItem('training', { title: '', organization: '', year: '' }) }} placeholder="Year" className="w-16 bg-transparent text-xs outline-none opacity-60 text-right" />
                    </div>
                  </div>
                ))}
                <button onClick={() => addItem('training', { title: '', organization: '', year: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:bg-white transition-all">+ Add Training</button>
              </div>

              {/* Languages Section */}
              <div className="space-y-6">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Sparkles size={16} /> Languages</label>
                {cvData.languages.map((l, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-2xl bg-slate-50 relative group">
                    <button onClick={() => removeItem('languages', index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={10} /></button>
                    <input type="text" value={l.language} onChange={(e) => handleInputChange('languages', 'language', e.target.value, index)} autoFocus={lastAddedIndex.section === 'languages' && lastAddedIndex.index === index} onKeyDown={(e) => { if(e.key === 'Enter') addItem('languages', { language: '', level: 'Native' }) }} placeholder="Language" className="flex-1 bg-transparent font-bold text-sm outline-none" />
                    <select value={l.level} onChange={(e) => handleInputChange('languages', 'level', e.target.value, index)} className="bg-transparent text-xs font-bold outline-none border-b border-slate-200">
                      <option>Native</option>
                      <option>Fluent</option>
                      <option>Professional</option>
                      <option>Basic</option>
                    </select>
                  </div>
                ))}
                <button onClick={() => addItem('languages', { language: '', level: 'Native' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:bg-white transition-all">+ Add Language</button>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              {/* References Section */}
              <div className="space-y-6">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><User size={16} /> References</label>
                <div className="grid md:grid-cols-2 gap-6">
                  {cvData.references.map((r, index) => (
                    <div key={index} className="space-y-3 p-6 rounded-3xl bg-slate-50 relative group border border-slate-100">
                      <button onClick={() => removeItem('references', index)} className="absolute -top-2 -right-2 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"><Trash2 size={12} /></button>
                      <input type="text" value={r.name} onChange={(e) => handleInputChange('references', 'name', e.target.value, index)} autoFocus={lastAddedIndex.section === 'references' && lastAddedIndex.index === index} placeholder="Reference Name" className="w-full bg-transparent font-black text-slate-800 outline-none" />
                      <input type="text" value={r.company} onChange={(e) => handleInputChange('references', 'company', e.target.value, index)} placeholder="Company / Relationship" className="w-full bg-transparent text-xs font-bold text-blue-600 outline-none" />
                      <input type="text" value={r.contact} onChange={(e) => handleInputChange('references', 'contact', e.target.value, index)} onKeyDown={(e) => { if(e.key === 'Enter') addItem('references', { name: '', company: '', contact: '' }) }} placeholder="Email or Phone" className="w-full bg-transparent text-xs text-slate-400 outline-none" />
                    </div>
                  ))}
                  <button onClick={() => addItem('references', { name: '', company: '', contact: '' })} className="aspect-video border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2">
                    <Plus size={24} /> Add Reference
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              {/* Custom Sections */}
              <div className="space-y-6">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Sparkles size={16} /> Custom Sections</label>
                <div className="space-y-6">
                  {cvData.customSections.map((cs, index) => (
                    <div key={index} className="p-8 rounded-[32px] bg-slate-50 relative group border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-xl">
                      <button onClick={() => removeItem('customSections', index)} className="absolute -top-3 -right-3 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-red-600 hover:text-white"><Trash2 size={16} /></button>
                      <input 
                        type="text" 
                        value={cs.title} 
                        onChange={(e) => handleInputChange('customSections', 'title', e.target.value, index)} 
                        autoFocus={lastAddedIndex.section === 'customSections' && lastAddedIndex.index === index}
                        placeholder="Section Title (e.g. Volunteering, Projects, Hobbies)" 
                        className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none mb-6 placeholder:text-slate-200" 
                      />
                      <textarea 
                        value={cs.content} 
                        onChange={(e) => handleInputChange('customSections', 'content', e.target.value, index)} 
                        placeholder="Describe your activities or details here..." 
                        className="w-full bg-transparent text-sm leading-relaxed text-slate-500 outline-none min-h-[120px] resize-none"
                      />
                    </div>
                  ))}
                  <button onClick={() => addItem('customSections', { title: '', content: '' })} className="w-full py-8 border-4 border-dashed border-slate-100 rounded-[32px] text-slate-300 font-black text-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Plus size={24} />
                    </div>
                    Add Custom Section
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-700 ml-1">Key Achievements</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {cvData.achievements.map((ach, index) => (
                  <div key={index} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold border border-emerald-100">
                    <input 
                      type="text" 
                      autoFocus={lastAddedIndex.section === 'achievements' && lastAddedIndex.index === index}
                      value={ach} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem('achievements', '');
                        }
                      }}
                      onChange={(e) => {
                        const newAch = [...cvData.achievements];
                        newAch[index] = e.target.value;
                        setCvData({...cvData, achievements: newAch});
                      }}
                      className="bg-transparent outline-none w-32 text-sm"
                    />
                    <button onClick={() => removeItem('achievements', index)} className="hover:text-red-500"><Trash2 size={12} /></button>
                  </div>
                ))}
                <button onClick={() => addItem('achievements', '')} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Plus size={16}/></button>
              </div>
            </div>
          </motion.div>
        );

      case 'preview':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            {/* Export Actions at Top */}
            <div className="bg-slate-900 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-white text-lg font-black leading-tight">Ready to Export?</h3>
                  <p className="text-slate-500 text-xs font-medium">Download your professional resume below.</p>
                </div>
              </div>
              <div className="flex gap-3">
                 <button 
                  onClick={() => handleDownload('docx')}
                  disabled={loading}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all backdrop-blur-xl border border-white/10"
                 >
                   <FileText size={16} /> Word
                 </button>
                 <button 
                  onClick={() => handleDownload('pdf')}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20"
                 >
                   {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={18} />}
                   {loading ? 'Generating...' : 'Download PDF'}
                 </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Template Selection */}
              <div className="md:w-1/4 space-y-6">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2"><LayoutIcon size={16} className="text-blue-600" /> Switch Style</h3>
                <div className="grid grid-cols-1 gap-3">
                  {TEMPLATES.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedTemplate === t.id ? 'border-blue-600 bg-blue-50/50 shadow-lg' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${t.color} opacity-40 shadow-inner`} />
                      <span className="font-bold text-xs">{t.name}</span>
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
                    className="bg-white border border-slate-200 rounded-[32px] shadow-2xl min-h-[800px] overflow-hidden relative"
                  >
                    {selectedTemplate === 'classic-serif' && <ClassicSerifTemplate data={cvData} />}
                    {selectedTemplate === 'atlantic-blue' && <AtlanticBlueTemplate data={cvData} />}
                    {selectedTemplate === 'mercury-flow' && <MercuryFlowTemplate data={cvData} />}
                    {selectedTemplate === 'editorial-rule' && <EditorialRuleTemplate data={cvData} />}
                    {selectedTemplate === 'saffron-line' && <SaffronLineTemplate data={cvData} />}
                    {selectedTemplate === 'steady-form' && <SteadyFormTemplate data={cvData} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 pt-4 pb-12 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {showForm ? (
          <>
            {/* Header with Back to Gallery */}
            <div className="flex items-center justify-between mb-8">
               <button 
                onClick={() => { setShowForm(false); setCurrentStep(0); }}
                className="group flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-xs"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronLeft size={20} />
                </div>
                Back to templates
              </button>
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-3 rounded-3xl border border-white/20">
                 <div className={`w-3 h-3 rounded-full ${TEMPLATES.find(t => t.id === selectedTemplate)?.color || 'bg-slate-800'}`} />
                 <span className="text-sm font-black text-slate-900 uppercase tracking-wider">{selectedTemplate} Layout</span>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto overflow-x-auto gap-4 px-2 no-scrollbar">
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${currentStep >= idx ? 'bg-blue-600 text-white shadow-blue-500/20 scale-110' : 'bg-white text-slate-400 border border-slate-100'}`}>
                    <step.icon size={20} />
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= idx ? 'text-blue-600' : 'text-slate-400'}`}>Step {idx + 1}</p>
                    <p className={`text-xs font-black whitespace-nowrap ${currentStep >= idx ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</p>
                  </div>
                  {idx < STEPS.length - 1 && <ChevronRight className="text-slate-200 ml-2 hidden sm:block" size={16} />}
                </div>
              ))}
            </div>

            {/* Dynamic Form Area */}
            <div className="glass-card bg-white/80 p-8 md:p-12 shadow-2xl shadow-slate-200/50 min-h-[600px]">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                    {STEPS[currentStep].title} 
                    <Sparkles className="text-blue-400 animate-pulse" size={24} />
                  </h2>
                  <p className="text-slate-500 font-medium mt-1">Section {currentStep + 1} of {STEPS.length}</p>
                </div>
              </div>

              {renderFormStep()}

              {/* Navigation Controls */}
              <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
                <button 
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <ChevronLeft size={20} /> Previous Section
                </button>
                {currentStep < STEPS.length - 1 ? (
                  <button 
                    onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                    className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black flex items-center gap-2 shadow-2xl transition-all active:scale-95 ml-auto"
                  >
                    Next Section <ChevronRight size={20} />
                  </button>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          renderTemplateGallery()
        )}
      </div>
    </div>
  );
}

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

function ClassicSerifTemplate({ data }) {
  return (
    <div className="p-12 h-full flex flex-col bg-white font-serif text-[#1a1a1a]">
      <div className="text-center border-b border-slate-200 pb-8 mb-8">
        <h2 className="text-4xl font-normal tracking-tight mb-2 uppercase">{data.personal.name || 'Andrew O\'Sullivan'}</h2>
        <div className="flex justify-center gap-4 text-xs italic text-slate-500">
          <span>{data.personal.location}</span>
          <span>•</span>
          <span>{data.personal.email}</span>
          <span>•</span>
          <span>{data.personal.phone}</span>
        </div>
      </div>
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">Summary</h3>
          <p className="text-sm leading-relaxed">{data.summary || 'Professional with years of experience...'}</p>
        </section>
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">Professional Experience</h3>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-6">
              <div className="flex justify-between font-bold text-sm">
                <span>{exp.role}</span>
                <span>{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-xs italic text-slate-600 mb-2">{exp.company}</p>
              <p className="text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </section>
        <div className="grid grid-cols-2 gap-12">
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">Education</h3>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-4">
                <p className="text-sm font-bold">{edu.degree}</p>
                <p className="text-xs">{edu.school}</p>
              </div>
            ))}
          </section>
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">Skills</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {data.skills.map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </section>
          {data.achievements?.length > 0 && data.achievements[0] !== '' && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">Achievements</h3>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                {data.achievements.map((a, i) => a && <li key={i}>{a}</li>)}
              </ul>
            </section>
          )}
          {data.languages?.length > 0 && (
            <section className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">Languages</h3>
              <div className="space-y-1">
                {data.languages.map((l, i) => (
                  <p key={i} className="text-sm"><strong>{l.language}</strong> — {l.level}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {(data.training?.length > 0 || data.references?.length > 0) && (
        <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 gap-12">
          {data.training?.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">Training & Certifications</h3>
              {data.training.map((t, i) => (
                <div key={i} className="mb-3">
                  <p className="text-sm font-bold">{t.title}</p>
                  <p className="text-xs">{t.organization} • {t.year}</p>
                </div>
              ))}
            </section>
          )}
          {data.references?.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">References</h3>
              {data.references.map((r, i) => (
                <div key={i} className="mb-3">
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-slate-600">{r.company} • {r.contact}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      )}

      {data.customSections?.map((cs, i) => (
        cs.title && (
          <section key={i} className="mt-12">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-slate-900 mb-4 pb-1">{cs.title}</h3>
            <p className="text-sm leading-relaxed">{cs.content}</p>
          </section>
        )
      ))}
    </div>
  );
}

function AtlanticBlueTemplate({ data }) {
  return (
    <div className="h-full flex text-slate-800">
      <div className="w-[35%] bg-[#0f172a] p-10 text-white flex flex-col">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-8 border-4 border-slate-700 mx-auto">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-black text-center mb-1 leading-tight">{data.personal.name || 'Brian T. Wayne'}</h2>
        <p className="text-slate-400 text-sm text-center font-bold mb-10 uppercase tracking-widest">{data.experience[0]?.role || 'Business Consultant'}</p>
        
        <div className="space-y-8 mt-auto">
          <div className="space-y-3">
             <div className="flex items-center gap-3 text-xs text-slate-300"><Mail size={14} className="text-blue-400" /> {data.personal.email}</div>
             <div className="flex items-center gap-3 text-xs text-slate-300"><Phone size={14} className="text-blue-400" /> {data.personal.phone}</div>
             <div className="flex items-center gap-3 text-xs text-slate-300"><MapPin size={14} className="text-blue-400" /> {data.personal.location}</div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <User size={14} /> Profile
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400 italic">"{data.summary}"</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 border-b border-slate-700 pb-2">Languages</h4>
            <div className="space-y-2">
               {data.languages.map((l, i) => (
                 <div key={i} className="flex justify-between text-[10px] font-bold">
                   <span>{l.language}</span>
                   <span className="text-blue-400 opacity-60">{l.level}</span>
                 </div>
               ))}
            </div>
          </div>
          {data.references?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 border-b border-slate-700 pb-2">References</h4>
              <div className="space-y-3">
                 {data.references.map((r, i) => (
                   <div key={i} className="text-[10px]">
                     <p className="font-bold text-white">{r.name}</p>
                     <p className="text-slate-400">{r.company}</p>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-12 bg-white flex flex-col">
         <section className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <Briefcase className="text-blue-600" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Work Experience</h3>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-8 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-black text-slate-900">{exp.company}</h4>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500 uppercase">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-blue-600 text-xs font-bold mb-2">{exp.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
         </section>
         <div className="grid grid-cols-2 gap-8">
           <section>
              <div className="flex items-center gap-4 mb-6">
                <GraduationCap className="text-blue-600" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Education</h3>
              </div>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <h4 className="font-bold text-slate-800 text-sm">{edu.degree}</h4>
                  <p className="text-xs text-slate-500">{edu.school}</p>
                </div>
              ))}
           </section>
           {data.training?.length > 0 && (
             <section>
                <div className="flex items-center gap-4 mb-6">
                  <Award className="text-blue-600" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Training</h3>
                </div>
                {data.training.map((t, i) => (
                  <div key={i} className="mb-4">
                    <h4 className="font-bold text-slate-800 text-sm">{t.title}</h4>
                    <p className="text-xs text-slate-500">{t.organization}</p>
                  </div>
                ))}
             </section>
           )}
         </div>
         <section className="mt-10">
            <div className="flex items-center gap-4 mb-6">
              <Code className="text-blue-600" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Skills</h3>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               {data.skills.map((s, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <div className="w-1 h-1 rounded-full bg-blue-500" /> {s}
                 </div>
               ))}
            </div>
          </section>
          {data.achievements?.length > 0 && data.achievements[0] !== '' && (
             <section className="mt-10">
                <div className="flex items-center gap-4 mb-6">
                  <Award className="text-blue-600" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Achievements</h3>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <div className="space-y-2">
                  {data.achievements.map((a, i) => a && (
                    <div key={i} className="flex items-start gap-3 text-xs text-slate-500">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" /> {a}
                    </div>
                  ))}
                </div>
             </section>
          )}
         {data.customSections?.map((cs, i) => (
           cs.title && (
             <section key={i} className="mt-10">
                <div className="flex items-center gap-4 mb-6">
                  <Sparkles className="text-blue-600" size={18} />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{cs.title}</h3>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">"{cs.content}"</p>
             </section>
           )
         ))}
      </div>
    </div>
  );
}

function MercuryFlowTemplate({ data }) {
  return (
    <div className="p-12 h-full bg-slate-50 flex flex-col text-slate-700">
      <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200/50 flex items-center gap-10 mb-10">
        <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{data.personal.name || 'Camila Rivera'}</h2>
          <p className="text-slate-400 font-bold tracking-widest text-sm uppercase mb-4">{data.experience[0]?.role || 'Sales Manager'}</p>
          <div className="flex flex-wrap gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2"><Mail size={12} className="text-blue-500" /> {data.personal.email}</span>
            <span className="flex items-center gap-2"><Phone size={12} className="text-blue-500" /> {data.personal.phone}</span>
            <span className="flex items-center gap-2"><MapPin size={12} className="text-blue-500" /> {data.personal.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-10">
          <section>
             <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Summary</h3>
             <p className="text-sm leading-relaxed text-slate-600 text-center px-10 italic">"{data.summary}"</p>
          </section>
          <section>
             <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Professional Experience</h3>
             <div className="space-y-8">
               {data.experience.map((exp, i) => (
                 <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200/50 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <h4 className="font-black text-slate-900 text-lg">{exp.company}</h4>
                         <p className="text-blue-600 font-bold text-xs">{exp.role}</p>
                       </div>
                       <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{exp.description}</p>
                 </div>
               ))}
             </div>
          </section>
        </div>
        <div className="col-span-4 space-y-10">
           <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Education</h3>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <p className="text-xs font-black text-slate-800">{edu.degree}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{edu.school}</p>
                </div>
              ))}
           </section>
           <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Skills</h3>
              <div className="flex flex-wrap gap-2">
                 {data.skills.map((s, i) => (
                   <span key={i} className="px-3 py-1.5 bg-white text-slate-600 text-[10px] font-bold rounded-xl border border-slate-200">{s}</span>
                 ))}
              </div>
           </section>
           {data.achievements?.length > 0 && data.achievements[0] !== '' && (
             <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Achievements</h3>
                <div className="space-y-2">
                   {data.achievements.map((a, i) => a && (
                     <p key={i} className="text-[10px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">• {a}</p>
                   ))}
                </div>
             </section>
           )}
           {data.languages?.length > 0 && (
             <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Languages</h3>
                <div className="space-y-3">
                   {data.languages.map((l, i) => (
                     <div key={i} className="bg-white p-3 rounded-2xl border border-slate-200/50">
                        <p className="text-[10px] font-black text-slate-800">{l.language}</p>
                        <p className="text-[9px] text-blue-500 font-bold uppercase">{l.level}</p>
                     </div>
                   ))}
                </div>
             </section>
           )}
           {data.references?.length > 0 && (
             <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">References</h3>
                <div className="space-y-3">
                   {data.references.map((r, i) => (
                     <div key={i} className="text-[10px]">
                        <p className="font-black text-slate-800">{r.name}</p>
                        <p className="text-slate-400">{r.company}</p>
                     </div>
                   ))}
                </div>
             </section>
           )}
        </div>
      </div>
      {data.training?.length > 0 && (
        <div className="mt-10 pt-10 border-t border-slate-200">
           <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Training & Certifications</h3>
           <div className="grid grid-cols-3 gap-6">
              {data.training.map((t, i) => (
                <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-200/50 shadow-sm text-center">
                   <p className="text-sm font-black text-slate-900 mb-1">{t.title}</p>
                   <p className="text-[10px] text-slate-400 font-bold">{t.organization}</p>
                </div>
              ))}
           </div>
        </div>
      )}
      {data.customSections?.map((cs, i) => (
        cs.title && (
          <div key={i} className="mt-10 pt-10 border-t border-slate-200">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-6">{cs.title}</h3>
             <p className="text-sm leading-relaxed text-slate-600">{cs.content}</p>
          </div>
        )
      ))}
    </div>
  );
}

function EditorialRuleTemplate({ data }) {
  return (
    <div className="p-16 h-full bg-white flex flex-col text-[#222]">
      <div className="flex justify-between items-end mb-12">
        <div className="flex-1">
          <h2 className="text-5xl font-black tracking-tighter mb-2">{data.personal.name || 'Lena Hoffmann'}</h2>
          <p className="text-xl font-bold tracking-tight text-slate-400 italic mb-6">{data.experience[0]?.role || 'Operations Manager'}</p>
          <div className="flex gap-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <span>{data.personal.location}</span>
            <span>{data.personal.email}</span>
            <span>{data.personal.phone}</span>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-black w-full mb-10" />

      <div className="space-y-12">
        <section>
           <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6">Summary</h3>
           <p className="text-sm leading-loose max-w-4xl">{data.summary}</p>
        </section>

        <section>
           <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8">Professional Experience</h3>
           <div className="space-y-10">
             {data.experience.map((exp, i) => (
               <div key={i} className="grid grid-cols-4 gap-10">
                  <div className="font-black text-xs uppercase tracking-widest pt-1">{exp.startDate} - {exp.endDate}</div>
                  <div className="col-span-2">
                     <h4 className="text-lg font-black mb-1">{exp.company}</h4>
                     <p className="text-sm font-bold text-slate-500 italic mb-4">{exp.role}</p>
                     <p className="text-sm leading-relaxed">{exp.description}</p>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.personal.location}</div>
               </div>
             ))}
           </div>
        </section>

        <div className="grid grid-cols-2 gap-16 border-t-2 border-slate-100 pt-10">
           <section>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6">Education</h3>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-6">
                   <p className="font-black text-sm">{edu.degree}</p>
                   <p className="text-xs text-slate-500 font-bold mb-1">{edu.school}</p>
                   <p className="text-[10px] font-black text-slate-300 uppercase">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
           </section>
           <section>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6">Skills</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                 {data.skills.map((s, i) => (
                   <div key={i} className="text-xs font-black text-slate-700 pb-2 border-b border-slate-100">{s}</div>
                 ))}
              </div>
           </section>
           {data.achievements?.length > 0 && data.achievements[0] !== '' && (
             <section>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6">Achievements</h3>
                <div className="space-y-4">
                   {data.achievements.map((a, i) => a && (
                     <div key={i} className="text-xs font-medium leading-relaxed pb-2 border-b border-slate-100 flex gap-4">
                        <span className="font-black text-slate-300">0{i+1}</span>
                        <span>{a}</span>
                     </div>
                   ))}
                </div>
             </section>
           )}
        </div>
        
        {data.training?.length > 0 && (
          <section className="pt-10 border-t-2 border-slate-100">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8">Training & Certifications</h3>
             <div className="grid grid-cols-2 gap-10">
               {data.training.map((t, i) => (
                 <div key={i} className="flex justify-between items-start">
                    <p className="text-sm font-black">{t.title}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase">{t.organization} • {t.year}</p>
                 </div>
               ))}
             </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-16 pt-10 border-t-2 border-slate-100">
           {data.languages?.length > 0 && (
             <section>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6">Languages</h3>
                <div className="space-y-2">
                   {data.languages.map((l, i) => (
                     <p key={i} className="text-sm font-black">{l.language} <span className="text-slate-300 mx-4">|</span> <span className="text-xs text-slate-400 italic">{l.level}</span></p>
                   ))}
                </div>
             </section>
           )}
           {data.references?.length > 0 && (
             <section>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6">References</h3>
                <div className="space-y-4">
                   {data.references.map((r, i) => (
                     <div key={i}>
                        <p className="text-sm font-black">{r.name}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase">{r.company} • {r.contact}</p>
                     </div>
                   ))}
                </div>
             </section>
           )}
        </div>
        
        {data.customSections?.map((cs, i) => (
          cs.title && (
            <section key={i} className="pt-10 border-t-2 border-slate-100">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6">{cs.title}</h3>
               <p className="text-sm leading-loose">{cs.content}</p>
            </section>
          )
        ))}
      </div>
    </div>
  );
}

function SaffronLineTemplate({ data }) {
  return (
    <div className="h-full flex text-slate-700">
       <div className="w-[40%] bg-slate-50 p-12 flex flex-col border-r border-slate-200">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-8 shadow-xl shadow-orange-500/10 border-4 border-white mx-auto">
            <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-center mb-1">{data.personal.name || 'Matteo Ricci'}</h2>
          <p className="text-orange-600 font-bold text-center text-xs uppercase tracking-widest mb-12">{data.experience[0]?.role || 'Head of Operations'}</p>
          
          <div className="space-y-10">
             <section>
                <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-300"><User size={14} /> Contact</h4>
                <div className="space-y-3 text-[11px] font-bold">
                   <p className="flex items-center gap-3"><Mail size={14} className="text-orange-500" /> {data.personal.email}</p>
                   <p className="flex items-center gap-3"><Phone size={14} className="text-orange-500" /> {data.personal.phone}</p>
                   <p className="flex items-center gap-3"><MapPin size={14} className="text-orange-500" /> {data.personal.location}</p>
                </div>
             </section>
             <section>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-300">Skills</h4>
                <div className="space-y-4">
                   {data.skills.map((s, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black"><span>{s}</span><span>Intermediate</span></div>
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[60%]" /></div>
                     </div>
                   ))}
                </div>
             </section>
             {data.achievements?.length > 0 && data.achievements[0] !== '' && (
                <section>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-300">Achievements</h4>
                  <div className="space-y-3">
                     {data.achievements.map((a, i) => a && (
                       <div key={i} className="flex items-start gap-3 text-[10px] font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1" /> {a}
                       </div>
                     ))}
                  </div>
                </section>
             )}
             {data.languages?.length > 0 && (
               <section>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-300">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                     {data.languages.map((l, i) => (
                       <span key={i} className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-md">{l.language} ({l.level})</span>
                     ))}
                  </div>
               </section>
             )}
          </div>
       </div>
       <div className="flex-1 p-12 bg-white flex flex-col">
          <section className="mb-12">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white"><Briefcase size={16} /></div>
               <h3 className="text-sm font-black uppercase tracking-[0.2em]">Summary</h3>
               <div className="flex-1 h-0.5 bg-orange-500/10" />
             </div>
             <p className="text-sm leading-relaxed italic border-l-4 border-orange-500 pl-6 py-2">"{data.summary}"</p>
          </section>
          <section className={data.training?.length > 0 ? 'mb-12' : ''}>
             <div className="flex items-center gap-4 mb-8">
               <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white"><Briefcase size={16} /></div>
               <h3 className="text-sm font-black uppercase tracking-[0.2em]">Professional Experience</h3>
               <div className="flex-1 h-0.5 bg-orange-500/10" />
             </div>
             {data.experience.map((exp, i) => (
               <div key={i} className="mb-8">
                  <div className="flex justify-between items-baseline mb-2">
                     <h4 className="font-black text-slate-900">{exp.role}</h4>
                     <span className="text-[10px] font-black text-orange-600">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-bold mb-3">{exp.company}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
               </div>
             ))}
          </section>
          {data.training?.length > 0 && (
            <section className="mb-12">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white"><Award size={16} /></div>
                 <h3 className="text-sm font-black uppercase tracking-[0.2em]">Training</h3>
                 <div className="flex-1 h-0.5 bg-orange-500/10" />
               </div>
               {data.training.map((t, i) => (
                 <div key={i} className="mb-4">
                    <p className="font-bold text-slate-800 text-sm">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.organization} • {t.year}</p>
                 </div>
               ))}
            </section>
          )}
          {data.references?.length > 0 && (
            <section>
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white"><User size={16} /></div>
                 <h3 className="text-sm font-black uppercase tracking-[0.2em]">References</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 {data.references.map((r, i) => (
                   <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-black text-xs text-slate-900">{r.name}</p>
                      <p className="text-[10px] font-bold text-orange-600 mb-1">{r.company}</p>
                      <p className="text-[9px] text-slate-400">{r.contact}</p>
                   </div>
                 ))}
               </div>
            </section>
          )}
          {data.customSections?.map((cs, i) => (
            cs.title && (
              <section key={i} className="mt-12">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white"><Sparkles size={16} /></div>
                   <h3 className="text-sm font-black uppercase tracking-[0.2em]">{cs.title}</h3>
                   <div className="flex-1 h-0.5 bg-slate-100" />
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed">{cs.content}</p>
              </section>
            )
          ))}
       </div>
    </div>
  );
}

function SteadyFormTemplate({ data }) {
  return (
    <div className="p-12 h-full bg-white flex flex-col text-slate-700">
      <div className="flex items-center gap-10 mb-12 pb-12 border-b-2 border-slate-50">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl shadow-emerald-500/10 border-4 border-white">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">{data.personal.name || 'Rohan K. Patel'}</h2>
           <p className="text-emerald-600 font-bold text-lg">{data.experience[0]?.role || 'Project Engineer'}</p>
           <div className="flex gap-4 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>{data.personal.email}</span>
              <span>•</span>
              <span>{data.personal.phone}</span>
           </div>
        </div>
      </div>

      <div className="space-y-12">
        <section>
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6 text-center">Summary</h3>
           <p className="text-sm leading-relaxed text-center max-w-2xl mx-auto font-medium">{data.summary}</p>
        </section>

        <section>
           <div className="flex items-center gap-4 mb-8">
             <div className="flex-1 h-px bg-slate-100" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Professional Experience</h3>
             <div className="flex-1 h-px bg-slate-100" />
           </div>
           {data.experience.map((exp, i) => (
             <div key={i} className="grid grid-cols-12 gap-8 mb-10">
                <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase pt-1">{exp.startDate} - {exp.endDate}</div>
                <div className="col-span-9">
                   <h4 className="font-black text-slate-900 text-lg mb-1">{exp.company}</h4>
                   <p className="text-emerald-600 font-bold text-sm mb-4 italic">{exp.role}</p>
                   <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
                </div>
             </div>
           ))}
        </section>

        <div className="grid grid-cols-2 gap-16 pt-10 border-t border-slate-50">
           <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Education</h3>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-4">
                   <p className="text-sm font-black text-slate-900">{edu.degree}</p>
                   <p className="text-xs text-slate-400 font-bold">{edu.school}</p>
                </div>
              ))}
           </section>
           <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Expertise</h3>
              <div className="flex flex-wrap gap-3">
                 {data.skills.map((s, i) => (
                   <span key={i} className="text-xs font-bold text-slate-600 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-default">{s}</span>
                 ))}
              </div>
           </section>
           {data.achievements?.length > 0 && data.achievements[0] !== '' && (
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Achievements</h3>
                <div className="space-y-3">
                   {data.achievements.map((a, i) => a && (
                     <div key={i} className="text-xs font-medium flex gap-3 items-start">
                        <Award size={14} className="text-emerald-500 mt-0.5" />
                        <span>{a}</span>
                     </div>
                   ))}
                </div>
              </section>
           )}
           {data.languages?.length > 0 && (
             <section className="mt-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Languages</h3>
                <div className="space-y-3">
                   {data.languages.map((l, i) => (
                     <div key={i} className="flex justify-between items-center text-xs">
                        <span className="font-black text-slate-700">{l.language}</span>
                        <span className="text-emerald-600 font-bold">{l.level}</span>
                     </div>
                   ))}
                </div>
             </section>
           )}
        </div>
      </div>
      
      {(data.training?.length > 0 || data.references?.length > 0) && (
        <div className="mt-12 pt-12 border-t border-slate-50 grid grid-cols-2 gap-16">
           {data.training?.length > 0 && (
             <section>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Training</h3>
                {data.training.map((t, i) => (
                  <div key={i} className="mb-6">
                     <p className="text-sm font-black text-slate-900">{t.title}</p>
                     <p className="text-xs text-slate-400">{t.organization} • {t.year}</p>
                  </div>
                ))}
             </section>
           )}
           {data.references?.length > 0 && (
             <section>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">References</h3>
                {data.references.map((r, i) => (
                  <div key={i} className="mb-6">
                     <p className="text-sm font-black text-slate-900">{r.name}</p>
                     <p className="text-xs text-emerald-600 font-bold">{r.company}</p>
                     <p className="text-[10px] text-slate-400 mt-1">{r.contact}</p>
                  </div>
                ))}
             </section>
           )}
        </div>
      )}

      {data.customSections?.map((cs, i) => (
        cs.title && (
          <section key={i} className="mt-12 pt-12 border-t border-slate-50">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">{cs.title}</h3>
             <p className="text-sm leading-relaxed font-medium">{cs.content}</p>
          </section>
        )
      ))}
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

function InputField({ label, value, onChange, onKeyDown, icon: Icon, placeholder, autoFocus }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />}
        <input 
          type="text" 
          autoFocus={autoFocus}
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-12' : 'px-4'} py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-slate-50/50 font-medium text-slate-900 placeholder:text-slate-300`}
        />
      </div>
    </div>
  );
}
