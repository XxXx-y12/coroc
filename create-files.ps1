# create-files.ps1
# 在 Windows PowerShell 中运行此脚本，自动生成 COROC 项目的所有文件

$base = "src"

# 创建目录结构
New-Item -ItemType Directory -Force -Path "$base\components" | Out-Null
New-Item -ItemType Directory -Force -Path "$base\contexts" | Out-Null
New-Item -ItemType Directory -Force -Path "$base\services" | Out-Null
New-Item -ItemType Directory -Force -Path "$base\styles" | Out-Null

# ------------------- global.css -------------------
@"
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --aurora-blue: rgba(0, 242, 254, 0.25);
  --aurora-purple: rgba(138, 43, 226, 0.25);
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #050a10;
  color: #e2e8f0;
  overflow-x: hidden;
}

h1, h2, h3, h4, .font-tech {
  font-family: 'Orbitron', sans-serif;
}

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }

.glass-panel {
  background: rgba(255, 255, 255, 0.08); 
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.glass-input {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}
.glass-input:focus {
  border-color: rgba(32, 184, 219, 0.5);
  background: rgba(0, 0, 0, 0.4);
  outline: none;
  box-shadow: 0 0 15px rgba(32, 184, 219, 0.2);
}

@keyframes aurora-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.aurora-bg-anim {
  background: radial-gradient(circle at 15% 50%, var(--aurora-blue), transparent 40%),
              radial-gradient(circle at 85% 30%, var(--aurora-purple), transparent 40%),
              #050a10;
  background-size: 200% 200%;
  animation: aurora-flow 20s ease infinite;
}

.split-o-container {
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
  cursor: crosshair;
  transition: transform 0.3s;
}
.split-o-container:hover { transform: scale(1.1); filter: drop-shadow(0 0 10px #20b8db); }

.split-half {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  transition: all 1.2s cubic-bezier(0.8, 0, 0.2, 1);
  color: #20b8db;
}
.split-top { clip-path: polygon(0 0, 100% 0, 100% 100%); }
.split-bottom { clip-path: polygon(0 0, 100% 100%, 0 100%); }

.split-o-container.torn .split-top {
  transform: translate(60vw, -60vh) rotate(45deg);
  opacity: 0;
}
.split-o-container.torn .split-bottom {
  transform: translate(-60vw, 60vh) rotate(-45deg);
  opacity: 0;
}

.img-hover-zoom { transition: transform 0.4s ease; }
.glass-panel:hover .img-hover-zoom { transform: scale(1.05); }

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.toast-enter { animation: slideInRight 0.3s ease-out forwards; }

@keyframes orbit-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes star-shimmer {
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}
.orbit-slow {
  animation: orbit-rotate 40s linear infinite;
}
.orbit-reverse {
  animation: orbit-rotate 25s linear infinite reverse;
}
.star-shimmer {
  animation: star-shimmer 3s ease-in-out infinite;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.glass-card {
  background: rgba(4, 8, 20, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.glass-card-glow {
  background: rgba(4, 12, 32, 0.8);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 242, 254, 0.2);
  box-shadow: 0 0 40px rgba(0, 242, 254, 0.12);
}
.brush-grid {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.01) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
}
"@ | Out-File -FilePath "$base\styles\global.css" -Encoding utf8

# ------------------- ToastContext.tsx -------------------
@"
import React, { useState, createContext, useContext } from 'react';
import { CheckCircle2, AlertCircle, Activity } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className=\"fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none\">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-enter glass-panel px-6 py-4 rounded-xl flex items-center gap-3 border-l-4 shadow-2xl ${
              toast.type === 'success' ? 'border-l-emerald-400' : 
              toast.type === 'error' ? 'border-l-rose-400' : 'border-l-blue-400'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className=\"text-emerald-400\" size={20} />
            ) : toast.type === 'error' ? (
              <AlertCircle className=\"text-rose-400\" size={20} />
            ) : (
              <Activity className=\"text-blue-400\" size={20} />
            )}
            <p className=\"text-sm font-medium text-white\">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
"@ | Out-File -FilePath "$base\contexts\ToastContext.tsx" -Encoding utf8

# ------------------- geminiService.ts -------------------
@"
export const generateGeminiText = async (userPrompt: string, systemPrompt: string) => {
  // ⚠️ 请在这里填入你自己的有效 Gemini API Key
  const apiKey = "YOUR_GEMINI_API_KEY"; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  let retries = 3;
  let delay = 1000;
  while (retries > 0) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("API Error");
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "No output generated.";
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  return "";
};
"@ | Out-File -FilePath "$base\services\geminiService.ts" -Encoding utf8

# ------------------- WelcomeScreen.tsx -------------------
@"
import React, { useState } from 'react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [isTearing, setIsTearing] = useState(false);

  const handleTear = () => {
    setIsTearing(true);
    setTimeout(() => {
      onEnter();
    }, 1000);
  };

  return (
    <div className={`w-full h-screen flex items-center justify-center bg-[#020508] transition-opacity duration-1000 ${isTearing ? 'opacity-0' : 'opacity-100'}`}>
      <div className=\"text-center\">
        <h1 className=\"text-[12vw] font-tech font-black tracking-widest text-white/90 flex items-center justify-center\">
          <span>C</span>
          <div className={`split-o-container mx-2 ${isTearing ? 'torn' : ''}`} onClick={handleTear}>
            <span className=\"opacity-0\">O</span> 
            <span className=\"split-half split-top font-tech flex items-center justify-center absolute top-0 left-0\">O</span>
            <span className=\"split-half split-bottom font-tech flex items-center justify-center absolute top-0 left-0\">O</span>
            {!isTearing && (
               <div className=\"absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 animate-pulse\">
                  <div className=\"w-[120%] h-[2px] bg-[#20b8db] absolute transform rotate-45\"></div>
               </div>
            )}
          </div>
          <span>R</span>
          <span>O</span>
          <span>C</span>
        </h1>
        <p className=\"text-[#20b8db] mt-4 tracking-[0.3em] uppercase text-sm font-light\">Click the core to initialize</p>
      </div>
    </div>
  );
};
"@ | Out-File -FilePath "$base\components\WelcomeScreen.tsx" -Encoding utf8

# ------------------- StarryLandingScreen.tsx (简化版但功能完整) -------------------
@"
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

interface StarryLandingScreenProps {
  onLogin: () => void;
}

export const StarryLandingScreen: React.FC<StarryLandingScreenProps> = ({ onLogin }) => {
  const { addToast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'signup' | 'login'>('signup');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className=\"min-h-screen bg-[#02050e] text-slate-100 font-sans antialiased overflow-x-hidden\">
      <nav className=\"fixed top-0 left-0 w-full z-50 glass-card border-b border-white/5 backdrop-blur-md px-6 py-4 flex justify-between items-center\">
        <div className=\"flex items-center space-x-3 cursor-pointer\" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className=\"w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2fe] via-[#4facfe] to-[#8a2be2] p-[1px]\">
            <div className=\"w-full h-full bg-[#02050e] rounded-lg flex items-center justify-center\">
              <svg className=\"w-5 h-5 text-[#00f2fe]\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\">
                <path d=\"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\" />
              </svg>
            </div>
          </div>
          <span className=\"font-mono text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#00f2fe]\">
            COROC <span className=\"text-[10px] text-[#00f2fe] border border-[#00f2fe]/30 px-1.5 py-0.5 rounded ml-1 bg-[#00f2fe]/10\">MCP v2</span>
          </span>
        </div>
        <div className=\"flex items-center space-x-4\">
          <button onClick={() => { setAuthType('login'); setShowAuthModal(true); }} className=\"text-sm font-medium text-slate-400 hover:text-white\">Login</button>
          <button onClick={() => { setAuthType('signup'); setShowAuthModal(true); }} className=\"relative group overflow-hidden rounded-full bg-slate-900 border border-slate-700 px-5 py-2 text-sm text-white hover:border-[#00f2fe]/50\">
            Sign Up
          </button>
        </div>
      </nav>
      <section className=\"relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center\">
        <h1 className=\"text-5xl md:text-7xl font-extrabold tracking-tight\">
          Erase Concepts.<br />
          <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#8a2be2]\">Preserve Art.</span>
        </h1>
        <p className=\"text-slate-300 mt-6 max-w-2xl mx-auto\">
          COROC introduces a state-of-the-art methodology for targeted concept erasure in Text-to-Image models.
        </p>
        <button onClick={() => { setAuthType('signup'); setShowAuthModal(true); }} className=\"mt-8 px-8 py-3 bg-[#00f2fe] text-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,242,254,0.45)] transition\">
          Get Started
        </button>
      </section>
      {showAuthModal && (
        <div className=\"fixed inset-0 z-50 flex items-center justify-center p-4\">
          <div className=\"absolute inset-0 bg-black/85 backdrop-blur-md\" onClick={() => setShowAuthModal(false)} />
          <div className=\"relative glass-card-glow w-full max-w-md p-8 rounded-[32px] border border-[#00f2fe]/20 shadow-2xl space-y-6 z-10\">
            <button onClick={() => setShowAuthModal(false)} className=\"absolute top-4 right-4 text-slate-400 hover:text-white\">✕</button>
            <div className=\"text-center\">
              <h3 className=\"text-2xl font-mono font-bold text-white\">{authType === 'signup' ? 'System Access' : 'Identity Verification'}</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowAuthModal(false); addToast('Authentication successful!', 'success'); onLogin(); }} className=\"space-y-4\">
              <input type=\"email\" placeholder=\"agent@coroc.ai\" required className=\"w-full glass-input rounded-xl py-3 px-4 text-sm\" />
              <input type=\"password\" placeholder=\"••••••••\" required className=\"w-full glass-input rounded-xl py-3 px-4 text-sm\" />
              <button type=\"submit\" className=\"w-full py-3 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe] font-bold\">AUTHENTICATE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
"@ | Out-File -FilePath "$base\components\StarryLandingScreen.tsx" -Encoding utf8

# ------------------- MainApp.tsx -------------------
@"
import React, { useState } from 'react';
import { ImageIcon, Layers, Activity, History, LogOut } from 'lucide-react';
import { GenerateTab } from './GenerateTab';
import { CustomEraseTab } from './CustomEraseTab';
import { DashboardTab } from './DashboardTab';
import { HistoryTab } from './HistoryTab';

interface MainAppProps {
  onLogout: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('generate');

  const tabs = [
    { id: 'generate', icon: ImageIcon, label: 'Synthesize', component: GenerateTab },
    { id: 'customErase', icon: Layers, label: 'Custom Erase', component: CustomEraseTab },
    { id: 'dashboard', icon: Activity, label: 'Telemetry', component: DashboardTab },
    { id: 'history', icon: History, label: 'Logs', component: HistoryTab },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || GenerateTab;

  return (
    <div className=\"min-h-screen aurora-bg-anim relative text-slate-200 font-sans\">
      <nav className=\"sticky top-0 z-50 w-full glass-panel border-b-0 px-6 py-4 flex justify-between items-center\">
        <div className=\"flex items-center gap-8\">
          <div className=\"font-tech text-2xl font-bold tracking-widest text-white\">C<span className=\"text-[#00f2fe]\">O</span>ROC</div>
          <div className=\"hidden md:flex gap-2 bg-black/20 p-1.5 rounded-xl\">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-[#00f2fe]/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onLogout} className=\"text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-400/10\">
          <LogOut size={20} />
        </button>
      </nav>
      <main className=\"max-w-7xl mx-auto px-4 py-8\">
        <ActiveComponent />
      </main>
    </div>
  );
};
"@ | Out-File -FilePath "$base\components\MainApp.tsx" -Encoding utf8

# ------------------- GenerateTab.tsx -------------------
@"
import React, { useState } from 'react';
import { Sparkles, ImageIcon, Zap, Activity, Wand2, MessageSquareText, Share2, Download, ShieldAlert, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { generateGeminiText } from '../services/geminiService';

const SCENE_PROMPTS = [
  { id: 1, name: \"Neon City\", prompt: \"Rainy cyberpunk downtown, neon lights, highly detailed\" },
  { id: 2, name: \"Ancient Ruins\", prompt: \"Overgrown temple ruins in a dense jungle, cinematic lighting\" },
  { id: 3, name: \"Deep Space\", prompt: \"Nebula cloud with distant stars, hyper-realistic, 8k resolution\" },
  { id: 4, name: \"Product Shot\", prompt: \"Minimalist cosmetic bottle on water ripples, studio lighting\" },
];

export const GenerateTab: React.FC = () => {
  const { addToast } = useToast();
  const [activeScene, setActiveScene] = useState(SCENE_PROMPTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ TICoE: string; ESD: string; Original: string } | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    addToast(\"Initializing distributed generation pipeline...\", \"success\");
    setTimeout(() => {
      setResults({
        TICoE: \"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop\",
        ESD: \"https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop\",
        Original: \"https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2070&auto=format&fit=crop\"
      });
      setIsGenerating(false);
      addToast(\"Generation complete.\", \"success\");
    }, 2500);
  };

  const handleShare = () => addToast(\"分享链接已生成并复制到剪贴板！\", \"success\");

  const handleEnhancePrompt = async () => {
    if (!customPrompt && !activeScene.prompt) { addToast(\"Provide a base prompt to enhance.\", \"error\"); return; }
    setIsEnhancing(true);
    addToast(\"Enhancing prompt logic...\", \"info\");
    try {
      const sysPrompt = \"You are an expert at writing detailed prompts for AI image generation. Expand the user's short prompt into a highly descriptive, comma-separated list of visual elements. Output ONLY the enhanced prompt string.\";
      const enhanced = await generateGeminiText(customPrompt || activeScene.prompt, sysPrompt);
      setCustomPrompt(enhanced.trim());
      addToast(\"Prompt optimized.\", \"success\");
    } catch (e) {
      addToast(\"Failed to connect to LLM core.\", \"error\");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAnalyzeRisk = async () => {
    if (!customPrompt && !activeScene.prompt) { addToast(\"Provide a prompt to analyze.\", \"error\"); return; }
    setIsAnalyzing(true);
    setAnalysisResult(\"\");
    addToast(\"Scanning concepts...\", \"info\");
    try {
      const sysPrompt = \"You are a safety AI. Analyze the prompt for potential copyrighted characters or sensitive subjects. Return a brief 2-sentence analysis.\";
      const analysis = await generateGeminiText(customPrompt || activeScene.prompt, sysPrompt);
      setAnalysisResult(analysis.trim());
      addToast(\"Analysis complete.\", \"success\");
    } catch (e) {
      addToast(\"Failed to analyze prompt.\", \"error\");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className=\"space-y-6\">
      <div className=\"glass-panel p-6 rounded-2xl\">
        <div className=\"flex flex-wrap gap-3 mb-6\">
          {SCENE_PROMPTS.map((scene) => (
            <button
              key={scene.id}
              onClick={() => { setActiveScene(scene); setCustomPrompt(scene.prompt); }}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all border ${
                activeScene.id === scene.id ? 'bg-[#00f2fe]/20 border-[#00f2fe]/50 text-white' : 'glass-panel text-slate-300'
              }`}
            >
              {scene.name}
            </button>
          ))}
        </div>
        <div className=\"flex gap-4 mb-4\">
          <input 
            type=\"text\" 
            value={customPrompt || activeScene.prompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className=\"flex-1 glass-input text-white py-3 px-5 rounded-xl text-sm\"
          />
          <button onClick={handleEnhancePrompt} disabled={isEnhancing} className=\"px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50\">
            <Wand2 size={18} />
          </button>
          <button onClick={handleAnalyzeRisk} disabled={isAnalyzing} className=\"px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50\">
            <MessageSquareText size={18} />
          </button>
        </div>
        {analysisResult && (
          <div className=\"p-4 bg-[#8a2be2]/10 border border-[#8a2be2]/30 rounded-xl text-sm text-purple-100 flex gap-3 mb-4\">
            <ShieldAlert size={18} className=\"text-[#8a2be2]\" />
            <div className=\"flex-1\">{analysisResult}</div>
            <button onClick={() => setAnalysisResult(\"\")}><X size={16} /></button>
          </div>
        )}
        <button onClick={handleGenerate} disabled={isGenerating} className=\"w-full bg-gradient-to-r from-[#00f2fe] to-[#8a2be2] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2\">
          {isGenerating ? <Activity className=\"animate-spin\" size={20} /> : <Zap size={20} />}
          {isGenerating ? \"Synthesizing...\" : \"Generate\"}
        </button>
      </div>
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        {results && ['TICoE', 'ESD', 'Original'].map((method) => (
          <div key={method} className=\"glass-panel rounded-2xl overflow-hidden\">
            <div className=\"p-3 bg-white/5 border-b border-white/10 font-tech\">{method}</div>
            <div className=\"aspect-video\">
              <img src={results[method as keyof typeof results]} alt={method} className=\"w-full h-full object-cover\" />
            </div>
            <div className=\"p-3 flex justify-end gap-2\">
              <button onClick={handleShare}><Share2 size={16} /></button>
              <button><Download size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
"@ | Out-File -FilePath "$base\components\GenerateTab.tsx" -Encoding utf8

# ------------------- CustomEraseTab.tsx -------------------
@"
import React, { useState } from 'react';
import { Layers, Plus, Trash2, Activity, Wand2, UploadCloud } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const CustomEraseTab: React.FC = () => {
  const { addToast } = useToast();
  const [concepts, setConcepts] = useState([
    { id: 1, name: \"Copyrighted Brand Logos\", type: \"object\", weight: 90 },
    { id: 2, name: \"Cyberpunk Glow Aesthetic\", type: \"style\", weight: 75 }
  ]);
  const [newConcept, setNewConcept] = useState(\"\");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddConcept = () => {
    if (!newConcept.trim()) return;
    setConcepts([...concepts, { id: Date.now(), name: newConcept, type: \"custom\", weight: 80 }]);
    setNewConcept(\"\");
    addToast(\"自定义概念向量已添加\", \"success\");
  };

  const handleRemoveConcept = (id: number) => setConcepts(concepts.filter(c => c.id !== id));

  return (
    <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">
      <div className=\"lg:col-span-5 glass-panel p-8 rounded-3xl flex flex-col items-center justify-center min-h-[400px] border border-dashed border-[#00f2fe]/30 group cursor-pointer\">
        <UploadCloud size={56} className=\"text-[#00f2fe] mb-5 group-hover:scale-110 transition-transform\" />
        <h3 className=\"text-white font-tech tracking-wider mb-2\">UPLOAD SOURCE IMAGE</h3>
        <p className=\"text-sm text-slate-400 text-center\">拖拽图像至此区域或点击浏览</p>
      </div>
      <div className=\"lg:col-span-7 glass-panel p-8 rounded-3xl\">
        <h3 className=\"font-tech text-2xl text-white flex items-center gap-3 mb-6\"><Layers size={24} className=\"text-[#8a2be2]\" /> 多概念叠加擦除矩阵</h3>
        <div className=\"flex gap-3 mb-6\">
          <input type=\"text\" value={newConcept} onChange={(e) => setNewConcept(e.target.value)} placeholder=\"输入需要擦除的概念\" className=\"flex-1 glass-input rounded-xl py-3 px-4\" />
          <button onClick={handleAddConcept} className=\"bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] px-6 py-3 rounded-xl flex items-center gap-2\"><Plus size={18} /> 添加靶点</button>
        </div>
        <div className=\"space-y-4 max-h-64 overflow-auto\">
          {concepts.map(concept => (
            <div key={concept.id} className=\"bg-black/30 border border-white/5 p-4 rounded-2xl flex justify-between items-center\">
              <div><span className=\"text-sm text-slate-200\">{concept.name}</span><div className=\"text-[10px] text-[#8a2be2]\">{concept.type}</div></div>
              <button onClick={() => handleRemoveConcept(concept.id)} className=\"text-rose-400 hover:text-rose-300\"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); addToast(\"靶向概念擦除完成\", \"success\"); }, 2000); }} disabled={isProcessing || concepts.length === 0} className=\"mt-8 w-full bg-gradient-to-r from-[#00f2fe] to-[#8a2be2] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3\">
          {isProcessing ? <Activity className=\"animate-spin\" /> : <Wand2 />} 执行多概念擦除
        </button>
      </div>
    </div>
  );
};
"@ | Out-File -FilePath "$base\components\CustomEraseTab.tsx" -Encoding utf8

# ------------------- DashboardTab.tsx -------------------
@"
import React from 'react';
import { Activity, ImageIcon, User, Zap, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const CHART_DATA_USAGE = [
  { name: 'Mon', users: 4000, erasures: 2400 },
  { name: 'Tue', users: 3000, erasures: 1398 },
  { name: 'Wed', users: 2000, erasures: 9800 },
  { name: 'Thu', users: 2780, erasures: 3908 },
  { name: 'Fri', users: 1890, erasures: 4800 },
  { name: 'Sat', users: 2390, erasures: 3800 },
  { name: 'Sun', users: 3490, erasures: 4300 },
];

const CHART_DATA_PERFORMANCE = [
  { subject: 'Concept Fidelity', TICoE: 95, ESD: 80, Original: 60, fullMark: 100 },
  { subject: 'Erasure Rate', TICoE: 98, ESD: 85, Original: 10, fullMark: 100 },
  { subject: 'Image Quality', TICoE: 92, ESD: 88, Original: 95, fullMark: 100 },
  { subject: 'Inference Speed', TICoE: 85, ESD: 70, Original: 99, fullMark: 100 },
  { subject: 'Prompt Adherence', TICoE: 90, ESD: 82, Original: 92, fullMark: 100 },
];

export const DashboardTab: React.FC = () => {
  const stats = [
    { label: \"Total Generations\", value: \"124,592\", trend: \"+14.2%\", icon: ImageIcon, color: \"text-[#00f2fe]\" },
    { label: \"Active Operatives\", value: \"8,942\", trend: \"+5.1%\", icon: User, color: \"text-[#8a2be2]\" },
    { label: \"Avg Inference Time\", value: \"1.42s\", trend: \"-0.3s\", icon: Zap, color: \"text-[#fbbf24]\" },
    { label: \"Concepts Erased\", value: \"45\", trend: \"+2\", icon: ShieldAlert, color: \"text-[#f43f5e]\" },
  ];

  return (
    <div className=\"space-y-6\">
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
        {stats.map((stat, i) => (
          <div key={i} className=\"glass-panel p-5 rounded-2xl\">
            <p className=\"text-xs text-slate-400 uppercase\">{stat.label}</p>
            <h4 className=\"text-2xl font-tech font-bold text-white\">{stat.value}</h4>
            <p className=\"text-xs text-purple-400 mt-2\">{stat.trend} from last epoch</p>
          </div>
        ))}
      </div>
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
        <div className=\"glass-panel p-6 rounded-2xl\">
          <h3 className=\"font-tech text-lg mb-4 flex items-center gap-2\"><Activity size={18} /> Network Utilization</h3>
          <div className=\"h-72\">
            <ResponsiveContainer width=\"100%\" height=\"100%\">
              <AreaChart data={CHART_DATA_USAGE}>
                <CartesianGrid strokeDasharray=\"3 3\" stroke=\"rgba(255,255,255,0.1)\" />
                <XAxis dataKey=\"name\" stroke=\"rgba(255,255,255,0.5)\" />
                <YAxis stroke=\"rgba(255,255,255,0.5)\" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5,10,16,0.9)', border: 'none' }} />
                <Legend />
                <Area type=\"monotone\" dataKey=\"users\" stroke=\"#00f2fe\" fill=\"#00f2fe\" fillOpacity={0.3} />
                <Area type=\"monotone\" dataKey=\"erasures\" stroke=\"#8a2be2\" fill=\"#8a2be2\" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className=\"glass-panel p-6 rounded-2xl\">
          <h3 className=\"font-tech text-lg mb-4 flex items-center gap-2\"><SlidersHorizontal size={18} /> Method Performance</h3>
          <div className=\"h-72\">
            <ResponsiveContainer width=\"100%\" height=\"100%\">
              <RadarChart data={CHART_DATA_PERFORMANCE}>
                <PolarGrid stroke=\"rgba(255,255,255,0.1)\" />
                <PolarAngleAxis dataKey=\"subject\" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name=\"TICoE\" dataKey=\"TICoE\" stroke=\"#00f2fe\" fill=\"#00f2fe\" fillOpacity={0.4} />
                <Radar name=\"ESD\" dataKey=\"ESD\" stroke=\"#8a2be2\" fill=\"#8a2be2\" fillOpacity={0.3} />
                <Radar name=\"Original\" dataKey=\"Original\" stroke=\"#64748b\" fill=\"#64748b\" fillOpacity={0.2} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
"@ | Out-File -FilePath "$base\components\DashboardTab.tsx" -Encoding utf8

# ------------------- HistoryTab.tsx -------------------
@"
import React from 'react';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 101, prompt: \"Remove watermarks from landscape\", method: \"TICoE\", time: \"2 mins ago\", status: \"Success\" },
  { id: 102, prompt: \"Erase specific character style\", method: \"ESD\", time: \"1 hour ago\", status: \"Success\" },
  { id: 103, prompt: \"Remove inappropriate content\", method: \"TICoE\", time: \"3 hours ago\", status: \"Success\" },
  { id: 104, prompt: \"Filter violence concepts\", method: \"Original\", time: \"1 day ago\", status: \"Failed\" },
];

export const HistoryTab: React.FC = () => {
  return (
    <div className=\"glass-panel p-6 rounded-2xl min-h-[60vh]\">
      <div className=\"flex justify-between items-center mb-6 pb-4 border-b border-white/10\">
        <h2 className=\"font-tech text-xl text-white\">Execution Logs</h2>
        <div className=\"relative w-64\">
          <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 text-slate-400\" size={14} />
          <input type=\"text\" placeholder=\"Search prompts...\" className=\"w-full glass-input rounded-lg py-2 pl-9 pr-4 text-sm\" />
        </div>
      </div>
      <table className=\"w-full text-left\">
        <thead className=\"text-slate-400 text-xs uppercase border-b border-white/10\">
          <tr><th className=\"py-3\">ID</th><th>Prompt</th><th>Method</th><th>Time</th><th>Status</th></tr>
        </thead>
        <tbody>
          {MOCK_HISTORY.map(row => (
            <tr key={row.id} className=\"border-b border-white/5 hover:bg-white/5\">
              <td className=\"py-4 text-[#00f2fe] font-tech\">#{row.id}</td>
              <td className=\"text-sm text-slate-200 truncate max-w-xs\">{row.prompt}</td>
              <td><span className=\"px-2 py-1 bg-white/10 rounded-md text-xs\">{row.method}</span></td>
              <td className=\"text-slate-400 text-sm\">{row.time}</td>
              <td><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${row.status === 'Success' ? 'bg-[#00f2fe]/10 text-[#00f2fe]' : 'bg-rose-500/10 text-rose-400'}`}>{row.status === 'Success' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
"@ | Out-File -FilePath "$base\components\HistoryTab.tsx" -Encoding utf8

# ------------------- App.tsx -------------------
@"
import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StarryLandingScreen } from './components/StarryLandingScreen';
import { MainApp } from './components/MainApp';
import { ToastProvider } from './contexts/ToastContext';
import './styles/global.css';

export default function App() {
  const [view, setView] = useState<'welcome' | 'intro' | 'main'>('welcome');

  useEffect(() => {
    // 确保 global.css 已加载
  }, []);

  return (
    <ToastProvider>
      {view === 'welcome' && <WelcomeScreen onEnter={() => setView('intro')} />}
      {view === 'intro' && <StarryLandingScreen onLogin={() => setView('main')} />}
      {view === 'main' && <MainApp onLogout={() => setView('intro')} />}
    </ToastProvider>
  );
}
"@ | Out-File -FilePath "$base\App.tsx" -Encoding utf8

# ------------------- main.tsx -------------------
@"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@ | Out-File -FilePath "src\main.tsx" -Encoding utf8

Write-Host "✅ 所有文件已创建完成！" -ForegroundColor Green
Write-Host "👉 请记得修改 src/services/geminiService.ts 中的 API Key" -ForegroundColor Yellow