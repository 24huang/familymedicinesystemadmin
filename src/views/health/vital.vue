<template>
  <div class="app-container">
    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" size="small">
        <el-form-item label="成员">
          <el-select v-model="queryParams.memberId" placeholder="请选择成员" clearable filterable>
            <el-option
              v-for="member in memberList"
              :key="member.memberId"
              :label="member.name"
              :value="member.memberId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.type" placeholder="全部类型" clearable>
            <el-option label="血压" :value="1" />
            <el-option label="血糖" :value="2" />
            <el-option label="体温" :value="3" />
            <el-option label="心率" :value="4" />
            <el-option label="体重" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-s-data"></i> 体征数据列表</span>
      </div>

      <el-table v-loading="loading" :data="list" border stripe>
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="成员姓名" prop="memberName" width="120" align="center" />
        <el-table-column label="类型" prop="type" width="100" align="center">
          <template slot-scope="scope">
            <el-tag>{{ getTypeName(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数值1" prop="value1" width="120" align="center" />
        <el-table-column label="数值2" prop="value2" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.value2 || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="测量时间" prop="measureTime" width="160" align="center" />
        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              class="danger-text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="queryParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getVitalPage, deleteVital } from '@/api/vital'

export default {
  name: 'VitalList',
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      memberList: [], // 成员列表（用于下拉选择）
      queryParams: {
        current: 1,
        size: 10,
        memberId: undefined,
        type: undefined
      },
      typeMap: {
        1: '血压',
        2: '血糖',
        3: '体温',
        4: '心率',
        5: '体重'
      }
    }
  },
  created() {
    this.loadMemberList()
    this.getList()
  },
  methods: {
    /**
     * 加载成员列表（用于筛选下拉框）
     */
    loadMemberList() {
      import('@/api/member').then(({ getMemberPage }) => {
        getMemberPage({ current: 1, size: 1000 }).then(res => {
          this.memberList = res.data.records || []
        })
      })
    },
    /**
     * 获取体征数据列表
     */
    getList() {
      this.loading = true
      getVitalPage(this.queryParams).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        current: 1,
        size: 10,
        memberId: undefined,
        type: undefined
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.queryParams.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.current = val
      this.getList()
    },
    handleDelete(row) {
      this.$confirm('确认删除该条记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteVital(row.id).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    getTypeName(type) {
      return this.typeMap[type] || '未知'
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.danger-text {
  color: #f56c6c;
}
</style>
