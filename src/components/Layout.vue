<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapse }">
      <div class="logo">
        <img src="../assets/logo.png" alt="Logo" :style="{ width: isCollapse ? '32px' : '40px', height: 'auto' }">
        <span v-if="!isCollapse">家庭药品管理</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/home">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        
        <el-submenu index="medicine">
          <template slot="title">
            <i class="el-icon-first-aid-kit"></i>
            <span>药品管理</span>
          </template>
          <el-menu-item index="/medicine/list">药品列表</el-menu-item>
          <el-menu-item index="/medicine/scan">扫码录入</el-menu-item>
          <el-menu-item index="/medicine/stock">库存管理</el-menu-item>
        </el-submenu>
        
        <el-submenu index="medication">
          <template slot="title">
            <i class="el-icon-alarm-clock"></i>
            <span>用药提醒</span>
          </template>
          <el-menu-item index="/medication/calendar">提醒日历</el-menu-item>
          <el-menu-item index="/medication/plans">用药计划</el-menu-item>
          <el-menu-item index="/medication/records">用药记录</el-menu-item>
        </el-submenu>
        
        <el-submenu index="family">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>家庭成员</span>
          </template>
          <el-menu-item index="/family/members">成员管理</el-menu-item>
        </el-submenu>
        
        <el-menu-item index="/health">
          <i class="el-icon-document"></i>
          <span slot="title">健康档案</span>
        </el-menu-item>
        
        <el-menu-item index="/statistics">
          <i class="el-icon-data-line"></i>
          <span slot="title">统计分析</span>
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
            <el-breadcrumb-item v-if="breadcrumbItems.length > 0">
              {{ breadcrumbItems[breadcrumbItems.length - 1] }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <!-- 通知 -->
          <el-badge :value="notificationCount" class="notification-badge">
            <el-button type="text" icon="el-icon-bell" @click="showNotifications" />
          </el-badge>
          
          <!-- 用户头像和下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar">
                {{ userInfo.nickname ? userInfo.nickname.charAt(0) : 'U' }}
              </el-avatar>
              <span class="username">{{ userInfo.nickname || '用户' }}</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 内容区 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, logout } from '@/api/auth'

export default {
  name: 'Layout',
  data() {
    return {
      isCollapse: false,
      userInfo: {
        nickname: '',
        avatar: ''
      },
      notificationCount: 0
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    },
    breadcrumbItems() {
      const path = this.$route.path
      const breadcrumbs = {
        '/medicine/list': '药品列表',
        '/medicine/scan': '扫码录入',
        '/medicine/stock': '库存管理',
        '/medication/calendar': '提醒日历',
        '/medication/plans': '用药计划',
        '/medication/records': '用药记录',
        '/family/members': '成员管理',
        '/health': '健康档案',
        '/statistics': '统计分析'
      }
      return breadcrumbs[path] ? [breadcrumbs[path]] : []
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse
    },
    
    async getUserInfo() {
      try {
        const response = await getCurrentUser()
        this.userInfo = response.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    
    handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/profile')
          break
        case 'settings':
          this.$router.push('/settings')
          break
        case 'logout':
          this.handleLogout()
          break
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
            localStorage.removeItem('token')
            this.$message.success('退出登录成功')
            this.$router.push('/login')
          })
          .catch(error => {
            console.error('退出登录失败:', error)
            // 即使退出失败也清除本地token
            localStorage.removeItem('token')
            this.$router.push('/login')
          })
      }).catch(() => {
        // 用户取消
      })
    },
    
    showNotifications() {
      this.$message.info('暂无新通知')
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
  width: 220px;
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.sidebar-menu {
  border: none;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .el-button {
  margin-right: 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.notification-badge {
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #333;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>
