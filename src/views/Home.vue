<template>
  <div class="home-container">
    <!-- Welcome Section -->
    <div class="welcome-section animate-fade-in-up">
      <div class="welcome-text">
        <span class="workspace-kicker">FAMILY CARE / 工作台</span>
        <h2>{{timePeriod}}，管理员</h2>
        <p>从用药计划到健康档案，今天的家庭照护从这里开始。</p>
      </div>
      <img src="@/assets/logo.svg" class="welcome-img" />
    </div>

    <!-- Statistics Cards -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6" v-for="(item, index) in filteredCards" :key="index">
        <el-card shadow="hover" class="stat-card-container animate-fade-in-up" :style="{ animationDelay: (index * 0.1 + 0.2) + 's' }" :body-style="{ padding: '20px', display: 'flex', alignItems: 'center' }">
          <div class="stat-icon" :style="{ '--stat-accent': item.color }">
            <i :class="item.icon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="dashboard-content animate-fade-in-up" style="animation-delay: 0.6s">
      <!-- Left Column -->
      <el-col :span="16">
        <!-- Quick Actions -->
        <el-card class="box-card mb-20" shadow="hover">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-lightning"></i> 快捷操作</span>
          </div>
          <div class="quick-actions">
            <button type="button" class="action-item" @click="$router.push('/drug')"><span class="action-icon bg-blue"><i class="el-icon-first-aid-kit"></i></span><span>添加药品</span></button>
            <button type="button" class="action-item" @click="$router.push('/medication/plan')"><span class="action-icon bg-green"><i class="el-icon-alarm-clock"></i></span><span>设置提醒</span></button>
            <button type="button" class="action-item" @click="$router.push('/member')"><span class="action-icon bg-orange"><i class="el-icon-user"></i></span><span>成员管理</span></button>
            <button type="button" class="action-item" @click="$router.push('/category')"><span class="action-icon bg-purple"><i class="el-icon-menu"></i></span><span>分类管理</span></button>
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
          <div class="plan-scroll">
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
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入首页统计数据接口
import { getDashboardStats } from '@/api/dashboard'

export default {
  name: 'Home',
  data() {
    // 从本地存储获取用户信息，默认为空对象
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    return {
      // 统计卡片配置数组，每个卡片包含标签、数值、图标和颜色
      statCards: [
        { label: '库存药品', value: '-', icon: 'el-icon-box', color: '#409EFF' },
        { label: '家庭成员', value: '-', icon: 'el-icon-user', color: '#67C23A',roles:[1]},
        { label: '用户数量', value: '-', icon: 'el-icon-user', color: '#67C23A',roles:[0]},
        { label: '今日计划', value: '-', icon: 'el-icon-time', color: '#E6A23C' },
        { label: '缺货/过期', value: '-', icon: 'el-icon-warning', color: '#F56C6C' }
      ],
      // 当前用户角色（0-管理员，1-户主，2-成员）
      userRole: userInfo.role || 0,
      // 即将过期药品列表
      expiringDrugs: [],
      // 每日健康贴士内容
      dailyTip: '加载中...',
      // 今日用药活动时间线数据
      activities: [],
      timePeriod: "" //存储当前时间段（早上好/下午好/晚上好）
    }
  },

  mounted() {
    // 页面加载完成后，执行时段判断，显示对应问候语
    this.judgeTimePeriod()
    // 调用接口获取后台统计数据
    this.fetchData()
  },
  computed: {
    /**
     * 根据用户角色过滤显示的统计卡片
     * - 如果卡片没有配置roles属性，则对所有角色显示
     * - 如果配置了roles，则只有匹配的角色才能看到
     */
    filteredCards() {
      return this.statCards.filter(card => {
        // 没配权限 → 显示
        if (!card.roles) return true
        // 有权限 → 匹配才显示
        return card.roles.includes(this.userRole)
      })
    }
  },
  methods: {
    /**
     * 获取首页统计数据
     * 包括：库存药品数、用户数、今日计划数、过期药品数等
     */
    fetchData() {
      getDashboardStats().then(res => {
        const data = res.data || {}

        // 遍历统计卡片，根据标签更新对应的数值
        this.filteredCards.forEach(card => {
          switch (card.label) {
            case '库存药品':
              card.value = data.stockCount || 0
              break
            case '家庭成员':
              card.value = (data.userCount || 0)
              break
            case '用户数量':
              card.value = data.userCount || 0
              break
            case '今日计划':
              card.value = data.planCount || 0
              break
            case '缺货/过期':
              card.value = data.expiringCount || 0
              break
          }
        })

        // 更新即将过期药品列表，格式化显示数据
        this.expiringDrugs = (data.expiringDrugs || []).map(item => ({
            name: item.drugName,
            expireDate: item.expirationDate,
            stock: item.quantity,
            status: item.daysUntilExpiration <= 0 ? '已过期' : '即将过期'
        }))

        // 更新每日健康贴士
        this.dailyTip = data.dailyTip || '祝您健康每一天！'

        // 更新今日用药活动时间线
        this.activities = (data.activities || []).map(item => {
            let type = 'primary'
            let icon = 'el-icon-time'
            let color = '#409EFF'
            let statusText = '待服用'

            // 根据用药状态设置不同的显示样式
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

            // 格式化时间为 HH:mm 格式
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
        this.timePeriod = '早上好'
      } else if (hours >= 12 && hours < 18) {
        this.timePeriod = '下午好'
      } else {
        this.timePeriod = '晚上好'
      }
    }
  }
}
</script>

<style scoped>
.home-container { max-width:1500px; margin:0 auto; }
.welcome-section { display:flex; justify-content:space-between; align-items:center; padding:10px 0 26px; gap:20px; }
.workspace-kicker { display:block; font-size:10px; letter-spacing:2px; color:var(--primary-color); font-weight:650; margin-bottom:10px; }
.welcome-text h2 { font-size:28px; font-weight:650; letter-spacing:-.5px; color:var(--text-primary); margin:0 0 8px; }
.welcome-text p { color:var(--text-secondary); font-size:13px; margin:0; }
.welcome-img { height:48px; opacity:.8; }
.stat-card-container { margin-bottom:24px; }
.stat-icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-right:16px; background:var(--bg-secondary); color:var(--stat-accent,var(--primary-color)); font-size:22px; }
.stat-value { font-size:30px; line-height:1.25; font-weight:650; color:var(--text-primary); font-variant-numeric:tabular-nums; letter-spacing:-.8px; }
.stat-label { font-size:12px; color:var(--text-secondary); margin-top:6px; }
.mb-20 { margin-bottom:22px; }
.quick-actions { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.action-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:18px 8px; border:1px solid var(--border-light); border-radius:12px; background:var(--bg-secondary); color:var(--text-regular); cursor:pointer; font-size:12px; }
.action-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; }
.bg-blue { background:rgba(50,104,218,.09); color:var(--primary-color); }
.bg-green { background:rgba(36,132,106,.09); color:var(--success-color); }
.bg-orange { background:rgba(186,123,36,.09); color:var(--warning-color); }
.bg-purple { background:rgba(119,99,175,.09); color:#9a82c8; }
.health-tip-container { padding:25px; background:var(--active-bg); color:var(--text-primary); border-left:3px solid var(--primary-color); }
.health-tip-container h3 { font-size:15px; margin:0 0 12px; }
.health-tip-container p { font-size:13px; color:var(--text-regular); margin:0; line-height:1.9; }
.plan-scroll { max-height:360px; overflow-y:auto; padding:5px 4px 0 0; }
.clearfix:after { content:""; display:table; clear:both; }
@media(max-width:1000px){.quick-actions{grid-template-columns:repeat(2,1fr)}.stat-icon{display:none}.welcome-text h2{font-size:24px}.stat-cards{display:flex;flex-wrap:wrap}.stat-cards .el-col{width:50%}.dashboard-content>.el-col{width:100%}}

</style>
