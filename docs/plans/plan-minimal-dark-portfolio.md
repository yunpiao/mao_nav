# Portfolio 页面 Minimal Dark 风格重构计划

## 概述

将当前 Portfolio 页面从"DevOps 暗色风格"重构为 **Minimal Dark** 设计系统，解决以下问题：
1. 没有图像元素
2. 一个栏目占满屏太宽
3. 缺乏设计感

## 设计规范摘要

### 色彩系统
| Token | 值 | 用途 |
|-------|------|------|
| background | `#0A0A0F` | 页面背景（深邃温暖的深灰） |
| backgroundAlt | `#12121A` | 次级背景 |
| foreground | `#FAFAFA` | 主文字（近白色） |
| muted | `#1A1A24` | 卡片背景 |
| mutedForeground | `#71717A` | 次要文字 |
| accent | `#F59E0B` | 点缀色（琥珀色） |
| border | `rgba(255,255,255,0.08)` | 边框（极淡） |
| card | `rgba(26,26,36,0.6)` | 卡片背景（半透明） |

### 字体
- Display: `Space Grotesk` - 几何感标题
- Body: `Inter` - 正文
- Mono: `JetBrains Mono` - 代码/标签

### 关键特征
1. **Bento Grid 布局** - 大小不一的网格，限制最大宽度 `max-w-6xl`
2. **玻璃卡片** - 半透明 + backdrop-blur
3. **琥珀色发光** - hover 时微发光效果
4. **充足留白** - `py-24 md:py-32` 大间距

---

## 任务清单

### Task 1: 重写 CSS 设计系统
**文件**: `src/assets/main.css`

**修改内容**:
1. 更新 CSS 变量为 Minimal Dark 配色
2. 添加玻璃卡片样式 `.glass-card`
3. 添加琥珀色发光效果
4. 实现 Bento Grid 布局类
5. 添加 ambient orb 背景装饰

**代码示例**:
```css
:root {
  --background: #0A0A0F;
  --background-alt: #12121A;
  --foreground: #FAFAFA;
  --muted: #1A1A24;
  --muted-foreground: #71717A;
  --accent: #F59E0B;
  --border: rgba(255,255,255,0.08);
  --card: rgba(26,26,36,0.6);
}

.glass-card {
  background: var(--card);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 300ms ease-out;
}

.glass-card:hover {
  border-color: rgba(255,255,255,0.15);
  transform: scale(1.02);
  box-shadow: 0 0 30px rgba(245,158,11,0.1);
}
```

**验证**: `npm run build` 通过

---

### Task 2: 实现 Bento Grid 布局
**文件**: `src/views/PortfolioView.vue`

**修改内容**:
1. 限制内容最大宽度 `max-w-6xl mx-auto`
2. 精选项目使用 CSS Grid，核心项目占 `col-span-2`
3. 添加图像元素（项目截图占位或渐变装饰）

**布局示例**:
```
+------------------+----------+
|   Dify AI (2x1)  |  Grafana |
+------------------+----------+
| Any2Text | Kuma  | Tools    |
+----------+-------+----------+
```

**代码示例**:
```html
<div class="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
  <div class="col-span-2"><!-- Dify AI 大卡片 --></div>
  <div><!-- Grafana --></div>
  <div><!-- Any2Text --></div>
  <div><!-- Kuma --></div>
  <div><!-- Tools --></div>
</div>
```

**验证**: 页面布局不再全宽，有明显的网格层次

---

### Task 3: 添加视觉图像元素
**文件**: `src/views/PortfolioView.vue`

**修改内容**:
1. 核心项目卡片添加渐变装饰背景
2. 添加项目示意图（可用 SVG 占位或渐变图案）
3. 头部添加头像或装饰图形

**代码示例**:
```html
<!-- 卡片顶部装饰 -->
<div class="h-32 rounded-t-xl bg-gradient-to-br from-amber-500/20 to-transparent"></div>
```

**验证**: 页面有明显的视觉图像元素

---

### Task 4: 实现玻璃卡片效果
**文件**: `src/assets/main.css`, `src/views/PortfolioView.vue`

**修改内容**:
1. 卡片使用半透明背景 + backdrop-blur
2. 边框极淡 (8% opacity)
3. hover 时边框变亮 + 微发光

**验证**: 卡片有层次感，不再是实心色块

---

### Task 5: 添加 Ambient Orb 背景
**文件**: `src/views/PortfolioView.vue`

**修改内容**:
1. 添加大型模糊琥珀色装饰球
2. 位置：页面顶部中心、右下角
3. 非常低的透明度 (2-4%)

**代码示例**:
```html
<div class="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
            bg-amber-500/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
```

**验证**: 页面有"氛围光"效果

---

### Task 6: 优化字体和文字层级
**文件**: `src/assets/main.css`, `src/views/PortfolioView.vue`

**修改内容**:
1. 引入 Google Fonts: Space Grotesk, Inter
2. 标题使用 Space Grotesk, tracking-tight
3. 统计数值使用 JetBrains Mono
4. 次要文字使用 `#71717A`

**验证**: 文字层次分明，标题和正文有明显区分

---

### Task 7: 优化标签和小元素
**文件**: `src/views/PortfolioView.vue`

**修改内容**:
1. 标签使用极淡背景 + 细边框
2. 移除高饱和度颜色
3. 统一使用琥珀色作为点缀

**代码示例**:
```html
<span class="px-2 py-1 text-xs text-zinc-400 border border-white/10 rounded-md">AI</span>
```

**验证**: 标签不再抢眼，与整体风格协调

---

### Task 8: 响应式适配
**文件**: `src/views/PortfolioView.vue`, `src/assets/main.css`

**修改内容**:
1. 移动端网格变为单列
2. 缩小 ambient orb 尺寸
3. 调整间距

**验证**: 在 375px 宽度下布局正常

---

### Task 9: 最终验证
**命令**:
```bash
npm run lint
npm run build
```

**Playwright 截图验证**:
- 桌面版 (1280px)
- 移动端 (375px)
- 检查所有设计规范是否落实

---

## 预期效果

完成后页面应该：
- 有 Linear/Raycast 的高级感
- Bento Grid 布局，大小不一的卡片
- 玻璃效果卡片，微发光边框
- 琥珀色作为唯一点缀色
- 充足的留白和呼吸空间
- 有图像/装饰元素增加视觉丰富度

## 工作量估计

| 任务 | 优先级 | 工作量 |
|------|--------|--------|
| Task 1 CSS 系统 | P0 | 中 |
| Task 2 Bento Grid | P0 | 中 |
| Task 3 图像元素 | P1 | 低 |
| Task 4 玻璃卡片 | P1 | 低 |
| Task 5 Ambient Orb | P2 | 低 |
| Task 6 字体层级 | P1 | 低 |
| Task 7 标签优化 | P2 | 低 |
| Task 8 响应式 | P1 | 中 |
| Task 9 验证 | P0 | 低 |
