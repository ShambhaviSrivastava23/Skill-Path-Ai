import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  BookOpen, 
  Code, 
  Award, 
  CheckCircle, 
  ChevronRight, 
  PlayCircle,
  Clock,
  Flame,
  Star,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const roadmap = [
  {
    week: 'Week 1',
    topic: 'Mastering Back-end Fundamentals',
    desc: 'Deep dive into Node.js event loop, asynchronous patterns, and Express.js middleware architecting.',
    type: 'video',
    tasks: ['Complete Node.js Core Course', 'Build a custom Auth Middleware', 'Understand Streams & Buffers'],
    status: 'current',
    time: '12-14 Hours'
  },
  {
    week: 'Week 2',
    topic: 'Database Orchestration',
    desc: 'Advanced SQL queries, PostgreSQL indexing strategies, and introduction to NoSQL with MongoDB.',
    type: 'code',
    tasks: ['Join & Subquery Practice', 'Indexing Performance Test', 'Schema Design for E-commerce'],
    status: 'upcoming',
    time: '15-18 Hours'
  },
  {
    week: 'Week 3',
    topic: 'System Design Patterns',
    desc: 'Caching with Redis, Load Balancers, and scaling horizontal vs vertical.',
    type: 'theory',
    tasks: ['Read System Design Primer', 'Cache-aside strategy implementation', 'Vertical scaling simulation'],
    status: 'upcoming',
    time: '10-12 Hours'
  },
  {
    week: 'Week 4',
    topic: 'Capstone Integration',
    desc: 'Building a real-time collaborative tool using WebSockets and the full MERN stack.',
    type: 'project',
    tasks: ['Socket.io integration', 'End-to-end testing', 'Deployment on Cloud Run'],
    status: 'upcoming',
    time: '20+ Hours'
  }
];

export default function LearningRoadmap({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="py-8 space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Flame size={20} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">3 Day Streak</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight">Your AI Roadmap</h2>
          <p className="text-white/40">Customized 4-week intensive path to bridge your technical gaps.</p>
        </div>
        <div className="flex gap-4">
          <Card className="bg-white/5 border-white/10 p-4 rounded-3xl flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
               <Award size={20} />
             </div>
             <div>
               <p className="text-[10px] uppercase font-bold text-white/40">Certifications</p>
               <p className="text-sm font-bold">2 Suggested</p>
             </div>
          </Card>
          <Card className="bg-white/5 border-white/10 p-4 rounded-3xl flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
               <Code size={20} />
             </div>
             <div>
               <p className="text-[10px] uppercase font-bold text-white/40">Projects</p>
               <p className="text-sm font-bold">1 Major</p>
             </div>
          </Card>
        </div>
      </div>

      {/* Main Roadmap Timeline */}
      <div className="relative space-y-24 mt-16 pb-20">
        {/* Animated Flowline */}
        <div className="absolute left-8 top-10 bottom-10 w-[2px] bg-gradient-to-b from-cyan-500 via-cyan-500/20 to-zinc-900 overflow-hidden">
           <motion.div 
             animate={{ y: [0, 500] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="h-20 w-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
           />
        </div>

        {roadmap.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
            className="relative pl-24 group"
          >
            {/* Timeline Connector Dot with Pulse Pointers */}
            <div className={`absolute left-0 top-6 h-16 w-16 rounded-full flex items-center justify-center border-4 border-black transition-all duration-500 z-10 ${
              step.status === 'current' ? 'bg-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.5)] ring-8 ring-cyan-500/10' : 'bg-zinc-900 border-zinc-800'
            }`}>
              {step.status === 'current' ? (
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full bg-black" 
                  />
                  <PlayCircle size={28} className="text-black relative z-10" />
                </div>
              ) : (
                <div className="h-3 w-3 rounded-full bg-zinc-700" />
              )}
              
              {/* Flowchart Arrow Pointer */}
              {step.status === 'current' && (
                <motion.div 
                  animate={{ x: [-10, 0, -10] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 text-cyan-400"
                >
                  <ChevronRight size={32} strokeWidth={3} />
                </motion.div>
              )}
            </div>

            <Card className={`p-8 rounded-[32px] border-white/5 transition-all duration-500 group-hover:bg-white/[0.08] ${
              step.status === 'current' ? 'bg-white/10 border-white/20' : 'bg-white/5 opacity-60'
            }`}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-white/10 text-white/60 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      {step.week}
                    </Badge>
                    <Badge variant="outline" className="border-white/10 text-white/40 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Clock size={10} />
                      {step.time}
                    </Badge>
                    {step.status === 'current' && (
                      <Badge className="bg-cyan-500 text-black rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest animate-pulse">
                         In Progress
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.topic}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-8">{step.desc}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.tasks.map((task, j) => (
                      <div key={j} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center">
                           {step.status === 'current' && j === 0 ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="h-2 w-2 rounded-full bg-cyan-400" /> : null}
                        </div>
                        <span className="text-xs text-white/60 font-medium">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-4">
                   <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Resources</span>
                        <BookOpen size={14} className="text-cyan-400" />
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center justify-between text-xs group/item cursor-pointer">
                           <span className="text-white/50 group-hover/item:text-cyan-400 transition-colors">Documentation</span>
                           <ChevronRight size={12} />
                         </div>
                         <div className="flex items-center justify-between text-xs group/item cursor-pointer">
                           <span className="text-white/50 group-hover/item:text-cyan-400 transition-colors">Lab Workspace</span>
                           <ChevronRight size={12} />
                         </div>
                      </div>
                   </div>
                   {step.status === 'current' && (
                     <Button 
                       onClick={() => toast.success("Course module assigned! Redirecting to workspace...")}
                       className="w-full h-12 rounded-2xl bg-white text-black hover:bg-cyan-400 hover:text-black font-bold"
                     >
                       Start Today's Goal
                     </Button>
                   )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button 
          variant="outline" 
          className="h-14 px-10 rounded-2xl border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
        >
          <Sparkles className="mr-2 h-5 w-5 text-cyan-400" />
          Regenerate Roadmap via AI
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-30">
        <div className="mx-auto max-w-5xl flex items-center justify-between p-6 rounded-3xl bg-cyan-500 text-white shadow-2xl shadow-cyan-500/20">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-black/20 flex items-center justify-center">
               <CheckCircle size={24} />
             </div>
             <div>
               <h4 className="font-bold">Next Milestone: Ready to Build?</h4>
               <p className="text-white/80 text-sm">Once you finish Week 1, your resume will look significantly stronger.</p>
             </div>
          </div>
          <Button 
            onClick={onComplete}
            className="h-12 px-8 rounded-2xl bg-black text-white hover:bg-zinc-800 transition-all font-bold"
          >
            Build My Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
