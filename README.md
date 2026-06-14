# 使用方式
下载Node.js LTS版本
👉https://nodejs.org/zh-cn\
```bash
cd 保存路径/coroc

#初始化一个 Vite + React + TypeScript 项目
npm create vite@latest . -- --template react-ts

npm install

#安装图标库和图表库
npm install lucide-react recharts --registry=https://registry.npmmirror.com

```
我使用的是taliwindcss v4,因此安装 Tailwind CSS v4 专用的 PostCSS 插件
```bash
npm install @tailwindcss/postcss --save-dev
```
检查你的项目根目录下的 postcss.config.js 或 postcss.config.mjs 文件。请将其内容修改为如下格式
```bash
// postcss.config.mjs (或者 .js)
import tailwindcss from '@tailwindcss/postcss';

export default {
  plugins: [
    tailwindcss,
  ],
};
```
确保你的 src/index.css (或 App.css) 中使用了 Tailwind v4 的引入方式。删除旧的 @tailwind base; 等指令，改为：
```bash
@import "tailwindcss";
```

最后就可以运行环境
```bash
npm run dev
```
# 关于gemini的API
访问这个https://aistudio.google.com/app/api-keys  获取API密钥，填入/src/utils/api.js中的占位部分
