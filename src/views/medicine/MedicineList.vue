<template>
  <div class="medicine-list-container">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="药品名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入药品名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="药品分类">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="库存状态">
          <el-select
            v-model="searchForm.stockStatus"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="正常" value="normal" />
            <el-option label="不足" value="low" />
            <el-option label="过期" value="expired" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="action-buttons">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
          添加药品
        </el-button>
        <el-button type="success" icon="el-icon-camera" @click="handleScan">
          扫码录入
        </el-button>
        <el-button type="warning" icon="el-icon-download" @click="handleExport">
          导出数据
        </el-button>
      </div>
    </el-card>
    
    <!-- 药品列表 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="medicineList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="药品图片" width="80">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.imageUrl || defaultImage"
              :preview-src-list="scope.row.imageUrl ? [scope.row.imageUrl] : []"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 4px"
            >
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="药品名称" min-width="120" />
        
        <el-table-column prop="category" label="分类" width="100">
          <template slot-scope="scope">
            <el-tag size="mini">{{ scope.row.category || '未分类' }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="specification" label="规格" width="100" />
        
        <el-table-column label="库存" width="80">
          <template slot-scope="scope">
            <span :class="{ 'low-stock': scope.row.stock <= 5 }">
              {{ scope.row.stock }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column label="过期日期" width="120">
          <template slot-scope="scope">
            <span :class="{ 'expired': isExpired(scope.row.expiryDate) }">
              {{ scope.row.expiryDate }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag
              :type="getStatusType(scope.row)"
              size="mini"
            >
              {{ getStatusText(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #E6A23C"
              @click="handleUpdateStock(scope.row)"
            >
              库存
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #F56C6C"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑药品对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="medicineForm"
        :model="medicineForm"
        :rules="medicineRules"
        label-width="100px"
      >
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="medicineForm.name" placeholder="请输入药品名称" />
        </el-form-item>
        
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
        
        <el-form-item label="规格" prop="specification">
          <el-input v-model="medicineForm.specification" placeholder="如：10mg*24片" />
        </el-form-item>
        
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="medicineForm.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>
        
        <el-form-item label="库存数量" prop="stock">
          <el-input-number
            v-model="medicineForm.stock"
            :min="0"
            :max="9999"
            placeholder="请输入库存数量"
          />
        </el-form-item>
        
        <el-form-item label="过期日期" prop="expiryDate">
          <el-date-picker
            v-model="medicineForm.expiryDate"
            type="date"
            placeholder="请选择过期日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        
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
      </el-form>
      
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ submitLoading ? '提交中...' : '确定' }}
        </el-button>
      </div>
    </el-dialog>
    
    <!-- 库存更新对话框 -->
    <el-dialog
      title="更新库存"
      :visible.sync="stockDialogVisible"
      width="400px"
    >
      <el-form ref="stockForm" :model="stockForm" label-width="100px">
        <el-form-item label="当前库存">
          <span>{{ currentMedicine.stock }}</span>
        </el-form-item>
        
        <el-form-item label="操作类型">
          <el-radio-group v-model="stockForm.type">
            <el-radio label="add">增加</el-radio>
            <el-radio label="reduce">减少</el-radio>
            <el-radio label="set">设置</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="数量">
          <el-input-number
            v-model="stockForm.quantity"
            :min="0"
            :max="9999"
            placeholder="请输入数量"
          />
        </el-form-item>
      </el-form>
      
      <div slot="footer">
        <el-button @click="stockDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="stockLoading" @click="handleStockSubmit">
          {{ stockLoading ? '更新中...' : '确定' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMedicineList, addMedicine, updateMedicine, deleteMedicine, updateStock } from '@/api/medicine'

export default {
  name: 'MedicineList',
  data() {
    return {
      loading: false,
      submitLoading: false,
      stockLoading: false,
      searchForm: {
        name: '',
        category: '',
        stockStatus: ''
      },
      medicineList: [],
      selectedMedicines: [],
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      categories: [
        { label: '感冒药', value: 'cold' },
        { label: '消炎药', value: 'anti-inflammatory' },
        { label: '止痛药', value: 'painkiller' },
        { label: '维生素', value: 'vitamin' },
        { label: '中药', value: 'chinese' },
        { label: '其他', value: 'other' }
      ],
      dialogVisible: false,
      dialogTitle: '添加药品',
      medicineForm: {
        id: null,
        name: '',
        category: '',
        specification: '',
        manufacturer: '',
        stock: 0,
        expiryDate: '',
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
      stockDialogVisible: false,
      currentMedicine: {},
      stockForm: {
        type: 'add',
        quantity: 0
      },
      defaultImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNjY4Ii8+CjxwYXRoIGQ9Ik0yNSAzMUMyOC4zMTM3IDMxIDMxIDI4LjMxMzcgMzEgMjVDMzEgMjEuNjg2MyAyOC4zMTM3IDE5IDI1IDE5QzIxLjY4NjMgMTkgMTkgMjEuNjg2MyAxOSAyNUMxOSAyOC4zMTM3IDIxLjY4NjMgMzEgMjUgMzFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
    }
  },
  mounted() {
    this.loadMedicineList()
  },
  methods: {
    async loadMedicineList() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          size: this.pagination.size,
          ...this.searchForm
        }
        const response = await getMedicineList(params)
        this.medicineList = response.data.records || response.data
        this.pagination.total = response.data.total || this.medicineList.length
      } catch (error) {
        console.error('加载药品列表失败:', error)
        this.$message.error('加载药品列表失败')
      } finally {
        this.loading = false
      }
    },
    
    handleSearch() {
      this.pagination.page = 1
      this.loadMedicineList()
    },
    
    handleReset() {
      this.searchForm = {
        name: '',
        category: '',
        stockStatus: ''
      }
      this.handleSearch()
    },
    
    handleAdd() {
      this.dialogTitle = '添加药品'
      this.medicineForm = {
        id: null,
        name: '',
        category: '',
        specification: '',
        manufacturer: '',
        stock: 0,
        expiryDate: '',
        remark: ''
      }
      this.imageFileList = []
      this.instructionFileList = []
      this.dialogVisible = true
    },
    
    handleEdit(row) {
      this.dialogTitle = '编辑药品'
      this.medicineForm = { ...row }
      this.imageFileList = row.imageUrl ? [{ name: '药品图片', url: row.imageUrl }] : []
      this.instructionFileList = row.instructionUrl ? [{ name: '说明书', url: row.instructionUrl }] : []
      this.dialogVisible = true
    },
    
    handleView(row) {
      this.$router.push(`/medicine/detail/${row.id}`)
    },
    
    handleScan() {
      this.$router.push('/medicine/scan')
    },
    
    handleExport() {
      this.$message.info('导出功能开发中...')
    },
    
    handleDelete(row) {
      this.$confirm(`确定要删除药品 "${row.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteMedicine(row.id)
          this.$message.success('删除成功')
          this.loadMedicineList()
        } catch (error) {
          console.error('删除药品失败:', error)
          this.$message.error('删除药品失败')
        }
      }).catch(() => {
        // 用户取消
      })
    },
    
    handleUpdateStock(row) {
      this.currentMedicine = row
      this.stockForm = {
        type: 'add',
        quantity: 0
      }
      this.stockDialogVisible = true
    },
    
    handleSelectionChange(selection) {
      this.selectedMedicines = selection
    },
    
    handleSizeChange(size) {
      this.pagination.size = size
      this.loadMedicineList()
    },
    
    handleCurrentChange(page) {
      this.pagination.page = page
      this.loadMedicineList()
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
    
    handleDialogClose() {
      this.$refs.medicineForm.resetFields()
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
            
            if (this.medicineForm.id) {
              await updateMedicine(formData)
              this.$message.success('更新成功')
            } else {
              await addMedicine(formData)
              this.$message.success('添加成功')
            }
            
            this.dialogVisible = false
            this.loadMedicineList()
          } catch (error) {
            console.error('保存药品失败:', error)
            this.$message.error('保存药品失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    
    async handleStockSubmit() {
      if (this.stockForm.quantity === 0) {
        this.$message.warning('请输入数量')
        return
      }
      
      this.stockLoading = true
      try {
        let quantity = this.stockForm.quantity
        if (this.stockForm.type === 'reduce') {
          quantity = -quantity
        } else if (this.stockForm.type === 'set') {
          quantity = quantity - this.currentMedicine.stock
        }
        
        await updateStock(this.currentMedicine.id, quantity)
        this.$message.success('库存更新成功')
        this.stockDialogVisible = false
        this.loadMedicineList()
      } catch (error) {
        console.error('更新库存失败:', error)
        this.$message.error('更新库存失败')
      } finally {
        this.stockLoading = false
      }
    },
    
    isExpired(expiryDate) {
      return new Date(expiryDate) < new Date()
    },
    
    getStatusType(medicine) {
      if (this.isExpired(medicine.expiryDate)) return 'danger'
      if (medicine.stock <= 5) return 'warning'
      return 'success'
    },
    
    getStatusText(medicine) {
      if (this.isExpired(medicine.expiryDate)) return '已过期'
      if (medicine.stock <= 5) return '库存不足'
      return '正常'
    }
  }
}
</script>

<style scoped>
.medicine-list-container {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  color: #999;
  font-size: 20px;
}

.low-stock {
  color: #E6A23C;
  font-weight: bold;
}

.expired {
  color: #F56C6C;
  font-weight: bold;
}
</style>
