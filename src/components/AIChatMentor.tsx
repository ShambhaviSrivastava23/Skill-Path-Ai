import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export default function AIChatMentor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hi! I'm your Career Mentor. How can I help you navigate your career path today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are a professional career mentor for tech students. Be encouraging, concise, and use modern career advice. You are part of the SkillPath AI platform."
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't process that. Try again?" }]);
    } catch (error) {
      toast.error("AI connection lost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[380px] h-[500px] bg-black/90 border border-white/10 backdrop-blur-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-cyan-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">AI Mentor</p>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-cyan-500 text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-4">
                  <button 
                    onClick={() => {
                      setInput("Tell me about the Resume Builder");
                      sendMessage();
                    }}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-full text-white/60 hover:text-white transition-all font-bold uppercase tracking-wider"
                  >
                    Resume Help
                  </button>
                  <button 
                    onClick={() => {
                      setInput("Can you provide a demo of the platform features?");
                      sendMessage();
                    }}
                    className="text-[10px] bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-3 py-2 rounded-full text-cyan-400 transition-all font-bold uppercase tracking-wider"
                  >
                    Provide Demo
                  </button>
                </div>
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/50">
              <div className="relative">
                <Input 
                  placeholder="Ask anything about your career..." 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  className="h-12 bg-white/5 border-white/10 rounded-2xl pr-12 focus:border-cyan-400"
                />
                <button 
                  onClick={sendMessage}
                  className="absolute right-2 top-1.5 h-9 w-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center hover:bg-cyan-400 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-white shadow-2xl shadow-cyan-500/40 relative z-50 group overflow-hidden"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <Bot size={32} className="relative z-10" />
      </motion.button>
    </div>
  );
}
