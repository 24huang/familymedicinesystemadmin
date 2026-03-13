# 家庭药品管理系统前端

基于Vue2 + Element UI的家庭药品管理系统PC端管理界面。

## 功能特性

### 🏠 首页
- 统计卡片展示（药品总数、即将过期、库存不足、今日提醒）
- 今日用药计划列表（固定高度，内部滚动）
- 即将过期药品提醒
- 快捷操作入口

### 💊 药品管理
- **药品列表**：完整的药品信息管理，支持搜索、筛选、增删改查
- **扫码录入**：支持摄像头扫码和图片上传识别药品信息
- **库存管理**：实时库存监控，支持库存更新操作

### ⏰ 用药提醒
- **提醒日历**：月历视图展示用药提醒，支持添加、编辑、删除提醒
- **用药记录**：完整的用药记录查询，支持统计分析
- **提醒确认**：支持用药状态确认和补录操作

### 👥 家庭成员
- 成员信息管理
- 过敏史记录
- 用药计划分配

## 技术栈

- **前端框架**: Vue 2.6.11
- **UI组件库**: Element UI 2.15.14
- **路由管理**: Vue Router 3.6.5
- **状态管理**: Vuex 3.6.2
- **HTTP请求**: Axios 1.13.2
- **日期处理**: Moment.js
- **扫码功能**: 模拟扫码实现

## 项目结构

```
src/
├── api/                    # API接口
│   ├── auth.js            # 认证相关接口
│   ├── dashboard.js       # 首页看板
│   ├── drug.js            # 药品管理
│   ├── medication.js      # 用药计划/记录
│   ├── member.js          # 家庭成员
│   ├── category.js        # 分类管理
│   ├── notification.js    # 消息通知
│   └── request.js         # Axios封装与拦截
├── components/             # 公共组件
│   └── Layout.vue         # 主布局组件
├── views/                  # 页面组件
│   ├── Login.vue          # 登录页面
│   ├── Home.vue           # 首页
│   ├── drug/              # 药品管理
│   ├── medication/        # 用药提醒管理（计划/记录）
│   ├── member/            # 家庭成员
│   ├── category/          # 分类管理
│   ├── notification/      # 消息通知
│   └── monitor/operlog/   # 操作日志
├── router/                 # 路由配置
└── assets/                 # 静态资源
```

## 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run serve
```

### 生产环境构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 后端接口配置

开发环境默认通过 devServer 代理转发到后端 `http://localhost:8080`（见 vue.config.js）。

如需修改，请编辑 [vue.config.js](file:///d:/code-project/my-project/familymedicinesystemadmin/vue.config.js) 中的 proxy 或 `src/api/request.js` 的 baseURL。

```javascript
const service = axios.create({
  baseURL: 'http://your-backend-url/api', // 修改为实际后端地址
  timeout: 10000
})
```

## 主要功能说明

### 1. 药品管理
- 支持药品信息的增删改查
- 图片上传和说明书管理
- 库存实时监控和预警
- 批量操作和数据导出

### 2. 扫码录入
- 摄像头实时扫码识别
- 图片上传识别药品信息
- 扫码历史记录管理
- 手动补充药品信息

### 3. 用药提醒
- 日历视图展示用药计划
- 支持单次、每日、每周、每月重复提醒
- 用药状态确认和补录
- 提醒统计分析

### 4. 数据统计
- 用药记录统计
- 药品使用频率分析
- 服用率统计
- 数据可视化展示

## 开发说明

### API接口规范
所有API接口都遵循统一的响应格式：

```javascript
{
  "code": 200,        // 状态码
  "message": "成功",   // 消息
  "data": {...}       // 数据
}
```

### 错误处理
- 统一的错误拦截和处理
- 友好的错误提示信息
- Token失效自动跳转登录

### 权限控制
- JWT Token认证
- 路由权限验证
- 接口权限控制

## 部署说明

### 开发环境
```bash
npm run serve
```
访问地址：http://localhost:3000（如端口占用，Vue CLI 会自动递增）

## 视觉与交互优化
- 全局主题：浅色网格底纹 + 蓝→青主色渐变（按钮/卡片标题标记条/表格高亮）
- 布局质感：侧边栏深色渐变 + 顶栏玻璃感

### 生产环境
```bash
npm run build
```
构建完成后，将 `dist` 目录部署到Web服务器。

## 浏览器支持

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。
