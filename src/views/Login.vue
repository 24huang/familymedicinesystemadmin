<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <div class="login-info">
          <img src="@/assets/logo.svg" class="logo-img animate-fade-in-up" alt="logo" style="animation-delay: 0.1s">
          <h1 class="animate-fade-in-up" style="animation-delay: 0.2s">家庭药品管理系统</h1>
          <p class="subtitle animate-fade-in-up" style="animation-delay: 0.3s">Family Medicine Management System</p>
          <ul class="features animate-fade-in-up" style="animation-delay: 0.4s">
            <li><i class="el-icon-check"></i> 智能药品库存管理</li>
            <li><i class="el-icon-check"></i> 科学用药提醒服务</li>
            <li><i class="el-icon-check"></i> 家庭成员健康档案</li>
          </ul>
        </div>
        <div class="login-bg-decoration"></div>
      </div>
      
      <div class="login-right">
        <div class="login-form-box animate-fade-in-up" style="animation-delay: 0.5s">
          <h2>管理员登录</h2>
          <p class="login-tip">欢迎回来，请登录您的账户</p>
          
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            @submit.native.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入管理员账号"
                prefix-icon="el-icon-user"
              >
              </el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                show-password
                @keyup.enter.native="handleLogin"
              >
              </el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                class="login-button"
                @click="handleLogin"
              >
                {{ loading ? '登录中...' : '立即登录' }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adminLogin, getCurrentUser } from '@/api/auth'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入管理员账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, message: '密码长度不能少于5位', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          
          adminLogin(this.loginForm)
            .then(response => {
              const token = response.data
              localStorage.setItem('token', token)
              // 明确标识为管理员角色
              localStorage.setItem('userRole', 'ADMIN') 
              
              // 获取用户信息并存储
              return getCurrentUser().then(userRes => {
                const user = userRes.data
                localStorage.setItem('userId', user.userId)
                localStorage.setItem('username', user.username)
                localStorage.setItem('userInfo', JSON.stringify(user))
              })
            })
            .then(() => {
              this.$message.success({
                message: '登录成功',
                duration: 1500,
                onClose: () => {
                  this.$router.replace('/home')
                }
              })
            })
            .catch(error => {
              console.error('登录失败:', error)
              this.$message.error('登录失败，请检查用户名和密码')
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23409eff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.login-content {
  display: flex;
  width: 900px;
  height: 520px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #409EFF 0%, #36d1dc 100%);
  padding: 60px 40px;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.8;
}

.login-info {
  position: relative;
  z-index: 1;
}

.logo-img {
  width: 72px;
  height: 72px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
}

.login-left h1 {
  font-size: 32px;
  margin: 0 0 10px;
  font-weight: 600;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  margin: 15px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  opacity: 0.9;
}

.features li i {
  margin-right: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 4px;
  font-size: 12px;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.login-form-box {
  width: 320px;
  padding: 0 20px;
}

.login-form-box h2 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 10px;
  text-align: center;
}

.login-tip {
  color: #909399;
  font-size: 14px;
  margin-bottom: 30px;
  text-align: center;
}

.login-form .el-input__inner {
  height: 45px;
  line-height: 45px;
}

.login-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 10px;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
