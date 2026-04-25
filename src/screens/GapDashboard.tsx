import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Sparkles,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const data = [
  { subject: 'Frontend', A: 85, fullMark: 100 },
  { subject: 'Backend', A: 60, fullMark: 100 },
  { subject: 'Database', A: 50, fullMark: 100 },
  { subject: 'DSA', A: 40, fullMark: 100 },
  { subject: 'System Design', A: 30, fullMark: 100 },
  { subject: 'Soft Skills', A: 90, fullMark: 100 },
];

export default function GapDashboard({ onComplete }: { onComplete: () => void }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'profile', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    }
    fetchProfile();
  }, []);
  return (
    <div className="py-8 space-y-8 relative">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">
            Skill Analysis{profile?.fullName ? ` of ${profile.fullName}` : ''}
          </h2>
          <p className="text-white/40">Visualizing your journey to becoming a <span className="text-white font-bold">{profile?.targetRole || 'Full Stack Developer'}</span>.</p>
        </div>
        <div className="flex items-center space-x-4 bg-white/[0.03] border border-white/10 p-5 rounded-[32px] backdrop-blur-xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/5">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
             />
             <motion.span 
               initial={{ scale: 1 }}
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="text-xl font-black text-white"
             >
               58
             </motion.span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/50">Readiness Score</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white">Needs Development</p>
              <motion.div 
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <Card className="lg:col-span-2 p-10 border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[48px] overflow-hidden group">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Sparkles className="text-cyan-400" size={24} />
              Skill Proficiency
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Updated in Real-time</span>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 700 }} />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="#22d3ee"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Insight Card */}
        <div className="space-y-6">
          <Card className="p-8 border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-[40px] relative overflow-hidden group">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -top-12 -right-12 h-24 w-24 bg-cyan-400/20 blur-3xl"
            />
            <Sparkles className="text-cyan-400 mb-6" size={32} />
            <h4 className="text-xl font-bold mb-4">AI Mentor Says:</h4>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              "Your Frontend and Soft Skills are top-tier! However, to reach 'Placement Ready' status for a Full Stack role, we need to bridge the gap in <strong>System Design</strong> and <strong>DSA</strong>."
            </p>
            <div className="space-y-3">
               <div className="flex items-center text-xs text-white/40 gap-2">
                 <TrendingUp size={14} className="text-green-400" />
                 <span>Frontend: Top 10% of candidates</span>
               </div>
               <div className="flex items-center text-xs text-white/40 gap-2">
                 <AlertCircle size={14} className="text-orange-400" />
                 <span>Back-end needs consistent practice</span>
               </div>
            </div>
          </Card>

          <Card className="p-8 border-white/5 bg-white/5 rounded-[40px] flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-lg mb-2">Target Role Benchmarks</h4>
              <p className="text-xs text-white/30 mb-6 uppercase tracking-widest">Industry Average vs You</p>
              
              <div className="space-y-4">
                {[
                  { label: 'Coding Speed', val: 40, avg: 65 },
                  { label: 'Problem Solving', val: 30, avg: 70 },
                  { label: 'Tech Stack depth', val: 80, avg: 50 },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-white/60">{item.label}</span>
                      <span className="text-white/40">{item.val}% / {item.avg}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                       <div className="h-full bg-cyan-400/50" style={{ width: `${item.val}%` }} />
                       <div className="h-full bg-white/10" style={{ width: `${item.avg - item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="text-green-400" size={20} />
            Strengths Areas
          </h3>
          <div className="grid grid-cols-1 gap-3">
             {['React & Modern Hooks', 'Component Architecture', 'Tailwind CSS Mastery', 'Cross-team Communication'].map((s, i) => (
               <div key={i} className="p-4 rounded-2xl bg-green-400/5 border border-green-400/10 text-green-400 text-sm font-medium">
                 {s}
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="text-orange-400" size={20} />
            Weak Areas (Gaps)
          </h3>
          <div className="grid grid-cols-1 gap-3">
             {['PostgreSQL & NoSQL Databases', 'REST API Optimization', 'Low-level System Design', 'Array & String DSA'].map((w, i) => (
               <div key={i} className="p-4 rounded-2xl bg-orange-400/5 border border-orange-400/10 text-orange-400 text-sm font-medium">
                 {w}
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between p-8 rounded-[40px] bg-white text-black">
        <div className="flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-black flex items-center justify-center text-white">
            <BarChart3 size={28} />
          </div>
          <div>
            <h4 className="text-xl font-black">All set for your personal roadmap?</h4>
            <p className="text-black/50 text-sm">We've identified 4 critical gaps to bridge this month.</p>
          </div>
        </div>
        <Button 
          onClick={onComplete}
          className="h-14 px-10 rounded-2xl bg-black text-white hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 group"
        >
          Generate Learning Roadmap
          <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
