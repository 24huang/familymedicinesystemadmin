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
               <template slot-scope="scope">
                 <span :style="{ color: scope.row.status === '已过期' ? '#F56C6C' : '#E6A23C' }">{{ scope.row.status }}</span>
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
import { getDashboardStats } from '@/api/dashboard'

export default {
  name: 'Home',
  data() {
    return {
      statCards: [
        { label: '库存药品', value: '-', icon: 'el-icon-box', color: '#409EFF' },
        { label: '家庭成员', value: '-', icon: 'el-icon-user', color: '#67C23A' },
        { label: '今日计划', value: '-', icon: 'el-icon-time', color: '#E6A23C' },
        { label: '缺货/过期', value: '-', icon: 'el-icon-warning', color: '#F56C6C' }
      ],
      expiringDrugs: [],
      dailyTip: '加载中...',
      activities: [],
      timePeriod: "" //存储当前时间段
    }
  },
  mounted() {
    // 页面加载完成后，执行时段判断
    this.judgeTimePeriod()
    // 获取后台数据
    this.fetchData()
  },
  methods: {
    fetchData() {
      getDashboardStats().then(res => {
        const data = res.data || {}
        
        // Update Stat Cards
        this.statCards[0].value = data.stockCount || 0
        this.statCards[1].value = data.memberCount || 0
        this.statCards[2].value = data.planCount || 0
        this.statCards[3].value = data.expiringCount || 0

        // Update Expiring Drugs
        this.expiringDrugs = (data.expiringDrugs || []).map(item => ({
            name: item.drugName,
            expireDate: item.expirationDate,
            stock: item.quantity,
            status: item.daysUntilExpiration <= 0 ? '已过期' : '即将过期'
        }))

        // Update Daily Tip
        this.dailyTip = data.dailyTip || '祝您健康每一天！'

        // Update Activities
        this.activities = (data.activities || []).map(item => {
            let type = 'primary'
            let icon = 'el-icon-time'
            let color = '#409EFF'
            let statusText = '待服用'

            if (item.status === 1) {
                type = 'success'
                icon = 'el-icon-check'
                color = '#67C23A'
                statusText = '已服用'
            } else if (item.status === 2) {
                type = 'info'
                icon = 'el-icon-close'
                color = '#909399'
                statusText = '已跳过'
            }

            // Format time HH:mm
            const time = item.scheduledTime ? item.scheduledTime.substring(11, 16) : ''

            return {
                content: `${item.memberName} - ${item.drugName} (${statusText})`,
                timestamp: time,
                type: type,
                icon: icon,
                color: color,
                size: 'large'
            }
        })
      }).catch(err => {
        console.error("获取看板数据失败", err)
        this.dailyTip = "数据加载失败，请刷新重试"
      })
    },
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
  padding: 0;
}

.welcome-section {
  background: linear-gradient(120deg, #ffffff 0%, #f0f7ff 100%);
  padding: 30px 40px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #409EFF;
}

.welcome-text h2 {
  font-size: 26px;
  color: #303133;
  margin-bottom: 12px;
  font-weight: 600;
}

.welcome-text p {
  color: #606266;
  font-size: 16px;
}

.welcome-img {
  height: 100px;
  opacity: 1;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.stat-cards {
  margin-bottom: 24px;
}

.stat-card-container {
  cursor: pointer;
  transition: all 0.3s;
  height: 100px;
  overflow: hidden;
  position: relative;
}

.stat-card-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  color: white;
  font-size: 28px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.stat-info .stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
  font-family: 'DIN', 'Helvetica Neue', Arial, sans-serif;
}

.stat-info .stat-label {
  color: #909399;
  font-size: 14px;
}

.mb-20 {
  margin-bottom: 24px;
}

.box-card {
  height: 100%;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px;
  border-radius: 8px;
}

.action-item:hover {
  transform: scale(1.05);
  background-color: #f5f7fa;
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s;
}

.action-item:hover .action-icon {
  box-shadow: 0 6px 16px rgba(0,0,0,0.25);
}

.bg-blue { background: linear-gradient(135deg, #409EFF, #36D1DC); }
.bg-green { background: linear-gradient(135deg, #67C23A, #a8ff78); }
.bg-orange { background: linear-gradient(135deg, #E6A23C, #f6d365); }
.bg-purple { background: linear-gradient(135deg, #a18cd1, #fbc2eb); }

.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none !important;
}

.health-tip-container {
  padding: 30px;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.health-tip-container h3 {
  margin-bottom: 16px;
  font-size: 20px;
  display: flex;
  align-items: center;
}

.health-tip-container h3:before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 20px;
  background: white;
  margin-right: 10px;
  border-radius: 2px;
}

.health-tip-container p {
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.95;
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
