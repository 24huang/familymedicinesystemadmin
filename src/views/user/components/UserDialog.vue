<template>
  <el-dialog :title="title" :visible.sync="visible" width="500px" @close="handleClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!isEdit">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, updateUser } from '@/api/user'

export default {
  name: 'UserDialog',
  data() {
    return {
      visible: false,
      title: '',
      loading: false,
      isEdit: false,
      form: {
        userId: undefined,
        username: '',
        password: '',
        nickname: '',
        phone: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open(title, row) {
      this.title = title
      this.visible = true
      this.isEdit = !!row
      if (row) {
        this.form = { ...row, password: '' } // Password usually not returned or needed for edit unless changing
      } else {
        this.resetForm()
      }
    },
    resetForm() {
      this.form = {
        userId: undefined,
        username: '',
        password: '',
        nickname: '',
        phone: ''
      }
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    handleClose() {
      this.visible = false
      this.resetForm()
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const request = this.isEdit ? updateUser(this.form) : addUser(this.form)
          request.then(() => {
            this.$message.success(this.title + '成功')
            this.visible = false
            this.$emit('refresh')
          }).catch(err => {
            console.error(err)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
