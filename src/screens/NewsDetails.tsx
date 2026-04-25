import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  MapPin, 
  Share2, 
  Bookmark,
  Link,
  Linkedin,
  Twitter,
  PlusCircle,
  Star,
  Bell
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const NEWS_DATA = [
  {
    id: '1',
    title: 'Google Cloud is Hiring Senior DevOps Engineers',
    source: 'Google Careers',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800',
    content: `Google is looking for experienced DevOps engineers to help scale their cloud infrastructure globally. This role focuses on Kubernetes management, CI/CD automation, and site reliability. 
    
    Key Requirements:
    - 5+ years of experience in Cloud Infrastructure
    - Strong proficiency in Terraform and Ansible
    - Expert knowledge of GKE and networking protocols.
    
    Current open vacancies: 45 positions across Bangalore, London, and Mountain View.`,
    tags: ['Google', 'DevOps', 'Cloud'],
    type: 'vacancy'
  },
  {
    id: '2',
    title: 'Meta expands AI Research team in India',
    source: 'TechCrunch',
    time: '5h ago',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    content: `Meta has announced a major expansion of its AI division with a new research hub in Hyderabad. The team will focus on Generative AI and LLM optimization.
    
    Vacancies include:
    - ML Engineers (PyTorch/TensorFlow)
    - Data Scientists
    - AI Ethics Compliance Officers.`,
    tags: ['Meta', 'AI/ML', 'Research'],
    type: 'hiring'
  },
  {
    id: '3',
    title: 'Senior Full Stack Developer at Netflix',
    source: 'Netflix Jobs',
    time: '1d ago',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    content: `Netflix is reinventing entertainment. We are looking for a Senior Full Stack Developer to join our Cloud Gaming team. You will be responsible for building highly responsive UI and robust backend services that power millions of streaming hours.
    
    Responsibilities:
    - Architecting scalable front-end systems using React.
    - Optimized video streaming delivery protocols.
    - Collaborative work with design and product teams.
    
    Comp: Top of market + Stock options.`,
    tags: ['Netflix', 'FullStack', 'Gaming'],
    type: 'vacancy'
  }
];

export default function NewsDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const article = NEWS_DATA.find(n => n.id === id) || NEWS_DATA[0];

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white/40 hover:text-white">
          <ArrowLeft size={18} className="mr-2" />
          Back to Community
        </Button>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon" className="rounded-xl border-white/10 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all pointer-events-none">
                <Share2 size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900/95 border-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
              <div className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-black">Share Article</div>
              <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied to clipboard!'); }} className="rounded-xl focus:bg-cyan-500 focus:text-black cursor-pointer py-3 font-bold transition-all gap-3">
                <Link size={16} /> Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Redirecting to LinkedIn...')} className="rounded-xl focus:bg-cyan-500 focus:text-black cursor-pointer py-3 font-bold transition-all gap-3">
                <Linkedin size={16} /> LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Redirecting to X...')} className="rounded-xl focus:bg-cyan-500 focus:text-black cursor-pointer py-3 font-bold transition-all gap-3">
                <Twitter size={16} /> Twitter (X)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon" className="rounded-xl border-white/10 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all pointer-events-none">
                <Bookmark size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900/95 border-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-2xl">
              <div className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-white/30 font-black">Save & Bookmark</div>
              <DropdownMenuItem onClick={() => toast.success('Added to your collection!')} className="rounded-xl focus:bg-cyan-500 focus:text-black cursor-pointer py-3 font-bold transition-all gap-3">
                <PlusCircle size={16} /> Add to Collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Saved to favorites!')} className="rounded-xl focus:bg-cyan-500 focus:text-black cursor-pointer py-3 font-bold transition-all gap-3">
                <Star size={16} /> Add to Favorites
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 mx-1" />
              <DropdownMenuItem onClick={() => toast.success('Reminder set for tomorrow.')} className="rounded-xl focus:bg-cyan-500 focus:text-black cursor-pointer py-3 font-bold transition-all gap-3">
                <Bell size={16} /> Remind Me Later
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="relative h-[400px] rounded-[48px] overflow-hidden">
          <img src={article.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 opacity-90" />
          <div className="absolute bottom-10 left-10 space-y-4">
            <div className="flex gap-2">
              {article.tags.map(tag => <Badge key={tag} className="bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest">{tag}</Badge>)}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none max-w-2xl text-white">{article.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4">
          <div className="lg:col-span-2 space-y-6 text-white/70 leading-relaxed text-lg">
             <div className="whitespace-pre-line">{article.content}</div>
             <Button className="h-16 px-12 rounded-[24px] bg-cyan-500 text-white font-black hover:bg-cyan-400 mt-8 shadow-2xl shadow-cyan-500/20">
               Apply Now via Portal
             </Button>
          </div>

          <aside className="space-y-8">
             <Card className="p-8 border-white/5 bg-white/5 rounded-[32px] backdrop-blur-xl">
                <h4 className="font-black text-xs uppercase tracking-widest text-cyan-400 mb-6">Quick Info</h4>
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="bg-white/5 p-3 rounded-2xl"><Building2 size={20} className="text-white/40" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/20">Company</p>
                        <p className="font-bold">{article.source}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="bg-white/5 p-3 rounded-2xl"><Calendar size={20} className="text-white/40" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/20">Posted</p>
                        <p className="font-bold">{article.time}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="bg-white/5 p-3 rounded-2xl"><MapPin size={20} className="text-white/40" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/20">Location</p>
                        <p className="font-bold">Hybrid / Global</p>
                      </div>
                   </div>
                </div>
             </Card>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
