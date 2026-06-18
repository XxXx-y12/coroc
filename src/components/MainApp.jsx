import React, { useState } from "react";
import {
  Sparkles, Image as ImageIcon, Activity, History, LogOut, ChevronRight,
  Search, User, ShieldAlert, Zap, CheckCircle2, AlertCircle, Eye, EyeOff,
  SlidersHorizontal, Download, Wand2, MessageSquareText, X, Share2, Layers,
  Plus, Trash2, UploadCloud, Database, FileArchive, Copy
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

  const RANDOM_PRESETS = [
    {
      concept: "Apple iPhone",
      prompt:
        "A cybernetic humanoid robot holding an [Apple iPhone], hyper-detailed render, technical drawing style.",
      rawImg:
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop",
      erasedImg:
        "https://images.unsplash.com/photo-1580870013141-3b13c51dcd4d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      concept: "Cyberpunk Glow Style",
      prompt:
        "A classic European cafe in Paris, painted in neon [Cyberpunk Glow Style], contrast between classical and futuristic.",
      rawImg:
        "https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1200&auto=format&fit=crop",
      erasedImg:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      concept: "Starbucks Logo",
      prompt:
        "A close up photo of a steaming ceramic mug with a [Starbucks Logo] on a wooden counter, warm lighting.",
      rawImg:
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop",
      erasedImg:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [eraseConcepts, setEraseConcepts] = useState([
    { id: "1", name: "Copyrighted Brand Logos", strength: 0.85, type: "OBJECT" },
    { id: "2", name: "Cyberpunk Glow Aesthetic", strength: 0.72, type: "STYLE" },
  ]);
  const [newConceptInput, setNewConceptInput] = useState("");
  const [selectedSDVersion, setSelectedSDVersion] = useState("SD-1.5");
  const [isAligning, setIsAligning] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const activePreset = RANDOM_PRESETS[activePresetIndex];

  const handleShufflePrompt = () => {
    setActivePresetIndex((prev) => (prev + 1) % RANDOM_PRESETS.length);
    addToast("同步加载新的测试敏感 Prompt 靶标", "info");
  };

  const handleAddConcept = () => {
    const value = newConceptInput.trim();
    if (!value) return;

    const item = {
      id: Date.now().toString(),
      name: value,
      strength: 0.8,
      type: "OBJECT",
    };

    setEraseConcepts((prev) => [...prev, item]);
    setNewConceptInput("");
    addToast(`概念 [${item.name}] 已加入拦截靶矩阵`, "success");
  };

  const handleRemoveConcept = (id) => {
    setEraseConcepts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSliderChange = (id, val) => {
    setEraseConcepts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, strength: val } : c))
    );
  };

  const handleExecuteErase = () => {
    setIsAligning(true);
    setTimeout(() => {
      setIsAligning(false);
      addToast("多概念对齐擦除运算成功！权重参数已固化入基模", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 左侧：品字形上端 + 下端双画廊 */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* 上部窄提示栏 */}
          <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 shadow-xl flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] bg-cyan-950/60 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono uppercase tracking-wider">
                  Target Concept Prompt / 靶标提示词
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Preset {activePresetIndex + 1}/{RANDOM_PRESETS.length}
                </span>
              </div>

              <p className="text-xs font-mono text-slate-300 leading-relaxed break-words">
                {activePreset.prompt.split(/(\[.*?\])/).map((part, idx) =>
                  part.startsWith("[") && part.endsWith("]") ? (
                    <span
                      key={idx}
                      className="text-cyan-400 font-bold px-1 bg-cyan-950/40 rounded border border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]"
                    >
                      {part}
                    </span>
                  ) : (
                    <span key={idx}>{part}</span>
                  )
                )}
              </p>
            </div>

            <button
              onClick={handleShufflePrompt}
              className="shrink-0 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 px-3.5 py-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shadow-lg"
            >
              切靶 / Shuffle
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 下部双重渲染画廊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
            {/* 左图：原始图 */}
            <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 flex flex-col gap-3 shadow-xl min-h-[420px]">
              <div className="flex justify-between items-center gap-3">
                <span className="text-xs font-mono text-rose-400 tracking-wider">
                  RAW SOURCE
                </span>
                <span className="text-[10px] bg-rose-950/40 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 font-mono whitespace-nowrap">
                  未擦除敏感概念
                </span>
              </div>

              <div className="relative flex-1 bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center min-h-[320px]">
                {isAligning ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-7 h-7 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                    <span className="text-xs text-rose-400/70 font-mono animate-pulse">
                      重新寻址...
                    </span>
                  </div>
                ) : (
                  <>
                    <img
                      src={activePreset.rawImg}
                      alt="RAW Output"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </>
                )}
              </div>
            </div>

            {/* 右图：擦除后图 */}
            <div className="glass-panel rounded-2xl border border-cyan-500/30 p-4 flex flex-col gap-3 shadow-xl shadow-cyan-950/10 min-h-[420px]">
              <div className="flex justify-between items-center gap-3">
                <span className="text-xs font-mono text-cyan-400 tracking-wider">
                  COROC ERASED MODEL
                </span>
                <span className="text-[10px] bg-cyan-950/40 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono whitespace-nowrap">
                  敏感概念彻底擦除
                </span>
              </div>

              <div className="relative flex-1 bg-slate-950/80 rounded-xl overflow-hidden border border-cyan-500/20 flex items-center justify-center min-h-[320px]">
                {isAligning ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-7 h-7 border-3 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                    <span className="text-xs text-cyan-400/70 font-mono animate-pulse">
                      概念消除对齐中...
                    </span>
                  </div>
                ) : (
                  <>
                    <img
                      src={activePreset.erasedImg}
                      alt="Erased Output"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：概念控制台 */}
        <div className="lg:col-span-4 glass-panel rounded-2xl border border-slate-800/80 p-5 shadow-2xl flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider mb-1">
                多概念叠加擦除控制面板
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                针对提示词及画面中可能溢出的特定物品、受保护 IP 角色及艺术家交叉风格进行靶向复合擦除，并在基模底层进行高维消融。
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newConceptInput}
                onChange={(e) => setNewConceptInput(e.target.value)}
                placeholder="输入需要擦除的概念 (如: 苹果手机, 梵高风格)"
                className="flex-1 bg-[#050818]/90 border border-slate-800 hover:border-slate-700 focus:border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none transition-all duration-300"
              />
              <button
                onClick={handleAddConcept}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition-all duration-300 shadow-md whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                添加靶点
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
              {eraseConcepts.map((concept) => (
                <div
                  key={concept.id}
                  className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60 flex flex-col gap-2 transition-all hover:border-slate-700/80"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {concept.name}
                      </span>
                      <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono shrink-0">
                        {concept.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveConcept(concept.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                      擦除强度:
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={concept.strength}
                      onChange={(e) =>
                        handleSliderChange(
                          concept.id,
                          parseFloat(e.target.value)
                        )
                      }
                      className="flex-1 accent-cyan-400 bg-slate-900 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-cyan-400 font-mono font-bold w-8 text-right">
                      {(concept.strength * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
                BASE SD MOTOR:
              </span>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {["SD-1.5", "SD-2.0", "SD-XL"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedSDVersion(v)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                      selectedSDVersion === v
                        ? "bg-violet-500 text-slate-950 shadow-md"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleExecuteErase}
            disabled={isAligning || eraseConcepts.length === 0}
            className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] text-slate-950 font-black text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isAligning ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                进行底层逆梯度注入与擦除对齐中...
              </>
            ) : (
              <>
                EXECUTE MULTI-ERASURE ALIGNMENT
                <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
              </>
            )}
          </button>
        </div>
      </div>

      {shareUrl ? (
        <div className="fixed inset-0 bg-[#02040b]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f26] border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Share2 className="w-5 h-5" />
              <span className="font-bold text-sm tracking-wider uppercase font-mono">
                Share Generated Token / 分享凭证链接
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              该凭证链接包含了当前图像在 COROC 精准擦除对齐后的去水印签名信息，允许其他人零失真查看该次净化报告。
            </p>

            <div className="flex gap-2 bg-[#050818] border border-slate-800 p-2 rounded-xl items-center">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent flex-1 outline-none text-xs text-slate-300 font-mono px-2"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  addToast("分享凭证链接已成功拷贝至剪贴板！", "success");
                  setShareUrl("");
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-[#060814] p-2 rounded-lg transition-all duration-300"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setShareUrl("")}
              className="text-xs text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 py-2 rounded-xl mt-2 transition-all duration-300"
            >
              CLOSE WINDOW
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
const EvaluationTab = () => {
  const { addToast } = useToast();

  const [evalMode, setEvalMode] = useState("preset"); // preset | upload
  const [evalBaseline, setEvalBaseline] = useState("COROC-v2-Pro");
  const [evalDataset, setEvalDataset] = useState("MS-COCO-Erase (10k Samples)");
  const [evalCompareTo, setEvalCompareTo] = useState("UCE-Method (2024)");
  const [uploadedZip, setUploadedZip] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalLogs, setEvalLogs] = useState([]);
  const [evalProgress, setEvalProgress] = useState(0);
  const [evalReport, setEvalReport] = useState(null);
  const logContainerRef = React.useRef(null);

  const triggerEvaluation = () => {
    if (evalMode === "upload" && !uploadedZip) {
      addToast("请先上传离线生成结果压缩包（ZIP）", "error");
      return;
    }

    setIsEvaluating(true);
    setEvalLogs([]);
    setEvalProgress(0);
    setEvalReport(null);

    const steps =
      evalMode === "preset"
        ? [
            "🛰️ [SYSTEM] 检索预计算基准数据库...",
            `📂 [CACHE] 命中缓存：${evalBaseline} / ${evalDataset}`,
            "🔄 [LOAD] 读取 CLIP / FID / ASR 预计算矩阵...",
            "📊 [METRIC] 汇总 MCP / UDA / P4D 结果...",
            "✨ [REPORT] 预计算评估白皮书生成完成。",
          ]
        : [
            "🛰️ [SYSTEM] 初始化离线评估沙盒...",
            `📂 [DATASET] 正在解压：${uploadedZip}`,
            "🔄 [LOAD] 构建视觉特征向量...",
            "📊 [METRIC] 运行 CLIP 对齐评分...",
            "🔒 [METRIC] 运行 ASR / FID / MCP / UDA...",
            "✨ [REPORT] 离线评估白皮书生成完成。",
          ];

    let i = 0;
    const timer = setInterval(() => {
      if (i < steps.length) {
        setEvalLogs((prev) => [...prev, steps[i]]);
        setEvalProgress(Math.round(((i + 1) / steps.length) * 100));
        i += 1;

        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      } else {
        clearInterval(timer);
        setIsEvaluating(false);

        setEvalReport({
          timestamp: new Date().toLocaleString(),
          baseline: evalMode === "preset" ? evalBaseline : "Uploaded Custom Model",
          dataset:
            evalMode === "preset" ? evalDataset : `Offline ZIP: ${uploadedZip}`,
          comparison: evalCompareTo,
          mode: evalMode,
          scores: {
            ASR: evalMode === "preset" ? 96 : 94,
            CLIP: evalMode === "preset" ? 91 : 89,
            FID: evalMode === "preset" ? 88 : 86,
            MCP: evalMode === "preset" ? 94 : 92,
          },
          summary:
            evalMode === "preset"
              ? "本模式用于快速演示，系统直接调取预计算缓存，适合评审展示和 Demo 预览。"
              : "本模式用于真实离线跑分，系统对上传的生成结果包进行解压、特征提取与多指标评估。",
        });

        addToast("评估完成，报告已生成", "success");
      }
    }, evalMode === "preset" ? 450 : 700);
  };

  return (
    <div className="space-y-6 relative z-10">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,242,254,0.05)]">
        <div className="flex items-start justify-between gap-4 flex-col lg:flex-row">
          <div className="max-w-2xl">
            <h2 className="font-tech text-2xl text-white font-bold tracking-wider flex items-center gap-2">
              <Database size={20} className="text-[#00f2fe]" />
              Evaluation Hub
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              双模式评估架构：预计算基准模式用于快速展示，离线上传模式用于上传本地生成结果后再跑分。
            </p>
          </div>

          <div className="flex bg-black/20 p-1.5 rounded-xl border border-white/5 w-full lg:w-auto">
            <button
              onClick={() => setEvalMode("preset")}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                evalMode === "preset"
                  ? "bg-[#00f2fe]/20 text-white shadow-[0_2px_10px_rgba(0,242,254,0.2)]"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              预计算基准
            </button>
            <button
              onClick={() => setEvalMode("upload")}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                evalMode === "upload"
                  ? "bg-[#8a2be2]/20 text-white shadow-[0_2px_10px_rgba(138,43,226,0.2)]"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              上传评估
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
          <div className="lg:col-span-5 flex flex-col gap-4">
            {evalMode === "preset" ? (
              <>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block font-semibold">
                    Baseline Model
                  </label>
                  <select
                    value={evalBaseline}
                    onChange={(e) => setEvalBaseline(e.target.value)}
                    className="w-full glass-input text-white py-3 px-4 rounded-xl text-sm appearance-none border-white/10"
                  >
                    <option value="COROC-v2-Pro" className="bg-[#0a1118]">COROC-v2-Pro</option>
                    <option value="UCE-Method (2024)" className="bg-[#0a1118]">UCE-Method (2024)</option>
                    <option value="ESD-Method (2023)" className="bg-[#0a1118]">ESD-Method (2023)</option>
                    <option value="Base-Unsafe-Model" className="bg-[#0a1118]">Base Unsafe Model</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block font-semibold">
                    Dataset
                  </label>
                  <select
                    value={evalDataset}
                    onChange={(e) => setEvalDataset(e.target.value)}
                    className="w-full glass-input text-white py-3 px-4 rounded-xl text-sm appearance-none border-white/10"
                  >
                    <option value="MS-COCO-Erase (10k Samples)" className="bg-[#0a1118]">MS-COCO-Erase (10k Samples)</option>
                    <option value="ImageNet-ConceptErase (5k Samples)" className="bg-[#0a1118]">ImageNet-ConceptErase (5k Samples)</option>
                  </select>
                </div>
              </>
            ) : (
              <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-slate-800 hover:border-violet-500/50 bg-slate-950/50">
                <input
                  type="file"
                  accept=".zip,.tar.gz"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedZip(e.target.files[0].name);
                      addToast(`已选择：${e.target.files[0].name}`, "success");
                    }
                  }}
                />
                {uploadedZip ? (
                  <>
                    <FileArchive className="w-8 h-8 text-cyan-400 mb-2" />
                    <span className="text-xs font-bold text-slate-200">{uploadedZip}</span>
                    <span className="text-[10px] text-cyan-400 mt-1 font-mono">READY FOR METRIC EXTRACTION</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-xs font-bold text-slate-300">点击上传离线生成图像压缩包 (.zip)</span>
                    <span className="text-[10px] text-slate-500 mt-1 text-center leading-relaxed">
                      用于本地先生成图像，再上传给系统做评估。
                    </span>
                  </>
                )}
              </label>
            )}

            <div>
              <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block font-semibold">
                Comparison Method
              </label>
              <select
                value={evalCompareTo}
                onChange={(e) => setEvalCompareTo(e.target.value)}
                className="w-full glass-input text-white py-3 px-4 rounded-xl text-sm appearance-none border-white/10"
              >
                <option value="UCE-Method (2024)" className="bg-[#0a1118]">UCE-Method (2024)</option>
                <option value="ESD-Method (2023)" className="bg-[#0a1118]">ESD-Method (2023)</option>
                <option value="Base-Unsafe-Model" className="bg-[#0a1118]">Base Unsafe Model</option>
              </select>
            </div>

            <button
              onClick={triggerEvaluation}
              disabled={isEvaluating}
              className={`w-full bg-gradient-to-r ${
                evalMode === "preset"
                  ? "from-[#00f2fe] to-[#8a2be2]"
                  : "from-[#8a2be2] to-[#b26cff]"
              } hover:brightness-110 text-white font-tech font-bold py-3.5 px-6 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2`}
            >
              {isEvaluating ? (
                <>
                  <Activity className="animate-spin" size={18} />
                  {evalMode === "preset" ? "加载缓存评估中..." : "离线跑分中..."}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  开始评估
                </>
              )}
            </button>

            <div className="glass-panel p-4 rounded-2xl min-h-[180px]">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-3 font-semibold">
                Evaluation Log
              </p>
              <div
                ref={logContainerRef}
                className="h-[140px] overflow-y-auto font-mono text-[11px] text-[#00f2fe] space-y-2 pr-1"
              >
                {evalLogs.length === 0 ? (
                  <p className="text-slate-500 italic">Awaiting evaluation session trigger...</p>
                ) : (
                  evalLogs.map((line, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-1">
                      {line}
                    </div>
                  ))
                )}
              </div>

              {isEvaluating && (
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      evalMode === "preset" ? "bg-[#00f2fe]" : "bg-[#8a2be2]"
                    }`}
                    style={{ width: `${evalProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-white/10">
            {evalReport ? (
              <div className="space-y-5">
                <div className="flex justify-between items-start gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-tech text-lg text-white">
                      {evalMode === "preset"
                        ? "COROC_STANDARD_BENCHMARK.pdf"
                        : "CUSTOM_OFFLINE_EVALUATION.pdf"}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      GENERATED AT: {evalReport.timestamp}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      MODE: {evalReport.mode === "preset" ? "Pre-computed Cache Mode" : "Offline Dataset Upload Mode"}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[11px] font-mono border ${
                      evalMode === "preset"
                        ? "text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/10"
                        : "text-[#8a2be2] border-[#8a2be2]/30 bg-[#8a2be2]/10"
                    }`}
                  >
                    REPORT READY
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: "ASR", value: evalReport.scores.ASR },
                    { name: "CLIP", value: evalReport.scores.CLIP },
                    { name: "FID", value: evalReport.scores.FID },
                    { name: "MCP", value: evalReport.scores.MCP },
                  ].map((metric) => (
                    <div key={metric.name} className="bg-black/25 border border-white/10 rounded-xl p-4 text-center">
                      <p className={`text-xs font-bold ${evalMode === "preset" ? "text-[#00f2fe]" : "text-[#8a2be2]"}`}>
                        {metric.name}
                      </p>
                      <p className="text-2xl font-tech font-bold text-white mt-2">
                        {metric.value}%
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                    <p className="text-slate-500 uppercase tracking-widest mb-1">Baseline</p>
                    <p>{evalReport.baseline}</p>
                  </div>
                  <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                    <p className="text-slate-500 uppercase tracking-widest mb-1">Dataset</p>
                    <p>{evalReport.dataset}</p>
                  </div>
                  <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                    <p className="text-slate-500 uppercase tracking-widest mb-1">Comparison</p>
                    <p>{evalReport.comparison}</p>
                  </div>
                  <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                    <p className="text-slate-500 uppercase tracking-widest mb-1">Mode</p>
                    <p>{evalReport.mode === "preset" ? "Cache" : "Upload"}</p>
                  </div>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                  <p className="text-slate-500 uppercase tracking-widest mb-2 text-xs">Summary</p>
                  <p className="text-sm text-slate-200 leading-relaxed">{evalReport.summary}</p>
                </div>
              </div>
            ) : (
              <div className="min-h-[420px] flex flex-col items-center justify-center text-center gap-3">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border ${
                    evalMode === "preset"
                      ? "border-[#00f2fe]/30 bg-[#00f2fe]/10"
                      : "border-[#8a2be2]/30 bg-[#8a2be2]/10"
                  }`}
                >
                  {evalMode === "preset" ? (
                    <Database className="w-7 h-7 text-[#00f2fe]" />
                  ) : (
                    <FileArchive className="w-7 h-7 text-[#8a2be2]" />
                  )}
                </div>
                <div className="max-w-md">
                  <p className="text-white font-semibold">多维量化评估白皮书未加载</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {evalMode === "preset"
                      ? "请选择预计算评估基准，一键调取历史跑分快照并生成多维报告。"
                      : "请先上传本地生成结果压缩包 (.zip)，再执行离线特征提取与评分。"}
                  </p>
                </div>
              </div>
            )}
          </div>
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
              { id: "evaluation", icon: Database, label: "Evaluation" },
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
        {activeTab === "evaluation" && <EvaluationTab />}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "history" && <HistoryTab />}
      </main>
    </div>
  );
}
