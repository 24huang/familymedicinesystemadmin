<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-user"></i> 系统用户管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
      </div>
      
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="userId" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" width="100" align="center" />
        <el-table-column prop="nickname" label="昵称" width="150" align="center" />
        <el-table-column label="照片" width="100" align="center">
          <template slot-scope="scope">
            <el-image
                style="width: 50px; height: 50px; border-radius: 50%"
                :src="getImageUrl(scope.row.avatar)"
                :preview-src-list="scope.row.avatar ? [getImageUrl(scope.row.avatar)] : []"
                fit="cover"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-user-solid" style="font-size: 20px; color: #C0C4CC;"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150" align="center" />
        <el-table-column prop="email" label="email" width="150" align="center" />
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
        <el-table-column label="操作" width="150" align="center" fixed="right">
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
// 导入用户相关API接口
import { getUserList, deleteUser, updateUserStatus } from '@/api/user'
// 导入用户对话框组件（新增/编辑）
import UserDialog from './components/UserDialog'

export default {
  name: 'UserList',
  components: { UserDialog },
  filters: {
    /**
     * 角色过滤器：将角色数字转换为中文文本
     * @param {Number} roleNum - 角色编号（0-管理员，1-户主，2-家庭成员）
     * @returns {String} 角色中文名称
     */
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
      loading: false, // 表格加载状态
      tableData: [], // 用户列表数据
      total: 0, // 总记录数
      queryParams: {
        current: 1, // 当前页码
        size: 10 // 每页显示条数
      }
    }
  },
  created() {
    // 页面创建时自动加载用户列表
    this.getList()
  },
  methods: {
    /**
     * 获取用户列表数据
     * 调用API并更新表格数据和总数
     */
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
    /**
     * 处理用户状态变更（启用/禁用）
     * 显示确认对话框，确认后调用API更新状态
     * @param {Object} row - 用户行数据
     * @param {Number} status - 新状态（1-启用，0-禁用）
     */
    handleStatusChange(row, status) {
      const previous = status === 1 ? 0 : 1 // 保存之前的状态，用于回滚
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
        // 如果取消或失败，恢复原状态
        row.status = previous
      })
    },
    /**
     * 打开新增用户对话框
     */
    handleAdd() {
      this.$refs.userDialog.open('新增用户')
    },
    /**
     * 打开编辑用户对话框
     * @param {Object} row - 要编辑的用户行数据
     */
    handleUpdate(row) {
      this.$refs.userDialog.open('编辑用户', row)
    },
    /**
     * 删除用户
     * 显示确认对话框，确认后调用删除API
     * @param {Object} row - 要删除的用户行数据
     */
    handleDelete(row) {
      this.$confirm('确认删除该用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteUser(row.userId)
      }).then(() => {
        this.$message.success('删除成功')
        this.getList() // 重新加载列表
      }).catch(() => {})
    },
    /**
     * 处理每页显示条数变化
     * @param {Number} val - 新的每页显示条数
     */
    handleSizeChange(val) {
      this.queryParams.size = val
      this.getList()
    },
    /**
     * 处理页码变化
     * @param {Number} val - 新的页码
     */
    handleCurrentChange(val) {
      this.queryParams.current = val
      this.getList()
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
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.text-danger {
  color: #F56C6C;
}
</style>
