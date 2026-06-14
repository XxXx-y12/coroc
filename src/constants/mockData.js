export const SCENE_PROMPTS = [
  { id: 1, name: "Neon City", prompt: "Rainy cyberpunk downtown, neon lights, highly detailed" },
  { id: 2, name: "Ancient Ruins", prompt: "Overgrown temple ruins in a dense jungle, cinematic lighting" },
  { id: 3, name: "Deep Space", prompt: "Nebula cloud with distant stars, hyper-realistic, 8k resolution" },
  { id: 4, name: "Product Shot", prompt: "Minimalist cosmetic bottle on water ripples, studio lighting" },
];

export const MOCK_HISTORY = [
  { id: 101, prompt: "Remove watermarks from landscape", method: "TICoE", time: "2 mins ago", status: "Success" },
  { id: 102, prompt: "Erase specific character style", method: "ESD", time: "1 hour ago", status: "Success" },
  { id: 103, prompt: "Remove inappropriate content", method: "TICoE", time: "3 hours ago", status: "Success" },
  { id: 104, prompt: "Filter violence concepts", method: "Original", time: "1 day ago", status: "Failed" },
];

export const CHART_DATA_USAGE = [
  { name: 'Mon', users: 4000, erasures: 2400 },
  { name: 'Tue', users: 3000, erasures: 1398 },
  { name: 'Wed', users: 2000, erasures: 9800 },
  { name: 'Thu', users: 2780, erasures: 3908 },
  { name: 'Fri', users: 1890, erasures: 4800 },
  { name: 'Sat', users: 2390, erasures: 3800 },
  { name: 'Sun', users: 3490, erasures: 4300 },
];

export const CHART_DATA_PERFORMANCE = [
  { subject: 'CLIP', TICoE: 95, ESD: 80, Original: 60, fullMark: 100 },
  { subject: 'ASR', TICoE: 98, ESD: 85, Original: 10, fullMark: 100 },
  { subject: 'FID', TICoE: 92, ESD: 88, Original: 95, fullMark: 100 },
  { subject: 'MCP', TICoE: 85, ESD: 70, Original: 99, fullMark: 100 },
  { subject: 'UDA', TICoE: 90, ESD: 82, Original: 92, fullMark: 100 },
  { subject: 'P4D', TICoE: 90, ESD: 82, Original: 92, fullMark: 100 },
];