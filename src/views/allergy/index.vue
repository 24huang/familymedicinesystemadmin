<template>
  <div class="allergy-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="关键词">
          <el-input 
            v-model="queryParams.keyword" 
            placeholder="过敏原/反应"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="成员">
          <el-select 
            v-model="queryParams.memberId" 
            placeholder="请选择成员" 
            clearable
            filterable
          >
            <el-option 
              v-for="member in memberList" 
              :key="member.memberId" 
              :label="member.name" 
              :value="member.memberId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <div class="table-header">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增过敏记录</el-button>
        <el-button 
          type="danger" 
          icon="el-icon-delete" 
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >批量删除</el-button>
      </div>

      <el-table 
        :data="tableData" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="memberName" label="成员姓名" width="120" />
        <el-table-column prop="allergen" label="过敏原" min-width="150" />
        <el-table-column prop="reaction" label="过敏反应" min-width="200" show-overflow-tooltip />
        <el-table-column prop="severity" label="严重程度" width="100">
          <template slot-scope="scope">
            <el-tag :type="getSeverityType(scope.row.severity)">
              {{ getSeverityText(scope.row.severity) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="recordDate" label="记录日期" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button 
              type="text" 
              icon="el-icon-edit" 
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button 
              type="text" 
              icon="el-icon-delete" 
              style="color: #F56C6C"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogVisible" 
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form 
        ref="allergyForm" 
        :model="allergyForm" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item label="成员" prop="memberId">
          <el-select 
            v-model="allergyForm.memberId" 
            placeholder="请选择成员"
            style="width: 100%"
          >
            <el-option 
              v-for="member in memberList" 
              :key="member.memberId" 
              :label="member.name" 
              :value="member.memberId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="过敏原" prop="allergen">
          <el-input 
            v-model="allergyForm.allergen" 
            placeholder="例如：青霉素、花粉、海鲜"
          />
        </el-form-item>
        <el-form-item label="过敏反应" prop="reaction">
          <el-input 
            v-model="allergyForm.reaction" 
            type="textarea" 
            :rows="3"
            placeholder="描述过敏反应症状"
          />
        </el-form-item>
        <el-form-item label="严重程度" prop="severity">
          <el-radio-group v-model="allergyForm.severity">
            <el-radio :label="1">轻度</el-radio>
            <el-radio :label="2">中度</el-radio>
            <el-radio :label="3">重度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="记录日期" prop="recordDate">
          <el-date-picker 
            v-model="allergyForm.recordDate" 
            type="date" 
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/request'

export default {
  name: 'AllergyManagement',
  data() {
    return {
      loading: false,
      submitLoading: false,
      tableData: [],
      memberList: [],
      total: 0,
      selectedIds: [],
      dialogVisible: false,
      dialogTitle: '新增过敏记录',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        memberId: null,
        keyword: ''
      },
      allergyForm: {
        allergyId: null,
        memberId: null,
        allergen: '',
        reaction: '',
        severity: 1,
        recordDate: ''
      },
      rules: {
        memberId: [
          { required: true, message: '请选择成员', trigger: 'change' }
        ],
        allergen: [
          { required: true, message: '请输入过敏原', trigger: 'blur' }
        ],
        reaction: [
          { required: true, message: '请输入过敏反应', trigger: 'blur' }
        ],
        severity: [
          { required: true, message: '请选择严重程度', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.loadMemberList()
    this.loadData()
  },
  methods: {
    /**
     * 加载成员列表
     */
    loadMemberList() {
      request({
        url: '/admin/member/list',
        method: 'get'
      }).then(res => {
        console.log('成员列表响应:', res)
        if (res.code === 200) {
          this.memberList = res.data || []
          console.log('成员列表数据:', this.memberList)
        } else {
          this.$message.error(res.message || '加载成员列表失败')
        }
      }).catch(err => {
        console.error('加载成员列表失败:', err)
        this.$message.error('加载成员列表失败，请检查后端服务')
      })
    },
    /**
     * 加载过敏记录数据
     */
    loadData() {
      this.loading = true
      request({
        url: '/admin/allergy/page',
        method: 'get',
        params: this.queryParams
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records || []
          this.total = res.data.total || 0
          
          // 补充成员姓名
          this.tableData.forEach(row => {
            const member = this.memberList.find(m => m.memberId === row.memberId)
            row.memberName = member ? member.name : '-'
          })
        }
      }).catch(err => {
        console.error('加载数据失败:', err)
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.queryParams.pageNum = 1
      this.loadData()
    },
    /**
     * 重置
     */
    handleReset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        memberId: null,
        keyword: ''
      }
      this.loadData()
    },
    /**
     * 新增
     */
    handleAdd() {
      this.dialogTitle = '新增过敏记录'
      this.allergyForm = {
        allergyId: null,
        memberId: null,
        allergen: '',
        reaction: '',
        severity: 1,
        recordDate: new Date().toISOString().split('T')[0]
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.allergyForm.clearValidate()
      })
    },
    /**
     * 编辑
     */
    handleEdit(row) {
      this.dialogTitle = '编辑过敏记录'
      this.allergyForm = {
        allergyId: row.allergyId,
        memberId: row.memberId,
        allergen: row.allergen,
        reaction: row.reaction,
        severity: row.severity,
        recordDate: row.recordDate
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.allergyForm.clearValidate()
      })
    },
    /**
     * 提交
     */
    handleSubmit() {
      this.$refs.allergyForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          const url = this.allergyForm.allergyId ? '/admin/allergy/update' : '/admin/allergy/add'
          const method = this.allergyForm.allergyId ? 'put' : 'post'
          
          request({
            url: url,
            method: method,
            data: this.allergyForm
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(this.allergyForm.allergyId ? '更新成功' : '新增成功')
              this.dialogVisible = false
              this.loadData()
            }
          }).catch(err => {
            console.error('操作失败:', err)
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    /**
     * 删除
     */
    handleDelete(row) {
      this.$confirm('确认删除该过敏记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: `/admin/allergy/${row.allergyId}`,
          method: 'delete'
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.loadData()
          }
        }).catch(err => {
          console.error('删除失败:', err)
        })
      }).catch(() => {})
    },
    /**
     * 批量删除
     */
    handleBatchDelete() {
      this.$confirm(`确认删除选中的 ${this.selectedIds.length} 条记录？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/admin/allergy/batch',
          method: 'delete',
          data: this.selectedIds
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('批量删除成功')
            this.loadData()
          }
        }).catch(err => {
          console.error('批量删除失败:', err)
        })
      }).catch(() => {})
    },
    /**
     * 选择变化
     */
    handleSelectionChange(selection) {
      this.selectedIds = selection.map(item => item.allergyId)
    },
    /**
     * 分页大小变化
     */
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize
      this.loadData()
    },
    /**
     * 当前页变化
     */
    handleCurrentChange(pageNum) {
      this.queryParams.pageNum = pageNum
      this.loadData()
    },
    /**
     * 获取严重程度文本
     */
    getSeverityText(severity) {
      const map = { 1: '轻度', 2: '中度', 3: '重度' }
      return map[severity] || '-'
    },
    /**
     * 获取严重程度标签类型
     */
    getSeverityType(severity) {
      const map = { 1: 'success', 2: 'warning', 3: 'danger' }
      return map[severity] || 'info'
    }
  }
}
</script>

<style scoped>
.allergy-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  padding: 20px;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
