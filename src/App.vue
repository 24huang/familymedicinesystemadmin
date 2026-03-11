<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
:root {
  --primary-color: #2d6bff;
  --success-color: #16a34a;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --info-color: #64748b;
  --text-main: #0f172a;
  --text-regular: #334155;
  --text-secondary: #64748b;
  --border-color: rgba(15, 23, 42, 0.12);
  --bg-color: #f6f8fc;
  --card-bg: #ffffff;

  --surface-0: rgba(255, 255, 255, 0.75);
  --surface-1: rgba(255, 255, 255, 0.92);
  --surface-solid: #ffffff;
  --shadow-1: 0 10px 30px rgba(15, 23, 42, 0.08);
  --shadow-2: 0 18px 60px rgba(15, 23, 42, 0.12);
  --radius-10: 10px;
  --radius-14: 14px;
  --radius-16: 16px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "HarmonyOS Sans SC", "MiSans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  background-color: var(--bg-color);
  background-image:
    radial-gradient(1200px 640px at 14% -12%, rgba(45, 107, 255, 0.14), transparent 60%),
    radial-gradient(900px 540px at 92% 8%, rgba(25, 198, 210, 0.12), transparent 55%),
    linear-gradient(rgba(15, 23, 42, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px);
  background-size: auto, auto, 28px 28px, 28px 28px;
  background-position: 0 0, 0 0, 0 0, 0 0;
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

#app {
  height: 100vh;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.35);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.55);
}

.el-card {
  background: var(--surface-solid) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-16) !important;
  box-shadow: var(--shadow-1) !important;
  transition: box-shadow 0.25s ease, border-color 0.25s ease !important;
}

.el-card:hover {
  box-shadow: var(--shadow-2) !important;
  border-color: rgba(45, 107, 255, 0.18) !important;
}

.el-card__header {
  position: relative;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.02), transparent);
  border-bottom: 1px solid var(--border-color) !important;
  padding-left: 28px !important;
}

.el-card__header::before {
  content: "";
  position: absolute;
  left: 0;
  top: 14px;
  bottom: 14px;
  width: 3px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(45, 107, 255, 0.95), rgba(25, 198, 210, 0.85));
}

.el-button {
  font-weight: 600;
  border-radius: var(--radius-10);
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.el-button--primary,
.el-button--success,
.el-button--danger,
.el-button--warning,
.el-button--info {
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.el-button--primary:hover,
.el-button--success:hover,
.el-button--danger:hover,
.el-button--warning:hover,
.el-button--info:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
}

.el-button--text {
  box-shadow: none !important;
}

.el-button--text:hover {
  transform: none !important;
}

.el-button--primary {
  background-image: linear-gradient(135deg, rgba(45, 107, 255, 1), rgba(25, 198, 210, 0.95));
  border: none !important;
}

.el-button--primary:focus,
.el-button--primary:hover {
  filter: saturate(1.08) contrast(1.02);
}

.el-table {
  border-radius: var(--radius-16);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.el-table th {
  background-color: rgba(15, 23, 42, 0.03) !important;
  color: var(--text-main);
  font-weight: 600;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(45, 107, 255, 0.055) !important;
}

.el-dialog {
  border-radius: 18px !important;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.24) !important;
  overflow: hidden;
}

.el-dialog__header {
  padding: 20px 24px !important;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__title {
  font-weight: 600;
  font-size: 18px;
}

.el-dialog__body {
  padding: 24px !important;
}

.el-dialog__footer {
  padding: 16px 24px !important;
  border-top: 1px solid var(--border-color);
  background-color: rgba(15, 23, 42, 0.015);
}

.el-input__inner,
.el-textarea__inner {
  border-radius: var(--radius-10);
  border-color: rgba(15, 23, 42, 0.12);
  background-color: rgba(255, 255, 255, 0.92);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.el-input__inner {
  height: 36px;
  line-height: 36px;
}

.el-input__inner:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(45, 107, 255, 0.18);
}

.el-textarea__inner:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(45, 107, 255, 0.18);
}

.el-form-item__label {
  color: rgba(15, 23, 42, 0.72);
  font-weight: 600;
}

.el-form--inline .el-form-item {
  margin-right: 14px;
}

.el-breadcrumb__inner,
.el-breadcrumb__inner a,
.el-breadcrumb__separator {
  color: rgba(15, 23, 42, 0.62);
}

.el-breadcrumb__inner a:hover {
  color: var(--primary-color);
}

.el-tag {
  border-radius: 999px;
  padding: 0 10px;
  border-color: rgba(15, 23, 42, 0.1);
}

.el-pagination.is-background .el-pager li:not(.disabled) {
  border-radius: 10px;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-image: linear-gradient(135deg, rgba(45, 107, 255, 1), rgba(25, 198, 210, 0.95));
}

/* 页面切换动画 - 全局生效 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 元素淡入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-col-xs-24 {
    width: 100%;
  }
}
</style>
