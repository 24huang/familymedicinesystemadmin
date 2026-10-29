<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapse }">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="logo" class="logo-img">
        <span v-if="!isCollapse" class="logo-text">伐木累药<small>家庭照护工作台</small></span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapse"
        background-color="transparent"
        text-color="var(--text-secondary)"
        active-text-color="var(--primary-color)"
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
            :aria-label="isCollapse ? '展开导航' : '收起导航'"
            @click="toggleSidebar"
          />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">工作台</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.path !== '/home'">{{ currentPageTitle }}</el-breadcrumb-item>
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
import { clearAuthState } from '@/utils/session'
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
    currentPageTitle() {
      return this.$route.meta.title || '页面详情'
    },
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
      return (process.env.VUE_APP_FILE_BASE || '').replace(/\/$/, '') + avatar
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
            clearAuthState()
            
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
.layout-container { height:100vh; display:flex; overflow:hidden; }
.sidebar { width:232px; flex-shrink:0; display:flex; flex-direction:column; background:var(--sidebar-bg); border-right:1px solid var(--border-color); transition:width var(--motion-base) var(--motion-ease); overflow:hidden; z-index:1001; }
.sidebar.collapsed { width:72px; }
.logo { min-height:94px; display:flex; align-items:center; padding:22px; gap:12px; }
.logo-img { width:34px; height:34px; flex-shrink:0; }
.logo-text { font-size:18px; font-weight:750; letter-spacing:.5px; color:var(--text-primary); white-space:nowrap; }
.logo-text small { display:block; font-size:10px; letter-spacing:1px; font-weight:400; color:var(--text-secondary); margin-top:3px; }
.sidebar.collapsed .logo { justify-content:center; padding:22px 0; }
.sidebar-menu { flex:1; overflow-y:auto; border:0; padding:0 10px 22px; }
::v-deep .el-menu { border:0; background:transparent; }
::v-deep .el-menu-item,::v-deep .el-submenu__title { height:46px; line-height:46px; margin:4px 0; border-radius:8px; font-size:13px; }
::v-deep .el-menu-item i,::v-deep .el-submenu__title i { color:var(--text-secondary); font-size:18px; }
::v-deep .el-menu-item.is-active { color:var(--primary-color)!important; background:var(--active-bg)!important; font-weight:650; }
::v-deep .el-menu-item.is-active i { color:var(--primary-color); }
::v-deep .el-menu-item:hover,::v-deep .el-submenu__title:hover { background:var(--hover-bg)!important; }
::v-deep .el-submenu .el-menu-item { min-width:0; height:40px; line-height:40px; font-size:12px; }
.main-container { flex:1; min-width:0; display:flex; flex-direction:column; }
.header { height:70px; min-height:70px; background:var(--header-bg); border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; padding:0 30px; }
.header-left,.header-right { display:flex; align-items:center; gap:16px; min-width:0; }
.header-left .el-button { font-size:18px; color:var(--text-secondary); }
::v-deep .el-breadcrumb { font-size:12px; }
::v-deep .el-breadcrumb__inner,::v-deep .el-breadcrumb__inner a { color:var(--text-secondary); font-weight:400; }
::v-deep .el-breadcrumb__item:last-child .el-breadcrumb__inner { color:var(--text-primary); font-weight:550; }
.user-info { display:flex; align-items:center; gap:9px; color:var(--text-regular); cursor:pointer; font-size:12px; padding:5px 8px; border-radius:8px; }
.user-info:hover { background:var(--hover-bg); }
.username { max-width:140px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.content { flex:1; min-height:0; padding:30px; overflow:auto; background:var(--bg-color); }
@media(max-width:1100px){.sidebar{width:205px}.content{padding:20px}.header{padding:0 20px}.logo{padding:20px 17px}}
@media(max-width:760px){.sidebar:not(.collapsed){width:185px}.content{padding:14px}.header{padding:0 12px}.header-left,.header-right{gap:8px}.username{display:none}}

</style>
