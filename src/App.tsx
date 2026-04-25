/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LandingPage from './screens/LandingPage';
import OnboardingWizard from './screens/OnboardingWizard';
import SkillAssessment from './screens/SkillAssessment';
import GapDashboard from './screens/GapDashboard';
import LearningRoadmap from './screens/LearningRoadmap';
import ResumeGenerator from './screens/ResumeGenerator';
import CommunityFeed from './screens/CommunityFeed';
import FeedbackPage from './screens/FeedbackPage';
import NewsDetails from './screens/NewsDetails';
import AppLayout from './components/AppLayout';
import AIChatMentor from './components/AIChatMentor';

function AppContent() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  // Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Load progress from local storage
  useEffect(() => {
    const saved = localStorage.getItem('skillpath_progress');
    if (saved) {
      const { completed, current } = JSON.parse(saved);
      setCompletedSteps(completed);
      setCurrentStep(current);
    }
  }, []);

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      const newCompleted = [...completedSteps, step];
      setCompletedSteps(newCompleted);
      const nextStepIndex = step + 1;
      const paths = ['/onboarding', '/assessment', '/dashboard', '/roadmap', '/resume', '/community'];
      
      setCurrentStep(nextStepIndex);
      localStorage.setItem('skillpath_progress', JSON.stringify({
        completed: newCompleted,
        current: nextStepIndex
      }));

      if (nextStepIndex < paths.length) {
        navigate(paths[nextStepIndex]);
      }
    } else {
       // Just navigate if already completed
       const nextStepIndex = step + 1;
       const paths = ['/onboarding', '/assessment', '/dashboard', '/roadmap', '/resume', '/community'];
       if (nextStepIndex < paths.length) {
         navigate(paths[nextStepIndex]);
       }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      <Routes>
        <Route path="/" element={<LandingPage onStart={() => completeStep(-1)} />} />
        
        <Route element={<AppLayout currentStep={currentStep} completedSteps={completedSteps} />}>
          <Route path="/onboarding" element={<OnboardingWizard onComplete={() => completeStep(0)} />} />
          <Route 
            path="/assessment" 
            element={completedSteps.includes(0) ? <SkillAssessment onComplete={() => completeStep(1)} /> : <Navigate to="/onboarding" />} 
          />
          <Route 
            path="/dashboard" 
            element={completedSteps.includes(1) ? <GapDashboard onComplete={() => completeStep(2)} /> : <Navigate to="/assessment" />} 
          />
          <Route 
            path="/roadmap" 
            element={completedSteps.includes(2) ? <LearningRoadmap onComplete={() => completeStep(3)} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/resume" 
            element={completedSteps.includes(3) ? <ResumeGenerator onComplete={() => completeStep(4)} /> : <Navigate to="/roadmap" />} 
          />
          <Route 
            path="/community" 
            element={completedSteps.includes(4) ? <CommunityFeed /> : <Navigate to="/resume" />} 
          />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/news/:id" element={<NewsDetails />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" theme="dark" richColors />
      <AIChatMentor />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


