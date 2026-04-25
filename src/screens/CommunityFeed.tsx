import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Newspaper, 
  TrendingUp, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Trophy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Star
} from 'lucide-react';

export default function CommunityFeed() {
  const navigate = useNavigate();
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    setNews([
      {
        id: '1',
        title: 'Google Cloud is Hiring Senior DevOps Engineers',
        category: 'Hirings',
        date: '2h ago',
        image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: '2',
        title: 'Meta expands AI Research team for LLM safety',
        category: 'Hirings',
        date: '5h ago',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: '3',
        title: 'New Vacancy: Senior Full Stack Developer at Netflix',
        category: 'Vacancy',
        date: '1d ago',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
      }
    ]);
  }, []);

  const testimonials = [
    { name: 'Sarah Wu', role: 'Full Stack Dev @ Google', img: 'https://i.pravatar.cc/150?u=sarah', text: 'SkillPath AI helped me identify that I needed more focus on System Design. 3 months later, I landed my dream job!' },
    { name: 'Rohan Mehta', role: 'Data Analyst @ Amazon', img: 'https://i.pravatar.cc/150?u=rohan', text: 'The roadmap was perfectly paced. I finished my certifications and had a portfolio ready in record time.' },
  ];

  const jobs = [
    { title: 'Junior Frontend Developer', company: 'Linear', location: 'Remote', salary: '$80k - $120k', remote: true },
    { title: 'Software Engineer Intern', company: 'Notion', location: 'San Francisco', salary: '$45/hr', remote: false },
    { title: 'Product Manager (Associate)', company: 'Airbnb', location: 'New York', salary: '$110k+', remote: true },
  ];

  return (
    <div className="py-8 space-y-12 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black tracking-tight mb-2">Community & Insights</h2>
        <p className="text-white/40">Connect with fellow students and stay ahead of industry trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: News & Testimonials */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Industry News */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Newspaper className="text-cyan-400" size={20} />
                Industry Intel
              </h3>
              <Button variant="ghost" className="text-xs text-white/40 font-bold uppercase tracking-widest hover:text-cyan-400">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map(item => (
                <Card 
                  key={item.id} 
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="overflow-hidden border-white/5 bg-white/5 rounded-[32px] group cursor-pointer hover:bg-white/10 transition-all border-l-4 border-l-cyan-500 flex flex-col h-full shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-cyan-500 text-black border-none uppercase text-[10px] font-black tracking-widest">{item.category}</Badge>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <h4 className="text-lg font-bold mb-4 group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-snug">{item.title}</h4>
                    <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/30">
                      <span>{item.date}</span>
                      <div className="flex items-center gap-1 text-cyan-400 group-hover:gap-2 transition-all">
                        Explore <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Testimonials Wall */}
          <section className="space-y-6">
             <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="text-purple-400" size={20} />
                Success Stories
             </h3>
             <div className="grid grid-cols-1 gap-6">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-14 w-14 border-2 border-cyan-500/50">
                        <AvatarImage src={t.img} />
                        <AvatarFallback>{t.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg">{t.name}</p>
                        <p className="text-xs font-medium text-white/40">{t.role}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-lg italic text-white/80 leading-relaxed font-serif">"{t.text}"</p>
                  </motion.div>
                ))}
             </div>
          </section>
        </div>

        {/* Right Column: Jobs & Hackathons */}
        <div className="space-y-12">
          
          {/* Trending Jobs */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-green-400">
              <Briefcase size={20} />
              Trending Jobs
            </h3>
            <div className="space-y-4">
               {jobs.map((job, i) => (
                 <Card key={i} className="p-5 border-white/5 bg-white/5 rounded-3xl hover:border-green-400/20 transition-all">
                    <div className="flex items-start justify-between mb-2">
                       <h4 className="font-bold text-md leading-tight">{job.title}</h4>
                       {job.remote && <Badge className="bg-green-400/10 text-green-400 text-[8px] uppercase font-black">Remote</Badge>}
                    </div>
                    <p className="text-sm font-medium text-white/50 mb-4">{job.company}</p>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase">
                          <MapPin size={10} />
                          {job.location}
                       </div>
                       <span className="text-xs font-bold text-white">{job.salary}</span>
                    </div>
                 </Card>
               ))}
            </div>
                  <Button 
                  onClick={() => toast.promise(new Promise(r => setTimeout(r, 800)), { loading: 'Fetching more opportunities...', success: 'Updated with 15 new listings!', error: 'Failed to fetch' })}
                  className="w-full h-12 rounded-2xl bg-white text-black hover:bg-green-400 font-bold"
                >
                  Show More Jobs
                </Button>
              </section>
    
              {/* Hackathons */}
              <section className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-orange-400">
                  <Trophy size={20} />
                  Upcoming Hackathons
                </h3>
                <Card className="p-6 border-orange-400/20 bg-orange-400/5 rounded-3xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4">
                     <Sparkles className="text-orange-400 animate-pulse" size={24} />
                   </div>
                   <p className="text-xs font-black uppercase text-orange-400 tracking-widest mb-2">SkillPath Global</p>
                   <h4 className="text-lg font-bold mb-2">The AI Agent Challenge</h4>
                   <p className="text-xs text-white/40 mb-6">Build a custom agent and win $5k in prizes.</p>
                   <Button 
                     onClick={() => toast.success('Registration successful! Check your email for details.')}
                     className="w-full h-12 rounded-xl bg-orange-500 text-white hover:bg-orange-600 font-bold"
                   >
                     Register Now
                   </Button>
                </Card>
          </section>

          {/* Feedback */}
          <section className="p-8 rounded-[40px] border border-white/5 shadow-2xl bg-white/5 backdrop-blur-3xl text-center">
             <h4 className="font-bold text-lg mb-2">Love the platform?</h4>
             <p className="text-xs text-white/40 mb-6">Your feedback helps us train our AI career mentor better.</p>
             <Button 
               variant="outline" 
               onClick={() => navigate('/feedback')}
               className="h-12 w-full rounded-2xl border-white/10 bg-white/5 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all font-bold"
             >
               Submit Feedback
             </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
