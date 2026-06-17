# AI 视频制作 前端 UI

这是一个基于 Next.js 的前端 UI 骨架，提供“图片轮播模式”和“HTML 视频模式”的页面与三栏创作界面（UI 层），不包含后端 AI 调用逻辑。

运行：

```powershell
cd d:\code\ai-vedio
npm install
npm run dev
```

页面：
- 首页：展示品牌与两种创作模式卡片
- 创作页：三栏布局（左：历史；中：预览 + 分镜；右：AI 对话）

文件：
- [pages/index.tsx](pages/index.tsx)
- [pages/create/[mode].tsx](pages/create/[mode].tsx)
- [components](components) 下若干 UI 组件

下一步建议：接入后端 AI 接口，完成脚本生成、分镜拆分、图像/网页动画生成与语音合成。
