<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapse }">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="logo" class="logo-img">
        <span v-if="!isCollapse" class="logo-text">家庭药品管理</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapse"
        background-color="transparent"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/home">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/drug">
          <i class="el-icon-first-aid-kit"></i>
          <span slot="title">药品管理</span>
        </el-menu-item>
        <el-menu-item index="/category">
          <i class="el-icon-menu"></i>
          <span slot="title">分类管理</span>
        </el-menu-item>
        <el-menu-item index="/member">
          <i class="el-icon-user"></i>
          <span slot="title">家庭成员</span>
        </el-menu-item>
        <el-submenu index="/health">
          <template slot="title">
            <i class="el-icon-data-line"></i>
            <span slot="title">健康数据管理</span>
          </template>
          <el-menu-item index="/health/vital-signs">体征数据监测</el-menu-item>
          <el-menu-item index="/health/allergy">过敏信息管理</el-menu-item>
        </el-submenu>
        <el-submenu index="/medication">
          <template slot="title">
            <i class="el-icon-alarm-clock"></i>
            <span slot="title">用药提醒管理</span>
          </template>
          <el-menu-item index="/medication/plan">用药计划</el-menu-item>
          <el-menu-item index="/medication/record">服药记录</el-menu-item>
        </el-submenu>
        <el-menu-item index="/notification">
          <i class="el-icon-bell"></i>
          <span slot="title">消息通知</span>
        </el-menu-item>
        <el-submenu index="/monitor" v-if="isAdmin || isHouseHolder">
          <template slot="title">
            <i class="el-icon-monitor"></i>
            <span slot="title">系统监控</span>
          </template>
          <el-menu-item index="/monitor/operlog">操作日志</el-menu-item>
        </el-submenu>
        <el-menu-item index="/user" v-if="isAdmin">
          <i class="el-icon-s-custom"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 头部 -->
      <div class="header">
        <div class="header-left">
          <el-button
            type="text"
            icon="el-icon-s-fold"
            @click="toggleSidebar"
          />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <!-- 主题切换 -->
          <theme-toggle />
          
          <!-- 用户头像和下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="getUserAvatar()">
                <i class="el-icon-user-solid"></i>
              </el-avatar>
              <span class="username">{{ userInfo.nickname || '管理员' }}</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 内容区 -->
      <div class="content">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
// 导入退出登录API
import { logout } from '@/api/auth'
// 导入主题切换组件
import ThemeToggle from '@/components/ThemeToggle.vue'

export default {
  name: 'Layout',
  components: {
    ThemeToggle
  },
  data() {
    return {
      isCollapse: false,
      userInfo: {
        nickname: '',
        avatar: ''
      },
      userRole: null
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    },
    isAdmin() {
      return this.userRole === 0
    },
    isHouseHolder() {
      return this.userRole === 1
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr)
          this.userInfo = {
            nickname: userInfo.nickname || userInfo.username || '管理员',
            avatar: userInfo.avatar
          }
          this.userRole = userInfo.role
        } catch (e) {
          console.error('解析用户信息失败', e)
        }
      }
    },
    /**
     * 获取用户头像URL
     * @returns {String} 头像URL，如果没有则返回空字符串
     */
    getUserAvatar() {
      if (!this.userInfo.avatar) {
        return ''
      }
      const avatar = this.userInfo.avatar
      
      // 如果已经是完整URL或base64，直接返回
      if (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('blob:')) {
        return avatar
      }
      
      // 后端返回的是相对路径（如 /files/xxx.jpg）
      // 需要拼接后端地址，开发环境通过代理访问81端口
      return 'http://localhost:81' + avatar
    },
    toggleSidebar() {
      this.isCollapse = !this.isCollapse
    },
    
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout()
      }
    },
    
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logout()
          .then(() => {
            this.$message.success('退出登录成功')
          })
          .catch(error => {
            console.error('退出登录请求失败:', error)
            // 即使后端请求失败，前端也要执行退出逻辑
          })
          .finally(() => {
            // 清除所有用户信息
            localStorage.removeItem('token')
            localStorage.removeItem('userRole')
            localStorage.removeItem('userId')
            localStorage.removeItem('username')
            localStorage.removeItem('userInfo')
            
            this.$router.replace('/login')
          })
      }).catch(() => {
        // 用户取消
      })
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
}

.sidebar {
  width: 240px;
  background:
    radial-gradient(900px 520px at 10% -20%, rgba(45, 107, 255, 0.35), transparent 55%),
    linear-gradient(180deg, #06162f 0%, #0b2a57 100%);
  background-size: auto, auto;
  box-shadow: 10px 0 28px rgba(2, 6, 23, 0.28);
  transition: width 0.3s;
  overflow: hidden;
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

/* 深色主题下的侧边栏 */
.dark-theme .sidebar {
  background: var(--sidebar-bg);
  box-shadow: 10px 0 28px rgba(0, 0, 0, 0.4);
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  background-color: transparent; /* 透明背景以显示 sidebar 渐变 */
  color: white;
  overflow: hidden;
  transition: all 0.3s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar.collapsed .logo {
  padding-left: 0;
  justify-content: center;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.3));
}

.sidebar.collapsed .logo-img {
  margin-right: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 1px;
}

.sidebar-menu {
  border: none;
  flex: 1;
  overflow-y: auto;
}

/* 覆盖菜单样式 */
::v-deep .el-menu {
  border-right: none;
}

::v-deep .el-menu-item, ::v-deep .el-submenu__title {
  height: 50px;
  line-height: 50px;
  margin: 6px 10px;
  border-radius: 14px;
}

::v-deep .el-menu-item.is-active {
  background-image: linear-gradient(135deg, rgba(45, 107, 255, 1), rgba(25, 198, 210, 0.9)) !important;
  color: #fff !important;
}

::v-deep .el-menu-item:hover, ::v-deep .el-submenu__title:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: transparent;
}

.header {
  height: 60px;
  background-color: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

/* 深色主题下的头部 */
.dark-theme .header {
  background-color: var(--header-bg);
  border-bottom-color: var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .el-button {
  margin-right: 20px;
  font-size: 20px;
  color: #5a5e66;
}

.header-left .el-button:hover {
  color: var(--primary-color);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: rgba(0,0,0,0.025);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 深色主题下的用户名 */
.dark-theme .username {
  color: var(--text-regular);
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 深色主题下的内容区 */
.dark-theme .content {
  background-color: var(--bg-color);
}

/* 移除重复的 fade-transform 动画，已在 App.vue 全局定义 */
</style>
