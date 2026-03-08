<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <div class="login-info">
          <img src="@/assets/logo.svg" class="logo-img" alt="logo">
          <h1>家庭药品管理系统</h1>
          <p class="subtitle">Family Medicine Management System</p>
          <ul class="features">
            <li><i class="el-icon-check"></i> 智能药品库存管理</li>
            <li><i class="el-icon-check"></i> 科学用药提醒服务</li>
            <li><i class="el-icon-check"></i> 家庭成员健康档案</li>
          </ul>
        </div>
        <div class="login-bg-decoration"></div>
      </div>
      
      <div class="login-right">
        <div class="login-form-box">
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
  background-image: url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80");
  background-size: cover;
  background-position: center;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(240, 242, 245, 0.8);
  backdrop-filter: blur(5px);
  z-index: 0;
}

.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: 900px;
  height: 550px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s;
}

.login-content:hover {
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #409EFF 0%, #36d1dc 100%);
  padding: 60px 50px;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.login-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.6;
  animation: float 20s infinite linear;
}

@keyframes float {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.login-info {
  position: relative;
  z-index: 1;
}

.logo-img {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  backdrop-filter: blur(5px);
}

.login-left h1 {
  font-size: 36px;
  margin: 0 0 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
  font-weight: 300;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  margin: 18px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  opacity: 0.95;
  transition: transform 0.3s;
}

.features li:hover {
  transform: translateX(10px);
}

.features li i {
  margin-right: 12px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  padding: 5px;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;
}

.login-form-box {
  width: 360px;
  padding: 0 20px;
}

.login-form-box h2 {
  font-size: 28px;
  color: #303133;
  margin: 0 0 10px;
  text-align: center;
  font-weight: 600;
}

.login-tip {
  color: #909399;
  font-size: 14px;
  margin-bottom: 40px;
  text-align: center;
}

::v-deep .el-input__inner {
  height: 50px;
  line-height: 50px;
  border-radius: 8px;
  padding-left: 40px;
  background-color: #f8f9fa;
  border: 1px solid #e4e7ed;
}

::v-deep .el-input__inner:focus {
  background-color: #fff;
  border-color: #409EFF;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

::v-deep .el-input__prefix {
  left: 10px;
  line-height: 50px;
}

::v-deep .el-input__prefix i {
  font-size: 18px;
  line-height: 50px;
  color: #909399;
}

.login-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #409EFF 0%, #36d1dc 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.login-button:active {
  transform: translateY(0);
}
</style>
