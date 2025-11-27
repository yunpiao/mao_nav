# 主题监控与指标

## 指标
- `nav_home_mount_ms`: 组件挂载耗时（毫秒）。用于快速观察主题改造后页面初次渲染的时延变化。

## 采集位置
- `src/views/NavHomeView.vue` 中的 `onMounted` 钩子会输出：

```
console.info('[metrics] nav_home_mount_ms', ms)
```

可接入前端埋点平台时，将该日志对接到可观测系统。


