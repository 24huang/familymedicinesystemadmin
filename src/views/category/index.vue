<template>
  <div class="category-container">
    <el-card class="table-container">
      <div slot="header" class="table-header">
        <div class="left-tools">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增分类</el-button>
        </div>
        <div class="right-tools">
          <el-button icon="el-icon-refresh" size="small" circle @click="getList"></el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="categoryList"
        border
        stripe
      >
        <el-table-column label="ID" prop="categoryId" width="80" align="center"></el-table-column>
        <el-table-column label="分类名称" prop="name" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="描述" prop="description" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="danger-text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="queryParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增/修改对话框 -->
    <category-dialog
      ref="categoryDialog"
      @refresh="getList"
    />
  </div>
</template>

<script>
// 导入药品分类相关API接口
import { getCategoryPage, deleteCategory } from '@/api/category'
// 导入分类对话框组件（新增/编辑）
import CategoryDialog from './components/CategoryDialog.vue'

export default {
  name: 'CategoryList',
  components: {
    CategoryDialog
  },
  data() {
    return {
      loading: false, // 表格加载状态
      categoryList: [], // 药品分类列表数据
      total: 0, // 总记录数
      queryParams: {
        page: 1, // 当前页码
        size: 10 // 每页显示条数
      }
    }
  },
  created() {
    // 页面创建时自动加载分类列表
    this.getList()
  },
  methods: {
    /**
     * 获取药品分类列表数据
     * 调用API并更新表格数据和总数
     */
    getList() {
      this.loading = true
      getCategoryPage(this.queryParams).then(res => {
        this.categoryList = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
      this.queryParams.page = val
      this.getList()
    },
    /**
     * 打开新增分类对话框
     */
    handleAdd() {
      this.$refs.categoryDialog.open('新增分类')
    },
    /**
     * 打开编辑分类对话框
     * @param {Object} row - 要编辑的分类行数据
     */
    handleUpdate(row) {
      this.$refs.categoryDialog.open('编辑分类', row)
    },
    /**
     * 删除药品分类
     * 显示确认对话框，确认后调用删除API
     * @param {Object} row - 要删除的分类行数据
     */
    handleDelete(row) {
      this.$confirm(`确定要删除分类 "${row.name}" 吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteCategory(row.categoryId).then(() => {
          this.$message.success('删除成功')
          this.getList() // 重新加载列表
        })
      })
    }
  }
}
</script>

<style scoped>
.category-container {
  padding: 20px;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
