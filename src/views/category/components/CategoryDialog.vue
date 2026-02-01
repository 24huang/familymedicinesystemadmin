<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input 
          type="textarea" 
          v-model="form.description" 
          placeholder="请输入分类描述"
          :rows="3"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addCategory, updateCategory } from '@/api/category'

export default {
  name: 'CategoryDialog',
  data() {
    return {
      title: '',
      visible: false,
      loading: false,
      form: {
        categoryId: undefined,
        name: '',
        description: '',
        status: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    open(title, row) {
      this.title = title
      this.visible = true
      this.reset()
      if (row) {
        this.form = {
          categoryId: row.categoryId,
          name: row.name,
          description: row.description,
          status: row.status
        }
      }
    },
    reset() {
      this.form = {
        categoryId: undefined,
        name: '',
        description: '',
        status: 1
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          // 如果是新增，自动填充createBy
          if (!this.form.categoryId) {
            this.form.createBy = localStorage.getItem('userId')
          }
          const request = this.form.categoryId ? updateCategory : addCategory
          request(this.form).then(() => {
            this.$message.success(this.form.categoryId ? '修改成功' : '新增成功')
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
