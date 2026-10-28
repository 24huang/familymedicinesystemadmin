<template>
  <el-dialog @close="formVersion++; scanning=false; instructionUploading=false"
    :title="title"
    :visible.sync="visible"
    width="800px"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="条形码" prop="barCode">
            <el-input v-model="form.barCode" placeholder="请输入或扫描条形码" @blur="handleScan">
              <el-button slot="append" icon="el-icon-full-screen" @click="handleScan">扫码识别</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="商品名" prop="tradeName">
            <el-input v-model="form.tradeName" placeholder="请输入商品名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通用名" prop="name">
            <el-input v-model="form.name" placeholder="请输入通用名"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="分类" prop="categoryId">
            <el-select 
              v-model="form.categoryId" 
              placeholder="请选择分类"
              @click.native="getCategoryList"
              style="width: 100%"
              :loading="isLoading"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.categoryId"
                :label="item.name"
                :value="item.categoryId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处方类型" prop="categoryType">
            <el-select v-model="form.categoryType" placeholder="请选择处方类型" style="width: 100%">
              <el-option label="OTC" :value="1"></el-option>
              <el-option label="处方药" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="用法" prop="usageType">
            <el-select v-model="form.usageType" placeholder="请选择用法" style="width: 100%">
              <el-option label="内服" :value="0"></el-option>
              <el-option label="外用" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="剂型" prop="form">
            <el-input v-model="form.form" placeholder="如：胶囊/片剂"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格" prop="spec">
            <el-input v-model="form.spec" placeholder="如：0.25g*12片"></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="生产厂家" prop="manufacturer">
            <el-input v-model="form.manufacturer" placeholder="请输入生产厂家"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批准文号" prop="approvalNumber">
            <el-input v-model="form.approvalNumber" placeholder="请输入批准文号"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="form.price" :precision="2" :step="0.1" :min="0" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
<!--        <el-col :span="8">-->
<!--          <el-form-item label="库存" prop="stock">-->
<!--            <el-input-number v-model="form.stock" :min="0" :step="1" style="width: 100%"></el-input-number>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="8">
          <el-form-item label="保质期(月)" prop="shelfLife">
            <el-input-number v-model="form.shelfLife" :min="0" :step="1" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="用法用量" prop="usageDosage">
            <el-input type="textarea" v-model="form.usageDosage" placeholder="请输入用法用量" :rows="2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述/适应症" prop="description">
            <el-input type="textarea" v-model="form.description" placeholder="请输入适应症或描述" :rows="2"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="药品图片" prop="imageUrl">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="uploadImage"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.imageUrl" :src="getFullImageUrl(form.imageUrl)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="说明书" prop="instructionUrl">
            <el-input v-model="form.instructionUrl" placeholder="请输入说明书链接或上传"></el-input>
            <el-upload action="#" accept=".jpg,.jpeg,.png,.pdf" :http-request="uploadDrugInstruction" :show-file-list="false" :before-upload="beforeInstructionUpload" :disabled="instructionUploading">
              <el-button size="small" :loading="instructionUploading">上传图片/PDF说明书</el-button>
            </el-upload>
            <el-link v-if="form.instructionUrl && !form.instructionUrl.startsWith('data:')" :href="getFullImageUrl(form.instructionUrl)" target="_blank" rel="noopener noreferrer">查看说明书</el-link>
            <div>支持JPEG、PNG、PDF，最大10MB；上传后保存药品才会关联。</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading" :disabled="instructionUploading || scanning">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 导入药品相关API接口
import { getDrugDetail, addDrug, updateDrug,  uploadFile, scanDrug, uploadInstruction } from '@/api/drug'
// 导入药品分类API接口
import { getCategoryOptions } from '@/api/category'

export default {
  name: 'DrugDialog',
  data() {
    return {
      formVersion: 0, scanning: false, instructionUploading: false,
      title: '', // 对话框标题（新增/编辑）
      visible: false, // 对话框显示状态
      loading: false, // 提交按钮加载状态
      isLoading: false, // 分类列表加载状态
      categoryOptions: [], // 药品分类选项列表
      form: {
        drugId: undefined, // 药品ID（编辑时使用）
        barCode: '', // 条形码
        name: '', // 通用名
        tradeName: '', // 商品名
        categoryId: undefined, // 分类ID
        categoryType: undefined, // 处方类型（0-处方药，1-OTC）
        usageType: undefined, // 用法类型（0-内服，1-外用）
        form: '', // 剂型（如：胶囊、片剂）
        spec: '', // 规格（如：0.25g*12片）
        manufacturer: '', // 生产厂家
        approvalNumber: '', // 批准文号
        price: 0, // 价格
        stock: 0, // 库存
        usageDosage: '', // 用法用量
        description: '', // 描述/适应症
        imageUrl: '', // 药品图片URL
        instructionUrl: '', // 说明书链接
        shelfLife: undefined // 保质期（月）
      },
      // 表单验证规则
      rules: {
        tradeName: [
          { required: true, message: '请输入商品名', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 获取完整的图片URL
     * @param {String} url - 图片URL
     */
    getFullImageUrl(url) {
      if (!url) return ''
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url
      }
      return (process.env.VUE_APP_API_BASE || '/api').replace(/\/$/, '') + url
    },
    /**
     * 打开对话框
     * @param {String} title - 对话框标题
     * @param {Number} id - 药品ID（编辑时传入，新增时为undefined）
     */
    open(title, id) {
      this.title = title
      this.visible = true
      this.getCategoryList()
      this.reset()
      // 如果有ID，则加载药品详情（编辑模式）
      if (id) {
        this.loadDetail(id)
      }
    },
    /**
     * 获取药品分类列表
     * 支持加载状态显示和错误处理
     */
    getCategoryList() {
      this.isLoading = true;
      getCategoryOptions()
        .then(res => {
          // 确保返回数据是数组格式
          this.categoryOptions = Array.isArray(res.data) ? res.data : [];
        })
        .catch(err => {
          console.error('获取分类列表失败：', err);
          this.categoryOptions = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    /**
     * 重置表单数据到初始状态
     * 同时清除表单验证状态
     */
    reset() {
      this.formVersion++; this.scanning=false; this.instructionUploading=false
      this.form = {
        drugId: undefined,
        barCode: '',
        name: '',
        tradeName: '',
        categoryId: undefined,
        categoryType: undefined,
        usageType: undefined,
        form: '',
        spec: '',
        manufacturer: '',
        approvalNumber: '',
        price: 0,
        stock: 0,
        shelfLife: undefined,
        usageDosage: '',
        description: '',
        imageUrl: '',
        instructionUrl: ''
      }
      // 等待DOM更新后清除验证状态
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    /**
     * 加载药品详情数据（编辑模式）
     * @param {Number} id - 药品ID
     */
    loadDetail(id) {
      getDrugDetail(id).then(res => {
        const data = res.data
        // 将后端返回的数据映射到表单字段
        this.form = {
          drugId: data.drugId,
          barCode: data.barCode,
          name: data.name,
          tradeName: data.tradeName,
          categoryId: data.categoryId,
          categoryType: data.categoryType,
          usageType: data.usageType,
          form: data.form,
          spec: data.spec,
          manufacturer: data.manufacturer,
          approvalNumber: data.approvalNumber,
          price: data.price,
          stock: data.stock,
          shelfLife: data.shelfLife,
          usageDosage: data.usageDosage,
          description: data.description,
          imageUrl: data.imageUrl,
          instructionUrl: data.instructionUrl
        }
      })
    },
    // 只补齐仍为空的字段；不改变编辑中的药品ID，也不覆盖用户输入。
    async handleScan() {
      if (this.scanning) return
      const barCode=this.form.barCode, version=this.formVersion, token=localStorage.getItem('token')
      if (!/^[0-9]{8,20}$/.test(barCode || '')) return this.$message.warning('请输入8至20位数字条码')
      this.scanning=true
      try {
        const res=await scanDrug(barCode)
        if (!this.visible || version!==this.formVersion || barCode!==this.form.barCode || token!==localStorage.getItem('token')) return
        const data=res.data || {}
        if (!data.name) return this.$message.info('未查到药品信息，请手动完善')
        const fields=['name','tradeName','categoryId','categoryType','usageType','form','spec','manufacturer','approvalNumber','usageDosage','description','imageUrl','instructionUrl','shelfLife']
        fields.forEach(field=>{if ((this.form[field] === '' || this.form[field] == null) && data[field] != null) this.$set(this.form,field,data[field])})
        this.$message.success('查询完成，仅补充空白信息，请核对后保存')
      } finally { if(version===this.formVersion)this.scanning=false }
    },
    beforeInstructionUpload(file) {
      const valid=/\.(pdf|jpe?g|png)$/i.test(file.name) && file.size > 0 && file.size <= 10*1024*1024
      if (!valid) this.$message.error('请选择10MB以内的JPEG、PNG或PDF')
      return valid
    },
    async uploadDrugInstruction(param) {
      if (this.instructionUploading) return
      const version=this.formVersion, token=localStorage.getItem('token'), previous=this.form.instructionUrl
      this.instructionUploading=true
      try {
        const data=new FormData();data.append('file',param.file)
        const res=await uploadInstruction(data)
        if (!this.visible || version!==this.formVersion || token!==localStorage.getItem('token')) return
        if (this.form.instructionUrl === previous) this.form.instructionUrl=res.data
        if (param.onSuccess) param.onSuccess(res)
        this.$message.success('说明书已上传，请保存药品')
      } catch(e) { if(param.onError)param.onError(e) }
      finally { if(version===this.formVersion)this.instructionUploading=false }
    },
    /**
     * 自定义图片上传方法
     * @param {Object} param - 上传参数，包含file对象
     */
    uploadImage(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      uploadFile(formData).then(res => {
        this.form.imageUrl = res.data
        this.$message.success('上传成功')
      }).catch(() => {
        this.$message.error('上传失败')
      })
    },
    /**
     * 图片上传前的校验
     * 限制：仅支持JPG/PNG格式，大小不超过2MB
     * @param {File} file - 待上传的文件对象
     * @returns {Boolean} 是否允许上传
     */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    /**
     * 提交表单数据
     * 根据是否有drugId判断是新增还是编辑操作
     */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          // 提交前的数据处理（深拷贝避免影响原数据）
          const submitData = { ...this.form }
          
          // 根据是否有drugId选择对应的API
          const request = this.form.drugId ? updateDrug : addDrug
          
          request(submitData).then(() => {
            this.$message.success(this.form.drugId ? '修改成功' : '新增成功')
            this.visible = false
            // 通知父组件刷新列表
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
