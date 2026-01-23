<template>
  <div class="calendar-container">
    <el-card class="calendar-card">
      <div slot="header" class="calendar-header">
        <div class="header-left">
          <el-button-group>
            <el-button
              icon="el-icon-arrow-left"
              @click="prevMonth"
            />
            <el-button
              icon="el-icon-arrow-right"
              @click="nextMonth"
            />
          </el-button-group>
          <span class="current-month">{{ currentMonth }}</span>
        </div>
        
        <div class="header-right">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAddPlan"
          >
            添加提醒
          </el-button>
          <el-button
            type="success"
            icon="el-icon-refresh"
            @click="loadCalendarData"
          >
            刷新
          </el-button>
        </div>
      </div>
      
      <!-- 日历视图 -->
      <div class="calendar-view">
        <div class="weekdays">
          <div
            v-for="day in weekdays"
            :key="day"
            class="weekday"
          >
            {{ day }}
          </div>
        </div>
        
        <div class="calendar-grid">
          <div
            v-for="(date, index) in calendarDates"
            :key="index"
            class="calendar-date"
            :class="getDateClass(date)"
            @click="handleDateClick(date)"
          >
            <div class="date-number">{{ date.day }}</div>
            <div class="date-indicators">
              <div
                v-for="reminder in date.reminders"
                :key="reminder.id"
                class="reminder-dot"
                :class="getReminderClass(reminder)"
                :title="reminder.medicineName"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 选中日期的提醒列表 -->
    <el-card v-if="selectedDate" class="reminders-card">
      <div slot="header">
        <span>{{ selectedDateText }} 的用药提醒</span>
        <el-button
          type="text"
          icon="el-icon-close"
          @click="selectedDate = null"
        />
      </div>
      
      <div v-if="selectedReminders.length === 0" class="empty-reminders">
        <i class="el-icon-date"></i>
        <p>该日期暂无用药提醒</p>
      </div>
      
      <div v-else class="reminders-list">
        <div
          v-for="reminder in selectedReminders"
          :key="reminder.id"
          class="reminder-item"
          :class="{ completed: reminder.status === 2 }"
        >
          <div class="reminder-time">
            <i class="el-icon-time"></i>
            {{ reminder.time }}
          </div>
          
          <div class="reminder-content">
            <div class="reminder-medicine">{{ reminder.medicineName }}</div>
            <div class="reminder-detail">
              {{ reminder.familyMemberName }} · {{ reminder.dosage }}
              <el-tag
                :type="reminder.status === 2 ? 'success' : 'warning'"
                size="mini"
              >
                {{ reminder.status === 2 ? '已服用' : '待服用' }}
              </el-tag>
            </div>
          </div>
          
          <div class="reminder-actions">
            <el-button
              v-if="reminder.status === 1 && isToday(reminder.date)"
              type="primary"
              size="mini"
              @click="confirmMedication(reminder.id)"
            >
              确认服用
            </el-button>
            
            <el-dropdown @command="handleReminderCommand">
              <el-button type="text" size="mini">
                <i class="el-icon-more"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ action: 'edit', reminder }">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item :command="{ action: 'delete', reminder }">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 添加/编辑提醒对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="reminderForm"
        :model="reminderForm"
        :rules="reminderRules"
        label-width="100px"
      >
        <el-form-item label="家庭成员" prop="familyMemberId">
          <el-select
            v-model="reminderForm.familyMemberId"
            placeholder="请选择家庭成员"
            style="width: 100%"
          >
            <el-option
              v-for="member in familyMembers"
              :key="member.id"
              :label="member.name"
              :value="member.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="药品" prop="medicineId">
          <el-select
            v-model="reminderForm.medicineId"
            placeholder="请选择药品"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="medicine in medicines"
              :key="medicine.id"
              :label="medicine.name"
              :value="medicine.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="用药日期" prop="date">
          <el-date-picker
            v-model="reminderForm.date"
            type="date"
            placeholder="请选择用药日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="用药时间" prop="time">
          <el-time-picker
            v-model="reminderForm.time"
            placeholder="请选择用药时间"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="用药剂量" prop="dosage">
          <el-input
            v-model="reminderForm.dosage"
            placeholder="如：1片、2粒等"
          />
        </el-form-item>
        
        <el-form-item label="重复设置" prop="repeatType">
          <el-radio-group v-model="reminderForm.repeatType">
            <el-radio label="once">单次</el-radio>
            <el-radio label="daily">每日</el-radio>
            <el-radio label="weekly">每周</el-radio>
            <el-radio label="monthly">每月</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item
          v-if="reminderForm.repeatType !== 'once'"
          label="结束日期"
          prop="endDate"
        >
          <el-date-picker
            v-model="reminderForm.endDate"
            type="date"
            placeholder="请选择结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input
            v-model="reminderForm.remark"
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
  </div>
</template>

<script>
import { getMedicationPlans, createMedicationPlan, updateMedicationPlan, deleteMedicationPlan } from '@/api/medication'
import { getFamilyMembers } from '@/api/family'
import { getMedicineList } from '@/api/medicine'
import { confirmMedication } from '@/api/medication'

export default {
  name: 'Calendar',
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      calendarDates: [],
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      reminders: [],
      familyMembers: [],
      medicines: [],
      loading: false,
      submitLoading: false,
      dialogVisible: false,
      dialogTitle: '添加用药提醒',
      reminderForm: {
        id: null,
        familyMemberId: '',
        medicineId: '',
        date: '',
        time: '',
        dosage: '',
        repeatType: 'once',
        endDate: '',
        remark: ''
      },
      reminderRules: {
        familyMemberId: [
          { required: true, message: '请选择家庭成员', trigger: 'change' }
        ],
        medicineId: [
          { required: true, message: '请选择药品', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择用药日期', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请选择用药时间', trigger: 'change' }
        ],
        dosage: [
          { required: true, message: '请输入用药剂量', trigger: 'blur' }
        ],
        repeatType: [
          { required: true, message: '请选择重复设置', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    currentMonth() {
      return this.currentDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long'
      })
    },
    
    selectedDateText() {
      if (!this.selectedDate) return ''
      return this.selectedDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    selectedReminders() {
      if (!this.selectedDate) return []
      const dateStr = this.formatDate(this.selectedDate)
      return this.reminders.filter(reminder => reminder.date === dateStr)
        .sort((a, b) => a.time.localeCompare(b.time))
    }
  },
  mounted() {
    this.initCalendar()
    this.loadBasicData()
    this.loadCalendarData()
  },
  methods: {
    initCalendar() {
      this.generateCalendarDates()
    },
    
    generateCalendarDates() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      
      // 获取月份第一天和最后一天
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      // 获取第一天是星期几
      const firstDayOfWeek = firstDay.getDay()
      
      // 生成日历日期数组
      const dates = []
      
      // 添加上个月的日期
      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        dates.push({
          day: prevMonthLastDay - i,
          date: new Date(year, month - 1, prevMonthLastDay - i),
          isCurrentMonth: false,
          reminders: []
        })
      }
      
      // 添加当前月的日期
      for (let day = 1; day <= lastDay.getDate(); day++) {
        dates.push({
          day,
          date: new Date(year, month, day),
          isCurrentMonth: true,
          reminders: []
        })
      }
      
      // 添加下个月的日期
      const remainingDays = 42 - dates.length
      for (let day = 1; day <= remainingDays; day++) {
        dates.push({
          day,
          date: new Date(year, month + 1, day),
          isCurrentMonth: false,
          reminders: []
        })
      }
      
      this.calendarDates = dates
    },
    
    async loadBasicData() {
      try {
        const [membersResponse, medicinesResponse] = await Promise.all([
          getFamilyMembers(),
          getMedicineList({ size: 1000 })
        ])
        
        this.familyMembers = membersResponse.data
        this.medicines = medicinesResponse.data.records || medicinesResponse.data
      } catch (error) {
        console.error('加载基础数据失败:', error)
      }
    },
    
    async loadCalendarData() {
      this.loading = true
      try {
        const response = await getMedicationPlans({
          startDate: this.formatDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)),
          endDate: this.formatDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0))
        })
        
        this.reminders = response.data
        
        // 将提醒数据分配到日历日期
        this.assignRemindersToDates()
      } catch (error) {
        console.error('加载日历数据失败:', error)
        this.$message.error('加载日历数据失败')
      } finally {
        this.loading = false
      }
    },
    
    assignRemindersToDates() {
      this.calendarDates.forEach(dateObj => {
        const dateStr = this.formatDate(dateObj.date)
        dateObj.reminders = this.reminders.filter(reminder => reminder.date === dateStr)
      })
    },
    
    prevMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1)
      this.initCalendar()
      this.loadCalendarData()
    },
    
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1)
      this.initCalendar()
      this.loadCalendarData()
    },
    
    handleDateClick(date) {
      if (date.isCurrentMonth) {
        this.selectedDate = date.date
      }
    },
    
    getDateClass(date) {
      const classes = []
      
      if (!date.isCurrentMonth) {
        classes.push('other-month')
      }
      
      if (this.isToday(date.date)) {
        classes.push('today')
      }
      
      if (this.isSelectedDate(date.date)) {
        classes.push('selected')
      }
      
      if (date.reminders.length > 0) {
        classes.push('has-reminders')
      }
      
      return classes.join(' ')
    },
    
    getReminderClass(reminder) {
      if (reminder.status === 2) return 'completed'
      if (this.isToday(reminder.date)) return 'today'
      return 'normal'
    },
    
    isToday(date) {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    },
    
    isSelectedDate(date) {
      return this.selectedDate && date.toDateString() === this.selectedDate.toDateString()
    },
    
    formatDate(date) {
      return date.toISOString().split('T')[0]
    },
    
    handleAddPlan() {
      this.dialogTitle = '添加用药提醒'
      this.reminderForm = {
        id: null,
        familyMemberId: '',
        medicineId: '',
        date: this.selectedDate ? this.formatDate(this.selectedDate) : this.formatDate(new Date()),
        time: '',
        dosage: '',
        repeatType: 'once',
        endDate: '',
        remark: ''
      }
      this.dialogVisible = true
    },
    
    handleReminderCommand({ action, reminder }) {
      switch (action) {
        case 'edit':
          this.editReminder(reminder)
          break
        case 'delete':
          this.deleteReminder(reminder)
          break
      }
    },
    
    editReminder(reminder) {
      this.dialogTitle = '编辑用药提醒'
      this.reminderForm = { ...reminder }
      this.dialogVisible = true
    },
    
    deleteReminder(reminder) {
      this.$confirm(`确定要删除这条用药提醒吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteMedicationPlan(reminder.id)
          this.$message.success('删除成功')
          this.loadCalendarData()
        } catch (error) {
          console.error('删除提醒失败:', error)
          this.$message.error('删除提醒失败')
        }
      })
    },
    
    async confirmMedication(planId) {
      try {
        await confirmMedication(planId)
        this.$message.success('已确认用药')
        this.loadCalendarData()
      } catch (error) {
        console.error('确认用药失败:', error)
        this.$message.error('确认用药失败')
      }
    },
    
    handleDialogClose() {
      this.$refs.reminderForm.resetFields()
    },
    
    async handleSubmit() {
      this.$refs.reminderForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            if (this.reminderForm.id) {
              await updateMedicationPlan(this.reminderForm)
              this.$message.success('更新成功')
            } else {
              await createMedicationPlan(this.reminderForm)
              this.$message.success('添加成功')
            }
            
            this.dialogVisible = false
            this.loadCalendarData()
          } catch (error) {
            console.error('保存提醒失败:', error)
            this.$message.error('保存提醒失败')
          } finally {
            this.submitLoading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.calendar-container {
  padding: 0;
}

.calendar-card {
  margin-bottom: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-month {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.calendar-view {
  margin-top: 20px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e4e7ed;
  margin-bottom: 1px;
}

.weekday {
  background-color: #f5f7fa;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  color: #606266;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e4e7ed;
}

.calendar-date {
  background-color: white;
  min-height: 80px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.calendar-date:hover {
  background-color: #f5f7fa;
}

.calendar-date.other-month {
  color: #c0c4cc;
  background-color: #fafafa;
}

.calendar-date.today {
  background-color: #ecf5ff;
}

.calendar-date.selected {
  background-color: #e6f7ff;
  border: 2px solid #409EFF;
}

.calendar-date.has-reminders {
  font-weight: bold;
}

.date-number {
  font-size: 14px;
  margin-bottom: 5px;
}

.date-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.reminder-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.reminder-dot.normal {
  background-color: #409EFF;
}

.reminder-dot.today {
  background-color: #E6A23C;
}

.reminder-dot.completed {
  background-color: #67C23A;
}

.reminders-card {
  margin-bottom: 20px;
}

.empty-reminders {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-reminders i {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.reminders-list {
  max-height: 400px;
  overflow-y: auto;
}

.reminder-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.reminder-item:last-child {
  border-bottom: none;
}

.reminder-item.completed {
  opacity: 0.6;
}

.reminder-time {
  width: 80px;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.reminder-content {
  flex: 1;
  margin-left: 15px;
}

.reminder-medicine {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.reminder-detail {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reminder-actions {
  display: flex;
  gap: 5px;
}
</style>
