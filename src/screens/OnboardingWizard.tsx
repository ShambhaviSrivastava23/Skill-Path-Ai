import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { User, Briefcase, GraduationCap, Target, ChevronRight, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: '',
    fullName: '',
    collegeName: '',
    phone: '',
    email: '',
    gender: '',
    degree: '',
    specialization: '',
    year: '',
    targetRole: ''
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const nextStep = async () => {
    if (step === 1 && !formData.userType) return toast.error('Please select your experience type');
    if (step === 2 && (!formData.fullName || !formData.email || !formData.phone || !formData.gender)) {
      return toast.error('Please fill in all personal details');
    }
    if (step === 3 && (!formData.collegeName || !formData.degree || !formData.year)) {
      return toast.error('Please provide your educational background');
    }
    if (step === 4 && !formData.targetRole) {
      return toast.error('Please select a target job role');
    }
    
    if (step === 4) {
      setLoading(true);
      try {
        localStorage.setItem('skillpath_target_role', formData.targetRole);
        
        // Save to Firebase if user is logged in
        if (auth.currentUser) {
          const profilePath = `users/${auth.currentUser.uid}/profile/main`;
          try {
            await setDoc(doc(db, profilePath), {
              ...formData,
              updatedAt: new Date().toISOString()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, profilePath);
          }
        }
        
        onComplete();
      } catch (error) {
        toast.error('Failed to save profile. Proceeding anyway.');
        onComplete();
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <div className="w-full max-w-2xl">
        {/* Step Progress */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Step {step} of {totalSteps}</span>
            <span className="text-xs font-bold text-white/50">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-1 bg-white/5" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-black tracking-tight mb-2">Welcome to your future.</h2>
                <p className="text-white/50">Are you starting out or already on your journey?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'fresher', label: 'Fresher', icon: GraduationCap, desc: 'Student or recent graduate' },
                  { id: 'experienced', label: 'Experienced', icon: Briefcase, desc: 'Professional looking to grow' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateForm('userType', type.id)}
                    className={`relative p-8 rounded-3xl border-2 transition-all duration-300 text-left group ${
                      formData.userType === type.id 
                        ? 'border-cyan-400 bg-cyan-400/5' 
                        : 'border-white/5 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                      formData.userType === type.id ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/40 group-hover:text-white'
                    }`}>
                      <type.icon size={24} />
                    </div>
                    <div className="font-bold text-xl mb-1">{type.label}</div>
                    <div className="text-sm text-white/40">{type.desc}</div>
                    {formData.userType === type.id && (
                      <motion.div layoutId="check" className="absolute top-4 right-4 h-2 w-2 rounded-full bg-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black tracking-tight mb-2">Basic Details</h2>
                <p className="text-white/50">Let's get to know you better</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">Full Name</label>
                  <Input 
                    placeholder="Enter your full name" 
                    value={formData.fullName}
                    onChange={(e) => updateForm('fullName', e.target.value)}
                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all px-6"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">Email</label>
                    <Input 
                      placeholder="Email address" 
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-cyan-400 px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">Gender</label>
                    <Select onValueChange={(v) => updateForm('gender', v)} value={formData.gender}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 px-6">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">Phone</label>
                  <Input 
                    placeholder="Phone number" 
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-cyan-400 px-6"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black tracking-tight mb-2">Education</h2>
                <p className="text-white/50">Where are you learning?</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">College/University</label>
                  <Input 
                    placeholder="e.g. Stanford University" 
                    value={formData.collegeName}
                    onChange={(e) => updateForm('collegeName', e.target.value)}
                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-cyan-400 px-6"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">Degree</label>
                    <Select onValueChange={(v) => updateForm('degree', v)} value={formData.degree}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 px-6">
                        <SelectValue placeholder="Select Degree" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="btech">B.Tech / B.E.</SelectItem>
                        <SelectItem value="mca">MCA</SelectItem>
                        <SelectItem value="bca">BCA</SelectItem>
                        <SelectItem value="mba">MBA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-white/40 ml-1">Year</label>
                    <Select onValueChange={(v) => updateForm('year', v)} value={formData.year}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 px-6">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">Final Year</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black tracking-tight mb-2">Career Goals</h2>
                <p className="text-white/50">What's your dream role?</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/40 ml-1">Target Job Role</label>
                  <Select onValueChange={(v) => updateForm('targetRole', v)} value={formData.targetRole}>
                    <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 px-10 relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
                      <SelectValue placeholder="Select your target role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                      <SelectItem value="frontend">Frontend Developer</SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="data">Data Scientist / Analyst</SelectItem>
                      <SelectItem value="uiux">UI/UX Designer</SelectItem>
                      <SelectItem value="product">Product Manager</SelectItem>
                      <SelectItem value="cyber">Cyber Security Analyst</SelectItem>
                      <SelectItem value="devops">DevOps Engineer</SelectItem>
                      <SelectItem value="mobile">Mobile App Developer</SelectItem>
                      <SelectItem value="ai">AI/ML Engineer</SelectItem>
                      <SelectItem value="cloud">Cloud Architect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Card className="p-6 bg-cyan-400/5 border-cyan-400/20 rounded-3xl flex items-start space-x-4">
                  <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">AI Insight:</p>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Great choice! The {formData.targetRole || 'selected'} role is currently in high demand with a 15% year-on-year growth. We'll calibrate your assessment to these requirements.
                    </p>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={prevStep} className="h-12 px-6 rounded-2xl hover:bg-white/5">
              <ChevronLeft className="mr-2" size={18} />
              Back
            </Button>
          ) : <div />}
          <Button 
            onClick={nextStep} 
            disabled={
              loading || 
              (step === 1 && !formData.userType) ||
              (step === 2 && (!formData.fullName || !formData.email || !formData.phone || !formData.gender)) ||
              (step === 3 && (!formData.collegeName || !formData.degree || !formData.year)) ||
              (step === 4 && !formData.targetRole)
            }
            className="h-12 px-10 rounded-2xl bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:grayscale transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : step === totalSteps ? 'Proceed to Assessment' : 'Next Step'}
            {!loading && <ChevronRight className="ml-2" size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
