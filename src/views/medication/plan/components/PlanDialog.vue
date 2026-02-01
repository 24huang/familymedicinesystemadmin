<template>
  <el-dialog :title="title" :visible.sync="visible" width="600px" append-to-body @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="家庭成员" prop="memberId">
        <el-select
          v-model="form.memberId"
          filterable
          placeholder="请选择家庭成员"
          style="width: 100%"
        >
          <el-option
            v-for="item in memberList"
            :key="item.memberId"
            :label="item.name"
            :value="item.memberId"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="药品" prop="drugId">
        <el-select
          v-model="form.drugId"
          filterable
          remote
          :remote-method="searchDrugs"
          :loading="drugLoading"
          placeholder="请输入药品名称搜索"
          style="width: 100%"
          @change="handleDrugChange"
        >
          <el-option
            v-for="item in drugList"
            :key="item.drugId"
            :label="item.name"
            :value="item.drugId"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.spec }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="服药周期" required>
        <el-col :span="11">
          <el-form-item prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line" style="text-align: center">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="频次类型" prop="frequencyType">
        <el-radio-group v-model="form.frequencyType">
          <el-radio :label="0">每日</el-radio>
          <!-- 暂时只支持每日，文档中 frequencyType: 0-每日 -->
        </el-radio-group>
      </el-form-item>

      <el-form-item label="服药时间" required>
        <div v-for="(time, index) in form.times" :key="index" style="margin-bottom: 10px; display: flex; align-items: center;">
          <el-time-picker
            v-model="form.times[index]"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间"
            style="width: 160px; margin-right: 10px;"
          />
          <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="removeTime(index)" v-if="form.times.length > 1"></el-button>
          <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addTime" v-if="index === form.times.length - 1"></el-button>
        </div>
        <div v-if="form.times.length === 0">
          <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addTime"></el-button>
        </div>
      </el-form-item>

      <el-form-item label="每次用量" prop="dosage">
        <el-input v-model="form.dosage" placeholder="例如：1袋, 2粒" />
      </el-form-item>

      <el-form-item label="总数量" prop="totalQuantity">
        <el-input-number v-model="form.totalQuantity" :min="1" label="总数量" style="width: 100%"></el-input-number>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="例如：饭后服用" />
      </el-form-item>
      
      <el-form-item label="状态" prop="status" v-if="form.planId">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">进行中</el-radio>
          <el-radio :label="2">已停止</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addPlan, updatePlan } from '@/api/medication'
import { getMemberPage } from '@/api/member'
import { getDrugPage } from '@/api/drug'

export default {
  name: 'PlanDialog',
  data() {
    return {
      title: '',
      visible: false,
      submitLoading: false,
      memberList: [],
      drugList: [],
      drugLoading: false,
      form: {
        planId: undefined,
        memberId: undefined,
        drugId: undefined,
        drugName: '',
        startDate: '',
        endDate: '',
        frequencyType: 0,
        times: ['08:00'],
        dosage: '',
        totalQuantity: undefined,
        remark: '',
        status: 0
      },
      rules: {
        memberId: [{ required: true, message: '请选择家庭成员', trigger: 'change' }],
        drugId: [{ required: true, message: '请选择药品', trigger: 'change' }],
        startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
        dosage: [{ required: true, message: '请输入每次用量', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open(title, row) {
      this.title = title
      this.visible = true
      this.reset()
      this.loadMembers()
      
      if (row) {
        // 编辑模式
        this.form = {
          planId: row.planId,
          memberId: row.memberId,
          drugId: row.drugId,
          drugName: row.drugName,
          startDate: row.startDate,
          endDate: row.endDate,
          frequencyType: row.frequencyType,
          times: row.times || ['08:00'], // 直接使用 times 数组
          dosage: row.dosage,
          totalQuantity: row.totalQuantity,
          remark: row.remark,
          status: row.status
        }
        
        // 预加载当前药品以便显示
        this.drugList = [{
          drugId: row.drugId,
          name: row.drugName,
          spec: '' // 列表可能没有规格，暂时留空
        }]
      } else {
        // 新增模式
        this.form.times = ['08:00']
      }
    },
    close() {
      this.visible = false
      this.reset()
    },
    reset() {
      this.form = {
        planId: undefined,
        memberId: undefined,
        drugId: undefined,
        drugName: '',
        startDate: '',
        endDate: '',
        frequencyType: 0,
        times: ['08:00'],
        dosage: '',
        totalQuantity: undefined,
        remark: '',
        status: 0
      }
      this.drugList = []
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
    },
    loadMembers() {
      getMemberPage({ current: 1, size: 100 }).then(res => {
        this.memberList = res.data.records
      })
    },
    searchDrugs(query) {
      if (query !== '') {
        this.drugLoading = true
        getDrugPage({ page: 1, pageSize: 20, keyword: query }).then(res => {
          this.drugList = res.data.records
          this.drugLoading = false
        })
      } else {
        this.drugList = []
      }
    },
    handleDrugChange(val) {
      const drug = this.drugList.find(item => item.drugId === val)
      if (drug) {
        this.form.drugName = drug.name
      }
    },
    addTime() {
      this.form.times.push('08:00')
    },
    removeTime(index) {
      this.form.times.splice(index, 1)
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.times || this.form.times.length === 0) {
            this.$message.warning('请至少添加一个服药时间')
            return
          }
          
          this.submitLoading = true
          const req = this.form.planId ? updatePlan : addPlan
          
          req(this.form).then(() => {
            this.$message.success(this.form.planId ? '修改成功' : '新增成功')
            this.visible = false
            this.$emit('refresh')
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
