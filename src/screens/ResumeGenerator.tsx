import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Lock, 
  UserPlus, 
  LogIn, 
  Mail, 
  Key,
  Layout,
  Type,
  CheckCircle,
  Eye,
  RefreshCcw,
  Loader2,
  LogOut,
  Wand2,
  X,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { auth, signInWithGoogle } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { geminiService } from '../services/geminiService';
import { cn } from '@/lib/utils';

export default function ResumeGenerator({ onComplete }: { onComplete: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [generating, setGenerating] = useState(false);
  const [tuning, setTuning] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [template, setTemplate] = useState<'Modern' | 'Formal' | 'Creative'>('Modern');
  const [isFeedbackDone, setIsFeedbackDone] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    
    // Check feedback status
    const feedbackStatus = localStorage.getItem('skillpath_feedback_completed') === 'true';
    setIsFeedbackDone(feedbackStatus);

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome to SkillPath AI!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setResumeData(null);
  };

  const generateResume = () => {
    setGenerating(true);
    setTimeout(() => {
      setResumeData({
        name: user?.displayName || 'Alex Johnson',
        role: localStorage.getItem('skillpath_target_role') || 'Full Stack Developer',
        email: user?.email || 'alex@example.com',
        phone: '+1 (555) 0123-4567',
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'System Design'],
        experience: [
          { title: 'Project Lead', company: 'TechNova', period: '2025 - Present', desc: 'Led a team of 4 to build an AI platform.' }
        ],
        summary: 'Ambitious developer specializing in high-performance applications and clean architecture.'
      });
      setGenerating(false);
      toast.success('AI Resume Generated!');
    }, 2500);
  };

  const handleAiTuning = async () => {
    if (!resumeData) return;
    setTuning(true);
    toast.loading('AI is optimizing your content...');
    
    const tunedContent = await geminiService.tuneResume(resumeData);
    
    if (tunedContent) {
      setResumeData(prev => ({
        ...prev,
        summary: tunedContent.summary,
        experience: prev.experience.map((exp: any, i: number) => 
          i === 0 ? { ...exp, desc: tunedContent.experience_desc } : exp
        )
      }));
      toast.dismiss();
      toast.success('Resume Content Optimized!');
    } else {
      toast.dismiss();
      toast.error('AI Tuning failed. Please try again.');
    }
    setTuning(false);
  };

  const downloadPDF = async () => {
    if (!isFeedbackDone) {
      toast.error('Download Locked', {
        description: 'Please complete the feedback form first to unlock PDF downloads.',
      });
      return;
    }

    const element = document.getElementById('resume-preview');
    if (!element) return;
    
    toast.loading('Preparing PDF...');
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('SkillPath_Resume.pdf');
    toast.dismiss();
    toast.success('Resume downloaded!');
  };

  if (!user && !resumeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-10 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-cyan-500/20 blur-[80px]" />
          
          <div className="text-center mb-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-white mb-6 shadow-lg shadow-cyan-500/20">
              <Lock size={28} />
            </div>
            <h2 className="text-3xl font-black mb-2">Login Required</h2>
            <p className="text-white/40 text-sm">Resume builder is a premium feature for registered students.</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full h-14 rounded-2xl bg-white text-black hover:bg-cyan-400 font-bold flex items-center justify-center gap-3 shadow-xl"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
              Continue with Google
            </Button>

            <Button 
              onClick={() => {
                setResumeData({
                  name: 'Guest Student',
                  email: 'guest@example.com',
                  role: 'Full Stack Engineer',
                  experience: [
                    { title: 'Project Lead', company: 'SkillPath AI', period: '2024 - Present', desc: 'Real-time career guidance platform built with React and Gemini API.' },
                    { title: 'Backend Dev', company: 'E-commerce Engine', period: '2023 - 2024', desc: 'Scaleable backend services using microservices architecture.' }
                  ],
                  summary: 'Passionate software engineer focused on building impactful user experiences and scalable backends.',
                  skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Firebase'],
                  phone: '+1 (555) 0123-4567'
                });
                toast.success('Demo mode activated!');
              }}
              variant="outline"
              className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-cyan-400 hover:bg-white/[0.08] font-bold"
            >
              <Sparkles size={18} className="mr-2 text-cyan-400" />
              Try Demo Mode
            </Button>

            <p className="text-[10px] text-center text-white/20 uppercase tracking-widest font-black">Secure Authentication via Firebase</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">AI Resume Builder</h2>
          <p className="text-white/40">Crafting an ATS-proof resume tailored specifically for {resumeData?.role || 'your target role'}.</p>
        </div>
        {resumeData && (
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="h-12 rounded-2xl border-white/10 bg-white/5 text-white/40 hover:text-white"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Maximize2 size={18} className="mr-2" />
              Preview
            </Button>
            <Button variant="outline" className="h-12 rounded-2xl border-white/10 bg-white/5" onClick={generateResume}>
              <RefreshCcw size={18} className="mr-2" />
              Regenerate
            </Button>
            <Button 
              className={cn(
                "h-12 rounded-2xl transition-all shadow-xl font-bold",
                isFeedbackDone ? "bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20" : "bg-white/10 text-white/20 cursor-not-allowed shadow-none"
              )} 
              onClick={downloadPDF}
            >
              {isFeedbackDone ? <Download size={18} className="mr-2" /> : <Lock size={18} className="mr-2" />}
              Download PDF
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-10"
          >
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-10 right-10 text-white/40 hover:text-white bg-white/5 p-4 rounded-3xl transition-all z-10 hover:scale-110 active:scale-95"
            >
              <X size={28} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl h-[90vh] overflow-y-auto no-scrollbar rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-white"
            >
               <div className={cn(
                  "p-20 text-black min-h-full transition-all duration-700",
                  template === 'Formal' && "font-serif bg-white border-t-[15px] border-slate-900",
                  template === 'Creative' && "bg-slate-50 border-l-[80px] border-cyan-500"
               )}>
                  <header className={cn(
                    "mb-12",
                    template === 'Modern' && "border-b-2 border-slate-900 pb-12",
                    template === 'Formal' && "text-center mb-16",
                    template === 'Creative' && "mb-16 -ml-4"
                  )}>
                    <h1 className={cn(
                      "font-black tracking-tighter mb-3 uppercase leading-none",
                      template === 'Modern' && "text-6xl",
                      template === 'Formal' && "text-5xl italic",
                      template === 'Creative' && "text-7xl text-cyan-600"
                    )}>{resumeData?.name}</h1>
                    <div className={cn(
                      "flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]",
                      template === 'Formal' && "justify-center"
                    )}>
                       <span>{resumeData?.role}</span>
                       <span className="text-cyan-500">•</span>
                       <span>{resumeData?.email}</span>
                       <span className="text-cyan-500">•</span>
                       <span>{resumeData?.phone}</span>
                    </div>
                  </header>

                  <section className="mb-12">
                    <h2 className={cn(
                      "text-[10px] font-black uppercase tracking-[0.4em] mb-6 pr-4 border-r-4 border-cyan-500 inline-block",
                      template === 'Formal' ? "text-slate-900 border-none tracking-[0.6em]" : "text-slate-400"
                    )}>Professional Summary</h2>
                    <p className="text-base leading-loose text-slate-700 font-medium">{resumeData?.summary}</p>
                  </section>

                  <section className="mb-12">
                    <h2 className={cn(
                       "text-[10px] font-black uppercase tracking-[0.4em] mb-6 pr-4 border-r-4 border-cyan-500 inline-block",
                       template === 'Formal' ? "text-slate-900 border-none tracking-[0.6em]" : "text-slate-400"
                    )}>Core Competencies</h2>
                    <div className="flex flex-wrap gap-3">
                       {resumeData?.skills.map((s: string) => (
                         <span key={s} className="px-4 py-2 bg-slate-100 text-[10px] font-black rounded-lg border border-slate-200 tracking-widest">{s}</span>
                       ))}
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className={cn(
                       "text-[10px] font-black uppercase tracking-[0.4em] mb-6 pr-4 border-r-4 border-cyan-500 inline-block",
                       template === 'Formal' ? "text-slate-900 border-none tracking-[0.6em]" : "text-slate-400"
                    )}>Work History</h2>
                    {resumeData?.experience.map((exp: any, i: number) => (
                      <div key={i} className="mb-10 group">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{exp.title}</h3>
                              <p className="text-sm font-bold text-cyan-600 uppercase tracking-widest">{exp.company}</p>
                           </div>
                           <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 tracking-tighter">{exp.period}</span>
                        </div>
                        <p className={cn(
                          "text-base leading-relaxed text-slate-600",
                          template === 'Formal' && "italic border-l-4 border-slate-100 pl-6 ml-1 py-1"
                        )}>• {exp.desc}</p>
                      </div>
                    ))}
                  </section>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Editor Side */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 border-white/5 bg-white/5 rounded-[40px] space-y-8">
             <div className="flex items-center gap-4 p-4 rounded-3xl bg-cyan-500/10 border border-cyan-400/20">
               <Sparkles className="text-cyan-400" size={24} />
               <div>
                  <p className="text-sm font-bold text-white">Advanced AI Tuning</p>
                  <p className="text-xs text-white/50">Using industry keywords for {resumeData?.role || 'Tech Role'}</p>
               </div>
             </div>

             <div className="space-y-6 text-left">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Choose Template</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Modern', 'Formal', 'Creative'] as const).map(t => (
                      <button 
                        key={t} 
                        onClick={() => setTemplate(t)}
                        className={cn(
                        "h-10 rounded-xl border-2 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter transition-all",
                        template === t 
                          ? 'border-cyan-400 bg-cyan-400/5 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                          : 'border-white/5 bg-white/5 text-white/40 hover:border-white/10'
                      )}>
                        {t}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Optimize Content</label>
                  <Button 
                    onClick={handleAiTuning}
                    disabled={tuning || !resumeData}
                    className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white hover:border-cyan-400 hover:text-cyan-400 font-bold flex items-center justify-center gap-3 transition-all"
                  >
                    {tuning ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                    AI Tuning
                  </Button>
                  <p className="text-[10px] text-white/20 text-center leading-relaxed">Runs Gemini LLM to swap generic sentences with achievement-oriented metrics.</p>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Focus Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {resumeData?.skills.map((s: string) => (
                      <Badge key={s} variant="secondary" className="bg-white/5 border-white/10 px-3 py-1 text-white/60">
                        {s}
                      </Badge>
                    ))}
                  </div>
               </div>
             </div>

             {!resumeData ? (
               <Button 
                onClick={generateResume} 
                disabled={generating}
                className="w-full h-14 rounded-2xl bg-white text-black hover:bg-cyan-400 font-black text-lg shadow-2xl"
               >
                 {generating ? <Loader2 className="animate-spin" /> : 'Start AI Generation'}
               </Button>
             ) : (
                <div className="p-6 rounded-3xl bg-green-400/5 border border-green-400/20">
                   <div className="flex items-center gap-3 mb-2 text-green-400">
                     <CheckCircle size={20} />
                     <span className="font-bold">ATS Score: 94%</span>
                   </div>
                   <p className="text-xs text-white/40 leading-relaxed">
                     Perfect optimization! Your resume matches 94% of top {resumeData.role} role descriptions.
                   </p>
                </div>
             )}
           </Card>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-8 overflow-hidden rounded-[40px] border border-white/5 shadow-2xl">
           <AnimatePresence mode="wait">
             {generating ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[800px] w-full bg-white/5 backdrop-blur-md flex flex-col items-center justify-center space-y-6"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-20 w-20 border-t-4 border-l-4 border-cyan-500 rounded-full"
                  />
                  <p className="text-xl font-bold tracking-tight text-white/60">Polishing your credentials...</p>
                </motion.div>
             ) : resumeData ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="resume-preview"
                  className={cn(
                    "min-h-[842px] w-full bg-white text-black p-16 font-sans pointer-events-none transition-all duration-500",
                    template === 'Formal' && "font-serif border-t-[12px] border-slate-900",
                    template === 'Creative' && "bg-slate-50 border-l-[60px] border-cyan-500 px-12"
                  )}
                >
                  <header className={cn(
                    "mb-10",
                    template === 'Modern' && "border-b-2 border-slate-900 pb-10",
                    template === 'Formal' && "text-center mb-12",
                    template === 'Creative' && "mb-12"
                  )}>
                    <h1 className={cn(
                      "font-black tracking-tight mb-2 uppercase",
                      template === 'Modern' && "text-5xl",
                      template === 'Formal' && "text-4xl italic",
                      template === 'Creative' && "text-6xl text-cyan-600"
                    )}>{resumeData.name}</h1>
                    <div className={cn(
                      "flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest",
                      template === 'Formal' && "justify-center"
                    )}>
                       <span>{resumeData.role}</span>
                       <span className="text-cyan-500">•</span>
                       <span>{resumeData.email}</span>
                       <span className="text-cyan-500">•</span>
                       <span>{resumeData.phone}</span>
                    </div>
                  </header>

                  <section className="mb-10">
                    <h2 className={cn(
                      "text-[10px] font-black uppercase tracking-[0.3em] mb-4 pr-3 border-r-2 border-cyan-500 inline-block",
                      template === 'Modern' ? "text-slate-400" : "text-slate-900 border-none"
                    )}>Summary</h2>
                    <p className="text-sm leading-relaxed text-slate-700 font-medium">{resumeData.summary}</p>
                  </section>

                  <section className="mb-10">
                    <h2 className={cn(
                       "text-[10px] font-black uppercase tracking-[0.3em] mb-4 pr-3 border-r-2 border-cyan-500 inline-block",
                        template === 'Modern' ? "text-slate-400" : "text-slate-900 border-none"
                    )}>Core Arsenal</h2>
                    <div className="flex flex-wrap gap-2 uppercase">
                       {resumeData.skills.map((s: string) => (
                         <span key={s} className="px-3 py-1.5 bg-slate-100 text-[10px] font-black rounded-lg border border-slate-200">{s}</span>
                       ))}
                    </div>
                  </section>

                  <section className="mb-10">
                    <h2 className={cn(
                       "text-[10px] font-black uppercase tracking-[0.3em] mb-4 pr-3 border-r-2 border-cyan-500 inline-block",
                        template === 'Modern' ? "text-slate-400" : "text-slate-900 border-none"
                    )}>Field Operations</h2>
                    {resumeData.experience.map((exp: any, i: number) => (
                      <div key={i} className="mb-8 relative">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <h3 className="text-xl font-black text-slate-900 leading-tight">{exp.title}</h3>
                              <p className="text-sm font-bold text-cyan-600 mb-1">{exp.company}</p>
                           </div>
                           <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{exp.period}</span>
                        </div>
                        <p className={cn(
                          "text-sm leading-relaxed text-slate-600",
                          template === 'Formal' && "italic border-l-2 border-slate-200 pl-4 ml-1"
                        )}>• {exp.desc}</p>
                      </div>
                    ))}
                  </section>
                </motion.div>
             ) : (
                <Card className="h-[800px] w-full border border-dashed border-white/10 bg-white/2 flex flex-col items-center justify-center p-12 rounded-[40px] text-center">
                  <div className="p-8 rounded-[40px] bg-white/5 mb-8">
                    <FileText className="text-cyan-500/40" size={60} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Your Masterpiece Awaits</h3>
                  <p className="text-white/30 max-w-sm font-medium">Hit start and let our AI engine synthesize your career milestones into a precision-engineered professional profile.</p>
                </Card>
             )}
           </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-30">
        <div className="mx-auto max-w-5xl flex items-center justify-between p-6 rounded-[32px] bg-zinc-900 text-white border border-white/10 shadow-3xl shadow-black">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-inner">
               <Eye size={28} />
             </div>
             <div>
               <h4 className="font-bold flex items-center gap-2">
                 Phase Complete
                 <Badge className="bg-green-500/20 text-green-400 border-none text-[8px] font-black uppercase">Success</Badge>
               </h4>
               <p className="text-white/40 text-xs mt-1">Review your generated assets before transitioning to the community hub.</p>
             </div>
          </div>
          <Button 
            onClick={onComplete}
            className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-cyan-400 transition-all font-black text-sm shadow-xl shadow-cyan-500/20"
          >
            Explore Community
          </Button>
        </div>
      </div>
    </div>
  );
}
