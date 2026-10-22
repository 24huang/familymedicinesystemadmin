const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

function dialog() {
  const saved = [], warnings = []
  const context = vm.createContext({
    addPlan: async data => saved.push(data), updatePlan: async data => saved.push(data)
  })
  const source = fs.readFileSync(path.resolve(__dirname, '../src/views/medication/plan/components/PlanDialog.vue'), 'utf8')
    .split('<script>')[1].split('</script>')[0].replace(/^import .*$/gm, '').replace('export default', 'globalThis.definition =')
  vm.runInContext(source, context)
  const page = context.definition.data()
  for (const [name, method] of Object.entries(context.definition.methods)) page[name] = method.bind(page)
  page.$refs = { form: { validate: callback => callback(true) } }
  page.$message = { warning: message => warnings.push(message), success: () => {} }
  page.$emit = () => {}
  return { page, saved, warnings }
}

test('as-needed admin plan saves without a scheduled time', async () => {
  const { page, saved } = dialog()
  Object.assign(page.form, { frequencyType: 3, times: [], startDate: '2026-10-21' })
  page.submitForm()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(saved.length, 1); assert.equal(saved[0].times.length, 0)
  assert.equal(saved[0].clearEndDate, true)
})

test('weekly admin plan requires weekdays and preserves them in request', async () => {
  const { page, saved, warnings } = dialog()
  Object.assign(page.form, { frequencyType: 2, weekDays: [], startDate: '2026-10-21' })
  page.submitForm(); assert.equal(saved.length, 0); assert.equal(warnings.length, 1)
  page.form.weekDays = [1, 5]; page.submitForm()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(saved.length, 1); assert.equal(saved[0].weekDays.join(','), '1,5')
})

test('admin schedule parser retains legacy arrays and new weekly dates', () => {
  const { page } = dialog()
  const legacy = page.parseSchedule({ frequencyDetail: '["08:00","18:00"]' })
  assert.equal(legacy.times.length, 2)
  const weekly = page.parseSchedule({ frequencyDetail: '{"times":["09:00"],"weekDays":[2,6]}' })
  assert.equal(weekly.weekDays.join(','), '2,6')
})

test('admin deletion reports history retention from server instead of claiming physical removal', async () => {
  const messages = [], confirmations = []
  const context = vm.createContext({ PlanDialog: {}, deletePlan: async () => ({ message: '计划已停止，历史记录已保留' }) })
  const source = fs.readFileSync(path.resolve(__dirname, '../src/views/medication/plan/index.vue'), 'utf8')
    .split('<script>')[1].split('</script>')[0].replace(/^import .*$/gm, '').replace('export default', 'globalThis.definition =')
  vm.runInContext(source, context)
  let refreshes = 0
  const page = { $confirm: message => { confirmations.push(message); return Promise.resolve() },
    $message: { success: message => messages.push(message) }, getList: () => { refreshes++ } }
  context.definition.methods.handleDelete.call(page, { planId: 1 })
  await new Promise(resolve => setImmediate(resolve))
  assert.ok(confirmations[0].includes('历史'))
  assert.equal(messages[0], '计划已停止，历史记录已保留'); assert.equal(refreshes, 1)
})
