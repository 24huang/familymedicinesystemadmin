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
        <el-descriptions-item label="剂型">{{ drug.form || '-' }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ drug.spec || '-' }}</el-descriptions-item>
        <el-descriptions-item label="保质期">{{ drug.shelfLife ? drug.shelfLife + '个月' : '-' }}</el-descriptions-item>
        <el-descriptions-item label="生产厂家">{{ drug.manufacturer || '-' }}</el-descriptions-item>
        <el-descriptions-item label="批准文号">{{ drug.approvalNumber || '-' }}</el-descriptions-item>
        <el-descriptions-item label="当前库存">{{ drug.stock }}</el-descriptions-item>
        <el-descriptions-item label="用法">{{ drug.usageType === 0 ? '内服' : (drug.usageType === 1 ? '外用' : '-') }}</el-descriptions-item>
        <el-descriptions-item label="主要成分" :span="2">{{ drug.mainIngredient || '-' }}</el-descriptions-item>
        <el-descriptions-item label="说明书" :span="2">
          <a v-if="drug.instructionUrl" :href="drug.instructionUrl" target="_blank" style="color: #409EFF">查看说明书</a>
          <span v-else>暂无</span>
        </el-descriptions-item>
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
  gap: 24px;
  margin-bottom: 28px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.06), rgba(25, 198, 210, 0.04));
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.detail-image {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.08);
}
.detail-info {
  flex: 1;
}
.detail-info h3 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0.5px;
}
.common-name {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 0 12px 0;
}
.tags {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}
.price {
  font-size: 28px;
  color: #f56c6c;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 24px;
}
.usage-text {
  line-height: 1.8;
  color: var(--text-regular);
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.05), rgba(25, 198, 210, 0.03));
  border-radius: 8px;
  border-left: 3px solid rgba(64, 158, 255, 0.4);
  margin-top: 8px;
}

/* 深色主题适配 */
::v-deep .dark-theme .el-descriptions {
  background-color: var(--card-bg) !important;
}

::v-deep .dark-theme .el-descriptions-item__label {
  background-color: var(--bg-secondary) !important;
  color: var(--text-regular) !important;
}

::v-deep .dark-theme .el-descriptions-item__content {
  color: var(--text-primary) !important;
}

::v-deep .dark-theme .el-descriptions__body td {
  border-color: var(--border-color) !important;
  background-color: var(--card-bg) !important;
}

::v-deep .dark-theme .el-divider {
  border-color: var(--border-color);
}

::v-deep .dark-theme .el-divider__text {
  background-color: var(--card-bg);
  color: var(--text-primary);
}

::v-deep .dark-theme .el-dialog {
  background-color: var(--card-bg);
}

::v-deep .dark-theme .el-dialog__header {
  border-bottom-color: var(--border-color);
}

::v-deep .dark-theme .el-dialog__title {
  color: var(--text-primary);
}
</style>
