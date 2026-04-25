import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, MessageSquare, Send, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FEEDBACK_QUESTIONS = [
  {
    q: "How would you rate the clarity of the career roadmaps?",
    options: ["Exceeds Expectations", "Meets Expectations", "Needs Improvement", "Poor"]
  },
  {
    q: "How accurate was the AI Skill Assessment for your target role?",
    options: ["Extremely Accurate", "Somewhat Accurate", "Neutral", "Inaccurate"]
  },
  {
    q: "What do you think about the platform's visual design?",
    options: ["Modern & Sleek", "Good but Busy", "Functional", "Outdated"]
  },
  {
    q: "How likely are you to recommend SkillPath AI to a friend?",
    options: ["Very Likely", "Likely", "Unlikely", "Never"]
  },
  {
    q: "Which feature did you find most useful?",
    options: ["AI Roadmap", "Gap Analysis", "Resume Builder", "AI Mentor Chat"]
  }
];

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQ] === undefined) return toast.error("Please pick an option!");
    
    if (currentQ < FEEDBACK_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setIsSubmitted(true);
      localStorage.setItem('skillpath_feedback_completed', 'true');
      toast.success("Thank you for your feedback!");
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           className="h-24 w-24 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight">Feedback Received!</h2>
          <p className="text-white/40 max-w-sm mx-auto">Your insights help us train our AI career mentor to be more helpful for every student.</p>
        </div>
        <Button 
          onClick={() => navigate('/community')}
          className="h-14 px-12 rounded-2xl bg-white text-black font-bold hover:bg-cyan-400 transition-all"
        >
          Return to Community
        </Button>
      </div>
    );
  }

  const progress = ((currentQ + 1) / FEEDBACK_QUESTIONS.length) * 100;

  return (
    <div className="py-12 max-w-2xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white/40 hover:text-white">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-cyan-400" size={20} />
          <span className="text-sm font-bold uppercase tracking-widest text-cyan-400">Platform Feedback</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1 bg-white/5" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="space-y-10"
        >
          <div className="space-y-4">
             <h3 className="text-3xl font-bold leading-tight text-white">{FEEDBACK_QUESTIONS[currentQ].q}</h3>
             <p className="text-white/40 text-sm">Help us improve the SkillPath AI experience.</p>
          </div>

          <div className="grid gap-4">
             {FEEDBACK_QUESTIONS[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300 text-left ${
                    answers[currentQ] === i 
                      ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                      : 'border-white/5 bg-white/5 hover:border-white/10'
                  }`}
                >
                  <span className={`font-bold ${answers[currentQ] === i ? 'text-white' : 'text-white/40'}`}>{opt}</span>
                  {answers[currentQ] === i ? <CheckCircle2 className="text-cyan-400" size={20} /> : <Circle className="text-white/10" size={20} />}
                </button>
             ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end pt-8">
        <Button 
          onClick={handleNext}
          disabled={answers[currentQ] === undefined}
          className="h-14 px-12 rounded-2xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 shadow-xl shadow-cyan-500/20 disabled:opacity-50 disabled:grayscale transition-all"
        >
          {currentQ === FEEDBACK_QUESTIONS.length - 1 ? 'Submit Feedback' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
