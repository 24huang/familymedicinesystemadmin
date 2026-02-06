<template>
  <div class="drug-container">
    <el-card class="filter-container" shadow="hover">
      <div slot="header" class="clearfix">
        <span class="filter-title"><i class="el-icon-search"></i> 筛选查询</span>
      </div>
      <el-form :inline="true" :model="queryParams" size="small" class="filter-form">
        <el-form-item label="关键字">
          <el-input v-model="queryParams.keyword" placeholder="药品名/条形码" clearable @keyup.enter.native="handleQuery" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="药品分类">
          <el-select v-model="queryParams.categoryId" placeholder="请选择分类" clearable style="width: 150px;">
            <el-option
              v-for="item in categoryOptions"
              :key="item.categoryId"
              :label="item.name"
              :value="item.categoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性">
          <el-select v-model="queryParams.categoryType" placeholder="请选择属性" clearable style="width: 120px;">
            <el-option label="处方药" :value="0"></el-option>
            <el-option label="OTC" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px;">
            <el-option label="待审核" :value="0"></el-option>
            <el-option label="已通过" :value="1"></el-option>
            <el-option label="已拒绝" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container" shadow="hover">
      <div slot="header" class="table-header">
        <div class="header-left">
          <span class="table-title"><i class="el-icon-s-grid"></i> 药品列表</span>
        </div>
        <div class="header-right">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增药品</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" :disabled="!multipleSelection.length" @click="handleBatchDelete">批量删除</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="drugList"
        @selection-change="handleSelectionChange"
        border
        stripe
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px; border-radius: 4px;"
              :src="scope.row.imageUrl"
              :preview-src-list="[scope.row.imageUrl]"
              fit="cover"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名" prop="tradeName" show-overflow-tooltip></el-table-column>
        <el-table-column label="通用名" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="规格" prop="spec" width="120" align="center"></el-table-column>
        <el-table-column label="价格" prop="price" width="100" align="center">
          <template slot-scope="scope">
            <span class="price-tag">￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.categoryType === 0 ? 'danger' : 'success'" size="small">
              {{ scope.row.categoryType === 0 ? 'Rx' : 'OTC' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="160" align="center"></el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              icon="el-icon-check"
              class="success-text"
              @click="handleAudit(scope.row)"
            >审核</el-button>
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

    <!-- 新增/修改对话框 -->
    <drug-dialog
      ref="drugDialog"
      @refresh="getList"
    />

    <!-- 详情对话框 -->
    <drug-detail-dialog
      ref="drugDetailDialog"
    />
  </div>
</template>

<script>
import { getDrugPage, deleteDrug, auditDrug, getDrugCategoryOptions } from '@/api/drug'
import DrugDialog from './components/DrugDialog.vue'
import DrugDetailDialog from './components/DrugDetailDialog.vue'

export default {
  name: 'DrugList',
  components: {
    DrugDialog,
    DrugDetailDialog
  },
  data() {
    return {
      loading: false,
      categoryOptions: [],
      drugList: [],
      total: 0,
      multipleSelection: [],
      queryParams: {
        page: 1,
        size: 10,
        keyword: '',
        categoryId: undefined,
        categoryType: undefined,
        status: undefined
      }
    }
  },
  created() {
    this.getCategoryList()
    this.getList()
  },
  methods: {
    getCategoryList() {
      getDrugCategoryOptions().then(res => {
        this.categoryOptions = res.data || []
      })
    },
    getList() {
      this.loading = true
      getDrugPage(this.queryParams).then(res => {
        this.drugList = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        page: 1,
        size: 10,
        keyword: '',
        categoryId: undefined,
        categoryType: undefined,
        status: undefined
      }
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.queryParams.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.current = val
      this.getList()
    },
    getStatusType(status) {
      const types = {
        0: 'warning',
        1: 'success',
        2: 'danger'
      }
      return types[status] || 'info'
    },
    getStatusLabel(status) {
      const labels = {
        0: '待审核',
        1: '已通过',
        2: '已拒绝'
      }
      return labels[status] || '未知'
    },
    handleAdd() {
      this.$refs.drugDialog.open('新增药品')
    },
    handleUpdate(row) {
      this.$refs.drugDialog.open('编辑药品', row.drugId)
    },
    handleDetail(row) {
      this.$refs.drugDetailDialog.open(row.drugId)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除药品 "${row.name}" 吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteDrug(row.drugId).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    handleBatchDelete() {
      const ids = this.multipleSelection.map(item => item.drugId).join(',')
      this.$confirm(`确定要批量删除选中的 ${this.multipleSelection.length} 个药品吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteDrug(ids).then(() => {
          this.$message.success('批量删除成功')
          this.getList()
        })
      })
    },
    handleAudit(row) {
      this.$confirm(`审核药品 "${row.name}"`, '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'info'
      }).then(() => {
        auditDrug(row.drugId, 1).then(() => {
          this.$message.success('审核已通过')
          this.getList()
        })
      }).catch(action => {
        if (action === 'cancel') {
          auditDrug(row.drugId, 2).then(() => {
            this.$message.warning('审核已拒绝')
            this.getList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.drug-container {
  padding: 20px;
}
.filter-container {
  margin-bottom: 20px;
}
.filter-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.filter-form {
  margin-top: 10px;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.header-right {
  display: flex;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.price-tag {
  color: #f56c6c;
  font-weight: bold;
}
.success-text {
  color: #67c23a;
}
.danger-text {
  color: #f56c6c;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}
</style>
