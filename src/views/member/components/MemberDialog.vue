<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="关系" prop="relation">
            <el-select v-model="form.relation" placeholder="请选择关系" style="width: 100%">
              <el-option label="本人 (Self)" value="Self"></el-option>
              <el-option label="配偶 (Spouse)" value="Spouse"></el-option>
              <el-option label="子女 (Child)" value="Child"></el-option>
              <el-option label="父母 (Parent)" value="Parent"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="出生日期" prop="birthDate">
        <el-date-picker
          v-model="form.birthDate"
          type="date"
          placeholder="选择出生日期"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="健康状况" prop="healthCondition">
        <el-input 
          type="textarea" 
          v-model="form.healthCondition" 
          placeholder="请输入健康状况，如：高血压、糖尿病、健康等"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addMember, updateMember } from '@/api/member'

export default {
  name: 'MemberDialog',
  data() {
    return {
      title: '',
      visible: false,
      loading: false,
      form: {
        memberId: undefined,
        householdId: undefined,
        name: '',
        relation: '',
        gender: 1,
        birthDate: '',
        phone: '',
        healthCondition: ''
      },
      rules: {
        householdId: [
          { required: true, message: '请输入所属户主ID', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        relation: [
          { required: true, message: '请选择关系', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    open(title, row) {
      this.title = title
      this.visible = true
      if (row) {
        this.form = { ...row }
      } else {
        this.form = {
          memberId: undefined,
          householdId: undefined,
          name: '',
          relation: '',
          gender: 1,
          birthDate: '',
          phone: '',
          healthCondition: ''
        }
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          // 如果是新增，默认使用当前登录用户的ID作为户主ID
          if (!this.form.memberId) {
            this.form.householdId = localStorage.getItem('userId')
          }
          const request = this.form.memberId ? updateMember : addMember
          request(this.form).then(() => {
            this.$message.success(this.form.memberId ? '修改成功' : '添加成功')
            this.visible = false
            this.$emit('refresh')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.tip-text {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}
</style>
