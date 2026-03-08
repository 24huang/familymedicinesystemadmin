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
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
  --text-main: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --border-color: #DCDFE6;
  --bg-color: #f0f2f5;
  --card-bg: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

#app {
  height: 100vh;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* Element UI 样式覆盖与美化 */

/* 卡片美化 */
.el-card {
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}

.el-card:hover {
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

/* 按钮美化 */
.el-button {
  font-weight: 500;
  border-radius: 4px;
}

.el-button--primary {
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
}

.el-button--success {
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
}

.el-button--danger {
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.3);
}

/* 表格美化 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table th {
  background-color: #f5f7fa !important;
  color: var(--text-main);
  font-weight: 600;
}

/* 弹窗美化 */
.el-dialog {
  border-radius: 12px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
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
  border-top: 1px solid #ebeef5;
  background-color: #fcfcfc;
}

/* 输入框美化 */
.el-input__inner {
  border-radius: 4px;
  border-color: #dcdfe6;
  transition: all 0.3s;
}

.el-input__inner:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-col-xs-24 {
    width: 100%;
  }
}
</style>
