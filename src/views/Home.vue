<template>
  <div class="home-container">
    <el-card class="welcome-card">
      <div slot="header">
        <h2>欢迎使用家庭药品管理系统</h2>
      </div>
      <div class="content">
        <p>系统基础框架已就绪。</p>
        <p>您可以在此基础上进行二次开发。</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-card {
  max-width: 800px;
  margin: 0 auto;
}

.content {
  text-align: center;
  padding: 40px 0;
  color: #606266;
}

.content p {
  margin: 10px 0;
  font-size: 16px;
}
</style>
