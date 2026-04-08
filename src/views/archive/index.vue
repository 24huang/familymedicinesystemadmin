<template>
  <div class="archive-container">
    <div class="header-section">
      <el-page-header @back="goBack" content="健康档案详情" title="返回列表"></el-page-header>
      <el-button type="primary" icon="el-icon-download" size="small" @click="handleExport">导出PDF档案</el-button>
    </div>

    <!-- 档案概览 -->
    <el-card class="overview-card" v-loading="loading">
      <div slot="header" class="clearfix">
        <span>档案概览</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="avatar-container">
            <div class="avatar-wrapper">
              <el-avatar :size="100" :src="getAvatarUrl(overview.memberInfo.avatarUrl)">
                <i class="el-icon-user-solid"></i>
              </el-avatar>
            </div>
          </div>
          <div class="info-item">
            <div class="label">姓名</div>
            <div class="value">{{ overview.memberInfo.name }}</div>
          </div>
          <div class="info-item">
            <div class="label">年龄</div>
            <div class="value">{{ overview.memberInfo.age }}岁</div>
          </div>
          <div class="info-item">
            <div class="label">性别</div>
            <div class="value">{{ overview.memberInfo.gender }}</div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="info-item">
            <div class="label">健康状况</div>
            <div class="value health-condition">{{ overview.memberInfo.healthCondition || '无' }}</div>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-num">{{ overview.stats.totalPlans }}</div>
              <div class="stat-label">累计计划</div>
            </div>
            <div class="stat-item">
              <div class="stat-num highlight">{{ overview.stats.activePlans }}</div>
              <div class="stat-label">进行中</div>
            </div>
            <div class="stat-item">
              <div class="stat-num">{{ overview.stats.adherenceRate }}</div>
              <div class="stat-label">依从性</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-title">高频用药</div>
          <div v-for="(item, index) in overview.frequentDrugs" :key="index" class="drug-item">
            <span class="drug-name">{{ item.drugName }}</span>
            <el-progress :percentage="Math.min(item.count * 10, 100)" :format="() => item.count + '次'"></el-progress>
          </div>
          <div v-if="overview.frequentDrugs.length === 0" class="empty-text">暂无用药记录</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用药时间轴 -->
    <el-card class="timeline-card" v-loading="timelineLoading">
      <div slot="header" class="clearfix">
        <span>用药时间轴</span>
        <el-date-picker
          v-model="year"
          type="year"
          placeholder="选择年份"
          size="small"
          style="float: right; width: 120px;"
          value-format="yyyy"
          @change="fetchTimeline"
        >
        </el-date-picker>
      </div>
      
      <el-timeline v-if="timelineList.length > 0">
        <el-timeline-item
          v-for="(activity, index) in timelineList"
          :key="index"
          :timestamp="activity.date"
          :type="activity.type === 'PLAN_START' ? 'primary' : 'success'"
          placement="top"
        >
          <el-card shadow="hover">
            <h4>{{ activity.title }}</h4>
            <p>{{ activity.description }}</p>
            <div v-if="activity.images && activity.images.length > 0" class="image-list">
              <el-image 
                v-for="(img, imgIndex) in activity.images" 
                :key="imgIndex"
                :src="getImageUrl(img)" 
                :preview-src-list="activity.images.map(i => getImageUrl(i))"
                class="timeline-image">
              </el-image>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暂无时间轴数据"></el-empty>
    </el-card>
  </div>
</template>

<script>
import { getArchiveOverview, getTimeline, exportArchivePdf } from '@/api/archive'

export default {
  name: 'ArchiveDetail',
  data() {
    return {
      memberId: null,
      loading: false,
      timelineLoading: false,
      year: new Date().getFullYear() + '',
      overview: {
        memberInfo: {
          name: '',
          age: 0,
          gender: '',
          healthCondition: '',
          avatarUrl: ''
        },
        stats: {
          totalPlans: 0,
          activePlans: 0,
          adherenceRate: '0%',
          totalPrescriptions: 0
        },
        frequentDrugs: []
      },
      timelineList: []
    }
  },
  created() {
    this.memberId = this.$route.query.memberId
    if (this.memberId) {
      this.initData()
    } else {
      this.$message.error('参数缺失：缺少家庭成员ID')
      this.goBack()
    }
  },
  methods: {
    initData() {
      this.fetchOverview()
      this.fetchTimeline()
    },
    fetchOverview() {
      this.loading = true
      getArchiveOverview(this.memberId).then(res => {
        if (res.data) {
          this.overview = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    fetchTimeline() {
      this.timelineLoading = true
      getTimeline(this.memberId, this.year).then(res => {
        this.timelineList = res.data || []
      }).finally(() => {
        this.timelineLoading = false
      })
    },
    handleExport() {
      const loading = this.$loading({
        lock: true,
        text: '正在生成PDF...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      exportArchivePdf(this.memberId).then(blob => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `健康档案_${this.overview.memberInfo.name}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        this.$message.success('导出成功')
      }).catch(() => {
        this.$message.error('导出失败')
      }).finally(() => {
        loading.close()
      })
    },
    goBack() {
      this.$router.push('/member')
    },
    /**
     * 获取头像完整URL
     * @param {String} url - 头像路径
     * @returns {String} 完整URL
     */
    getAvatarUrl(url) {
      if (!url) {
        // 默认头像
        return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      }
      // 如果已经是完整URL或base64，直接返回
      if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url
      }
      // 后端返回的是相对路径（如 /files/xxx.jpg）
      // 需要拼接后端地址，开发环境通过代理访问81端口
      return 'http://localhost:81' + url
    },
    /**
     * 获取图片完整URL
     * @param {String} url - 图片路径
     * @returns {String} 完整URL
     */
    getImageUrl(url) {
      if (!url) return ''
      // 如果已经是完整URL或base64，直接返回
      if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url
      }
      // 后端返回的是相对路径（如 /files/xxx.jpg）
      // 需要拼接后端地址，开发环境通过代理访问81端口
      return 'http://localhost:81' + url
    }
  }
}
</script>

<style scoped>
.archive-container {
  padding: 20px;
}
.avatar-container {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-wrapper {
  display: inline-block;
  width: 100px;
  height: 100px;
}

.avatar-wrapper /deep/ .el-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 50px;
}

.avatar-wrapper /deep/ .el-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--card-bg), var(--bg-secondary));
  padding: 18px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-lighter);
  transition: all 0.3s ease;
}

.header-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}
.overview-card {
  margin-bottom: 20px;
}
.info-item {
  margin-bottom: 15px;
}
.info-item .label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}
.info-item .value {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}
.health-condition {
  color: #E6A23C;
  line-height: 1.6;
  font-weight: 500;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.08), rgba(230, 162, 60, 0.04));
  border-radius: 6px;
  border-left: 3px solid rgba(230, 162, 60, 0.5);
}
.stats-grid {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  background: linear-gradient(135deg, var(--bg-secondary), var(--card-bg));
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--border-lighter);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.stat-item {
  text-align: center;
}
.stat-num {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  text-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-num:hover {
  transform: scale(1.05);
}
.stat-num.highlight {
  color: #67C23A;
  text-shadow: 0 2px 8px rgba(103, 194, 58, 0.2);
}
.stat-label {
  margin-top: 5px;
  font-size: 12px;
  color: var(--text-secondary);
}
.chart-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--text-regular);
}
.drug-item {
  margin-bottom: 10px;
}
.drug-name {
  font-size: 13px;
  margin-bottom: 5px;
  display: block;
}
.timeline-card {
  min-height: 400px;
}

.timeline-card .el-card__header {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.06), rgba(25, 198, 210, 0.04));
  border-bottom: 1px solid var(--border-lighter);
}
.image-list {
  margin-top: 10px;
}

.image-list .el-image {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.image-list .el-image:hover {
  transform: scale(1.05);
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
.timeline-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  border-radius: 4px;
}
.empty-text {
  color: var(--text-secondary);
  font-size: 13px;
  text-align: center;
  padding: 20px 0;
}

/* 深色主题特定优化 */
.dark-theme .header-section {
  background: linear-gradient(135deg, rgba(45, 45, 45, 0.8), rgba(31, 31, 31, 0.6));
  border-color: rgba(255, 255, 255, 0.08);
}

.dark-theme .stats-grid {
  background: linear-gradient(135deg, rgba(31, 31, 31, 0.6), rgba(45, 45, 45, 0.4));
  border-color: rgba(255, 255, 255, 0.06);
}

.dark-theme .health-condition {
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.12), rgba(230, 162, 60, 0.06));
  border-left-color: rgba(230, 162, 60, 0.6);
}

.dark-theme .stat-num {
  text-shadow: 0 2px 12px rgba(64, 158, 255, 0.4);
}

.dark-theme .stat-num.highlight {
  text-shadow: 0 2px 12px rgba(103, 194, 58, 0.4);
}

.dark-theme .timeline-card .el-card__header {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(25, 198, 210, 0.06));
  border-bottom-color: rgba(255, 255, 255, 0.08);
}
</style>
