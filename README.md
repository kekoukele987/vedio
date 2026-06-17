# AI 视频制作 - 前端 UI

一个基于 Next.js 的 AI 视频制作工具前端界面，提供直观的视频创作体验。支持”图片轮播”和”HTML 视频”两种创作模式，采用三栏布局设计，集成 AI 对话功能。

## 功能特性

- **两种创作模式**
  - 图片轮播模式：上传图片序列生成视频
  - HTML 视频模式：编辑 HTML/CSS 生成动画视频

- **三栏创作界面**
  - 左栏：创作历史记录管理
  - 中栏：实时视频预览 + 分镜编辑
  - 右栏：AI 对话助手（用于脚本生成、问题解答等）

- **现代化界面**
  - 响应式设计
  - TypeScript 类型安全
  - 组件化架构

## 快速开始

### 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

### 开发模式运行

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

```bash
npm run build
npm start
```

## 项目结构

```
├── pages/              # Next.js 页面
│   ├── index.tsx       # 首页（模式选择）
│   └── create/[mode].tsx  # 创作页面
├── components/         # React 组件库
├── styles/            # 样式文件
├── lib/               # 工具函数和类型定义
├── data/              # 数据文件
└── public/            # 静态资源
```

## 技术栈

- **框架**: Next.js 13
- **UI 库**: React 18
- **语言**: TypeScript
- **数据库**: sql.js（浏览器端 SQLite）
- **样式**: CSS

## 开发路线图

- [ ] 接入后端 AI 接口
- [ ] 脚本自动生成
- [ ] 分镜智能拆分
- [ ] 图像合成与动画生成
- [ ] 语音合成集成
- [ ] 视频导出功能
- [ ] 用户账号系统
- [ ] 作品云同步

## 许可证

MIT
