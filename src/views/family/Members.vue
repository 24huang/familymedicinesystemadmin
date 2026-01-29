<template>
  <div class="family-members-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>家庭成员管理</h2>
      <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">
        添加成员
      </el-button>
    </div>

    <!-- 搜索筛选 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="关系">
          <el-select v-model="searchForm.relationship" placeholder="请选择关系" clearable>
            <el-option label="本人" value="本人" />
            <el-option label="配偶" value="配偶" />
            <el-option label="父亲" value="父亲" />
            <el-option label="母亲" value="母亲" />
            <el-option label="儿子" value="儿子" />
            <el-option label="女儿" value="女儿" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="searchForm.gender" placeholder="请选择性别" clearable>
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchMembers">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 成员列表 -->
    <el-card class="table-card">
      <el-table v-loading="loading" :data="members" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="relationship" label="关系" width="100" />
        <el-table-column prop="gender" label="性别" width="80">
          <template slot-scope="scope">
            {{ scope.row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日" width="120" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="400" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="viewMember(scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="editMember(scope.row)">编辑</el-button>
            <el-button 
              size="mini" 
              :type="scope.row.status === 1 ? 'warning' : 'success'"
              @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button size="mini" type="info" @click="updateMemberAllergies(scope.row)">过敏史</el-button>
            <el-button size="mini" type="info" @click="updateMemberMedicalHistory(scope.row)">病史</el-button>
            <el-button size="mini" type="danger" @click="deleteMember(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :current-page="pagination.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      @close="resetForm"
    >
      <el-form ref="memberForm" :model="memberForm" :rules="formRules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="memberForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="关系" prop="relationship">
          <el-select v-model="memberForm.relationship" placeholder="请选择关系">
            <el-option label="本人" value="本人" />
            <el-option label="配偶" value="配偶" />
            <el-option label="父亲" value="父亲" />
            <el-option label="母亲" value="母亲" />
            <el-option label="儿子" value="儿子" />
            <el-option label="女儿" value="女儿" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="memberForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="memberForm.birthday"
            type="date"
            placeholder="选择生日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="memberForm.status">
            <el-radio :label="1">管理员</el-radio>
            <el-radio :label="2">用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="memberForm.phone" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="过敏史" prop="allergies">
          <el-input
            v-model="memberForm.allergies"
            type="textarea"
            :rows="3"
            placeholder="请输入过敏史"
          />
        </el-form-item>
        <el-form-item label="病史" prop="medicalHistory">
          <el-input
            v-model="memberForm.medicalHistory"
            type="textarea"
            :rows="3"
            placeholder="请输入病史"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="成员详情" :visible.sync="detailVisible" width="600px">
      <div v-if="memberDetail" class="member-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ memberDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="关系">{{ memberDetail.relationship }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ memberDetail.gender === 1 ? '男' : '女' }}</el-descriptions-item>
          <el-descriptions-item label="生日">{{ memberDetail.birthday }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ memberDetail.phone }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="memberDetail.status === 1 ? 'success' : 'danger'">
              {{ memberDetail.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="过敏史" :span="2">{{ memberDetail.allergies || '无' }}</el-descriptions-item>
          <el-descriptions-item label="病史" :span="2">{{ memberDetail.medicalHistory || '无' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{ memberDetail.createTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFamilyMembersList,
  getFamilyMember,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  updateMemberStatus,
  updateAllergies,
  updateMedicalHistory,
  getBirthdayReminders
} from '@/api/family'

export default {
  name: 'FamilyMembers',
  data() {
    return {
      loading: false,
      members: [],
      searchForm: {
        name: '',
        relationship: '',
        gender: null
      },
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: false,
      dialogType: 'add', // add or edit
      memberForm: {
        id: null,
        name: '',
        relationship: '',
        gender: 1,
        birthday: '',
        phone: '',
        allergies: '',
        medicalHistory: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        relationship: [{ required: true, message: '请选择关系', trigger: 'change' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        birthday: [{ required: true, message: '请选择生日', trigger: 'change' }]
      },
      detailVisible: false,
      memberDetail: null
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogType === 'add' ? '添加家庭成员' : '编辑家庭成员'
    }
  },
  mounted() {
    this.loadMembers()
  },
  methods: {
    async loadMembers() {
      this.loading = true
      try {
        const params = {
          current: this.pagination.current,
          size: this.pagination.size,
          ...this.searchForm
        }
        const response = await getFamilyMembersList(params)
        this.members = response.data.records
        this.pagination.total = response.data.total
      } catch (error) {
        console.error('加载家庭成员失败:', error)
        this.$message.error('加载家庭成员失败')
      } finally {
        this.loading = false
      }
    },

    searchMembers() {
      this.pagination.current = 1
      this.loadMembers()
    },

    resetSearch() {
      this.searchForm = {
        name: '',
        relationship: '',
        gender: null
      }
      this.searchMembers()
    },

    handleSizeChange(size) {
      this.pagination.size = size
      this.loadMembers()
    },

    handleCurrentChange(current) {
      this.pagination.current = current
      this.loadMembers()
    },

    showAddDialog() {
      this.dialogType = 'add'
      this.dialogVisible = true
    },

    editMember(member) {
      this.dialogType = 'edit'
      this.memberForm = { ...member }
      this.dialogVisible = true
    },

    async viewMember(member) {
      try {
        const response = await getFamilyMember(member.id)
        this.memberDetail = response.data
        this.detailVisible = true
      } catch (error) {
        console.error('获取成员详情失败:', error)
        this.$message.error('获取成员详情失败')
      }
    },

    async submitForm() {
      try {
        await this.$refs.memberForm.validate()
        
        if (this.dialogType === 'add') {
          await addFamilyMember(this.memberForm)
          this.$message.success('添加成员成功')
        } else {
          await updateFamilyMember(this.memberForm.id, this.memberForm)
          this.$message.success('更新成员成功')
        }
        
        this.dialogVisible = false
        this.loadMembers()
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('操作失败')
      }
    },

    async deleteMember(member) {
      try {
        await this.$confirm('确定要删除该成员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await deleteFamilyMember(member.id)
        this.$message.success('删除成功')
        this.loadMembers()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    },

    async toggleStatus(member) {
      try {
        const newStatus = member.status === 1 ? 0 : 1
        await updateMemberStatus(member.id, newStatus)
        this.$message.success(`${newStatus === 1 ? '启用' : '禁用'}成功`)
        this.loadMembers()
      } catch (error) {
        console.error('状态更新失败:', error)
        this.$message.error('状态更新失败')
      }
    },

    resetForm() {
      this.memberForm = {
        id: null,
        name: '',
        relationship: '',
        gender: 1,
        birthday: '',
        phone: '',
        allergies: '',
        medicalHistory: ''
      }
      if (this.$refs.memberForm) {
        this.$refs.memberForm.resetFields()
      }
    },

    async loadBirthdayReminders() {
      try {
        const response = await getBirthdayReminders(7)
        console.log('生日提醒:', response.data)
      } catch (error) {
        console.error('获取生日提醒失败:', error)
      }
    },

    // 单独更新过敏史
    async updateMemberAllergies(member) {
      try {
        const { value: allergies } = await this.$prompt('请输入过敏史', '更新过敏史', {
          inputValue: member.allergies || '',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        
        await updateAllergies(member.id, allergies)
        this.$message.success('更新过敏史成功')
        this.loadMembers()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新过敏史失败:', error)
          this.$message.error('更新过敏史失败')
        }
      }
    },

    // 单独更新病史
    async updateMemberMedicalHistory(member) {
      try {
        const { value: medicalHistory } = await this.$prompt('请输入病史', '更新病史', {
          inputValue: member.medicalHistory || '',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        
        await updateMedicalHistory(member.id, medicalHistory)
        this.$message.success('更新病史成功')
        this.loadMembers()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('更新病史失败:', error)
          this.$message.error('更新病史失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.family-members-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.member-detail {
  padding: 20px 0;
}
</style>
