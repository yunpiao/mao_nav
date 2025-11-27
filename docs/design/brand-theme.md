# 品牌主题设计说明（v1）

## 目标
- 用浅色、清爽的品牌主题替换原深色主题，强调「白底+橙色主色+蓝色点缀」，类似营销落地页风格。

## 设计规范
- 颜色变量（见 `src/assets/base.css`）
  - `--brand-primary`: #ff6a00（主品牌橙）
  - `--brand-accent`: #0ea5e9（蓝色点缀）
  - 其余：`--brand-bg`、`--brand-surface`、`--brand-border`、`--brand-text`、`--brand-muted`

## 应用范围
- 页面：`src/views/NavHomeView.vue`
- 实现方式：在根容器添加 `brand-theme` 类，通过 CSS 覆盖完成主题替换，避免破坏既有样式结构。

## 交互/动效
- 卡片悬停轻微抬升和阴影增强。
- 链接与按钮在 hover 时使用主色加深。

## 性能与可维护性
- 所有颜色通过 CSS 变量集中管理，方便后续换肤与暗色主题扩展。

## 启停
- 启动：`npm run start`
- 停止：`npm run stop`


