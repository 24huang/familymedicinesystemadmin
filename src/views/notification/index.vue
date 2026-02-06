<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-bell"></i> 消息通知列表</span>
      </div>
      
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="notificationId" label="ID" width="80" align="center" />
        <el-table-column prop="title" label="标题" width="200" align="center" />
        <el-table-column prop="content" label="内容" min-width="300" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="发送时间" width="180" align="center" />
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
import { getNotificationPage } from '@/api/notification'

export default {
  name: 'NotificationList',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      queryParams: {
        current: 1,
        size: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getNotificationPage(this.queryParams).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch(err => {
        console.error('获取通知列表失败:', err)
      }).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.queryParams.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.current = val
      this.getList()
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
