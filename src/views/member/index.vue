<template>
  <div class="member-container">
    <el-card class="filter-container animate-fade-in-up" shadow="hover">
      <div slot="header" class="clearfix">
        <span class="filter-title"><i class="el-icon-search"></i> 筛选查询</span>
      </div>
      <el-form :inline="true" :model="queryParams" size="small">
        <el-form-item label="户主ID">
          <el-input v-model="queryParams.householdId" placeholder="请输入户主ID" clearable @keyup.enter.native="handleQuery"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container animate-fade-in-up" shadow="hover" style="animation-delay: 0.2s">
      <div slot="header" class="table-header">
        <div class="header-left">
          <span class="table-title"><i class="el-icon-s-grid"></i> 成员列表</span>
        </div>
        <div class="header-right">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加成员</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="memberList"
        border
        stripe
      >
        <el-table-column label="ID" prop="memberId" width="80" align="center"></el-table-column>
        <el-table-column label="户主ID" prop="householdId" width="100" align="center"></el-table-column>
        <el-table-column label="姓名" prop="name" width="120" align="center"></el-table-column>
        <el-table-column label="照片" width="100" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px; border-radius: 50%"
              :src="scope.row.picture"
              :preview-src-list="scope.row.picture ? [scope.row.picture] : []">
              <div slot="error" class="image-slot">
                <i class="el-icon-user-solid" style="font-size: 20px; line-height: 50px; color: #C0C4CC; background: #f5f7fa; width: 100%; height: 100%; display: block;"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.gender === 1 ? 'primary' : 'danger'" size="small">
              {{ scope.row.gender === 1 ? '男' : '女' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关系" prop="relation" width="100" align="center">
          <template slot-scope="scope">
            {{ getRelationLabel(scope.row.relation) }}
          </template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthDate" width="120" align="center"></el-table-column>
        <el-table-column label="手机号" prop="phone" width="120" align="center"></el-table-column>
        <el-table-column label="健康状况" prop="healthCondition" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="230" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-document" @click="handleArchive(scope.row)">档案</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
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
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加/修改对话框 -->
    <member-dialog
      ref="memberDialog"
      @refresh="getList"
    />
  </div>
</template>

<script>
// 导入家庭成员相关API接口
import { getMemberPage, deleteMember } from '@/api/member'
// 导入成员对话框组件（新增/编辑）
import MemberDialog from './components/MemberDialog.vue'

export default {
  name: 'MemberList',
  components: {
    MemberDialog
  },
  data() {
    return {
      loading: false, // 表格加载状态
      memberList: [], // 家庭成员列表数据
      total: 0, // 总记录数
      queryParams: {
        current: 1, // 当前页码
        size: 10, // 每页显示条数
        householdId: undefined, // 户主ID筛选条件
        name: '' // 姓名筛选条件
      }
    }
  },
  created() {
    // 页面创建时自动加载列表数据
    this.getList()
  },
  methods: {
    /**
     * 获取家庭成员列表数据
     * 根据查询参数调用API，更新列表和总数
     */
    getList() {
      this.loading = true
      getMemberPage(this.queryParams).then(res => {
        this.memberList = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 执行查询操作
     * 重置到第一页并重新加载数据
     */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /**
     * 重置查询条件
     * 清空所有筛选条件并重新查询
     */
    resetQuery() {
      this.queryParams = {
        current: 1,
        size: 10,
        householdId: undefined,
        name: ''
      }
      this.handleQuery()
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
     * 获取关系标签的中文显示
     * @param {String} relation - 关系英文标识（Self/Spouse/Child/Parent）
     * @returns {String} 中文关系标签
     */
    getRelationLabel(relation) {
      const map = {
        'Self': '本人',
        'Spouse': '配偶',
        'Child': '子女',
        'Parent': '父母'
      }
      return map[relation] || relation
    },
    /**
     * 打开添加成员对话框
     */
    handleAdd() {
      this.$refs.memberDialog.open('添加家庭成员')
    },
    /**
     * 打开编辑成员对话框
     * @param {Object} row - 要编辑的成员行数据
     */
    handleUpdate(row) {
      this.$refs.memberDialog.open('编辑家庭成员', row)
    },
    /**
     * 查看成员健康档案
     * 跳转到健康档案页面并传递成员ID
     * @param {Object} row - 成员行数据
     */
    handleArchive(row) {
      this.$router.push({
        path: '/member/archive',
        query: { memberId: row.memberId }
      })
    },
    /**
     * 删除家庭成员
     * 显示确认对话框，确认后调用删除API
     * @param {Object} row - 要删除的成员行数据
     */
    handleDelete(row) {
      this.$confirm(`确定要删除成员 "${row.name}" 吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteMember(row.memberId).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>
.member-container {
  padding: 20px;
}
.filter-container {
  margin-bottom: 20px;
}
.filter-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.danger-text {
  color: #f56c6c;
}
</style>
