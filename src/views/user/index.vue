<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-user"></i> 系统用户管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
      </div>
      
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="userId" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" width="150" align="center" />
        <el-table-column prop="nickname" label="昵称" width="150" align="center" />
        <el-table-column prop="phone" label="手机号" width="150" align="center" />
        <el-table-column label="角色" width="150" align="center" >
          <template v-slot="scope">
            {{ scope.row.role | roleFilter }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              @change="val => handleStatusChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              class="text-danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
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

    <user-dialog ref="userDialog" @refresh="getList" />
  </div>
</template>

<script>
import { getUserList, deleteUser, updateUserStatus } from '@/api/user'
import UserDialog from './components/UserDialog'

export default {
  name: 'UserList',
  components: { UserDialog },
  filters: {
    roleFilter(roleNum) {
      // 角色映射表，便于维护和扩展
      const roleMap = {
        0: '管理员',
        1: '户主',
        2: '家庭成员'
      }
      // 兜底处理：未知角色
      return roleMap[roleNum] || '未知角色'
    }
  },
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
      getUserList(this.queryParams).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch(err => {
        console.error('获取用户列表失败:', err)
      }).finally(() => {
        this.loading = false
      })
    },
    handleStatusChange(row, status) {
      const previous = status === 1 ? 0 : 1
      const tip = status === 1 ? '确认启用该用户？' : '确认禁用该用户？'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return updateUserStatus({ userId: row.userId, status })
      }).then(() => {
        this.$message.success('状态更新成功')
      }).catch(() => {
        row.status = previous
      })
    },
    handleAdd() {
      this.$refs.userDialog.open('新增用户')
    },
    handleUpdate(row) {
      this.$refs.userDialog.open('编辑用户', row)
    },
    handleDelete(row) {
      this.$confirm('确认删除该用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteUser(row.userId)
      }).then(() => {
        this.$message.success('删除成功')
        this.getList()
      }).catch(() => {})
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
.text-danger {
  color: #F56C6C;
}
</style>
