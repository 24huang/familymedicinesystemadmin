<template>
  <div class="scan-medicine-container">
    <el-card class="scan-card">
      <div slot="header">
        <span>扫码录入药品</span>
      </div>
      
      <div class="scan-content">
        <!-- 扫码区域 -->
        <div class="scan-area">
          <div class="scan-box" :class="{ scanning: isScanning }">
            <video
              ref="video"
              class="scan-video"
              :style="{ display: showVideo ? 'block' : 'none' }"
            />
            <canvas
              ref="canvas"
              class="scan-canvas"
              :style="{ display: showVideo ? 'none' : 'block' }"
            />
            
            <div v-if="!showVideo" class="scan-placeholder">
              <i class="el-icon-camera"></i>
              <p>点击下方按钮开始扫码</p>
            </div>
            
            <div v-if="isScanning" class="scan-overlay">
              <div class="scan-line"></div>
            </div>
          </div>
          
          <div class="scan-controls">
            <el-button
              type="primary"
              :icon="showVideo ? 'el-icon-video-camera' : 'el-icon-camera'"
              :loading="isScanning"
              @click="toggleScan"
            >
              {{ showVideo ? '停止扫码' : '开始扫码' }}
            </el-button>
            
            <el-button
              type="success"
              icon="el-icon-upload"
              @click="handleFileUpload"
            >
              上传图片
            </el-button>
            
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileChange"
            />
          </div>
        </div>
        
        <!-- 扫码结果 -->
        <div class="scan-result">
          <div v-if="scanResult" class="result-content">
            <h3>扫码结果</h3>
            <div class="result-info">
              <div class="result-item">
                <label>药品名称：</label>
                <span>{{ scanResult.name || '未识别' }}</span>
              </div>
              <div class="result-item">
                <label>条形码：</label>
                <span>{{ scanResult.barcode || '未识别' }}</span>
              </div>
              <div class="result-item">
                <label>二维码：</label>
                <span>{{ scanResult.qrCode || '未识别' }}</span>
              </div>
            </div>
            
            <div class="result-actions">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="handleAddMedicine"
              >
                添加到药品库
              </el-button>
              <el-button
                icon="el-icon-refresh"
                @click="resetScan"
              >
                重新扫码
              </el-button>
            </div>
          </div>
          
          <div v-else class="result-placeholder">
            <i class="el-icon-document"></i>
            <p>扫码结果将显示在这里</p>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 手动录入表单 -->
    <el-card v-if="showManualForm" class="manual-form-card">
      <div slot="header">
        <span>手动录入药品信息</span>
      </div>
      
      <el-form
        ref="manualForm"
        :model="manualForm"
        :rules="manualRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="药品名称" prop="name">
              <el-input v-model="manualForm.name" placeholder="请输入药品名称" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="药品分类" prop="category">
              <el-select v-model="manualForm.category" placeholder="请选择分类">
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
              <el-input v-model="manualForm.specification" placeholder="如：10mg*24片" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input v-model="manualForm.manufacturer" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="库存数量" prop="stock">
              <el-input-number
                v-model="manualForm.stock"
                :min="0"
                :max="9999"
                placeholder="请输入库存数量"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="过期日期" prop="expiryDate">
              <el-date-picker
                v-model="manualForm.expiryDate"
                type="date"
                placeholder="请选择过期日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="条形码">
              <el-input v-model="manualForm.barcode" placeholder="扫码自动填充" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注">
          <el-input
            v-model="manualForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="handleManualSubmit">
            {{ submitLoading ? '提交中...' : '保存药品' }}
          </el-button>
          <el-button @click="resetManualForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 扫码历史 -->
    <el-card class="history-card">
      <div slot="header">
        <span>最近扫码记录</span>
        <el-button type="text" @click="clearHistory">清空历史</el-button>
      </div>
      
      <div v-if="scanHistory.length === 0" class="empty-history">
        <i class="el-icon-time"></i>
        <p>暂无扫码记录</p>
      </div>
      
      <div v-else class="history-list">
        <div
          v-for="(item, index) in scanHistory"
          :key="index"
          class="history-item"
        >
          <div class="history-info">
            <div class="history-name">{{ item.name || '未知药品' }}</div>
            <div class="history-detail">
              {{ item.scanTime }} · {{ item.type === 'qr' ? '二维码' : '条形码' }}
            </div>
          </div>
          <el-button
            type="text"
            size="small"
            @click="useHistoryItem(item)"
          >
            使用此信息
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { scanAddMedicine, addMedicine } from '@/api/medicine'

export default {
  name: 'ScanMedicine',
  data() {
    return {
      isScanning: false,
      showVideo: false,
      scanResult: null,
      showManualForm: false,
      submitLoading: false,
      categories: [
        { label: '感冒药', value: 'cold' },
        { label: '消炎药', value: 'anti-inflammatory' },
        { label: '止痛药', value: 'painkiller' },
        { label: '维生素', value: 'vitamin' },
        { label: '中药', value: 'chinese' },
        { label: '其他', value: 'other' }
      ],
      manualForm: {
        name: '',
        category: '',
        specification: '',
        manufacturer: '',
        stock: 1,
        expiryDate: '',
        barcode: '',
        qrCode: '',
        remark: ''
      },
      manualRules: {
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
      scanHistory: []
    }
  },
  mounted() {
    this.loadScanHistory()
  },
  beforeDestroy() {
    this.stopScan()
  },
  methods: {
    async toggleScan() {
      if (this.showVideo) {
        this.stopScan()
      } else {
        await this.startScan()
      }
    },
    
    async startScan() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        
        this.$refs.video.srcObject = stream
        this.showVideo = true
        this.isScanning = true
        
        // 开始扫码检测
        this.startScanDetection()
      } catch (error) {
        console.error('无法访问摄像头:', error)
        this.$message.error('无法访问摄像头，请检查权限设置')
      }
    },
    
    stopScan() {
      if (this.$refs.video && this.$refs.video.srcObject) {
        const stream = this.$refs.video.srcObject
        stream.getTracks().forEach(track => track.stop())
        this.$refs.video.srcObject = null
      }
      
      this.showVideo = false
      this.isScanning = false
    },
    
    startScanDetection() {
      // 模拟扫码检测（实际项目中需要集成扫码库）
      const detectInterval = setInterval(() => {
        if (!this.isScanning) {
          clearInterval(detectInterval)
          return
        }
        
        // 模拟扫码成功
        if (Math.random() > 0.95) {
          this.handleScanSuccess({
            type: 'barcode',
            value: '1234567890123',
            name: '阿莫西林胶囊'
          })
          clearInterval(detectInterval)
        }
      }, 1000)
    },
    
    handleScanSuccess(result) {
      this.scanResult = {
        type: result.type,
        barcode: result.type === 'barcode' ? result.value : '',
        qrCode: result.type === 'qr' ? result.value : '',
        name: result.name
      }
      
      // 添加到历史记录
      this.addToHistory(result)
      
      // 停止扫码
      this.stopScan()
      
      // 显示手动录入表单
      this.showManualForm = true
      this.fillManualForm(result)
    },
    
    handleFileUpload() {
      this.$refs.fileInput.click()
    },
    
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.processImageFile(file)
      }
    },
    
    async processImageFile(file) {
      try {
        // 创建图片预览
        const reader = new FileReader()
        reader.onload = (e) => {
          this.$refs.canvas.width = 300
          this.$refs.canvas.height = 200
          const ctx = this.$refs.canvas.getContext('2d')
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0, 300, 200)
          }
          img.src = e.target.result
        }
        reader.readAsDataURL(file)
        
        // 模拟图片识别
        setTimeout(() => {
          this.handleScanSuccess({
            type: 'qr',
            value: 'QR_CODE_' + Date.now(),
            name: '布洛芬缓释胶囊'
          })
        }, 2000)
        
      } catch (error) {
        console.error('处理图片失败:', error)
        this.$message.error('图片处理失败')
      }
    },
    
    handleAddMedicine() {
      this.showManualForm = true
      this.fillManualForm(this.scanResult)
    },
    
    fillManualForm(result) {
      this.manualForm = {
        ...this.manualForm,
        name: result.name || '',
        barcode: result.barcode || '',
        qrCode: result.qrCode || ''
      }
    },
    
    async handleManualSubmit() {
      this.$refs.manualForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            const formData = new FormData()
            Object.keys(this.manualForm).forEach(key => {
              if (this.manualForm[key] !== null && this.manualForm[key] !== undefined) {
                formData.append(key, this.manualForm[key])
              }
            })
            
            await addMedicine(formData)
            this.$message.success('药品添加成功')
            
            // 重置表单
            this.resetManualForm()
            this.resetScan()
            
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
    
    resetScan() {
      this.scanResult = null
      this.stopScan()
    },
    
    resetManualForm() {
      this.$refs.manualForm.resetFields()
      this.showManualForm = false
    },
    
    addToHistory(result) {
      const historyItem = {
        ...result,
        scanTime: new Date().toLocaleString()
      }
      
      this.scanHistory.unshift(historyItem)
      if (this.scanHistory.length > 10) {
        this.scanHistory = this.scanHistory.slice(0, 10)
      }
      
      // 保存到localStorage
      localStorage.setItem('scanHistory', JSON.stringify(this.scanHistory))
    },
    
    loadScanHistory() {
      const history = localStorage.getItem('scanHistory')
      if (history) {
        this.scanHistory = JSON.parse(history)
      }
    },
    
    clearHistory() {
      this.$confirm('确定要清空扫码历史吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.scanHistory = []
        localStorage.removeItem('scanHistory')
        this.$message.success('历史记录已清空')
      })
    },
    
    useHistoryItem(item) {
      this.fillManualForm(item)
      this.showManualForm = true
    }
  }
}
</script>

<style scoped>
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
