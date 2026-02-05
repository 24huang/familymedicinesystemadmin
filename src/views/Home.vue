<template>
  <div class="home-container">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div class="welcome-text">
        <h2>{{timePeriod}}，管理员</h2>
        <p>祝您今天心情愉快，家庭健康！</p>
      </div>
      <img src="@/assets/logo.svg" class="welcome-img" />
    </div>

    <!-- Statistics Cards -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6" v-for="(item, index) in statCards" :key="index">
        <el-card shadow="hover" class="stat-card-container" :body-style="{ padding: '20px', display: 'flex', alignItems: 'center' }">
          <div class="stat-icon" :style="{ backgroundColor: item.color }">
            <i :class="item.icon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="dashboard-content">
      <!-- Left Column -->
      <el-col :span="16">
        <!-- Quick Actions -->
        <el-card class="box-card mb-20" shadow="hover">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-lightning"></i> 快捷操作</span>
          </div>
          <div class="quick-actions">
            <div class="action-item" @click="$router.push('/drug')">
              <div class="action-icon bg-blue"><i class="el-icon-first-aid-kit"></i></div>
              <span>添加药品</span>
            </div>
            <div class="action-item" @click="$router.push('/medication/plan')">
              <div class="action-icon bg-green"><i class="el-icon-alarm-clock"></i></div>
              <span>设置提醒</span>
            </div>
            <div class="action-item" @click="$router.push('/member')">
              <div class="action-icon bg-orange"><i class="el-icon-user"></i></div>
              <span>成员管理</span>
            </div>
            <div class="action-item" @click="$router.push('/category')">
              <div class="action-icon bg-purple"><i class="el-icon-menu"></i></div>
              <span>分类管理</span>
            </div>
          </div>
        </el-card>

        <!-- Expiring Drugs -->
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-warning-outline"></i> 近期过期药品提醒</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="$router.push('/drug')">查看全部</el-button>
          </div>
          <el-table :data="expiringDrugs" stripe style="width: 100%" size="small">
            <el-table-column prop="name" label="药品名称" width="180"></el-table-column>
            <el-table-column prop="expireDate" label="过期日期" width="180">
              <template slot-scope="scope">
                <el-tag type="danger" size="small">{{ scope.row.expireDate }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存"></el-table-column>
            <el-table-column prop="status" label="状态">
               <template>
                 <span style="color: #F56C6C">即将过期</span>
               </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Right Column -->
      <el-col :span="8">
        <!-- Health Tips / Daily Quote -->
        <el-card class="box-card mb-20 bg-gradient" shadow="hover" :body-style="{ padding: '0px' }">
          <div class="health-tip-container">
            <h3>每日健康贴士</h3>
            <p>{{ dailyTip }}</p>
          </div>
        </el-card>

        <!-- Recent Activity / Plan -->
        <el-card class="box-card" shadow="hover">
           <div slot="header" class="clearfix">
            <span><i class="el-icon-date"></i> 今日用药计划</span>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      statCards: [
        { label: '库存药品', value: '128', icon: 'el-icon-box', color: '#409EFF' },
        { label: '家庭成员', value: '4', icon: 'el-icon-user', color: '#67C23A' },
        { label: '今日计划', value: '12', icon: 'el-icon-time', color: '#E6A23C' },
        { label: '缺货/过期', value: '3', icon: 'el-icon-warning', color: '#F56C6C' }
      ],
      expiringDrugs: [
        { name: '阿莫西林胶囊', expireDate: '2023-12-01', stock: '2盒' },
        { name: '布洛芬缓释胶囊', expireDate: '2023-11-20', stock: '1瓶' },
        { name: '维生素C片', expireDate: '2023-12-15', stock: '3瓶' }
      ],
      dailyTip: '每天喝足够的水（约8杯）有助于维持身体水分平衡，促进新陈代谢。',
      activities: [
        { content: '爷爷 - 服用 降压药', timestamp: '08:00', type: 'primary', icon: 'el-icon-check', size: 'large', color: '#0bbd87' },
        { content: '奶奶 - 服用 钙片', timestamp: '08:30', type: 'success', icon: 'el-icon-check', color: '#0bbd87' },
        { content: '爸爸 - 服用 维生素', timestamp: '09:00', type: 'warning', icon: 'el-icon-more' },
        { content: '爷爷 - 服用 降压药 (晚)', timestamp: '20:00', color: '#909399' }
      ],
      timePeriod: "" //存储当前时间段
    }
  },
  mounted() {
    // 页面加载完成后，执行时段判断
    this.judgeTimePeriod()
  },
  methods: {
    // 核心方法：获取当前时间并判断时段
    judgeTimePeriod() {
      const now = new Date() // 获取当前时间对象
      const hours = now.getHours() // 提取当前小时数（0-23）

      // 按规则判断时段，赋值给响应式数据
      if (hours >= 6 && hours < 12) {
        this.timePeriod = '早上'
      } else if (hours >= 12 && hours < 18) {
        this.timePeriod = '下午'
      } else {
        this.timePeriod = '晚上'
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-section {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.welcome-text h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.welcome-text p {
  color: #909399;
}

.welcome-img {
  height: 80px;
  opacity: 0.8;
}

.stat-card-container {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card-container:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: white;
  font-size: 24px;
}

.stat-info .stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-info .stat-label {
  color: #909399;
  font-size: 14px;
}

.mb-20 {
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  transform: scale(1.05);
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-bottom: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.bg-blue { background: linear-gradient(135deg, #409EFF, #36D1DC); }
.bg-green { background: linear-gradient(135deg, #67C23A, #a8ff78); }
.bg-orange { background: linear-gradient(135deg, #E6A23C, #f6d365); }
.bg-purple { background: linear-gradient(135deg, #a18cd1, #fbc2eb); }

.health-tip-container {
  padding: 30px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.health-tip-container h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>