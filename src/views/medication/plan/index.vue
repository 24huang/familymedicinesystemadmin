<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-search"></i> 筛选查询</span>
      </div>
      <el-form :inline="true" :model="queryParams" size="small">
        <el-form-item label="户主ID">
          <el-input v-model="queryParams.householdId" placeholder="请输入户主ID" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="家庭成员">
          <el-select v-model="queryParams.memberId" placeholder="请选择成员" clearable filterable>
            <el-option
              v-for="item in memberList"
              :key="item.memberId"
              :label="item.name"
              :value="item.memberId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="药品名称">
          <el-input v-model="queryParams.drugName" placeholder="请输入药品名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-tickets"></i> 用药计划列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="handleAdd">新增计划</el-button>
      </div>
      
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="planId" label="ID" width="60" align="center" />
        <el-table-column prop="memberId" label="成员ID" width="80" align="center" />
        <el-table-column label="成员姓名" width="100" align="center">
          <template slot-scope="scope">
             <!-- 如果后端没返回 memberName，需要前端关联，但通常后端会返回或者我们只显示ID。文档示例里列表没有 memberName，只有 memberId。
                  不过文档里 Record 列表有 memberName。Plan 列表示例里没有。
                  我可以尝试从 memberList 中匹配显示，或者直接显示 ID。为了美观，尝试匹配。 -->
             {{ getMemberName(scope.row.memberId) }}
          </template>
        </el-table-column>
        <el-table-column prop="drugName" label="药品名称" min-width="120" align="center" />
        <el-table-column label="服药周期" min-width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.startDate }} 至 {{ scope.row.endDate || '长期' }}
          </template>
        </el-table-column>
        <el-table-column label="频次/时间" min-width="200" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag size="mini" type="info">{{ ['每日', '隔日', '每周', '必要时'][scope.row.frequencyType] }}</el-tag>
              <div v-if="scope.row.frequencyType !== 3" style="margin-top: 5px">
                <el-tag 
                  v-for="(time, index) in scope.row.times" 
                  :key="index" 
                  size="mini" 
                  style="margin-right: 5px"
                >
                  {{ time }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dosage" label="每次用量" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="statusType(scope.row.status)">
              {{ statusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              class="text-danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="queryParams.current"
          :page-size.sync="queryParams.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <plan-dialog ref="planDialog" @refresh="getList" />
  </div>
</template>

<script>
// 导入用药计划相关API接口
import { getPlanPage, deletePlan } from '@/api/medication'
// 导入家庭成员API接口（用于显示成员姓名）
import { getMemberPage } from '@/api/member'
// 导入用药计划对话框组件（新增/编辑）
import PlanDialog from './components/PlanDialog'

export default {
  name: 'MedicationPlan',
  components: { PlanDialog },
  data() {
    return {
      loading: false, // 表格加载状态
      tableData: [], // 用药计划列表数据
      total: 0, // 总记录数
      memberList: [], // 家庭成员列表（用于显示姓名）
      queryParams: {
        current: 1, // 当前页码
        size: 10, // 每页显示条数
        householdId: undefined, // 户主ID筛选条件
        memberId: undefined, // 成员ID筛选条件
        drugName: '' // 药品名称筛选条件
      }
    }
  },
  created() {
    // 页面创建时加载成员列表和计划列表
    this.loadMembers()
    this.getList()
  },
  methods: {
    /**
     * 解析用药计划的时间配置
     * 支持两种格式：
     * 1. 直接是数组: ["08:00", "12:00"]
     * 2. JSON对象: {"times": ["08:00", "12:00"]}
     * 3. JSON字符串: '{"times": [...]}' 或 '[...]'
     * @param {Object} row - 计划行数据
     * @returns {Array} 时间点数组
     */
    parseTimes(row) {
      // 如果已经是数组，直接返回
      if (row && Array.isArray(row.times)) {
        return row.times
      }
      const raw = row && row.frequencyDetail
      if (!raw || typeof raw !== 'string') {
        return []
      }
      const text = raw.trim()
      if (!text) return []
      try {
        // 尝试解析JSON对象格式
        if (text.startsWith('{')) {
          const obj = JSON.parse(text)
          if (obj && Array.isArray(obj.times)) return obj.times
          return []
        }
        // 尝试解析JSON数组格式
        if (text.startsWith('[')) {
          const arr = JSON.parse(text)
          return Array.isArray(arr) ? arr : []
        }
      } catch (e) {
        return []
      }
      return []
    },
    /**
     * 加载家庭成员列表
     * 用于在表格中显示成员姓名而非ID
     */
    loadMembers() {
      getMemberPage({ current: 1, size: 100 }).then(res => {
        this.memberList = res.data.records
      })
    },
    /**
     * 根据成员ID获取成员姓名
     * @param {Number} id - 成员ID
     * @returns {String|Number} 成员姓名，找不到则返回ID
     */
    getMemberName(id) {
      const member = this.memberList.find(item => item.memberId === id)
      return member ? member.name : id
    },
    /**
     * 获取用药计划列表数据
     * 调用API并解析时间配置
     */
    getList() {
      this.loading = true
      getPlanPage(this.queryParams).then(res => {
        const records = (res.data && res.data.records) ? res.data.records : []
        // 为每条记录解析时间配置
        this.tableData = records.map(item => ({
          ...item,
          times: this.parseTimes(item)
        }))
        this.total = res.data.total
      }).catch(err => {
        console.error('获取用药计划失败:', err)
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 执行查询操作
     * 重置到第一页并重新加载数据
     */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /**
     * 重置查询条件
     * 清空所有筛选条件并重新查询
     */
    resetQuery() {
      this.queryParams.householdId = undefined
      this.queryParams.memberId = undefined
      this.queryParams.drugName = ''
      this.handleQuery()
    },
    /**
     * 打开新增用药计划对话框
     */
    handleAdd() {
      this.$refs.planDialog.open('新增用药计划')
    },
    /**
     * 打开编辑用药计划对话框
     * @param {Object} row - 要编辑的计划行数据
     */
    handleUpdate(row) {
      this.$refs.planDialog.open('编辑用药计划', row)
    },
    /**
     * 删除用药计划
     * 显示确认对话框，确认后调用删除API
     * @param {Object} row - 要删除的计划行数据
     */
    handleDelete(row) {
      this.$confirm('有已服、已跳过或过往日期记录的计划将停止并保留历史，只取消今天及未来待服任务；没有历史的计划才会删除。确认继续？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deletePlan(row.planId)
      }).then(res => {
        this.$message.success(res.message || '处理成功')
        this.getList()
      }).catch(() => {})
    },
    /**
     * 处理每页显示条数变化
     * @param {Number} val - 新的每页显示条数
     */
    handleSizeChange(val) {
      this.queryParams.size = val
      this.getList()
    },
    /**
     * 处理页码变化
     * @param {Number} val - 新的页码
     */
    handleCurrentChange(val) {
      this.queryParams.current = val
      this.getList()
    },
    /**
     * 获取计划状态的标签类型
     * @param {Number} status - 状态码（0-进行中，1-已完成，2-已停止）
     * @returns {String} Element UI标签类型
     */
    statusType(status) {
      const map = {
        0: 'success',
        1: 'info',
        2: 'danger'
      }
      return map[status] || 'info'
    },
    /**
     * 获取计划状态的文本显示
     * @param {Number} status - 状态码
     * @returns {String} 状态文本
     */
    statusText(status) {
      const map = {
        0: '进行中',
        1: '已完成',
        2: '已停止'
      }
      return map[status] || '未知'
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.text-danger {
  color: #F56C6C;
}
</style>
