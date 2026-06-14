import React, { useState, useEffect, useRef } from "react";
import { User, ShieldAlert, X, Layers } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

// ----------------------------------------------------------------------
// CONSTANTS & MOCK DATA
// ----------------------------------------------------------------------
const categories = [
  { id: 'scene', label: '擦除场景', desc: '完美清除复杂星空、山川地貌中特定结构，保留笔触纹理' },
  { id: 'style', label: '风格提取', desc: '剥离特定艺术家的主观画风与特异笔触，防止AI大模型无授权抄袭' },
  { id: 'object', label: '敏感物品', desc: '精准识别并抹除受版权保护、工业设计专利的特征产品边界' },
  { id: 'nudity', label: '合规防裸露', desc: '针对大模型安全对齐设计，无损生成高精度安全内容屏障' },
  { id: 'multi', label: '多概念叠加', desc: '同时消除多个交错艺术流派与受版权保护角色的侵权烙印' }
];

const modelsData = {
  'sd1.5': {
    title: 'Stable Diffusion v1.5 Secure-Weights',
    resolution: '512 x 512 native',
    speed: '1.2s avg. inference',
    safety: '99.4% removal success',
    loss: 'FID delta < 0.15'
  },
  'sd2.0': {
    title: 'Stable Diffusion v2.0 Ultra-Aligned',
    resolution: '768 x 768 native',
    speed: '0.8s avg. inference (optimized)',
    safety: '99.98% commercial safety',
    loss: 'FID delta < 0.08 (zero fidelity loss)'
  }
};

const pricingPlans = [
  {
    name: '学术探索版 (Academic)',
    price: '$0',
    period: 'Forever free for non-profit',
    desc: '专为独立学术研究、非盈利性防侵权检测而设计。',
    features: ['支持 SD 1.5 概念剪裁引擎', '每月 1,000 次免费 API 调试额度', '核心 MCP 安全保护指数报告', '社区 Discord 开发者支持群组'],
    cta: '启动学术接入'
  },
  {
    name: '专业艺术工坊 (Creative Pro)',
    price: '$129',
    period: 'per month',
    desc: '适合中小型生成式艺术画室、商业AI模型微调团队。',
    features: ['支持 SD 1.5 & SD 2.0 实时热插拔擦除', '无限次特定风格概念擦除与检测', '高精细度 MCP 指标雷达监控仪', '定制抗微调逆向工程对抗插件', '24/7 专属工程师优先服务通道'],
    cta: '激活专业安全引擎',
    popular: true
  },
  {
    name: '企业级防火墙 (Enterprise)',
    price: 'Custom',
    period: 'Tailored contract SLA',
    desc: '针对大规模企业级云端 AIGC 图像平台深度合规化。',
    features: ['全套模型无损反演、多维概念裁剪定制', '多概念并行擦除无并发限制 (低延迟架构)', '支持私有云本地集群物理部署（H100/A100优化）', '独立法律责任合规保障与数字水印对抗方案'],
    cta: '与产品架构师沟通'
  }
];

const apiCode = {
  python: `import coroc

# 1. 载入 COROC 多概念安全擦除引擎
engine = coroc.EraserEngine(
    base_model="stable-diffusion-2.0", 
    security_key="sk_coroc_van_gogh_starry"
)

# 2. 定义需要抹除的敏感概念与版权比重
erased_concepts = [
    {"concept": "van_gogh_style", "strength": 0.95},
    {"concept": "explicit_content", "strength": 1.00}
]

# 3. 注入 MCP 相似度评估算子，确保未擦除区域表现力完美留存
result = engine.apply_erasure(
    concepts=erased_concepts,
    evaluation_metric="mcp_v2",
    preserve_background_fidelity=True
)

# 4. 导出安全防侵权模型权重
engine.export_checkpoint("./secure_weights_starry.safetensors")
print("🔥 MCP Secure alignment complete. Fidelity loss: 0.04%")`,
  javascript: `import { CorocEngine } from '@coroc/secure-art';

// 初始化 COROC 艺术家版权保护引擎
const eraser = new CorocEngine({
  apiKey: "sk_coroc_van_gogh_starry",
  model: "stable-diffusion-2.0"
});

// 执行高效多流概念清除机制
const secureWeights = await eraser.erase({
  targetConcepts: ["van_gogh_brushstrokes", "copyrighted_ip_cyber"],
  fidelityMetrics: "MCP_v2",
  preserveLayout: true
});

console.log('✅ Model sterilized! Safety score:', secureWeights.safetyFidelity);`,
  bash: `curl -X POST "https://api.coroc.ai/v1/erase" \
  -H "Authorization: Bearer sk_coroc_van_gogh_starry" \
  -H "Content-Type: application/json" \
  -d '{
    "base_model": "stable-diffusion-2.0",
    "concepts": ["van_gogh_style"],
    "mcp_assessment": true
  }'`
};

export default function StarryLandingScreen({ onLogin }) {
  const { addToast } = useToast();
  
  const [scrollY, setScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedModel, setSelectedModel] = useState('sd2.0');
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [videoProgress, setVideoProgress] = useState(25);
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [apiLang, setApiLang] = useState('python');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('signup');
  const [isCopied, setIsCopied] = useState(false);

  const [typedText, setTypedText] = useState('');
  const fullText = "Multi-Concept Preservation Evaluation Framework (MCP)";

  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    let interval;
    if (isPlayingVideo) {
      interval = setInterval(() => {
        setVideoProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 50);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (interval) clearInterval(interval);
    };
  }, [isPlayingVideo]);

  useEffect(() => {
    let index = 0;
    setTypedText('');
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      if(canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const strokes = [];
    const colors = [
      'rgba(12, 38, 96, 0.45)',  
      'rgba(26, 60, 142, 0.4)',   
      'rgba(59, 130, 246, 0.35)', 
      'rgba(234, 179, 8, 0.35)',  
      'rgba(253, 224, 71, 0.3)',  
      'rgba(255, 255, 255, 0.25)' 
    ];

    for (let i = 0; i < 180; i++) {
      strokes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 40 + Math.random() * 80,
        speed: 0.6 + Math.random() * 1.4,
        angle: Math.random() * Math.PI * 2,
        width: 2 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const drawFlowField = () => {
      ctx.fillStyle = 'rgba(2, 5, 14, 0.12)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      strokes.forEach(stroke => {
        const centerX = canvas.width * 0.45;
        const centerY = canvas.height * 0.45;
        const dx = stroke.x - centerX;
        const dy = stroke.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
        if (dist < 350) {
          targetAngle += (1 - dist / 350) * 0.5; 
        }

        const mdx = stroke.x - mouseRef.current.x;
        const mdy = stroke.y - mouseRef.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          const force = (1 - mdist / 180) * 0.8;
          targetAngle += Math.atan2(mdy, mdx) * force;
        }

        stroke.angle += (targetAngle - stroke.angle) * 0.05;
        stroke.x += Math.cos(stroke.angle) * stroke.speed;
        stroke.y += Math.sin(stroke.angle) * stroke.speed;

        if (stroke.x < -100) stroke.x = canvas.width + 100;
        if (stroke.x > canvas.width + 100) stroke.x = -100;
        if (stroke.y < -100) stroke.y = canvas.height + 100;
        if (stroke.y > canvas.height + 100) stroke.y = -100;

        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = 'round';
        ctx.moveTo(stroke.x, stroke.y);
        ctx.lineTo(
          stroke.x - Math.cos(stroke.angle) * stroke.length * 0.25,
          stroke.y - Math.sin(stroke.angle) * stroke.length * 0.25
        );
        ctx.stroke();
      });

      ctx.beginPath();
      const moonX = canvas.width * 0.82;
      const moonY = canvas.height * 0.22;
      ctx.arc(moonX, moonY, 45, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(253, 224, 71, 0.03)';
      ctx.fill();

      animationId = requestAnimationFrame(drawFlowField);
    };

    drawFlowField();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleMouseMoveCanvas = (e) => {
    if(canvasRef.current){
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseLeaveCanvas = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'scene', label: '擦除场景', desc: '完美清除复杂星空、山川地貌中特定结构，保留笔触纹理' },
    { id: 'style', label: '风格提取', desc: '剥离特定艺术家的主观画风与特异笔触，防止AI大模型无授权抄袭' },
    { id: 'object', label: '敏感物品', desc: '精准识别并抹除受版权保护、工业设计专利的特征产品边界' },
    { id: 'nudity', label: '合规防裸露', desc: '针对大模型安全对齐设计，无损生成高精度安全内容屏障' },
    { id: 'multi', label: '多概念叠加', desc: '同时消除多个交错艺术流派与受版权保护角色的侵权烙印' }
  ];

  const modelsData = {
    'sd1.5': {
      title: 'Stable Diffusion v1.5 Secure-Weights',
      resolution: '512 x 512 native',
      speed: '1.2s avg. inference',
      safety: '99.4% removal success',
      loss: 'FID delta < 0.15'
    },
    'sd2.0': {
      title: 'Stable Diffusion v2.0 Ultra-Aligned',
      resolution: '768 x 768 native',
      speed: '0.8s avg. inference (optimized)',
      safety: '99.98% commercial safety',
      loss: 'FID delta < 0.08 (zero fidelity loss)'
    }
  };

  const pricingPlans = [
    {
      name: '学术探索版 (Academic)',
      price: '$0',
      period: 'Forever free for non-profit',
      desc: '专为独立学术研究、非盈利性防侵权检测而设计。',
      features: ['支持 SD 1.5 概念剪裁引擎', '每月 1,000 次免费 API 调试额度', '核心 MCP 安全保护指数报告', '社区 Discord 开发者支持群组'],
      cta: '启动学术接入'
    },
    {
      name: '专业艺术工坊 (Creative Pro)',
      price: '$129',
      period: 'per month',
      desc: '适合中小型生成式艺术画室、商业AI模型微调团队。',
      features: ['支持 SD 1.5 & SD 2.0 实时热插拔擦除', '无限次特定风格概念擦除与检测', '高精细度 MCP 指标雷达监控仪', '定制抗微调逆向工程对抗插件', '24/7 专属工程师优先服务通道'],
      cta: '激活专业安全引擎',
      popular: true
    },
    {
      name: '企业级防火墙 (Enterprise)',
      price: 'Custom',
      period: 'Tailored contract SLA',
      desc: '针对大规模企业级云端 AIGC 图像平台深度合规化。',
      features: ['全套模型无损反演、多维概念裁剪定制', '多概念并行擦除无并发限制 (低延迟架构)', '支持私有云本地集群物理部署（H100/A100优化）', '独立法律责任合规保障与数字水印对抗方案'],
      cta: '与产品架构师沟通'
    }
  ];

  const apiCode = {
    python: `import coroc

# 1. 载入 COROC 多概念安全擦除引擎
engine = coroc.EraserEngine(
    base_model="stable-diffusion-2.0", 
    security_key="sk_coroc_van_gogh_starry"
)

# 2. 定义需要抹除的敏感概念与版权比重
erased_concepts = [
    {"concept": "van_gogh_style", "strength": 0.95},
    {"concept": "explicit_content", "strength": 1.00}
]

# 3. 注入 MCP 相似度评估算子，确保未擦除区域表现力完美留存
result = engine.apply_erasure(
    concepts=erased_concepts,
    evaluation_metric="mcp_v2",
    preserve_background_fidelity=True
)

# 4. 导出安全防侵权模型权重
engine.export_checkpoint("./secure_weights_starry.safetensors")
print("🔥 MCP Secure alignment complete. Fidelity loss: 0.04%")`,
    javascript: `import { CorocEngine } from '@coroc/secure-art';

// 初始化 COROC 艺术家版权保护引擎
const eraser = new CorocEngine({
  apiKey: "sk_coroc_van_gogh_starry",
  model: "stable-diffusion-2.0"
});

// 执行高效多流概念清除机制
const secureWeights = await eraser.erase({
  targetConcepts: ["van_gogh_brushstrokes", "copyrighted_ip_cyber"],
  fidelityMetrics: "MCP_v2",
  preserveLayout: true
});

console.log('✅ Model sterilized! Safety score:', secureWeights.safetyFidelity);`,
    bash: `curl -X POST "https://api.coroc.ai/v1/erase" \\
  -H "Authorization: Bearer sk_coroc_van_gogh_starry" \\
  -H "Content-Type: application/json" \\
  -d '{
    "base_model": "stable-diffusion-2.0",
    "concepts": ["van_gogh_style"],
    "mcp_assessment": true
  }'`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(apiCode[apiLang]);
    setIsCopied(true);
    addToast("代码已复制到剪贴板", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const rawOpacity = Math.max(0, Math.min(1, (100 - sliderPos) / 35));
  const corocOpacity = Math.max(0, Math.min(1, sliderPos / 35));

  return (
    <div className="min-h-screen bg-[#02050e] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-[#00f2fe]/30 selection:text-[#00f2fe] animate-in fade-in duration-1000">
      
      <nav className="fixed top-0 left-0 w-full z-50 glass-card border-b border-white/5 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2fe] via-[#4facfe] to-[#8a2be2] p-[1px]">
              <div className="w-full h-full bg-[#02050e] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#00f2fe]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <span className="font-mono text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#00f2fe]">
              COROC <span className="text-[10px] text-[#00f2fe] border border-[#00f2fe]/30 px-1.5 py-0.5 rounded ml-1 bg-[#00f2fe]/10">MCP v2</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#00f2fe] hover:scale-105 transition-all duration-200 focus:outline-none">产品功能</button>
            <button onClick={() => scrollToSection('performance')} className="hover:text-[#00f2fe] hover:scale-105 transition-all duration-200 focus:outline-none">产品性能</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-[#00f2fe] hover:scale-105 transition-all duration-200 focus:outline-none">产品定价</button>
            <button onClick={() => scrollToSection('api')} className="hover:text-[#00f2fe] hover:scale-105 transition-all duration-200 focus:outline-none">API Access</button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => { setAuthType('login'); setShowAuthModal(true); }}
              className="text-sm font-medium text-slate-400 hover:text-white hover:scale-105 transition-all duration-200"
            >
              Login
            </button>
            <button 
              onClick={() => { setAuthType('signup'); setShowAuthModal(true); }}
              className="relative group overflow-hidden rounded-full bg-slate-900 border border-slate-700 px-5 py-2 text-sm text-white transition-all duration-300 hover:border-[#00f2fe]/50 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f2fe]/20 to-[#8a2be2]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center space-x-1 font-mono">
                <span>Sign Up</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      <header className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between pt-16 bg-[#030614]">
        
        {/* Parallax Layers */}
        <div 
          className="absolute inset-0 z-0 opacity-90 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
          onMouseMove={handleMouseMoveCanvas}
          onMouseLeave={handleMouseLeaveCanvas}
        >
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </div>

        <div 
          className="absolute inset-x-0 top-0 h-[80vh] z-10 pointer-events-none mix-blend-screen opacity-70"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <svg className="absolute top-12 left-1/2 -translate-x-[15%] w-full max-w-[800px] h-full" viewBox="0 0 1000 600" fill="none">
            <g transform="translate(620, 180)">
              <circle cx="0" cy="0" r="180" stroke="url(#starGradient1)" strokeWidth="1" strokeDasharray="3 15" className="orbit-slow" />
              <circle cx="0" cy="0" r="120" stroke="url(#starGradient2)" strokeWidth="1.5" strokeDasharray="4 10" className="orbit-reverse" />
              <circle cx="0" cy="0" r="70" fill="url(#moonGlow)" className="star-shimmer" opacity="0.45" />
              <path d="M-10,-35 A40,40 0 1,0 40,25 A34,34 0 1,1 -10,-35 Z" fill="#fbbf24" filter="drop-shadow(0 0 25px #f59e0b)" />
              <circle cx="0" cy="0" r="50" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 8" opacity="0.5" />
            </g>
            <defs>
              <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#eab308" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#030614" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="starGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="starGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div 
          className="absolute inset-x-0 bottom-0 h-[38vh] z-15 pointer-events-none opacity-60"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <svg className="absolute bottom-[-1px] w-full h-full" viewBox="0 0 1440 280" preserveAspectRatio="none">
            <path fill="url(#hillGrad1)" d="M0,150L120,135C240,120,480,90,720,110C960,130,1200,200,1320,210L1440,220L1440,280L1320,280C1200,280,960,280,720,280C480,280,240,280,120,280L0,280Z" />
            <defs>
              <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#091b44" />
                <stop offset="100%" stopColor="#02050e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div 
          className="absolute inset-x-0 bottom-0 h-[26vh] z-20 pointer-events-none opacity-85"
          style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        >
          <svg className="absolute bottom-[-2px] w-full h-full" viewBox="0 0 1440 220" preserveAspectRatio="none">
            <path fill="url(#hillGrad2)" d="M0,140L100,145C200,150,400,160,600,150C800,140,1000,110,1200,105L1440,100L1440,220L1200,220C1000,220,800,220,600,220C400,220,200,220,100,220L0,220Z" />
            <g transform="translate(420, 140)">
              <rect x="0" y="0" width="16" height="12" fill="#040e24" />
              <polygon points="-4,0 8,-8 20,0" fill="#020719" />
              <rect x="5" y="4" width="6" height="5" fill="#f59e0b" filter="drop-shadow(0 0 4px #fbbf24)" />
            </g>
            <g transform="translate(850, 130)">
              <rect x="0" y="0" width="14" height="10" fill="#030b1e" />
              <polygon points="-3,0 7,-6 17,0" fill="#01040f" />
              <rect x="4" y="3" width="5" height="4" fill="#fbbf24" />
            </g>
            <defs>
              <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#040e2d" />
                <stop offset="100%" stopColor="#02050d" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute inset-y-0 left-0 w-[24%] max-w-[280px] z-30 pointer-events-none mix-blend-multiply opacity-95">
          <svg className="absolute bottom-[-15px] left-0 w-full h-[70vh] text-[#010614] fill-current" viewBox="0 0 200 600" preserveAspectRatio="none">
            <path d="M 60,600 C -10,510 -5,410 10,310 C -5,220 15,150 30,80 C 35,45 45,20 55,0 C 65,30 70,60 80,100 C 95,70 110,120 120,180 C 130,150 140,210 145,270 C 160,220 165,310 155,380 C 180,440 165,510 110,600 Z" />
          </svg>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#02050e] via-[#02050e]/90 to-transparent z-35" />

        <div className="relative z-40 max-w-7xl mx-auto px-6 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-20 pb-16 transform -translate-y-4">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="w-full glass-card p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden border border-white/10">
              <div className="inline-flex items-center space-x-2 bg-[#00f2fe]/10 border border-[#00f2fe]/30 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-[#00f2fe] mb-8">
                <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
                <span>🛡️ Advanced Creator Copyright Protection</span>
              </div>

              <h1 className="text-[38px] sm:text-[48px] md:text-[62px] font-extrabold tracking-tight leading-[1.05] text-slate-100 mb-6 font-sans">
                Erase Concepts.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-[#5dbdf2] to-[#b18eff]">
                  Preserve Art.
                </span>
              </h1>

              <p className="text-sm md:text-base text-slate-300 mb-8 leading-relaxed font-light">
                COROC introduces a state-of-the-art methodology for targeted concept erasure in Text-to-Image models. Safeguard your generative outputs without compromising overall model utility. Experience the cleanest removal of specified artistic styles, copyrighted subjects, and explicit content.
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-slate-300">
                  <span className="text-[#00f2fe]">⚡</span>
                  <span>Ultra-Fast Inference</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-slate-300">
                  <span className="text-[#00f2fe]">🛡️</span>
                  <span>Safe Generation</span>
                </div>

                <button 
                  onClick={() => { setAuthType('signup'); setShowAuthModal(true); }}
                  className="px-6 py-2.5 rounded-xl font-mono font-bold text-xs tracking-wider text-black bg-[#00f2fe] overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(0,242,254,0.45)] focus:outline-none relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-25 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center space-x-1.5">
                    <span>开始体验 SAFE ENGINE</span>
                    <span className="font-sans text-xs">→</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block" />
        </div>

        <div className="relative z-40 w-full max-w-7xl mx-auto px-6 pb-6 flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span>CREATIVE STELLAR DEFENDER V2</span>
          <span>© 2026 COROC ALLIANCE</span>
        </div>
      </header>

      <section id="features" className="relative py-28 bg-[#02050e] brush-grid border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-xs font-mono text-[#00f2fe] tracking-widest uppercase">// Interactive Eraser Engine</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-2 text-white">艺术擦除与多模型对比</h2>
            <p className="text-slate-400 max-w-2xl mt-4 text-sm md:text-base font-light">
              体验 COROC 如何做到在不影响大模型整体画质的前提下，干净地剪切或抹除特定风格与版权内容。
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10 bg-slate-900/60 p-2 rounded-2xl border border-white/5 max-w-4xl">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(idx)}
                className={`flex-1 min-w-[130px] py-3.5 px-4 rounded-xl font-mono text-xs tracking-wider transition-all duration-300 ${
                  activeCategory === idx
                    ? 'bg-[#00f2fe] text-black font-bold shadow-[0_0_15px_rgba(0,242,254,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5">
                  <span>0{idx + 1}.</span>
                  <span>{cat.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div 
                ref={sliderRef}
                className="relative h-[380px] md:h-[460px] w-full rounded-[32px] overflow-hidden cursor-ew-resize border border-white/10 select-none shadow-2xl bg-[#030712]"
                onMouseMove={(e) => { if (e.buttons === 1) handleSliderMove(e.clientX); }}
                onTouchMove={(e) => { if (e.touches && e.touches[0]) handleSliderMove(e.touches[0].clientX); }}
                onMouseDown={() => {
                  const onMouseMove = (moveEvent) => handleSliderMove(moveEvent.clientX);
                  const onMouseUp = () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
                  window.addEventListener('mousemove', onMouseMove);
                  window.addEventListener('mouseup', onMouseUp);
                }}
              >
                <div className="absolute inset-0 bg-[#06122d] flex flex-col justify-end p-8">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#05183d] via-[#103073] to-[#040e24] opacity-95" />
                  <div className="absolute inset-0 opacity-80 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 800 450">
                      <circle cx="200" cy="150" r="55" fill="url(#canvasStarGlow)" className="star-shimmer" />
                      <circle cx="550" cy="220" r="45" fill="url(#canvasStarGlow)" className="star-shimmer" />
                      <path d="M 50,200 Q 250,100 450,250 T 750,150" fill="none" stroke="#facc15" strokeWidth="16" strokeDasharray="6 20" opacity="0.6" />
                      <path d="M 40,210 Q 240,110 440,260 T 740,160" fill="none" stroke="#60a5fa" strokeWidth="8" strokeDasharray="4 15" opacity="0.5" />
                    </svg>
                  </div>
                </div>

                <div 
                  className="absolute inset-y-0 left-0 right-0 bg-[#0a0f1d] flex flex-col justify-end p-8 border-r-2 border-[#00f2fe]/80"
                  style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#050b16] to-[#0d162d]" />
                  <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 800 450">
                      <circle cx="200" cy="150" r="30" stroke="#475569" strokeWidth="2" fill="none" />
                      <circle cx="550" cy="220" r="25" stroke="#475569" strokeWidth="2" fill="none" />
                      <path d="M 50,200 Q 250,100 450,250 T 750,150" fill="none" stroke="#334155" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                <div className="absolute inset-y-0 w-1 bg-[#00f2fe] z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#02050e] border-2 border-[#00f2fe] flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.5)]">
                    <span className="text-[#00f2fe] text-sm font-bold font-mono">↔</span>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 z-30 w-64 bg-black/85 backdrop-blur-md border border-amber-500/30 p-3 rounded-xl transition-all duration-150 pointer-events-none" style={{ opacity: rawOpacity }}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">RAW UNSTERILIZED</span>
                  </div>
                  <p className="text-[11px] text-slate-300">风格侵权率: <strong className="text-amber-400">98.7%</strong> <span className="text-[10px] text-slate-500">(高诉讼风险)</span></p>
                </div>

                <div className="absolute bottom-6 left-6 z-30 w-64 bg-black/85 backdrop-blur-md border border-[#00f2fe]/30 p-3 rounded-xl transition-all duration-150 pointer-events-none" style={{ opacity: corocOpacity }}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#00f2fe] font-bold uppercase tracking-wider">COROC SECURED</span>
                  </div>
                  <p className="text-[11px] text-slate-300">侵权相关度: <strong className="text-[#00f2fe]">0.04%</strong> <span className="text-[10px] text-green-400">(完全豁免)</span></p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 font-mono text-xs flex items-center justify-between">
                <span className="text-slate-400">场景：<strong className="text-slate-100">{categories[activeCategory].desc}</strong></span>
                <span className="text-[#00f2fe] hidden md:inline">← 拖动中心滑块观察互锁擦除效果 →</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Select Model Weights</span>
                <h3 className="text-lg font-bold text-slate-100">支持的模型安全底座</h3>

                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setSelectedModel('sd1.5')}
                    className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all ${
                      selectedModel === 'sd1.5' ? 'bg-slate-800 text-[#00f2fe]' : 'text-slate-400'
                    }`}
                  >
                    Stable Diffusion 1.5
                  </button>
                  <button
                    onClick={() => setSelectedModel('sd2.0')}
                    className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all ${
                      selectedModel === 'sd2.0' ? 'bg-slate-800 text-[#00f2fe]' : 'text-slate-400'
                    }`}
                  >
                    Stable Diffusion 2.0
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="border-b border-white/5 pb-3">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Target Blueprint</div>
                    <div className="font-bold text-sm text-slate-200">{modelsData[selectedModel].title}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">原生分辨率</div>
                      <div className="font-bold text-xs text-slate-300">{modelsData[selectedModel].resolution}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">核心损耗</div>
                      <div className="font-bold text-xs text-[#00f2fe]">{modelsData[selectedModel].loss}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">吞吐速度</div>
                      <div className="font-bold text-xs text-slate-300">{modelsData[selectedModel].speed}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">对抗阻断率</div>
                      <div className="font-bold text-xs text-green-400">{modelsData[selectedModel].safety}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card-glow p-6 rounded-3xl flex items-start space-x-4">
                <div className="p-3.5 rounded-2xl bg-[#00f2fe]/10 text-[#00f2fe]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-mono text-sm font-bold text-slate-200">极客逆向无损保留</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-light">
                    搭载 COROC 物理隔离对齐框架，能够在精准剪断侵权概念连接的同时，完整复原底座模型的原有通用表达力。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="border-b border-white/5 pb-4 mb-8">
              <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">// Custom Sandbox Simulation</span>
              <h3 className="text-2xl font-extrabold mt-1 text-white">视频演示：自定义擦除概念全链路追踪</h3>
            </div>

            <div className="glass-card p-4 rounded-[32px] border border-white/10 shadow-2xl overflow-hidden max-w-5xl mx-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="pl-2">Secure_Erase_Simulation_v2.09.sh</span>
                </div>
                <div className="text-[10px] bg-[#00f2fe]/10 text-[#00f2fe] px-2.5 py-0.5 rounded border border-[#00f2fe]/20 font-bold">
                  SIMULATION ACTIVE
                </div>
              </div>

              <div className="relative aspect-video w-full rounded-2xl bg-[#02050f] overflow-hidden flex flex-col justify-between p-6 group border border-white/5">
                <div className="font-mono text-[10px] md:text-xs text-green-400 space-y-1 select-none pointer-events-none opacity-80 z-10">
                  <p className="text-slate-500">[SYSTEM INIT] Spinning up clean node gpu-H100-cluster...</p>
                  <p>[INFO] Identifying target concepts for safety quarantine: "Artistic Brushstrokes" & "Uncensored Elements"</p>
                  <p className="text-cyan-400">[COROC-MCP] Evaluating retention loss on background structures...</p>
                  <p className="text-yellow-400">[WARNING] Over-erasing similarity overlap detected (Score: 0.81). Re-allocating...</p>
                  <p className="text-[#00f2fe]">[SUCCESS] Output weights generated successfully. Checksum validated.</p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 rounded-full border border-[#00f2fe]/20 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border border-dashed border-[#8a2be2]/30 flex items-center justify-center animate-spin">
                      <div className="w-14 h-14 rounded-full bg-[#00f2fe]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#00f2fe] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 2 22 22 22" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full glass-card border border-white/10 p-3 md:p-4 rounded-xl flex items-center justify-between space-x-4 z-20">
                  <button onClick={() => setIsPlayingVideo(!isPlayingVideo)} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 focus:outline-none">
                    {isPlayingVideo ? <svg className="w-4 h-4 text-[#00f2fe]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-4 h-4 text-[#00f2fe]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                  </button>
                  <span className="font-mono text-xs text-slate-300">{`00:0${Math.floor(videoProgress / 16)}`}</span>
                  <div className="flex-grow h-1.5 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00f2fe] to-[#8a2be2]" style={{ width: `${videoProgress}%` }} />
                  </div>
                  <span className="font-mono text-xs text-slate-300">00:06</span>
                  <span className="font-mono text-[10px] md:text-xs text-slate-300 border border-white/10 px-2 py-0.5 rounded bg-white/5 select-none hidden sm:inline">倍速 2.0x</span>
                  <button className="p-1.5 text-slate-400 hover:text-white transition-colors focus:outline-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="performance" className="relative py-28 bg-[#010309] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-[#00f2fe]/10 border border-emerald-500/20 rounded-full">
                <span className="font-mono text-xs text-emerald-400">MATH INTEGRITY METRICS</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-mono h-[70px] md:h-[120px] select-none">
                {typedText}
                <span className="animate-pulse text-[#00f2fe]">|</span>
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base font-light">
                在大模型对齐与版权保卫战中，传统的概念擦除技术通常伴随着致命的**“过度抹除（Over-erasure）”**现象。COROC 为此提出了全新的 <strong>MCP (Multi-Concept Preservation)</strong> 相似度保留评估框架，精准度量模型未擦除概念的特征恢复率。
              </p>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe]" />
                  <span className="font-mono text-xs font-bold text-slate-200">科学界主流测试指标整合 (CLIP, ASR, FID, MCP, UDA, P4D)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  在多轮、高负荷风格擦除测试下，本模型阻断了特定风格在生成网络中的重组几率，并把基础画面的清晰度、完整性和艺术广度完好无损地封存在参数网络深处。
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="glass-card p-8 rounded-3xl border border-white/10 w-full max-w-md relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-3 font-mono text-[9px] text-slate-700 select-none">SECURE PROTOCOLS VERIFIED</div>
                <div className="text-center mb-6">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Comparison Metrics Radar</span>
                  <h4 className="text-md font-bold text-slate-200 mt-1">评估指标雷达对照</h4>
                </div>
                <div className="w-full flex items-center justify-center">
                  <svg className="w-72 h-72" viewBox="0 0 300 300">
                    <polygon points="150,30 254,90 254,210 150,270 46,210 46,90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <polygon points="150,60 233,108 233,204 150,252 67,204 67,108" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
                    <polygon points="150,90 212,126 212,198 150,234 88,198 88,126" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                    <polygon points="150,120 191,144 191,192 150,216 109,192 109,144" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1="150" y1="150" x2="150" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="150" y1="150" x2="254" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="150" y1="150" x2="254" y2="210" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="150" y1="150" x2="150" y2="270" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="150" y1="150" x2="46" y2="210" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="150" y1="150" x2="46" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                    <text x="150" y="22" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">CLIP</text>
                    <text x="264" y="88" textAnchor="start" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">ASR</text>
                    <text x="264" y="215" textAnchor="start" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">FID</text>
                    <text x="150" y="288" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">MCP</text>
                    <text x="36" y="215" textAnchor="end" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">UDA</text>
                    <text x="36" y="88" textAnchor="end" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">P4D</text>

                    <polygon points="150,110 212,114 202,180 150,180 88,174 88,126" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5" />
                    <polygon points="150,45 244,102 234,198 150,258 60,198 56,102" fill="rgba(0,242,254,0.25)" stroke="#00f2fe" strokeWidth="2.5" />

                    <circle cx="150" cy="45" r="4.5" fill="#00f2fe" className="cursor-pointer" onClick={() => addToast("CLIP Score: 98.4 (Ultra-fidelity preservation)", "info")} />
                    <circle cx="244" cy="102" r="4.5" fill="#00f2fe" className="cursor-pointer" onClick={() => addToast("ASR Score: 99.98% (Complete concept defense)", "info")} />
                    <circle cx="150" cy="110" r="4" fill="#10b981" />
                    <circle cx="212" cy="114" r="4" fill="#10b981" />
                  </svg>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-6 font-mono text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-1.5 bg-[#00f2fe] rounded" />
                    <span className="text-white font-bold">COROC (本模型)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-1.5 bg-[#10b981] rounded" />
                    <span className="text-slate-400">UCE Method</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative py-28 bg-[#02050e] brush-grid border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-[#00f2fe] tracking-widest uppercase">// Subscription Options</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-2 text-white">灵活安全的对齐计划</h2>
            <p className="text-slate-400 max-w-xl mx-auto mt-4 text-sm md:text-base font-light">
              为不同阶段的创作者与开发企业设计，针对学术研究和大规模商业对齐场景提供最硬核的产品技术防线。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPlan(idx)}
                className={`cursor-pointer rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 transform select-none hover:scale-[1.02] ${
                  selectedPlan === idx
                    ? 'glass-card-glow ring-2 ring-[#00f2fe] -translate-y-2'
                    : 'glass-card hover:border-[#00f2fe]/40 hover:-translate-y-1'
                }`}
              >
                <div>
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 bg-[#00f2fe]/10 text-[#00f2fe] rounded-full text-[9px] font-mono font-bold tracking-widest uppercase mb-4 border border-[#00f2fe]/20">
                      POPULAR CHOICE
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed font-light">{plan.desc}</p>
                  <div className="flex items-baseline mb-6 border-b border-white/5 pb-6">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs font-mono text-slate-400 ml-2">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start text-xs text-slate-300 font-light">
                        <span className="text-[#00f2fe] mr-2">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setAuthType('signup'); setShowAuthModal(true); }}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    selectedPlan === idx
                      ? 'bg-[#00f2fe] text-black shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:scale-[1.02]'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="api" className="relative py-28 bg-[#010309] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono text-[#00f2fe] tracking-widest uppercase">// Developer SDK Integration</span>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">低代码热插拔 API</h3>
              <p className="text-slate-400 leading-relaxed font-light text-sm md:text-base">
                向全球学者与生成平台全天候开放 API 接入通道。通过几行简洁、健壮的代码，即可在部署的模型中热拔插特定艺术题材擦除权重。不需要耗资高昂的重新训练。
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="text-[#00f2fe] font-mono text-lg font-bold">120ms</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-1 tracking-wider">Cloud Engine Response</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="text-emerald-400 font-mono text-lg font-bold">Safetensors</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-1 tracking-wider">Weight Distribution</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="glass-card rounded-[24px] overflow-hidden border border-white/10 shadow-2xl">
                <div className="bg-slate-950/80 px-6 py-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center space-x-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs text-slate-300">DEVELOPER PLAYGROUND</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-white/5">
                    {['python', 'javascript', 'bash'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setApiLang(lang)}
                        className={`px-3 py-1 rounded-lg font-mono text-[10px] uppercase transition-all ${
                          apiLang === lang ? 'bg-[#00f2fe] text-black font-extrabold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang === 'bash' ? 'cURL' : lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative p-6 bg-slate-950/90 font-mono text-xs overflow-x-auto text-slate-300 max-h-[380px] no-scrollbar">
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 text-xs px-3 py-1.5 rounded-xl border border-white/5 transition-all flex items-center space-x-1.5 focus:outline-none"
                  >
                    <span>{isCopied ? '✓ 已复制' : '复制代码'}</span>
                  </button>
                  <pre className="whitespace-pre-wrap leading-relaxed">{apiCode[apiLang]}</pre>
                </div>
                <div className="bg-slate-900/60 px-6 py-4 flex items-center justify-between border-t border-white/5 font-mono text-xs text-slate-500">
                  <span>PROD ROUTER: api.coroc.ai/v2/secure-align</span>
                  <span className="text-emerald-400 animate-pulse">● STABLE API ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-36 bg-[#02050e] brush-grid overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8a2be2]/10 to-[#00f2fe]/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <span className="text-amber-400 text-sm">✦</span>
            <span className="font-mono text-xs text-slate-300">KEEP EXPLORING</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white leading-tight">
            探索大模型安全对齐的
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-[#5abaf1] to-[#8a2be2]">
              法理边界与艺术自由
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed text-sm md:text-base font-light">
            我们坚信，生成式AI前沿技术的爆发与人类原创版权并非宿敌。COROC 以数学和硬核算法为核，为广大人类创作者与模型开发者铸造版权保护护甲。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={() => { setAuthType('signup'); setShowAuthModal(true); }}
              className="px-8 py-4 bg-[#00f2fe] text-black font-mono font-bold rounded-2xl shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-transform hover:scale-105 focus:outline-none"
            >
              一键开启 SAFE ENGINE
            </button>
            <button 
              onClick={() => addToast("安全评估论文已归档 (Reference: COROC-v2-ArXiv)", "info")}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-2xl border border-white/10 transition-colors focus:outline-none"
            >
              获取 MCP 评估白皮书 (PDF)
            </button>
          </div>
        </div>
      </section>

      <footer className="relative bg-[#010309] border-t border-white/5 py-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg font-bold text-white tracking-wider">COROC</span>
              <span className="text-[#00f2fe] text-[10px] border border-[#00f2fe]/30 px-1 py-0.5 rounded">MCP v2</span>
            </div>
            <p className="text-slate-500 leading-relaxed font-light">
              基于全球前沿版权防御共识框架的多维概念擦除与忠实度度量评估体系。
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-mono text-sm text-white uppercase tracking-wider font-bold">快速导航</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors text-left focus:outline-none">技术特性与对比</button></li>
              <li><button onClick={() => scrollToSection('performance')} className="hover:text-white transition-colors text-left focus:outline-none">MCP 指标看板</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors text-left focus:outline-none">安全订阅方案</button></li>
              <li><button onClick={() => scrollToSection('api')} className="hover:text-white transition-colors text-left focus:outline-none">开发者 Playground</button></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-mono text-sm text-white uppercase tracking-wider font-bold">学术生态</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-500 font-light">COROC Research Lab (2026)</span></li>
              <li><span className="text-slate-500 font-light">Starry-Night Defense Initiative</span></li>
              <li><span className="text-slate-500 font-light">Copyright Alignment Standard</span></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-mono text-sm text-white uppercase tracking-wider font-bold font-sans">联系中枢</h4>
            <ul className="space-y-2.5 font-mono text-slate-300">
              <li className="flex items-center space-x-2"><span>📧</span><span>contact@coroc.ai</span></li>
              <li className="flex items-center space-x-2"><span>📍</span><span>Creative Security Lab, Area 7</span></li>
              <li className="flex items-center space-x-2"><span>🛰️</span><span>Secure Channel: VHF 433.9 MHz</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-600 font-mono">
          <span>© 2026 COROC Starry-Night Safe-Image Co. All rights reserved.</span>
          <span className="mt-4 md:mt-0">DESIGNED FOR UNRESTRICTED CREATIVE FREEDOM</span>
        </div>
      </footer>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowAuthModal(false)} />
          <div className="relative glass-card-glow w-full max-w-md p-8 rounded-[32px] border border-[#00f2fe]/20 shadow-2xl space-y-6 z-10 animate-scaleUp">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-mono transition-colors focus:outline-none">✕</button>
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-mono font-bold text-white tracking-wide">{authType === 'signup' ? 'System Access' : 'Identity Verification'}</h3>
              <p className="text-xs text-slate-400 font-light">{authType === 'signup' ? '注册并获取 COROC 模型评估及防御对齐面板。' : '提供安全密钥验证您的终端接入身份。'}</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowAuthModal(false); addToast("安全中枢身份验证成功！已分配节点服务", "success"); onLogin(); }} className="space-y-4">
              {authType === 'signup' && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">USERNAME</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-500"><User size={16}/></span>
                    <input type="text" placeholder="Operative Name" required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-[#00f2fe]/80 transition-all font-mono" />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">EMAIL ADDRESS</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-xs">✉</span>
                  <input type="email" placeholder="agent@coroc.ai" required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-[#00f2fe]/80 transition-all font-mono" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">PASSWORD / API KEY</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-xs">🔑</span>
                  <input type="password" placeholder="••••••••" required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-[#00f2fe]/80 transition-all font-mono" />
                </div>
              </div>
              {authType === 'signup' && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">VERIFICATION CODE</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-3.5 text-slate-500"><ShieldAlert size={16}/></span>
                      <input type="text" placeholder="6-digit code" required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-[#00f2fe]/80 transition-all font-mono" />
                    </div>
                    <button type="button" onClick={() => addToast("验证码已发送至您的邮箱", "info")} className="bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 px-4 rounded-xl text-xs font-bold hover:bg-[#00f2fe] hover:text-black transition-colors whitespace-nowrap">
                      发送验证码
                    </button>
                  </div>
                </div>
              )}
              {authType === 'signup' && (
                <div className="flex items-center space-x-2 pt-1">
                  <input type="checkbox" id="terms" required className="rounded accent-[#00f2fe] cursor-pointer" />
                  <label htmlFor="terms" className="text-[11px] text-slate-400 leading-none cursor-pointer">我已同意并签署 COROC 《联合防御协议》</label>
                </div>
              )}
              <button type="submit" className="w-full py-4 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/40 hover:bg-[#00f2fe] text-[#00f2fe] hover:text-black transition-all duration-300 font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 mt-4">
                <span>AUTHENTICATE</span><span>→</span>
              </button>
            </form>
            <div className="text-center pt-2">
              {authType === 'signup' ? (
                <button onClick={() => setAuthType('login')} className="text-xs text-slate-400 hover:text-white transition-colors font-mono focus:outline-none">Already registered? Sign In instead</button>
              ) : (
                <button onClick={() => setAuthType('signup')} className="text-xs text-slate-400 hover:text-white transition-colors font-mono focus:outline-none">Request new Agent access key</button>
              )}
            </div>
          </div>
        </div>
      )}

      <svg className="hidden">
        <defs>
          <radialGradient id="canvasStarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#facc15" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#05183d" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
