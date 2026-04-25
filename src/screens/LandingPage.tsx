import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, BarChart3, FileText, Sparkles, X, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const navigate = useNavigate();

  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleStart = () => {
    onStart();
    navigate('/onboarding');
  };

  const features = [
    { icon: Target, title: 'Skill Assessment', desc: 'Role-based dynamic quizzes to test your tech proficiency.' },
    { icon: BarChart3, title: 'Gap Dashboard', desc: 'Visual analytics showing exactly where you stand against industry standards.' },
    { icon: Zap, title: 'AI Roadmap', desc: 'Personalized learning path generated specifically for your career goals.' },
    { icon: FileText, title: 'AI Resume', desc: 'Build ATS-perfect resumes with real-time AI suggestions.' },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/skillpath-ai', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/company/skillpath-ai', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/skillpath_ai', label: 'Twitter' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black selection:bg-cyan-500/30">
      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
            onClick={() => setIsDemoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-[40px] border border-white/10 bg-zinc-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsDemoOpen(false)}
                className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                <X size={24} />
              </button>
              
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/S7xTBa93TX8?autoplay=1"
                title="Product Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Animated Background Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full bg-cyan-500/20 blur-[120px]" 
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-purple-500/20 blur-[120px]" 
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white/70 tracking-tight">The Future of Career Guidance is Here</span>
          </div>
          
          <h1 className="mb-8 text-6xl font-black tracking-tighter sm:text-8xl">
            SKILLPATH <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">AI</span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-2xl text-lg text-white/50 sm:text-xl leading-relaxed">
            Your AI Career Mentor. Navigate your professional journey with precision-engineered AI feedback, real-time market analytics, and adaptive learning paths.
          </p>

          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <Button 
              size="lg" 
              onClick={handleStart}
              className="h-14 px-10 text-lg font-bold rounded-2xl bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-xl shadow-cyan-500/10"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsDemoOpen(true)}
                className="h-14 px-10 text-lg font-medium rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-cyan-500/50 transition-all shadow-2xl shadow-cyan-500/10"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-32 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <div 
              key={i}
              className="group relative rounded-3xl border border-white/5 bg-white/5 p-8 text-left backdrop-blur-xl transition-all hover:border-white/10 hover:bg-white/[0.08]"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-400">
                <f.icon size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Footer with Social Links */}
        <footer className="mt-40 border-t border-white/5 pt-12 pb-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-left">
              <h2 className="text-2xl font-black tracking-tighter text-white mb-2">
                SKILLPATH <span className="text-cyan-400">AI</span>
              </h2>
              <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold">
                Empowering the next generation of engineers
              </p>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/40 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                  aria-label={link.label}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>

            <div className="text-sm text-white/20 font-medium">
              © {new Date().getFullYear()} SkillPath AI. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Floating Decoration */}
        <div className="mt-8 flex justify-center">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-full bg-cyan-500/20 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-black p-4 backdrop-blur-md">
              <Sparkles className="text-cyan-400 h-8 w-8" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
