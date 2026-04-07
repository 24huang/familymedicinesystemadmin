<template>
  <div class="theme-toggle">
    <el-tooltip :content="isDark ? '切换到浅色模式' : '切换到深色模式'" placement="bottom">
      <div class="theme-button" @click="toggleTheme">
        <transition name="theme-icon" mode="out-in">
          <i :key="isDark ? 'moon' : 'sun'" 
             :class="isDark ? 'el-icon-moon' : 'el-icon-sunny'"
             class="theme-icon">
          </i>
        </transition>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'ThemeToggle',
  data() {
    return {
      isDark: false
    }
  },
  created() {
    // 从 localStorage 读取用户之前的主题偏好
    this.initTheme()
  },
  methods: {
    /**
     * 初始化主题
     * 从 localStorage 读取保存的主题设置
     * 如果用户从未手动选择过，则根据时间自动判断（晚上6点后使用深色模式）
     */
    initTheme() {
      const savedTheme = localStorage.getItem('theme')
      
      // 如果用户之前手动选择过主题，直接使用用户的偏好
      if (savedTheme === 'dark') {
        this.isDark = true
        this.applyTheme(true)
      } else if (savedTheme === 'light') {
        this.isDark = false
        this.applyTheme(false)
      } else {
        // 用户从未选择过，根据当前时间自动判断
        const isAutoDark = this.isNightTime()
        this.isDark = isAutoDark
        this.applyTheme(isAutoDark)
        
        // 保存到 localStorage（标记为自动设置的）
        localStorage.setItem('theme', isAutoDark ? 'dark' : 'light')
      }
    },
    
    /**
     * 判断是否为夜间时间（晚上6点到早上6点）
     * @returns {Boolean} - 是否为夜间
     */
    isNightTime() {
      const currentHour = new Date().getHours()
      // 晚上6点（18:00）到凌晨6点（6:00）之间为夜间
      return currentHour >= 18 || currentHour < 6
    },
    
    /**
     * 切换主题
     * 点击按钮时切换主题状态
     */
    toggleTheme() {
      this.isDark = !this.isDark
      this.handleThemeChange(this.isDark)
    },
    
    /**
     * 处理主题切换
     * @param {Boolean} value - 是否为深色主题
     */
    handleThemeChange(value) {
      this.applyTheme(value)
      
      // 保存到 localStorage
      localStorage.setItem('theme', value ? 'dark' : 'light')
      
      // 显示提示
      this.$message({
        message: value ? '已切换到深色模式 🌙' : '已切换到浅色模式 ☀️',
        type: 'success',
        duration: 1500
      })
    },
    
    /**
     * 应用主题
     * 通过添加/移除 body 的 class 来切换主题
     * @param {Boolean} isDark - 是否为深色主题
     */
    applyTheme(isDark) {
      if (isDark) {
        document.body.classList.add('dark-theme')
        // 清除表格表头的内联背景色样式
        this.clearTableHeaderStyles()
      } else {
        document.body.classList.remove('dark-theme')
        // 恢复表格表头的内联背景色样式
        this.restoreTableHeaderStyles()
      }
    },
    
    /**
     * 清除表格表头的内联样式
     * Element UI 的表格使用内联样式设置表头背景色，需要用 JS 清除
     */
    clearTableHeaderStyles() {
      this.$nextTick(() => {
        const headers = document.querySelectorAll('.el-table__header-wrapper th')
        headers.forEach(th => {
          th.style.backgroundColor = ''
        })
        
        const headerWrappers = document.querySelectorAll('.el-table__header-wrapper')
        headerWrappers.forEach(wrapper => {
          wrapper.style.backgroundColor = ''
        })
        
        const tableHeaders = document.querySelectorAll('.el-table__header')
        tableHeaders.forEach(header => {
          header.style.backgroundColor = ''
        })
      })
    },
    
    /**
     * 恢复表格表头的内联样式
     */
    restoreTableHeaderStyles() {
      this.$nextTick(() => {
        const headers = document.querySelectorAll('.el-table__header-wrapper th')
        headers.forEach(th => {
          th.removeAttribute('style')
        })
      })
    }
  }
}
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
}

/* 主题切换按钮 */
.theme-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--card-bg), var(--bg-secondary));
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* 按钮悬停效果 */
.theme-button:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
  border-color: var(--primary-color);
}

/* 按钮点击效果 */
.theme-button:active {
  transform: scale(0.95);
}

/* 图标样式 */
.theme-icon {
  font-size: 20px;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

/* 深色模式下的图标 */
.dark-theme .theme-button {
  background: linear-gradient(135deg, rgba(45, 45, 45, 0.8), rgba(31, 31, 31, 0.6));
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.dark-theme .theme-button:hover {
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.4);
  border-color: var(--primary-color);
}

.dark-theme .theme-icon {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

/* 图标切换动画 */
.theme-icon-enter-active {
  transition: all 0.3s ease;
}

.theme-icon-leave-active {
  transition: all 0.3s ease;
}

.theme-icon-enter {
  transform: rotate(-180deg) scale(0);
  opacity: 0;
}

.theme-icon-leave-to {
  transform: rotate(180deg) scale(0);
  opacity: 0;
}

/* 深色主题下的特定样式 */
.dark-theme .theme-button:hover {
  background: linear-gradient(135deg, rgba(50, 50, 50, 0.9), rgba(35, 35, 35, 0.7));
}
</style>
