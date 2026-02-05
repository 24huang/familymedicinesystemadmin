<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-search"></i> 筛选查询</span>
      </div>
      <el-form :inline="true" :model="queryParams" size="small">
        <el-form-item label="户主ID">
          <el-input v-model="queryParams.householdId" placeholder="请输入户主ID" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="家庭成员">
          <el-select v-model="queryParams.memberId" placeholder="请选择成员" clearable filterable>
            <el-option
              v-for="item in memberList"
              :key="item.memberId"
              :label="item.name"
              :value="item.memberId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查询日期">
          <el-date-picker
            v-model="queryParams.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-notebook-2"></i> 服药记录列表</span>
      </div>
      
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="recordId" label="ID" width="80" align="center" />
        <el-table-column prop="memberName" label="成员姓名" width="120" align="center" />
        <el-table-column prop="drugName" label="药品名称" min-width="150" align="center" />
        <el-table-column label="计划时间" width="160" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.scheduledTime) }}
          </template>
        </el-table-column>
        <el-table-column label="实际时间" width="160" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.actualTime) || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="statusType(scope.row.status)">
              {{ statusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" align="center" />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="queryParams.current"
          :page-size.sync="queryParams.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getRecordPage } from '@/api/medication'
import { getMemberPage } from '@/api/member'

export default {
  name: 'MedicationRecord',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      memberList: [],
      queryParams: {
        current: 1,
        size: 10,
        householdId: undefined,
        memberId: undefined,
        date: undefined
      }
    }
  },
  created() {
    this.loadMembers()
    this.getList()
  },
  methods: {
    loadMembers() {
      getMemberPage({ current: 1, size: 100 }).then(res => {
        this.memberList = res.data.records
      })
    },
    getList() {
      this.loading = true
      getRecordPage(this.queryParams).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch(err => {
        console.error('获取服药记录失败:', err)
      }).finally(() => {
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams.householdId = undefined
      this.queryParams.memberId = undefined
      this.queryParams.date = undefined
      this.handleQuery()
    },
    handleSizeChange(val) {
      this.queryParams.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.current = val
      this.getList()
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      // 简单处理 T 格式
      return timeStr.replace('T', ' ')
    },
    statusType(status) {
      const map = {
        0: 'warning', // 待服用
        1: 'success', // 已服用
        2: 'info'     // 已跳过
      }
      return map[status] || 'info'
    },
    statusText(status) {
      const map = {
        0: '待服用',
        1: '已服用',
        2: '已跳过'
      }
      return map[status] || '未知'
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
