<template>
  <el-dialog
    title="药品详情"
    :visible.sync="visible"
    width="700px"
    append-to-body
  >
    <div class="detail-container" v-loading="loading">
      <div class="detail-header">
        <el-image
          class="detail-image"
          :src="drug.imageUrl"
          :preview-src-list="[drug.imageUrl]"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div class="detail-info">
          <h3>{{ drug.tradeName }}</h3>
          <p class="common-name">{{ drug.name }}</p>
          <div class="tags">
            <el-tag size="small" effect="dark">{{ drug.categoryName || drug.categoryId }}</el-tag>
            <el-tag size="small" :type="drug.categoryType === 0 ? 'danger' : 'success'">{{ drug.categoryType === 0 ? 'Rx' : 'OTC' }}</el-tag>
            <el-tag size="small" :type="drug.status === 1 ? 'success' : 'warning'">{{ drug.status === 1 ? '已上架' : '待审核' }}</el-tag>
          </div>
          <div class="price">￥{{ drug.price }}</div>
        </div>
      </div>

      <el-divider content-position="left">基本信息</el-divider>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="条形码">{{ drug.barCode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ drug.spec || '-' }}</el-descriptions-item>
        <el-descriptions-item label="包装">{{ drug.package || '-' }}</el-descriptions-item>
        <el-descriptions-item label="有效期">{{ drug.validity || '-' }}</el-descriptions-item>
        <el-descriptions-item label="生产厂家">{{ drug.manufacturer || '-' }}</el-descriptions-item>
        <el-descriptions-item label="批准文号">{{ drug.approvalNumber || '-' }}</el-descriptions-item>
        <el-descriptions-item label="当前库存">{{ drug.stock }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ drug.updateTime || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">用法用量 / 描述</el-divider>
      <div class="usage-text">{{ drug.description || drug.usageDosage || '暂无说明' }}</div>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDrugDetail } from '@/api/drug'

export default {
  name: 'DrugDetailDialog',
  data() {
    return {
      visible: false,
      loading: false,
      drug: {}
    }
  },
  methods: {
    open(id) {
      this.visible = true
      this.loadDetail(id)
    },
    loadDetail(id) {
      this.loading = true
      getDrugDetail(id).then(res => {
        this.drug = res.data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.detail-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  flex-shrink: 0;
}
.detail-info {
  flex: 1;
}
.detail-info h3 {
  margin: 0 0 5px 0;
  font-size: 20px;
  color: #303133;
}
.common-name {
  color: #909399;
  font-size: 14px;
  margin: 0 0 10px 0;
}
.tags {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}
.price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 24px;
}
.usage-text {
  line-height: 1.6;
  color: #606266;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}
</style>
