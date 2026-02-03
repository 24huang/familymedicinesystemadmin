<template>
  <el-dialog
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
                :key="item.id"
                :label="item.name"
                :value="item.id"
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
        <el-col :span="8">
          <el-form-item label="库存" prop="stock">
            <el-input-number v-model="form.stock" :min="0" :step="1" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
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
              <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="说明书" prop="instructionUrl">
            <el-input v-model="form.instructionUrl" placeholder="请输入说明书链接或上传"></el-input>
            <!-- 暂未实现说明书上传，预留位置 -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDrugDetail, addDrug, updateDrug,  uploadFile } from '@/api/drug'
import { getCategoryOptions } from '@/api/category'

export default {
  name: 'DrugDialog',
  data() {
    return {
      title: '',
      visible: false,
      loading: false,
      isLoading: false,
      categoryOptions: [],
      form: {
        drugId: undefined, // 修改为 drugId
        barCode: '', // 修改为 barCode
        name: '',
        tradeName: '',
        categoryId: undefined,
        categoryType: undefined,
        usageType: undefined, // 新增 usageType
        form: '', // 新增 form (剂型)
        spec: '',
        manufacturer: '',
        approvalNumber: '',
        price: 0,
        stock: 0,
        usageDosage: '',
        description: '', // 新增 description
        imageUrl: '',
        instructionUrl: '', // 新增 instructionUrl
        shelfLife: undefined // 新增 shelfLife
      },
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
    open(title, id) {
      this.title = title
      this.visible = true
      this.getCategoryList()
      this.reset()
      if (id) {
        this.loadDetail(id)
      }
    },
    // getCategoryList() {
    //   getCategoryOptions().then(res => {
    //     this.categoryOptions = res.data
    //   })
    // },
    getCategoryList() {
      this.isLoading = true;
      getCategoryOptions()
        .then(res => {
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
    reset() {
      this.form = {
        id: undefined,
        code: '',
        name: '',
        tradeName: '',
        categoryId: undefined,
        categoryType: undefined,
        spec: '',
        package: '',
        validity: '',
        manufacturer: '',
        approvalNumber: '',
        price: 0,
        stock: 0,
        usageDosage: '',
        imageUrl: ''
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    loadDetail(id) {
      getDrugDetail(id).then(res => {
        const data = res.data
        // 将后端数据映射到表单
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
    handleScan() {
      if (!this.form.barCode) return
      // TODO: 调用扫码接口，目前先模拟
      this.$message.info('扫码功能开发中，当前条码：' + this.form.barCode)
    },
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
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          // 提交前的数据处理
          const submitData = { ...this.form }
          
          const request = this.form.drugId ? updateDrug : addDrug
          
          request(submitData).then(() => {
            this.$message.success(this.form.drugId ? '修改成功' : '新增成功')
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
