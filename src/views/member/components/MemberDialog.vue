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
        <el-col :span="24" style="text-align: center">
          <el-upload
            class="avatar-uploader"
            action="/api/common/upload"
            :show-file-list="false"
            :headers="uploadHeaders"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.picture" :src="form.picture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-col>
      </el-row>

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

      <el-form-item v-if="isAdmin" label="所属户主" prop="householdId">
        <el-select v-model="form.householdId" filterable placeholder="请选择户主账号" style="width: 100%">
          <el-option
            v-for="item in householdOptions"
            :key="item.userId"
            :label="formatHouseholdLabel(item)"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

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
import { getHouseholdOptions } from '@/api/user'

export default {
  name: 'MemberDialog',
  data() {
    return {
      title: '',
      visible: false,
      loading: false,
      isAdmin: false,
      householdOptions: [],
      uploadHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      form: {
        memberId: undefined,
        householdId: undefined,
        name: '',
        relation: '',
        gender: 1,
        birthDate: '',
        phone: '',
        healthCondition: '',
        picture: ''
      },
      rules: {
        householdId: [],
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
    resolveIsAdmin() {
      try {
        const userInfoStr = localStorage.getItem('userInfo')
        if (!userInfoStr) return false
        const userInfo = JSON.parse(userInfoStr)
        return userInfo && userInfo.role === 0
      } catch (e) {
        return false
      }
    },
    loadHouseholdOptions() {
      if (!this.isAdmin) return
      return getHouseholdOptions({ includeAdmin: true }).then(res => {
        this.householdOptions = res.data || []
      })
    },
    formatHouseholdLabel(item) {
      const roleText = item.role === 0 ? '管理员' : (item.role === 1 ? '户主' : '普通成员')
      const name = item.nickname || item.username || ''
      return `${name}（ID:${item.userId}｜${roleText}）`
    },
    open(title, row) {
      this.title = title
      this.visible = true
      this.isAdmin = this.resolveIsAdmin()
      this.rules.householdId = this.isAdmin
        ? [{ required: true, message: '请选择所属户主', trigger: 'change' }]
        : []
      this.loadHouseholdOptions()
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
          healthCondition: '',
          picture: ''
        }
        if (!this.isAdmin) {
          this.form.householdId = localStorage.getItem('userId')
        }
      }
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    handleAvatarSuccess(res) {
      if (res.code === 200) {
        this.form.picture = res.data
      } else {
        this.$message.error(res.message || '上传图片失败')
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (!this.form.householdId) {
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
  color: var(--text-secondary);
  margin-left: 10px;
}

::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
