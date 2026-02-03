# Project Context

## 1. Overview

- **摘要**：个人导航网站，支持分类管理和自定义收藏夹
- **领域**：Frontend / Static Site
- **核心价值**：
  - 简洁美观的导航界面
  - 支持可视化管理（GitHub Token）
  - 多平台部署支持

---

## 2. Tech Stack

| 层级 | 技术 |
|------|------|
| **Framework** | Vue 3.5 |
| **Build** | Vite 5.4 |
| **State** | Pinia |
| **Styling** | Tailwind CSS 4 |
| **Deploy** | EdgeOne Pages (git push 触发) |

---

## 3. Structure

```
📂 mao-nav/
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 wrangler.toml          # Cloudflare 配置（备用）
├── 📄 vercel.json            # Vercel 配置（备用）
├── 📂 src/
│   ├── 📂 apis/              # GitHub API 接口
│   ├── 📂 assets/            # 静态资源
│   ├── 📂 components/        # Vue 组件
│   ├── 📂 mock/              # 导航数据 (mock_data.js)
│   ├── 📂 router/            # 路由配置
│   ├── 📂 stores/            # Pinia 状态管理
│   ├── 📂 views/             # 页面组件
│   ├── 📄 App.vue
│   └── 📄 main.js
└── 📂 dist/                  # 构建输出
```

---

## 4. Development Guidelines

- **Idioms**：Vue 3 Composition API、ES Modules
- **Naming**：camelCase 函数、PascalCase 组件
- **Structure**：单文件组件 (SFC)

---

## 5. Setup/Run

```bash
# 本地开发
npm install
npm run dev

# 构建
npm run build

# 部署（git push 触发 EdgeOne Pages 自动构建）
git add . && git commit -m "message" && git push
```

---

## 6. Deployment

**当前部署方式**：EdgeOne Pages

- **触发方式**：`git push origin master`
- **构建命令**：`npm run build`
- **输出目录**：`dist`
- **自动部署**：推送后 EdgeOne 自动构建部署

---

## 7. AI Behavior Rules

### 7.1 Must Do

- [ ] 修改 `src/mock/mock_data.js` 后执行 `git push` 部署
- [ ] 使用 `npm run build` 验证构建成功

### 7.2 Must NOT Do

- [ ] 不要直接修改 `dist/` 目录
- [ ] 不要硬编码 GitHub Token

### 7.3 Prefer

- [ ] 优先通过 git push 部署，而非手动上传
- [ ] 优先编辑 `mock_data.js` 管理导航数据

---

## 8. Key Files

| 文件 | 说明 |
|------|------|
| `src/mock/mock_data.js` | 导航数据配置 |
| `src/views/HomeView.vue` | 首页组件 |
| `src/views/AdminView.vue` | 管理后台 |
| `src/apis/useGitHubAPI.js` | GitHub API 封装 |

---

## ⚠️ Manual Notes

- **服务域名**: 通过 EdgeOne Pages 部署
- **GitHub 仓库**: `yunpiao/mao_nav`
- **部署分支**: `master`

_(开发者可在此处手动添加 AI 无法通过代码分析得出的业务背景)_
