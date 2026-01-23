<template>
  <div class="records-container">
    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="家庭成员">
          <el-select
            v-model="searchForm.familyMemberId"
            placeholder="请选择家庭成员"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="member in familyMembers"
              :key="member.id"
              :label="member.name"
              :value="member.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="药品名称">
          <el-input
            v-model="searchForm.medicineName"
            placeholder="请输入药品名称"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          />
        </el-form-item>
        
        <el-form-item label="服用状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="已服用" value="2" />
            <el-option label="未服用" value="1" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="action-buttons">
        <el-button type="success" icon="el-icon-download" @click="handleExport">
          导出记录
        </el-button>
        <el-button type="warning" icon="el-icon-data-line" @click="showStatistics">
          统计分析
        </el-button>
      </div>
    </el-card>
    
    <!-- 记录列表 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="recordsList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="日期" width="120" sortable>
          <template slot-scope="scope">
            {{ scope.row.date }}
          </template>
        </el-table-column>
        
        <el-table-column label="时间" width="100" sortable>
          <template slot-scope="scope">
            {{ scope.row.time }}
          </template>
        </el-table-column>
        
        <el-table-column label="家庭成员" width="120">
          <template slot-scope="scope">
            <div class="member-info">
              <el-avatar :size="32" :src="scope.row.familyMemberAvatar">
                {{ scope.row.familyMemberName ? scope.row.familyMemberName.charAt(0) : 'U' }}
              </el-avatar>
              <span>{{ scope.row.familyMemberName }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="medicineName" label="药品名称" min-width="150" />
        
        <el-table-column prop="dosage" label="剂量" width="100" />
        
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 2 ? 'success' : 'warning'"
              size="mini"
            >
              {{ scope.row.status === 2 ? '已服用' : '未服用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="备注" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.remark || '无' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              type="text"
              size="small"
              style="color: #67C23A"
              @click="handleConfirm(scope.row)"
            >
              补录
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #E6A23C"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 统计分析对话框 -->
    <el-dialog
      title="用药统计分析"
      :visible.sync="statisticsVisible"
      width="800px"
    >
      <div class="statistics-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="stat-card">
              <div slot="header">
                <span>用药统计</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">总记录数：</span>
                <span class="stat-value">{{ statistics.totalRecords }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">已服用：</span>
                <span class="stat-value success">{{ statistics.takenRecords }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">未服用：</span>
                <span class="stat-value warning">{{ statistics.missedRecords }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">服用率：</span>
                <span class="stat-value">{{ statistics.takenRate }}%</span>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="stat-card">
              <div slot="header">
                <span>常用药品TOP5</span>
              </div>
              <div class="medicine-rank">
                <div
                  v-for="(medicine, index) in statistics.topMedicines"
                  :key="medicine.name"
                  class="rank-item"
                >
                  <span class="rank-number">{{ index + 1 }}</span>
                  <span class="rank-name">{{ medicine.name }}</span>
                  <span class="rank-count">{{ medicine.count }}次</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card class="stat-card">
              <div slot="header">
                <span>每日用药趋势</span>
              </div>
              <div class="trend-chart" ref="trendChart">
                <!-- 这里可以集成ECharts图表 -->
                <div class="chart-placeholder">
                  <i class="el-icon-data-line"></i>
                  <p>图表展示区域</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    
    <!-- 记录详情对话框 -->
    <el-dialog
      title="用药记录详情"
      :visible.sync="detailVisible"
      width="600px"
    >
      <div v-if="currentRecord" class="record-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="记录日期">
            {{ currentRecord.date }}
          </el-descriptions-item>
          <el-descriptions-item label="用药时间">
            {{ currentRecord.time }}
          </el-descriptions-item>
          <el-descriptions-item label="家庭成员">
            {{ currentRecord.familyMemberName }}
          </el-descriptions-item>
          <el-descriptions-item label="药品名称">
            {{ currentRecord.medicineName }}
          </el-descriptions-item>
          <el-descriptions-item label="用药剂量">
            {{ currentRecord.dosage }}
          </el-descriptions-item>
          <el-descriptions-item label="服用状态">
            <el-tag
              :type="currentRecord.status === 2 ? 'success' : 'warning'"
              size="mini"
            >
              {{ currentRecord.status === 2 ? '已服用' : '未服用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" span="2">
            {{ currentRecord.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="备注信息" span="2">
            {{ currentRecord.remark || '无' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMedicationRecords, confirmMedication } from '@/api/medication'
import { getFamilyMembers } from '@/api/family'

export default {
  name: 'Records',
  data() {
    return {
      loading: false,
      searchForm: {
        familyMemberId: '',
        medicineName: '',
        status: ''
      },
      dateRange: [],
      recordsList: [],
      selectedRecords: [],
      familyMembers: [],
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      statisticsVisible: false,
      detailVisible: false,
      currentRecord: null,
      statistics: {
        totalRecords: 0,
        takenRecords: 0,
        missedRecords: 0,
        takenRate: 0,
        topMedicines: []
      }
    }
  },
  mounted() {
    this.loadFamilyMembers()
    this.loadRecords()
  },
  methods: {
    async loadFamilyMembers() {
      try {
        const response = await getFamilyMembers()
        this.familyMembers = response.data
      } catch (error) {
        console.error('加载家庭成员失败:', error)
      }
    },
    
    async loadRecords() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          size: this.pagination.size,
          ...this.searchForm
        }
        
        if (this.dateRange && this.dateRange.length === 2) {
          params.startDate = this.dateRange[0]
          params.endDate = this.dateRange[1]
        }
        
        const response = await getMedicationRecords(params)
        this.recordsList = response.data.records || response.data
        this.pagination.total = response.data.total || this.recordsList.length
      } catch (error) {
        console.error('加载用药记录失败:', error)
        this.$message.error('加载用药记录失败')
      } finally {
        this.loading = false
      }
    },
    
    handleSearch() {
      this.pagination.page = 1
      this.loadRecords()
    },
    
    handleReset() {
      this.searchForm = {
        familyMemberId: '',
        medicineName: '',
        status: ''
      }
      this.dateRange = []
      this.handleSearch()
    },
    
    handleView(row) {
      this.currentRecord = row
      this.detailVisible = true
    },
    
    handleConfirm(row) {
      this.$confirm(`确定要补录 "${row.medicineName}" 的用药记录吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await confirmMedication(row.planId)
          this.$message.success('补录成功')
          this.loadRecords()
        } catch (error) {
          console.error('补录失败:', error)
          this.$message.error('补录失败')
        }
      })
    },
    
    handleEdit(row) {
      this.$message.info('编辑功能开发中...')
    },
    
    handleExport() {
      this.$message.info('导出功能开发中...')
    },
    
    async showStatistics() {
      // 计算统计数据
      const totalRecords = this.recordsList.length
      const takenRecords = this.recordsList.filter(r => r.status === 2).length
      const missedRecords = totalRecords - takenRecords
      const takenRate = totalRecords > 0 ? Math.round((takenRecords / totalRecords) * 100) : 0
      
      // 统计药品使用次数
      const medicineCount = {}
      this.recordsList.forEach(record => {
        const name = record.medicineName
        medicineCount[name] = (medicineCount[name] || 0) + 1
      })
      
      const topMedicines = Object.entries(medicineCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))
      
      this.statistics = {
        totalRecords,
        takenRecords,
        missedRecords,
        takenRate,
        topMedicines
      }
      
      this.statisticsVisible = true
    },
    
    handleSelectionChange(selection) {
      this.selectedRecords = selection
    },
    
    handleSizeChange(size) {
      this.pagination.size = size
      this.loadRecords()
    },
    
    handleCurrentChange(page) {
      this.pagination.page = page
      this.loadRecords()
    }
  }
}
</script>

<style scoped>
.records-container {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-info span {
  font-size: 14px;
  color: #333;
}

.statistics-content {
  max-height: 600px;
  overflow-y: auto;
}

.stat-card {
  height: 280px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.stat-value {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.stat-value.success {
  color: #67C23A;
}

.stat-value.warning {
  color: #E6A23C;
}

.medicine-rank {
  padding: 10px 0;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-number {
  width: 24px;
  height: 24px;
  background-color: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
}

.rank-name {
  flex: 1;
  color: #333;
}

.rank-count {
  color: #666;
  font-size: 14px;
}

.trend-chart {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-radius: 4px;
}

.chart-placeholder {
  text-align: center;
  color: #999;
}

.chart-placeholder i {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.record-detail {
  padding: 20px 0;
}
</style>
