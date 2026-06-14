import React, { useState } from "react";
import {
  Sparkles, Image as ImageIcon, Activity, History, LogOut, ChevronRight,
  Search, User, ShieldAlert, Zap, CheckCircle2, AlertCircle, Eye, EyeOff,
  SlidersHorizontal, Download, Wand2, MessageSquareText, X, Share2, Layers,
  Plus, Trash2, UploadCloud
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { useToast } from "../contexts/ToastContext";
import { generateGeminiText } from "../utils/api";
import {
  SCENE_PROMPTS,
  MOCK_HISTORY,
  CHART_DATA_USAGE,
  CHART_DATA_PERFORMANCE
} from "../constants/mockData";

// ----------------------------------------------------------------------
// 6. SCREEN 3: MAIN SYSTEM DASHBOARD (TABS)
// ----------------------------------------------------------------------
const ShareModal = ({ isOpen, onClose, link }) => {
  const { addToast } = useToast();
  if (!isOpen) return null;

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      addToast("分享链接已复制到剪贴板！", "success");
    } catch (err) {
      addToast("复制失败，请手动复制", "error");
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md border border-[#00f2fe]/30 shadow-[0_0_30px_rgba(0,242,254,0.15)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white focus:outline-none">
           <X size={20} />
        </button>
        <h3 className="text-white font-tech mb-2 text-xl">生成分享链接</h3>
        <p className="text-xs text-slate-400 mb-6 font-light">您的安全对齐图像已生成，任何人通过此链接均可查看带有防伪水印的验证结果。</p>

        <div className="bg-black/50 border border-white/10 rounded-xl p-3 mb-6 flex items-center justify-between">
          <span className="text-[#00f2fe] font-mono text-sm truncate mr-4 select-all">{link}</span>
        </div>

        <div className="flex gap-4">
          <button onClick={copyToClipboard} className="flex-1 bg-gradient-to-r from-[#00f2fe] to-[#8a2be2] text-white font-bold py-3 rounded-xl transition-transform hover:scale-105">
            一键复制链接
          </button>
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-colors border border-white/10">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

const GenerateTab = () => {
  const { addToast } = useToast();
  const [activeScene, setActiveScene] = useState(SCENE_PROMPTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [showShare, setShowShare] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    addToast("Initializing distributed generation pipeline...", "success");
    setTimeout(() => {
      setResults({
        TICoE: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        ESD: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
        Original: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2070&auto=format&fit=crop"
      });
      setIsGenerating(false);
      addToast("Generation complete.", "success");
    }, 2500);
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const handleEnhancePrompt = async () => {
    if (!customPrompt) { addToast("Provide a base prompt to enhance.", "error"); return; }
    setIsEnhancing(true);
    addToast("Enhancing prompt logic...", "info");
    try {
      const sysPrompt = "You are an expert at writing detailed, evocative prompts for AI image generation. Take the user's short prompt and expand it into a highly descriptive, comma-separated list of visual elements, lighting, style, and camera angles. Keep it under 50 words. Output ONLY the enhanced prompt string without quotes.";
      const enhanced = await generateGeminiText(customPrompt, sysPrompt);
      setCustomPrompt(enhanced.trim());
      addToast("Prompt optimized for synthesis.", "success");
    } catch (e) {
      addToast("Failed to connect to LLM core.", "error");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAnalyzeRisk = async () => {
    if (!customPrompt) { addToast("Provide a prompt to analyze.", "error"); return; }
    setIsAnalyzing(true);
    setAnalysisResult("");
    addToast("Scanning concepts...", "info");
    try {
      const sysPrompt = "You are a safety and compliance AI for a generative image platform. Analyze the user's prompt for potential copyrighted characters, sensitive subjects, or specific artistic styles that might need to be explicitly erased or filtered. Return a brief, 2-sentence analysis of potential risks and specifically name the concepts that should be targeted for erasure.";
      const analysis = await generateGeminiText(customPrompt, sysPrompt);
      setAnalysisResult(analysis.trim());
      addToast("Analysis complete.", "success");
    } catch (e) {
      addToast("Failed to analyze prompt.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 items-start z-10 relative">
        <div className="w-full">
          <label className="text-xs text-slate-400 uppercase tracking-widest mb-3 block font-semibold">Scene Architecture</label>
          <div className="flex flex-wrap gap-3">
            {SCENE_PROMPTS.map((scene) => (
              <button
                key={scene.id}
                onClick={() => { setActiveScene(scene); setCustomPrompt(scene.prompt); }}
                className={`px-5 py-2.5 rounded-xl text-sm transition-all border ${
                  activeScene.id === scene.id 
                    ? 'bg-[#00f2fe]/20 border-[#00f2fe]/50 text-white shadow-[0_0_15px_rgba(0,242,254,0.2)]' 
                    : 'glass-panel text-slate-300 hover:bg-white/5'
                }`}
              >
                {scene.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
           <div className="flex flex-col lg:flex-row gap-4 items-end w-full">
             <div className="flex-1 relative w-full">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-widest block font-semibold">Custom Parameters (Prompt)</label>
                  <div className="flex gap-4">
                     <button onClick={handleEnhancePrompt} disabled={isEnhancing} className="flex items-center gap-1.5 text-[#00f2fe] hover:text-white transition-colors disabled:opacity-50" title="Enhance Prompt">
                       {isEnhancing ? <Activity size={14} className="animate-spin" /> : <Wand2 size={14} />}
                       <span className="text-[10px] font-medium uppercase tracking-wider">Enhance</span>
                     </button>
                     <button onClick={handleAnalyzeRisk} disabled={isAnalyzing} className="flex items-center gap-1.5 text-[#8a2be2] hover:text-white transition-colors disabled:opacity-50" title="Analyze Concepts">
                       {isAnalyzing ? <Activity size={14} className="animate-spin" /> : <MessageSquareText size={14} />}
                       <span className="text-[10px] font-medium uppercase tracking-wider">Analyze Risk</span>
                     </button>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={customPrompt || activeScene.prompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full glass-input text-white py-3 px-5 rounded-xl text-sm border-[#00f2fe]/30 focus:border-[#00f2fe] transition-all"
                />
             </div>
             <div className="w-full lg:w-48">
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block font-semibold">Base Model</label>
                <select className="w-full glass-input text-white py-3 px-4 rounded-xl text-sm appearance-none border-white/10">
                  <option value="sd-1.4" className="bg-[#0a1118]">SD v1.4</option>
                  <option value="sd-1.5" className="bg-[#0a1118]">SD v1.5</option>
                  <option value="sdxl" className="bg-[#0a1118]">SDXL</option>
                </select>
             </div>
           </div>
           {analysisResult && (
             <div className="p-4 bg-[#8a2be2]/10 border border-[#8a2be2]/30 rounded-xl text-sm text-purple-100 flex gap-3 items-start relative animate-in fade-in slide-in-from-top-2">
                <ShieldAlert size={18} className="text-[#8a2be2] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-[#8a2be2] font-tech text-xs mb-1 uppercase tracking-wider font-semibold">Concept Risk Analysis</h4>
                  <p className="text-xs leading-relaxed text-purple-50/80">{analysisResult}</p>
                </div>
                <button onClick={() => setAnalysisResult("")} className="text-[#8a2be2] hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                   <X size={16} />
                </button>
             </div>
           )}
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="mt-2 w-full lg:w-auto bg-gradient-to-r from-[#00f2fe] to-[#8a2be2] hover:brightness-110 text-white font-tech font-bold py-3.5 px-10 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(138,43,226,0.3)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isGenerating ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
          {isGenerating ? "Synthesizing Tensors..." : "Initialize Array"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col border border-[#00f2fe]/30 shadow-[0_0_20px_rgba(0,242,254,0.05)]">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="font-tech text-[#00f2fe] font-semibold flex items-center gap-2">
              <Sparkles size={16} /> TICoE (Proposed)
            </h3>
            <span className="text-xs bg-[#00f2fe]/20 text-[#00f2fe] px-2 py-1 rounded">Optimal</span>
          </div>
          <div className="aspect-[4/3] bg-black/40 relative overflow-hidden flex items-center justify-center">
            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 border-4 border-[#00f2fe]/20 border-t-[#00f2fe] rounded-full animate-spin"></div>
              </div>
            ) : results ? (
              <img src={results.TICoE} alt="TICoE" className="w-full h-full object-cover img-hover-zoom" />
            ) : (
              <p className="text-slate-500 font-tech text-sm tracking-widest flex flex-col items-center gap-2">
                <ImageIcon size={32} className="opacity-50" /> WAITING FOR INPUT
              </p>
            )}
          </div>
          <div className="p-3 bg-black/20 flex justify-between items-center backdrop-blur-md">
             <span className="text-xs text-slate-400">Concept entirely removed</span>
             <div className="flex items-center gap-1">
               <button onClick={handleShare} disabled={!results} className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 text-white" title="Share Link"><Share2 size={16}/></button>
               <button disabled={!results} className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 text-white" title="Download"><Download size={16}/></button>
             </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="font-tech text-slate-200 font-semibold flex items-center gap-2">
              <SlidersHorizontal size={16} /> ESD Method
            </h3>
          </div>
          <div className="aspect-[4/3] bg-black/40 relative overflow-hidden flex items-center justify-center">
             {isGenerating ? (
               <div className="w-16 h-16 border-4 border-white/10 border-t-slate-400 rounded-full animate-spin"></div>
            ) : results ? (
              <img src={results.ESD} alt="ESD" className="w-full h-full object-cover img-hover-zoom" />
            ) : (
              <p className="text-slate-500 font-tech text-sm tracking-widest">NO DATA</p>
            )}
          </div>
           <div className="p-3 bg-black/20 flex justify-between items-center backdrop-blur-md">
             <span className="text-xs text-slate-400">Noticeable artifacting</span>
             <div className="flex items-center gap-1">
               <button onClick={handleShare} disabled={!results} className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 text-white" title="Share Link"><Share2 size={16}/></button>
               <button disabled={!results} className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 text-white" title="Download"><Download size={16}/></button>
             </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="font-tech text-slate-200 font-semibold flex items-center gap-2">
              <ImageIcon size={16} /> Original Model
            </h3>
          </div>
          <div className="aspect-[4/3] bg-black/40 relative overflow-hidden flex items-center justify-center">
             {isGenerating ? (
               <div className="w-16 h-16 border-4 border-white/10 border-t-slate-400 rounded-full animate-spin"></div>
            ) : results ? (
              <img src={results.Original} alt="Original" className="w-full h-full object-cover img-hover-zoom" />
            ) : (
              <p className="text-slate-500 font-tech text-sm tracking-widest">NO DATA</p>
            )}
          </div>
           <div className="p-3 bg-black/20 flex justify-between items-center backdrop-blur-md">
             <span className="text-xs text-slate-400">Concept fully visible</span>
             <div className="flex items-center gap-1">
               <button onClick={handleShare} disabled={!results} className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 text-white" title="Share Link"><Share2 size={16}/></button>
               <button disabled={!results} className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 text-white" title="Download"><Download size={16}/></button>
             </div>
          </div>
        </div>
      </div>
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} link="https://api.coroc.ai/share/auth_req_v2_9a8b7c" />
    </div>
  );
};

const CustomEraseTab = () => {
  const { addToast } = useToast();
  const [concepts, setConcepts] = useState([
    { id: 1, name: "Copyrighted Brand Logos", type: "object", weight: 90 },
    { id: 2, name: "Cyberpunk Glow Aesthetic", type: "style", weight: 75 }
  ]);
  const [newConcept, setNewConcept] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddConcept = () => {
    if (!newConcept.trim()) return;
    setConcepts([...concepts, { id: Date.now(), name: newConcept, type: "custom", weight: 80 }]);
    setNewConcept("");
    addToast("自定义概念向量已添加", "success");
  };

  const handleRemoveConcept = (id) => {
    setConcepts(concepts.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 relative z-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Image Upload & Preview Container */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-3xl flex flex-col items-center justify-center min-h-[480px] border border-dashed border-[#00f2fe]/30 hover:border-[#00f2fe]/60 transition-colors group cursor-pointer relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-[#00f2fe]/5 to-[#8a2be2]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
           <UploadCloud size={56} className="text-[#00f2fe] mb-5 opacity-70 group-hover:scale-110 transition-transform" />
           <h3 className="text-white font-tech tracking-wider mb-2 text-lg">UPLOAD SOURCE IMAGE</h3>
           <p className="text-sm text-slate-400 text-center max-w-[85%] leading-relaxed font-light">拖拽需要提取或擦除敏感概念的图像至此区域，或点击浏览本地文件 (PNG, JPG, WEBP)</p>
           <div className="mt-8 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-slate-300 group-hover:bg-[#00f2fe]/10 group-hover:text-[#00f2fe] transition-colors">
             Select File
           </div>
        </div>

        {/* Right: Multi-Concept Erasure Controls */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl flex flex-col">
           <div className="mb-6 border-b border-white/10 pb-5">
             <h3 className="font-tech text-2xl text-white flex items-center gap-3">
               <Layers size={24} className="text-[#8a2be2]" /> 多概念叠加擦除矩阵
             </h3>
             <p className="text-sm text-slate-400 mt-2 font-light">针对画面中存在的特定物品、受保护的 IP 角色、及交叉画风进行靶向复合清除。</p>
           </div>

           <div className="flex gap-3 mb-8">
             <input
               type="text"
               value={newConcept}
               onChange={(e) => setNewConcept(e.target.value)}
               placeholder="输入需要擦除的概念 (如: 苹果手机, 梵高风格)"
               className="flex-1 glass-input text-white py-3 px-5 rounded-xl text-sm border-[#00f2fe]/30 focus:border-[#00f2fe]"
               onKeyDown={(e) => e.key === 'Enter' && handleAddConcept()}
             />
             <button onClick={handleAddConcept} className="bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30 px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-medium">
               <Plus size={18} /> 添加靶点
             </button>
           </div>

           <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar min-h-[200px]">
             {concepts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 font-mono text-sm">
                  NO ACTIVE TARGETS
                </div>
             ) : concepts.map(concept => (
               <div key={concept.id} className="bg-black/30 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between group gap-4">
                 <div className="flex flex-col gap-1 sm:w-5/12">
                   <span className="text-sm text-slate-200 font-medium">{concept.name}</span>
                   <span className="text-[10px] uppercase font-mono text-[#8a2be2] tracking-wider bg-[#8a2be2]/10 inline-block w-max px-2 py-0.5 rounded">
                     TYPE: {concept.type}
                   </span>
                 </div>
                 <div className="flex-1 flex items-center gap-4">
                   <span className="text-[11px] text-slate-400 font-mono">强度</span>
                   <input type="range" min="0" max="100" defaultValue={concept.weight} className="flex-1 accent-[#00f2fe] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" />
                 </div>
                 <button onClick={() => handleRemoveConcept(concept.id)} className="text-slate-500 hover:text-rose-400 transition-colors p-2 bg-white/5 hover:bg-rose-400/10 rounded-lg">
                   <Trash2 size={16} />
                 </button>
               </div>
             ))}
           </div>

           <button
             onClick={() => {
               setIsProcessing(true);
               addToast("正在编译多维概念擦除权重...", "info");
               setTimeout(() => { setIsProcessing(false); addToast("靶向概念擦除完成", "success"); }, 2000);
             }}
             disabled={isProcessing || concepts.length === 0}
             className="mt-8 w-full bg-gradient-to-r from-[#00f2fe] to-[#8a2be2] hover:brightness-110 text-white font-tech font-bold py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(138,43,226,0.35)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
           >
             {isProcessing ? <Activity className="animate-spin" size={22} /> : <Wand2 size={22} />}
             {isProcessing ? "PROCESSING TENSORS..." : "EXECUTE MULTI-ERASURE ALIGNMENT"}
           </button>
        </div>
      </div>
    </div>
  );
};

const DashboardTab = () => {
  return (
    <div className="space-y-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: "Total Generations", value: "124,592", trend: "+14.2%", icon: ImageIcon, color: "text-[#00f2fe]" },
           { label: "Active Operatives", value: "8,942", trend: "+5.1%", icon: User, color: "text-[#8a2be2]" },
           { label: "Avg Inference Time", value: "1.42s", trend: "-0.3s", icon: Zap, color: "text-[#fbbf24]" },
           { label: "Concepts Erased", value: "45", trend: "+2", icon: ShieldAlert, color: "text-[#f43f5e]" },
         ].map((stat, i) => (
           <div key={i} className="glass-panel p-5 rounded-2xl flex items-start justify-between relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div>
               <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
               <h4 className="text-2xl font-tech font-bold text-white">{stat.value}</h4>
               <p className="text-xs text-purple-400 mt-2 font-medium">{stat.trend} from last epoch</p>
             </div>
             <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
                <stat.icon size={20} />
             </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-tech text-lg mb-6 flex items-center gap-2">
             <Activity size={18} className="text-[#00f2fe]" /> Network Utilization
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA_USAGE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErasures" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 10, 16, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="users" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="erasures" stroke="#8a2be2" strokeWidth={2} fillOpacity={1} fill="url(#colorErasures)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <h3 className="font-tech text-lg mb-2 flex items-center gap-2">
             <SlidersHorizontal size={18} className="text-[#8a2be2]" /> Method Performance Metrics
          </h3>
          <p className="text-xs text-slate-400 mb-4">Comparison of TICoE vs baseline methodologies across key vectors.</p>
          <div className="flex-1 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={CHART_DATA_PERFORMANCE}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="TICoE" dataKey="TICoE" stroke="#00f2fe" strokeWidth={2} fill="#00f2fe" fillOpacity={0.4} />
                <Radar name="ESD" dataKey="ESD" stroke="#8a2be2" strokeWidth={2} fill="#8a2be2" fillOpacity={0.3} />
                <Radar name="Original" dataKey="Original" stroke="#64748b" strokeWidth={2} fill="#64748b" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 10, 16, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryTab = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl relative z-10 min-h-[60vh]">
      <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
         <div>
            <h2 className="font-tech text-xl text-white">Execution Logs</h2>
            <p className="text-xs text-slate-400 mt-1">Review past system operations and cache.</p>
         </div>
         <div className="relative w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
           <input type="text" placeholder="Search prompts..." className="w-full glass-input text-white py-2 pl-9 pr-4 rounded-lg text-sm" />
         </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
              <th className="py-3 font-medium">Task ID</th>
              <th className="py-3 font-medium">Prompt Query</th>
              <th className="py-3 font-medium">Method</th>
              <th className="py-3 font-medium">Timestamp</th>
              <th className="py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_HISTORY.map((row) => (
              <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                <td className="py-4 text-sm font-tech text-[#00f2fe]">#{row.id}</td>
                <td className="py-4 text-sm text-slate-200 truncate max-w-xs pr-4">{row.prompt}</td>
                <td className="py-4 text-sm">
                  <span className="px-2 py-1 bg-white/10 rounded-md text-xs border border-white/10 text-slate-300">
                    {row.method}
                  </span>
                </td>
                <td className="py-4 text-sm text-slate-400">{row.time}</td>
                <td className="py-4 text-sm text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    row.status === 'Success' 
                      ? 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {row.status === 'Success' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function MainApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="min-h-screen aurora-bg-anim relative text-slate-200 font-sans">
      <nav className="sticky top-0 z-50 w-full glass-panel border-b-0 border-x-0 rounded-none shadow-md px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-8">
          <div className="font-tech text-2xl font-bold tracking-widest text-white flex items-center gap-1 cursor-pointer transition-transform hover:scale-105">
            C<span className="text-[#00f2fe]">O</span>ROC
          </div>
          <div className="hidden md:flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
            {[
              { id: "generate", icon: ImageIcon, label: "Synthesize" },
              { id: "customErase", icon: Layers, label: "Custom Erase" },
              { id: "dashboard", icon: Activity, label: "Telemetry" },
              { id: "history", icon: History, label: "Logs" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#00f2fe]/20 text-white shadow-[0_2px_10px_rgba(0,242,254,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? "text-[#00f2fe]" : ""} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-1.5 rounded-full border border-[#00f2fe]/20">
             <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span> SYSTEM NOMINAL
           </div>
           <button 
             onClick={onLogout}
             className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-400/10 transition-colors group"
             title="Terminate Session"
           >
             <LogOut size={20} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {activeTab === "generate" && <GenerateTab />}
        {activeTab === "customErase" && <CustomEraseTab />}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "history" && <HistoryTab />}
      </main>
    </div>
  );
}
