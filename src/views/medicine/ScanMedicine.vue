<template>
  <div class="medicine-add-container">
    <el-card class="add-card">
      <div slot="header">
        <span>药品录入</span>
        <el-button type="text" @click="$router.push('/medicine/list')">
          返回列表
        </el-button>
      </div>
      
      <div class="add-content">
        <!-- 快速录入区域 -->
        <div class="quick-add-area">
          <div class="quick-add-box">
            <div class="quick-add-header">
              <h3>快速录入</h3>
              <p>支持条形码/二维码识别，或手动录入药品信息</p>
            </div>
            
            <div class="quick-add-actions">
              <el-button
                type="primary"
                icon="el-icon-camera"
                @click="handleImageUpload"
              >
                上传药品图片识别
              </el-button>
              
              <el-button
                type="success"
                icon="el-icon-edit"
                @click="showManualForm = true"
              >
                手动录入药品信息
              </el-button>
              
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleFileChange"
              />
            </div>
            
            <!-- 图片预览区域 -->
            <div v-if="previewImage" class="preview-area">
              <div class="preview-image">
                <img :src="previewImage" alt="药品图片" />
              </div>
              <div class="preview-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click="recognizeImage"
                  :loading="recognizing"
                >
                  {{ recognizing ? '识别中...' : '开始识别' }}
                </el-button>
                <el-button
                  size="small"
                  @click="clearPreview"
                >
                  重新选择
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 识别结果 -->
        <div class="result-area">
          <div v-if="recognitionResult" class="result-content">
            <h3>识别结果</h3>
            <div class="result-info">
              <div class="result-item">
                <label>药品名称：</label>
                <span>{{ recognitionResult.name || '未识别' }}</span>
              </div>
              <div class="result-item">
                <label>条形码：</label>
                <span>{{ recognitionResult.barcode || '未识别' }}</span>
              </div>
              <div class="result-item">
                <label>识别置信度：</label>
                <span>{{ recognitionResult.confidence || '0' }}%</span>
              </div>
            </div>
            
            <div class="result-actions">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="useRecognitionResult"
              >
                使用此信息
              </el-button>
              <el-button
                icon="el-icon-refresh"
                @click="resetRecognition"
              >
                重新识别
              </el-button>
            </div>
          </div>
          
          <div v-else class="result-placeholder">
            <i class="el-icon-document"></i>
            <p>识别结果将显示在这里</p>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 手动录入表单 -->
    <el-card v-if="showManualForm" class="manual-form-card">
      <div slot="header">
        <span>药品信息录入</span>
        <el-button
          type="text"
          icon="el-icon-close"
          @click="showManualForm = false"
        />
      </div>
      
      <el-form
        ref="medicineForm"
        :model="medicineForm"
        :rules="medicineRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="药品名称" prop="name">
              <el-input v-model="medicineForm.name" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="药品分类" prop="category">
              <el-select v-model="medicineForm.category" placeholder="请选择分类">
                <el-option
                  v-for="category in categories"
                  :key="category.value"
                  :label="category.label"
                  :value="category.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="medicineForm.specification" placeholder="如：10mg*24片" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input v-model="medicineForm.manufacturer" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="库存数量" prop="stock">
              <el-input-number
                v-model="medicineForm.stock"
                :min="0"
                :max="9999"
                placeholder="请输入库存数量"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="过期日期" prop="expiryDate">
              <el-date-picker
                v-model="medicineForm.expiryDate"
                type="date"
                placeholder="请选择过期日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="条形码">
              <el-input v-model="medicineForm.barcode" placeholder="扫码自动填充" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="药品图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="imageFileList"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="说明书">
          <el-upload
            action="#"
            :auto-upload="false"
            :file-list="instructionFileList"
            :on-change="handleInstructionChange"
            :on-remove="handleInstructionRemove"
            :limit="1"
            accept=".pdf"
          >
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传PDF文件</div>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input
            v-model="medicineForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            {{ submitLoading ? '提交中...' : '保存药品' }}
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 录入历史 -->
    <el-card class="history-card">
      <div slot="header">
        <span>最近录入记录</span>
        <el-button type="text" @click="clearHistory">清空历史</el-button>
      </div>
      
      <div v-if="addHistory.length === 0" class="empty-history">
        <i class="el-icon-time"></i>
        <p>暂无录入记录</p>
      </div>
      
      <div v-else class="history-list">
        <div
          v-for="(item, index) in addHistory"
          :key="index"
          class="history-item"
        >
          <div class="history-info">
            <div class="history-name">{{ item.name || '未知药品' }}</div>
            <div class="history-detail">
              {{ item.addTime }} · {{ item.type === 'manual' ? '手动录入' : '图片识别' }}
            </div>
          </div>
          <el-button
            type="text"
            size="small"
            @click="useHistoryItem(item)"
          >
            查看详情
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addMedicine } from '@/api/medicine'

export default {
  name: 'MedicineAdd',
  data() {
    return {
      showManualForm: false,
      submitLoading: false,
      recognizing: false,
      previewImage: null,
      recognitionResult: null,
      categories: [
        { label: '感冒药', value: 'cold' },
        { label: '消炎药', value: 'anti-inflammatory' },
        { label: '止痛药', value: 'painkiller' },
        { label: '维生素', value: 'vitamin' },
        { label: '中药', value: 'chinese' },
        { label: '其他', value: 'other' }
      ],
      medicineForm: {
        name: '',
        category: '',
        specification: '',
        manufacturer: '',
        stock: 1,
        expiryDate: '',
        barcode: '',
        remark: ''
      },
      medicineRules: {
        name: [
          { required: true, message: '请输入药品名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择药品分类', trigger: 'change' }
        ],
        stock: [
          { required: true, message: '请输入库存数量', trigger: 'blur' }
        ],
        expiryDate: [
          { required: true, message: '请选择过期日期', trigger: 'change' }
        ]
      },
      imageFileList: [],
      instructionFileList: [],
      addHistory: []
    }
  },
  mounted() {
    this.loadAddHistory()
  },
  methods: {
    handleImageUpload() {
      this.$refs.fileInput.click()
    },
    
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        // 创建图片预览
        const reader = new FileReader()
        reader.onload = (e) => {
          this.previewImage = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    async recognizeImage() {
      this.recognizing = true
      try {
        // 模拟图片识别过程
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 模拟识别结果
        this.recognitionResult = {
          name: '阿莫西林胶囊',
          barcode: '1234567890123',
          confidence: 95
        }
        
        this.$message.success('图片识别完成')
      } catch (error) {
        console.error('图片识别失败:', error)
        this.$message.error('图片识别失败')
      } finally {
        this.recognizing = false
      }
    },
    
    clearPreview() {
      this.previewImage = null
      this.recognitionResult = null
      this.$refs.fileInput.value = ''
    },
    
    useRecognitionResult() {
      this.fillFormWithResult(this.recognitionResult)
      this.showManualForm = true
    },
    
    fillFormWithResult(result) {
      this.medicineForm = {
        ...this.medicineForm,
        name: result.name || '',
        barcode: result.barcode || ''
      }
    },
    
    resetRecognition() {
      this.recognitionResult = null
    },
    
    handleImageChange(file, fileList) {
      this.imageFileList = fileList
    },
    
    handleImageRemove(file, fileList) {
      this.imageFileList = fileList
    },
    
    handleInstructionChange(file, fileList) {
      this.instructionFileList = fileList
    },
    
    handleInstructionRemove(file, fileList) {
      this.instructionFileList = fileList
    },
    
    async handleSubmit() {
      this.$refs.medicineForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            const formData = new FormData()
            Object.keys(this.medicineForm).forEach(key => {
              if (this.medicineForm[key] !== null && this.medicineForm[key] !== undefined) {
                formData.append(key, this.medicineForm[key])
              }
            })
            
            // 添加文件
            if (this.imageFileList.length > 0 && this.imageFileList[0].raw) {
              formData.append('imageFile', this.imageFileList[0].raw)
            }
            if (this.instructionFileList.length > 0 && this.instructionFileList[0].raw) {
              formData.append('instructionFile', this.instructionFileList[0].raw)
            }
            
            await addMedicine(formData)
            this.$message.success('药品添加成功')
            
            // 添加到历史记录
            this.addToHistory({
              name: this.medicineForm.name,
              type: this.recognitionResult ? 'image' : 'manual'
            })
            
            // 重置表单
            this.resetForm()
            
            // 跳转到药品列表
            this.$router.push('/medicine/list')
          } catch (error) {
            console.error('添加药品失败:', error)
            this.$message.error('添加药品失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    
    resetForm() {
      this.$refs.medicineForm.resetFields()
      this.imageFileList = []
      this.instructionFileList = []
      this.previewImage = null
      this.recognitionResult = null
      this.showManualForm = false
    },
    
    addToHistory(item) {
      const historyItem = {
        ...item,
        addTime: new Date().toLocaleString()
      }
      
      this.addHistory.unshift(historyItem)
      if (this.addHistory.length > 10) {
        this.addHistory = this.addHistory.slice(0, 10)
      }
      
      // 保存到localStorage
      localStorage.setItem('addHistory', JSON.stringify(this.addHistory))
    },
    
    loadAddHistory() {
      const history = localStorage.getItem('addHistory')
      if (history) {
        this.addHistory = JSON.parse(history)
      }
    },
    
    clearHistory() {
      this.$confirm('确定要清空录入历史吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addHistory = []
        localStorage.removeItem('addHistory')
        this.$message.success('历史记录已清空')
      })
    },
    
    useHistoryItem(item) {
      this.$message.info(`查看药品: ${item.name}`)
      // 这里可以跳转到药品详情页面
    }
  }
}
</script>

<style scoped>
.medicine-add-container {
  padding: 0;
}

.add-card {
  margin-bottom: 20px;
}

.add-content {
  display: flex;
  gap: 30px;
}

.quick-add-area {
  flex: 1;
}

.quick-add-box {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  background-color: #fafafa;
}

.quick-add-header h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 18px;
}

.quick-add-header p {
  color: #666;
  margin-bottom: 20px;
}

.quick-add-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.preview-area {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: white;
}

.preview-image {
  margin-bottom: 15px;
}

.preview-image img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.result-area {
  flex: 1;
  min-width: 300px;
}

.result-content {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: white;
}

.result-content h3 {
  margin-bottom: 15px;
  color: #333;
}

.result-item {
  display: flex;
  margin-bottom: 10px;
}

.result-item label {
  width: 100px;
  color: #666;
}

.result-item span {
  flex: 1;
}

.scan-medicine-container {
  padding: 0;
}

.scan-card {
  margin-bottom: 20px;
}

.scan-content {
  display: flex;
  gap: 30px;
}

.scan-area {
  flex: 1;
}

.scan-box {
  position: relative;
  width: 100%;
  height: 300px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fafafa;
}

.scan-box.scanning {
  border-color: #409EFF;
}

.scan-video,
.scan-canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scan-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.scan-placeholder i {
  font-size: 48px;
  margin-bottom: 10px;
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #409EFF, transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% { top: 0; }
  50% { top: calc(100% - 2px); }
  100% { top: 0; }
}

.scan-controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
}

.scan-result {
  flex: 1;
  min-width: 300px;
}

.result-content {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fff;
}

.result-content h3 {
  margin-bottom: 15px;
  color: #333;
}

.result-item {
  display: flex;
  margin-bottom: 10px;
}

.result-item label {
  width: 80px;
  color: #666;
}

.result-item span {
  flex: 1;
  color: #333;
}

.result-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.result-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  border: 1px dashed #e4e7ed;
  border-radius: 8px;
}

.result-placeholder i {
  font-size: 48px;
  margin-bottom: 10px;
}

.manual-form-card {
  margin-bottom: 20px;
}

.history-card {
  margin-bottom: 20px;
}

.empty-history {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-history i {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-info {
  flex: 1;
}

.history-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.history-detail {
  font-size: 14px;
  color: #666;
}
</style>
