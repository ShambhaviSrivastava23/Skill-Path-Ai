import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Loader2, Sparkles, Target } from 'lucide-react';
import { toast } from 'sonner';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const MOCK_QUESTIONS: Record<string, any[]> = {
  fullstack: [
    { q: "What is the primary difference between REST API and GraphQL?", options: ["Stateless vs Stateful", "Over-fetching vs Precise fetching", "Speed", "Security"] },
    { q: "Which of these is a popular CSS utility-first framework?", options: ["Bootstrap", "Tailwind CSS", "Semantic UI", "Foundation"] },
    { q: "What does SQL stand for?", options: ["Simple Query Language", "Structured Query Language", "Sequential Query Logic", "Standard Query Library"] },
    { q: "Which HTTP method is considered idempotent?", options: ["POST", "PUT", "PATCH", "CONNECT"] },
    { q: "What is the primary purpose of the 'Virtual DOM' in React?", options: ["Directly manipulation of HTML", "Improving performance via diffing", "Storing global state", "Handling browser history"] },
    { q: "Which node module is used for handling file paths?", options: ["path", "fs", "http", "url"] },
    { q: "What is a 'Closure' in JavaScript?", options: ["A way to close the browser", "A function with its lexical environment", "A data encryption method", "A specific loop type"] },
    { q: "What does 'ACID' stand for in database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Access, Cache, Index, Distribution", "Array, Collection, Item, Data", "Archive, Compile, Install, Deploy"] },
    { q: "Which of these is NOT a NoSQL database?", options: ["MongoDB", "Redis", "Cassandra", "PostgreSQL"] },
    { q: "What is the default port for most React development servers?", options: ["8080", "5000", "3000", "1234"] },
    { q: "What is 'Hoisting' in JavaScript?", options: ["Lifting weights", "Variables/functions declaration moved to top", "Server deployment", "Data compression"] },
    { q: "Which tool is used to manage different versions of Node.js?", options: ["NPM", "NVM", "Yarn", "Webpack"] },
    { q: "What is the 'Spread' operator in ES6?", options: ["...", "&&", "||", "??"] },
    { q: "Which status code represents a 'Not Found' error?", options: ["200", "403", "404", "500"] },
    { q: "What is 'Debouncing' used for?", options: ["Styling buttons", "Optimizing frequent event execution", "Database indexing", "Server cooling"] },
    { q: "What is the main advantage of TypeScript?", options: ["Faster execution", "Static type checking", "Automatic CSS generation", "Database hosting"] },
    { q: "Which of these is a popular Backend framework for JS?", options: ["Angular", "Vue", "Express", "Sass"] },
    { q: "What is JWT?", options: ["JavaScript Web Token", "JSON Web Tool", "JSON Web Token", "Java Web Transport"] },
    { q: "What is the difference between '==' and '==='?", options: ["Value vs Type+Value", "No difference", "Speed", "Boolean vs String"] },
    { q: "Which command initializes a git repository?", options: ["git start", "git init", "git repo", "git new"] }
  ],
  frontend: [
    { q: "What hook is used for side effects in React?", options: ["useState", "useContext", "useEffect", "useMemo"] },
    { q: "Which tag is used for the largest heading in HTML?", options: ["<h6>", "<h1>", "<header>", "<head>"] },
    { q: "What is the box model in CSS?", options: ["A layout mode", "Padding, Border, Margin around content", "An animation tool", "A database structure"] },
    { q: "What does 'Specificity' in CSS refer to?", options: ["How fast a site loads", "Which rule is applied to an element", "Grid column count", "Font size units"] },
    { q: "Which property is used to change the background color?", options: ["color", "bg-color", "background-color", "fill"] },
    { q: "What is the difference between 'em' and 'rem' units?", options: ["One is relative to parent, one to root", "One is absolute, one relative", "Pixels vs Points", "There is no difference"] },
    { q: "How do you center a flex item vertically?", options: ["justify-content: center", "align-items: center", "text-align: middle", "vertical-align: top"] },
    { q: "What is Semantic HTML?", options: ["HTML with emojis", "Meaningful tags for accessibility/SEO", "HTML written in JS", "Deprecated tags"] },
    { q: "Which company developed React?", options: ["Google", "Microsoft", "Meta (Facebook)", "Amazon"] },
    { q: "What is Webpack?", options: ["A web browser", "A module bundler", "A CSS framework", "A database"] },
    { q: "What is the 'Alt' attribute used for in <img> tags?", options: ["Image filter", "Alternative text for screen readers", "Image resolution", "Source URL"] },
    { q: "Which lifecycle method is triggered first in Class components?", options: ["componentDidMount", "render", "constructor", "componentWillUnmount"] },
    { q: "What is the purpose of 'Keys' in React lists?", options: ["Indexing data", "Helping React identify changed items", "Security", "Styling"] },
    { q: "What does SVG stand for?", options: ["Simple Vector Graphics", "Scalable Vector Graphics", "Static Visual Graphic", "Serial Video Grid"] },
    { q: "Which of these is a CSS grid property?", options: ["flex-direction", "grid-template-columns", "float", "position"] },
    { q: "What is a 'State' in React?", options: ["A global variable", "Mutable data local to component", "A CSS class", "A URL parameter"] },
    { q: "Which tool is used for unit testing React components?", options: ["Jest", "npm", "Vite", "Docker"] },
    { q: "What is the purpose of 'useCallback'?", options: ["Running intervals", "Memoizing functions", "Fetching data", "Styling components"] },
    { q: "Which CSS property makes text bold?", options: ["text-style", "font-weight", "bold: true", "font-style"] },
    { q: "What does 'Hydration' mean in React?", options: ["Drinking water", "Attaching event listeners to server HTML", "Clearing cache", "Compressing images"] }
  ],
  data: [
    { q: "Which library is most used for data manipulation in Python?", options: ["NumPy", "Pandas", "Matplotlib", "SciPy"] },
    { q: "What does 'Mean' refer to in statistics?", options: ["Middle value", "Most frequent value", "Average value", "The range"] },
    { q: "Which SQL command is used to remove duplicates from a result set?", options: ["UNIQUE", "DISTINCT", "FILTER", "REMOVE"] },
    { q: "What is a 'P-value'?", options: ["Probability coefficient", "Performance value", "Parameter count", "Power of test"] },
    { q: "Which type of chart is best for showing trends over time?", options: ["Pie chart", "Bar chart", "Line chart", "Scatter plot"] },
    { q: "What is 'Overfitting' in machine learning?", options: ["Model is too simple", "Model performs well only on training data", "Data is too small", "None of these"] },
    { q: "Commonly used language for statistical computing?", options: ["Java", "C++", "R", "PHP"] },
    { q: "Which join returns all records when there is a match in either left or right table?", options: ["Inner Join", "Left Join", "Right Join", "Full Outer Join"] },
    { q: "What is ETL?", options: ["Extract, Transform, Load", "Edit, Type, List", "Execution, Transfer, Log", "Every Task Loaded"] },
    { q: "Which library is used for generating plots in Python?", options: ["Flask", "Django", "Matplotlib", "Requests"] },
    { q: "What is the median of [1, 3, 3, 6, 7, 8, 9]?", options: ["3", "6", "5", "7"] },
    { q: "What is a 'Primary Key' in a database?", options: ["A backup key", "Unique identifier for a record", "A table password", "A sort index"] },
    { q: "Which of these is a categorical variable?", options: ["Temperature", "Weight", "Eye Color", "Price"] },
    { q: "What is 'Data Normalization'?", options: ["Finding errors", "Reducing data redundancy", "Deleting data", "Copying data"] },
    { q: "What is BigQuery?", options: ["A search engine", "Google's data warehouse", "A big database", "A query debugger"] },
    { q: "What is a 'Tensor' in Deep Learning?", options: ["A 1D array", "A multi-dimensional array", "A math function", "A type of neuron"] },
    { q: "What is supervised learning?", options: ["Learning with labels", "Learning without labels", "Learning by playing games", "Learning via textbooks"] },
    { q: "Which tool is used for Big Data processing?", options: ["Spark", "Notepad", "Calculator", "Chrome"] },
    { q: "What is a Histogram?", options: ["A history of labels", "Frequency distribution plot", "A line connecting points", "A type of pie chart"] },
    { q: "What does 'ROI' stand for in business analytics?", options: ["Return on Investment", "Risk of Interest", "Rate of Industry", "Range of items"] }
  ],
  default: [
    { q: "How many hours a week can you dedicate to learning?", options: ["< 5", "5-10", "10-20", "20+"] },
    { q: "What is your primary goal for using SkillPath AI?", options: ["Career switch", "Upskilling", "Job hunt", "Academic project"] },
    { q: "Do you have prior coding experience?", options: ["None", "Beginner", "Intermediate", "Professional"] },
    { q: "Preferred learning style?", options: ["Videos", "Reading/Documentation", "Building Projects", "Interactive Labs"] },
    { q: "Have you worked in a team before?", options: ["Yes, frequently", "Sometimes", "No, mostly solo", "Prefer not to say"] },
    { q: "Interest in Remote Work?", options: ["Highly interested", "Somewhat", "Neutral", "Prefer Office"] },
    { q: "Comfortable with English for technical learning?", options: ["Yes", "Learning", "No", "Prefer other"] },
    { q: "What field interests you most?", options: ["Web Dev", "Data Science", "Mobile Apps", "Security"] },
    { q: "How do you rate your problem solving?", options: ["1/5", "2/5", "3/5", "4/5", "5/5"] },
    { q: "Ever built a complete project?", options: ["Yes, many", "Yes, one", "Started but not finished", "No"] },
    { q: "Knowledge of Git?", options: ["Basic", "Advanced", "None", "What is Git?"] },
    { q: "Ideal company type?", options: ["Startup", "MNC", "Freelance", "Government"] },
    { q: "Can you attend live hackathons?", options: ["Yes", "Maybe", "No", "Remote only"] },
    { q: "Are you interested in AI?", options: ["Very", "A bit", "Neutral", "Not at all"] },
    { q: "Ready for a 3-month commitment?", options: ["Yes", "Depends", "Need breaks", "No"] }
  ]
};

export default function SkillAssessment({ onComplete }: { onComplete: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [role, setRole] = useState('fullstack');

  useEffect(() => {
    const targetRole = localStorage.getItem('skillpath_target_role') || 'fullstack';
    setRole(targetRole);
  }, []);

  const questions = MOCK_QUESTIONS[role] || MOCK_QUESTIONS.default;

  const handleSelect = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (answers[currentQ] === undefined) return toast.error('Please select an option');
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setAnalyzing(true);
      
      try {
        if (auth.currentUser) {
          const assessmentId = `assessment_${Date.now()}`;
          const assessmentPath = `users/${auth.currentUser.uid}/assessments/${assessmentId}`;
          await setDoc(doc(db, assessmentPath), {
            userId: auth.currentUser.uid,
            role,
            score: Math.floor(Math.random() * 40) + 60, // Mock score for now
            answers,
            completedAt: new Date().toISOString()
          });
        }
        
        setTimeout(() => {
          onComplete();
        }, 3000);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'assessments');
        onComplete();
      }
    }
  };

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8 p-6 rounded-full bg-cyan-500/10 text-cyan-400"
        >
          <Sparkles size={64} />
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight mb-4">Analyzing Your Skills</h2>
        <p className="text-white/40 mb-12 max-w-md">Our AI is crunching your answers and comparing them with industry benchmarks for {role} role...</p>
        
        <div className="w-full max-w-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white/30 uppercase tracking-widest">
            <span>Building Gap Analysis</span>
            <Loader2 className="animate-spin" size={12} />
          </div>
          <Progress value={65} className="h-1 bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">{role.toUpperCase()} Assessment</h2>
            <p className="text-white/40 text-sm">Question {currentQ + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-white/50 text-sm bg-white/5 px-4 py-2 rounded-xl">
          <Clock size={16} />
          <span>~5 mins</span>
        </div>
      </div>

      <Progress value={((currentQ + 1) / questions.length) * 100} className="mb-12 h-1 bg-white/5" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          <Card className="p-8 border-white/5 bg-white/5 backdrop-blur-xl rounded-3xl">
            <h3 className="text-2xl font-bold mb-8 leading-tight text-white">{questions[currentQ].q}</h3>
            
            <div className="grid gap-4">
              {questions[currentQ].options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`group flex items-center justify-between p-6 rounded-[28px] border-2 transition-all duration-300 text-left ${
                    answers[currentQ] === i 
                      ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]' 
                      : 'border-white/5 bg-white/5 hover:border-white/10'
                  }`}
                >
                  <span className={`font-bold tracking-tight text-lg transition-all ${answers[currentQ] === i ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>{opt}</span>
                  {answers[currentQ] === i ? <CheckCircle2 className="text-cyan-400" size={24} /> : <Circle className="text-white/5 group-hover:text-white/20" size={24} />}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex justify-end">
        <Button 
          onClick={handleNext} 
          disabled={answers[currentQ] === undefined || analyzing}
          className="h-14 px-12 rounded-2xl bg-cyan-500 text-white hover:bg-cyan-400 text-lg font-bold shadow-xl shadow-cyan-500/20 disabled:opacity-50 disabled:grayscale transition-all"
        >
          {currentQ === questions.length - 1 ? 'Analyze My Skills' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
