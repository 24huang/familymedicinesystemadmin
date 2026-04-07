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

/* ==================== 登录/注册页面强制浅色模式（不受深色主题影响） ==================== */
/* 当路由为登录页面时，强制使用浅色主题 */
body:has(.login-container) {
  --bg-color: #f6f8fc !important;
  --bg-white: #ffffff !important;
  --bg-secondary: #f5f7fa !important;
  --text-primary: #0f172a !important;
  --text-regular: #334155 !important;
  --text-secondary: #64748b !important;
  --text-main: #0f172a !important;
  --card-bg: #ffffff !important;
  --border-color: rgba(15, 23, 42, 0.12) !important;
  --border-light: #e4e7ed !important;
  --border-lighter: #ebeef5 !important;
  --header-bg: #ffffff !important;
  --sidebar-bg: #ffffff !important;
}

/* 登录页面内的所有元素强制浅色 */
.login-container {
  --bg-color: #f6f8fc !important;
  --bg-white: #ffffff !important;
  --bg-secondary: #f5f7fa !important;
  --text-primary: #0f172a !important;
  --text-regular: #334155 !important;
  --text-secondary: #64748b !important;
  --text-main: #0f172a !important;
  --card-bg: #ffffff !important;
  --border-color: rgba(15, 23, 42, 0.12) !important;
  --border-light: #e4e7ed !important;
  --border-lighter: #ebeef5 !important;
}

/* 覆盖深色主题类 */
.login-container.dark-theme {
  --bg-color: #f6f8fc !important;
  --bg-white: #ffffff !important;
  --bg-secondary: #f5f7fa !important;
  --text-primary: #0f172a !important;
  --text-regular: #334155 !important;
  --text-secondary: #64748b !important;
  --text-main: #0f172a !important;
  --card-bg: #ffffff !important;
  --border-color: rgba(15, 23, 42, 0.12) !important;
  --border-light: #e4e7ed !important;
  --border-lighter: #ebeef5 !important;
}

/* 登录页面内的 Element UI 组件强制浅色 */
.login-container .el-input__inner,
.login-container .el-textarea__inner {
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;
}

.login-container .el-input__inner::placeholder,
.login-container .el-textarea__inner::placeholder {
  color: #c0c4cc !important;
}

.login-container .el-button--primary {
  background-color: #409eff !important;
  border-color: #409eff !important;
  color: #ffffff !important;
}

.login-container .el-card {
  background-color: #ffffff !important;
  border-color: #ebeef5 !important;
}

.login-container .el-form-item__label {
  color: #606266 !important;
}

/* 登录页面背景色强制白色 */
.login-container .login-content {
  background-color: #ffffff !important;
}

.login-container .login-right {
  background-color: #ffffff !important;
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

/* 深色主题下的表格表头栏 */
.dark-theme .el-table th {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-lighter);
}

.dark-theme .el-table__header-wrapper {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.dark-theme .el-table__header {
  background-color: rgba(255, 255, 255, 0.05) !important;
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

/* ==================== 深色主题适配 ==================== */

/* 深色主题下的背景调整 */
body.dark-theme {
  background-color: var(--bg-color);
}

/* 深色主题下的表格表头 - 最高优先级 */
body.dark-theme .el-table th.el-table__cell {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-lighter);
}

body.dark-theme .el-table__header-wrapper {
  background-color: var(--card-bg) !important;
}

body.dark-theme .el-table__header {
  background-color: var(--card-bg) !important;
}

body.dark-theme .el-table__header tr,
body.dark-theme .el-table__header-wrapper tr {
  background-color: var(--card-bg) !important;
}

body.dark-theme {
  background-image:
    radial-gradient(1200px 640px at 14% -12%, rgba(45, 107, 255, 0.08), transparent 60%),
    radial-gradient(900px 540px at 92% 8%, rgba(25, 198, 210, 0.06), transparent 55%),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}

/* 深色主题下的卡片样式 */
.dark-theme .el-card {
  background: var(--card-bg) !important;
  border-color: var(--border-color) !important;
}

/* 深色主题下的卡片圆角 */
.dark-theme .el-card.is-always-shadow,
.dark-theme .el-card.is-hover-shadow {
  box-shadow: var(--shadow-light) !important;
}

.dark-theme .el-card__header {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent);
  border-bottom-color: var(--border-color) !important;
}

/* 深色主题下的表格 */
.dark-theme .el-table {
  border-color: var(--border-color);
  background-color: var(--card-bg) !important;
}

/* 深色主题下的表格整体背景 */
.dark-theme .el-table::before {
  background-color: var(--card-bg);
}

/* 深色主题下的表格表头 */
.dark-theme .el-table th.el-table__cell {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-lighter);
}

/* 深色主题下的表格表头包装器 */
.dark-theme .el-table__header-wrapper {
  background-color: var(--card-bg) !important;
}

.dark-theme .el-table__header {
  background-color: var(--card-bg) !important;
}

/* 深色主题下的表格表头行 */
.dark-theme .el-table__header tr,
.dark-theme .el-table__header-wrapper tr {
  background-color: var(--card-bg) !important;
}

/* 强制覆盖表格表头的内联样式 */
.dark-theme table.el-table__header {
  background-color: var(--card-bg) !important;
}

.dark-theme table.el-table__header thead {
  background-color: var(--card-bg) !important;
}

.dark-theme table.el-table__header thead tr {
  background-color: var(--card-bg) !important;
}

.dark-theme table.el-table__header thead tr th {
  background-color: var(--card-bg) !important;
  color: var(--text-primary) !important;
}

.dark-theme .el-table td {
  border-bottom-color: rgba(255, 255, 255, 0.15) !important;
  color: var(--text-regular) !important;
  background-color: var(--card-bg) !important;
}

/* 深色主题下的表格行悬停 */
.dark-theme .el-table__body tr:hover > td {
  background-color: rgba(64, 158, 255, 0.05) !important;
}

/* 深色主题下的表格选中行 */
.dark-theme .el-table__body tr.current-row > td {
  background-color: rgba(64, 158, 255, 0.12) !important;
}

/* 深色主题下的表格边框增强 */
.dark-theme .el-table--border td,
.dark-theme .el-table--border th {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.dark-theme .el-table::after,
.dark-theme .el-table::before {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 深色主题下的表格边框竖线增强 */
.dark-theme .el-table td.el-table__cell,
.dark-theme .el-table th.el-table__cell.is-leaf {
  border-bottom-color: rgba(255, 255, 255, 0.2) !important;
  border-right-color: rgba(255, 255, 255, 0.2) !important;
}

/* 深色主题下的表格表头 */
.dark-theme .el-table__header th {
  color: var(--text-primary) !important;
}

/* 深色主题下的表格空数据 */
.dark-theme .el-table__empty-text {
  color: var(--text-secondary) !important;
}

.dark-theme .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(64, 158, 255, 0.08) !important;
}

/* 深色主题下的输入框 */
.dark-theme .el-input__inner,
.dark-theme .el-textarea__inner {
  border-color: var(--border-color);
  background-color: var(--bg-white);
  color: var(--text-primary);
}

.dark-theme .el-input__inner::placeholder,
.dark-theme .el-textarea__inner::placeholder {
  color: var(--text-placeholder);
}

/* 深色主题下的表单标签 */
.dark-theme .el-form-item__label {
  color: var(--text-regular);
}

/* 深色主题下的对话框 */
.dark-theme .el-dialog {
  background-color: var(--card-bg);
}

.dark-theme .el-dialog__header {
  border-bottom-color: var(--border-color);
}

.dark-theme .el-dialog__title {
  color: var(--text-primary);
}

.dark-theme .el-dialog__body {
  color: var(--text-regular);
}

.dark-theme .el-dialog__footer {
  border-top-color: var(--border-color);
  background-color: rgba(255, 255, 255, 0.02);
}

/* 深色主题下的下拉菜单 */
.dark-theme .el-dropdown-menu {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

.dark-theme .el-dropdown-menu__item {
  color: var(--text-regular);
}

.dark-theme .el-dropdown-menu__item:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

/* 深色主题下的面包屑 */
.dark-theme .el-breadcrumb__inner,
.dark-theme .el-breadcrumb__inner a,
.dark-theme .el-breadcrumb__separator {
  color: var(--text-secondary);
}

.dark-theme .el-breadcrumb__inner a:hover {
  color: var(--primary-color);
}

/* 深色主题下的分页 */
.dark-theme .el-pagination {
  color: var(--text-regular);
}

/* 分页按钮 */
.dark-theme .el-pagination button {
  color: var(--text-regular);
  background-color: var(--bg-white);
  border-color: var(--border-color);
}

.dark-theme .el-pagination button:hover {
  color: var(--primary-color);
}

.dark-theme .el-pagination button:disabled {
  color: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
}

/* 分页数字按钮 */
.dark-theme .el-pagination.is-background .el-pager li:not(.disabled) {
  background-color: var(--bg-white);
  color: var(--text-regular);
  border-color: var(--border-color);
}

.dark-theme .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: var(--primary-color);
  background-color: var(--hover-bg);
}

.dark-theme .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-image: linear-gradient(135deg, var(--primary-color), #19c6d2);
  color: #ffffff !important;
  border-color: transparent;
}

/* 页码输入框 */
.dark-theme .el-pagination .el-input__inner {
  background-color: var(--bg-white);
  border-color: var(--border-color);
  color: var(--text-regular);
}

.dark-theme .el-pagination .el-input__inner:focus {
  border-color: var(--primary-color);
}

/* 分页总数和跳转文字 */
.dark-theme .el-pagination__total,
.dark-theme .el-pagination__jump {
  color: var(--text-secondary);
}

/* 深色主题下的标签 */
.dark-theme .el-tag {
  border-color: var(--border-color);
}

/* 深色主题下的按钮文本 */
.dark-theme .el-button--text {
  color: var(--primary-color);
}

/* ==================== 药品详情对话框深色适配 ==================== */

/* 深色主题下的药品详情描述列表 */
body.dark-theme .el-descriptions {
  background-color: var(--card-bg) !important;
}

body.dark-theme .el-descriptions-item__label {
  background-color: var(--bg-secondary) !important;
  color: var(--text-regular) !important;
}

body.dark-theme .el-descriptions-item__content {
  color: var(--text-primary) !important;
}

body.dark-theme .el-descriptions__body td {
  border-color: var(--border-color) !important;
  background-color: var(--card-bg) !important;
}

body.dark-theme .el-descriptions__body tr {
  background-color: var(--card-bg) !important;
}

body.dark-theme .el-descriptions-item {
  background-color: var(--card-bg) !important;
}

/* 深色主题下的分割线 */
body.dark-theme .el-divider {
  border-color: var(--border-color);
}

body.dark-theme .el-divider__text {
  background-color: var(--card-bg);
  color: var(--text-primary);
}

/* 深色主题下的对话框 */
body.dark-theme .el-dialog {
  background-color: var(--card-bg);
}

body.dark-theme .el-dialog__header {
  border-bottom-color: var(--border-color);
}

body.dark-theme .el-dialog__title {
  color: var(--text-primary);
}

/* 深色主题下的侧边栏 */
.dark-theme .sidebar {
  background-color: var(--sidebar-bg);
}

/* 深色主题下的头部 */
.dark-theme .header {
  background-color: var(--header-bg);
  border-bottom-color: var(--border-color);
}

/* 深色主题下的滚动条 */
.dark-theme ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark-theme ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ==================== Element UI 组件深色适配 ==================== */

/* 深色主题下的时间线 */
.dark-theme .el-timeline-item__content {
  color: var(--text-regular) !important;
}

.dark-theme .el-timeline-item__timestamp {
  color: var(--text-secondary) !important;
}

/* 深色主题下的卡片头部 */
.dark-theme .el-card__header {
  color: var(--text-primary) !important;
}

/* 深色主题下的快捷操作文字 */
.dark-theme .quick-actions span {
  color: var(--text-regular) !important;
}

/* 深色主题下的健康贴士容器 */
.dark-theme .health-tip-container {
  color: #ffffff !important;
}

.dark-theme .health-tip-container h3 {
  color: #ffffff !important;
}

.dark-theme .health-tip-container p {
  color: #f0f0f0 !important;
}

/* ==================== 健康档案页面深色适配 ==================== */

/* 深色主题下的健康档案头部区域 */
body.dark-theme .archive-container .header-section {
  background-color: var(--card-bg) !important;
  border-color: var(--border-lighter) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

/* 深色主题下的统计网格 */
body.dark-theme .stats-grid {
  background-color: var(--bg-secondary) !important;
  border-color: var(--border-lighter) !important;
}

/* 深色主题下的时间轴卡片 */
body.dark-theme .timeline-card .el-card__body {
  background-color: var(--card-bg) !important;
}

/* 深色主题下的时间轴项目内容 */
body.dark-theme .el-timeline-item__content {
  color: var(--text-regular) !important;
}

body.dark-theme .el-timeline-item__content h4 {
  color: var(--text-primary) !important;
}

body.dark-theme .el-timeline-item__content p {
  color: var(--text-secondary) !important;
}

/* 深色主题下的时间轴节点颜色增强 */
body.dark-theme .el-timeline-item__node--primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

body.dark-theme .el-timeline-item__node--success {
  background-color: var(--success-color) !important;
  border-color: var(--success-color) !important;
}

/* 深色主题下的时间轴连接线 */
body.dark-theme .el-timeline-item__tail {
  border-left-color: var(--border-color) !important;
}

/* 深色主题下的进度条 */
body.dark-theme .el-progress-bar__outer {
  background-color: var(--bg-secondary) !important;
}

body.dark-theme .el-progress-bar__inner {
  background-image: linear-gradient(90deg, var(--primary-color), #19c6d2) !important;
}

body.dark-theme .el-progress__text {
  color: var(--text-regular) !important;
}

/* 深色主题下的图片预览 */
body.dark-theme .el-image-viewer__wrapper {
  background-color: rgba(0, 0, 0, 0.95) !important;
}

/* 深色主题下的空状态文字 */
body.dark-theme .el-empty__description {
  color: var(--text-secondary) !important;
}

/* 深色主题下的日期选择器 */
body.dark-theme .el-date-editor.el-input,
body.dark-theme .el-date-editor.el-input__inner {
  background-color: var(--bg-white) !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}

body.dark-theme .el-date-editor .el-input__icon {
  color: var(--text-secondary) !important;
}

/* ==================== el-page-header 深色适配 ==================== */

/* 深色主题下的页头标题 */
body.dark-theme .el-page-header__title {
  color: var(--text-primary) !important;
}

/* 深色主题下的页头内容 */
body.dark-theme .el-page-header__content {
  color: var(--text-primary) !important;
  font-weight: 500 !important;
  font-size: 16px !important;
}

/* 深色主题下的页头返回按钮 */
body.dark-theme .el-page-header__left {
  color: var(--primary-color) !important;
}

body.dark-theme .el-page-header__left .el-icon {
  color: var(--primary-color) !important;
}

/* 深色主题下的页头分隔线 */
body.dark-theme .el-page-header__divider {
  border-color: var(--border-color) !important;
}
</style>
