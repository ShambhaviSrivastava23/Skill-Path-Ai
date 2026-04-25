import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCircle, 
  Target, 
  LayoutDashboard, 
  Map, 
  FileText, 
  Users, 
  MessageSquare,
  CheckCircle2, 
  ChevronRight,
  Menu,
  X,
  Lock,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const steps = [
  { path: '/onboarding', label: 'Onboarding', icon: UserCircle },
  { path: '/assessment', label: 'Skill Check', icon: Target },
  { path: '/dashboard', label: 'Gap Analysis', icon: LayoutDashboard },
  { path: '/roadmap', label: 'Career Map', icon: Map },
  { path: '/resume', label: 'AI Resume', icon: FileText },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/feedback', label: 'Feedback', icon: MessageSquare },
];

export default function AppLayout({ currentStep, completedSteps }: { currentStep: number; completedSteps: number[] }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-20 flex flex-col border-r border-white/10 bg-black/50 backdrop-blur-xl"
      >
        <div className="flex h-20 items-center justify-between px-6">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold tracking-tighter text-white"
              >
                SKILLPATH<span className="text-cyan-400">AI</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-2 hover:bg-white/5"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-4 px-4 py-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-6 px-2">Career Journey</div>
          {steps.map((step, index) => {
            const isActive = location.pathname === step.path;
            const isCompleted = completedSteps.includes(index - 1) || index === 0;
            const isLocked = !completedSteps.includes(index - 1) && index !== 0 && step.path !== '/community' && step.path !== '/feedback';

            return (
              <div key={step.path} className="relative">
                <Link
                  to={isLocked ? '#' : step.path}
                  onClick={(e) => {
                    if (isLocked) {
                      e.preventDefault();
                      toast.error(`Please complete the previous step first!`, {
                        description: `You need to finish ${steps[index - 1].label} first.`,
                      });
                    }
                  }}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-xl p-3 transition-all duration-300",
                    isActive ? "bg-white/5 text-white" : "text-white/40 hover:text-white",
                    isLocked && "cursor-not-allowed grayscale pointer-events-none opacity-10"
                  )}
                >
                  <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black transition-all",
                    isActive ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]" : 
                    isCompleted ? "border-cyan-500/50 text-cyan-400" : "border-white/20 text-white/20",
                    isLocked && "border-white/10 text-white/5"
                  )}>
                    {isLocked ? <Lock size={10} /> : (index + 1 < 10 ? `0${index + 1}` : index + 1)}
                  </div>
                  
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={cn("text-xs font-bold tracking-tight", isActive ? "text-white" : "text-slate-400")}
                      >
                        {step.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isActive && isSidebarOpen && (
                    <motion.div
                      layoutId="active-glow"
                      className="absolute -left-1 h-8 w-1 bg-cyan-500 rounded-full blur-[2px]"
                    />
                  )}
                </Link>
                {isLocked && (
                  <div className="absolute inset-0 bg-transparent z-10 cursor-not-allowed" 
                    onClick={() => toast.error("Step Locked", { description: `Complete ${steps[index - 1].label} to unlock.` })}
                  />
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-4 border border-white/5">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/50">
              <span>Overall Progress</span>
              <span>{Math.round((completedSteps.length / steps.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              />
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden pt-6 px-6 pb-20">
        <div className="mx-auto max-w-5xl mb-8">
           <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Sparkles size={16} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Current Stage</p>
                    <p className="text-xs font-bold text-white">{steps.find(s => s.path === location.pathname)?.label || 'Overview'}</p>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                 <div className="hidden md:flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Progress</p>
                    <div className="h-1 w-24 rounded-full bg-white/5 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                         className="h-full bg-cyan-500"
                       />
                    </div>
                 </div>
                 <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-tighter">
                    {completedSteps.length} / {steps.length} Steps
                 </div>
              </div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-5xl h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        
        {/* Floating AI Assistant Shadow */}
        <div className="fixed bottom-8 right-8 z-50">
           <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 blur-[1px] hover:blur-0 transition-all"
           >
             <UserCircle size={28} />
           </motion.button>
        </div>
      </main>
    </div>
  );
}
