<template>
  <div class="home-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon medicine">
              <i class="el-icon-first-aid-kit"></i>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.totalMedicines }}</div>
              <div class="stats-label">药品总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon warning">
              <i class="el-icon-warning"></i>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.expiringSoon }}</div>
              <div class="stats-label">即将过期</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon stock">
              <i class="el-icon-box"></i>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.lowStock }}</div>
              <div class="stats-label">库存不足</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon reminder">
              <i class="el-icon-alarm-clock"></i>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ stats.todayReminders }}</div>
              <div class="stats-label">今日提醒</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 主要内容区 -->
    <el-row :gutter="20" class="main-row">
      <!-- 今日用药提醒 -->
      <el-col :span="12">
        <el-card class="main-card">
          <div slot="header" class="card-header">
            <span>今日用药提醒</span>
            <el-button type="text" @click="$router.push('/medication/calendar')">
              查看全部
            </el-button>
          </div>
          
          <div v-if="todayReminders.length === 0" class="empty-state">
            <i class="el-icon-date"></i>
            <p>今日暂无用药提醒</p>
          </div>
          
          <div v-else class="reminder-list">
            <div
              v-for="reminder in todayReminders"
              :key="reminder.id"
              class="reminder-item"
              :class="{ completed: reminder.status === 2 }"
            >
              <div class="reminder-info">
                <div class="reminder-medicine">{{ reminder.medicineName }}</div>
                <div class="reminder-detail">
                  {{ reminder.familyMemberName }} · {{ reminder.time }}
                  <el-tag
                    :type="reminder.status === 2 ? 'success' : 'warning'"
                    size="mini"
                  >
                    {{ reminder.status === 2 ? '已服用' : '待服用' }}
                  </el-tag>
                </div>
              </div>
              <el-button
                v-if="reminder.status === 1"
                type="primary"
                size="mini"
                @click="confirmMedication(reminder.id)"
              >
                确认服用
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 即将过期药品 -->
      <el-col :span="12">
        <el-card class="main-card">
          <div slot="header" class="card-header">
            <span>即将过期药品</span>
            <el-button type="text" @click="$router.push('/medicine/list')">
              查看全部
            </el-button>
          </div>
          
          <div v-if="expiringMedicines.length === 0" class="empty-state">
            <i class="el-icon-check"></i>
            <p>暂无即将过期的药品</p>
          </div>
          
          <div v-else class="medicine-list">
            <div
              v-for="medicine in expiringMedicines"
              :key="medicine.id"
              class="medicine-item"
            >
              <div class="medicine-info">
                <div class="medicine-name">{{ medicine.name }}</div>
                <div class="medicine-detail">
                  剩余 {{ medicine.daysUntilExpiry }} 天过期
                  <el-tag type="danger" size="mini">
                    {{ medicine.stock }} 库存
                  </el-tag>
                </div>
              </div>
              <el-button
                type="warning"
                size="mini"
                @click="handleExpiringMedicine(medicine)"
              >
                处理
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快捷操作 -->
    <el-row class="quick-actions">
      <el-card>
        <div slot="header">
          <span>快捷操作</span>
        </div>
        
        <div class="action-buttons">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="$router.push('/medicine/scan')"
          >
            录入药品
          </el-button>
          
          <el-button
            type="success"
            icon="el-icon-alarm-clock"
            @click="$router.push('/medication/plans')"
          >
            设置用药提醒
          </el-button>
          
          <el-button
            type="info"
            icon="el-icon-user"
            @click="$router.push('/family/members')"
          >
            管理家庭成员
          </el-button>
          
          <el-button
            type="warning"
            icon="el-icon-document"
            @click="$router.push('/health')"
          >
            查看健康档案
          </el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { getExpiringSoon, getLowStock } from '@/api/medicine'
import { getTodayReminders, confirmMedication } from '@/api/medication'

export default {
  name: 'Home',
  data() {
    return {
      stats: {
        totalMedicines: 0,
        expiringSoon: 0,
        lowStock: 0,
        todayReminders: 0
      },
      todayReminders: [],
      expiringMedicines: [],
      loading: false
    }
  },
  mounted() {
    this.loadHomeData()
  },
  methods: {
    async loadHomeData() {
      this.loading = true
      try {
        // 并行加载数据
        const [expiringResponse, lowStockResponse, remindersResponse] = await Promise.all([
          getExpiringSoon(30),
          getLowStock(),
          getTodayReminders()
        ])
        
        // 更新统计数据
        this.expiringMedicines = expiringResponse.data.slice(0, 5)
        this.stats.expiringSoon = expiringResponse.data.length
        
        this.stats.lowStock = lowStockResponse.data.length
        
        this.todayReminders = remindersResponse.data
        this.stats.todayReminders = remindersResponse.data.length
        
        // 模拟总药品数（实际应该从API获取）
        this.stats.totalMedicines = 156
        
      } catch (error) {
        console.error('加载首页数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },
    
    async confirmMedication(planId) {
      try {
        await confirmMedication(planId)
        this.$message.success('已确认用药')
        // 重新加载数据
        this.loadHomeData()
      } catch (error) {
        console.error('确认用药失败:', error)
        this.$message.error('确认用药失败')
      }
    },
    
    handleExpiringMedicine(medicine) {
      this.$confirm(`药品 "${medicine.name}" 即将过期，是否进行处理？`, '过期提醒', {
        confirmButtonText: '立即处理',
        cancelButtonText: '稍后处理',
        type: 'warning'
      }).then(() => {
        // 跳转到药品详情页
        this.$router.push(`/medicine/detail/${medicine.id}`)
      }).catch(() => {
        // 用户取消
      })
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stats-card {
  height: 120px;
}

.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.stats-icon.medicine {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stats-icon.warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stats-icon.stock {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stats-icon.reminder {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.stats-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.main-row {
  margin-bottom: 20px;
}

.main-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.reminder-list,
.medicine-list {
  max-height: 320px;
  overflow-y: auto;
}

.reminder-item,
.medicine-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.reminder-item:last-child,
.medicine-item:last-child {
  border-bottom: none;
}

.reminder-item.completed {
  opacity: 0.6;
}

.reminder-info,
.medicine-info {
  flex: 1;
}

.reminder-medicine,
.medicine-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.reminder-detail,
.medicine-detail {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-actions {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  margin: 0;
}
</style>
