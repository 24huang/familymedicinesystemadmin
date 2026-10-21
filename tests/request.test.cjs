const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

function harness() {
  const storage = new Map(), messages = [], timers = []
  const context = vm.createContext({
    process: { env: { VUE_APP_API_BASE: '/custom-api' } },
    localStorage: { getItem: key => storage.get(key), removeItem: key => storage.delete(key) },
    window: { location: { hash: '/home' } }, Message: options => messages.push(options),
    setTimeout: callback => timers.push(callback),
    axios: { create: config => {
      context.axiosConfig = config
      return { interceptors: {
        request: { use: handler => { context.beforeRequest = handler } },
        response: { use: (success, failure) => { context.onSuccess = success; context.onFailure = failure } }
      } }
    } }
  })
  const root = path.resolve(__dirname, '..')
  vm.runInContext(fs.readFileSync(path.join(root, 'src/utils/session.js'), 'utf8').replace('export function', 'function'), context)
  const request = fs.readFileSync(path.join(root, 'src/api/request.js'), 'utf8')
    .replace(/^import .*$/gm, '').replace('export default service', '')
  vm.runInContext(request, context)
  return { storage, messages, timers, context }
}

test('concurrent authorization failures clear account state once and keep theme', async () => {
  const h = harness()
  for (const key of ['token', 'userInfo', 'userId', 'username', 'userRole']) h.storage.set(key, 'old')
  h.storage.set('theme', 'dark')
  const config = h.context.beforeRequest({ headers: {} })
  await assert.rejects(h.context.onSuccess({ config, data: { code: 401 } }))
  await assert.rejects(h.context.onFailure({ config, response: { status: 401 } }))
  assert.deepEqual([...h.storage.keys()], ['theme'])
  assert.equal(h.messages.length, 1)
  assert.equal(h.timers.length, 1)
  assert.equal(h.context.axiosConfig.baseURL, '/custom-api')
})

test('old request failures and delayed redirects cannot replace a new login', async () => {
  const h = harness()
  h.storage.set('token', 'old')
  const config = h.context.beforeRequest({ headers: {} })
  h.storage.set('token', 'new')
  await assert.rejects(h.context.onFailure({ config, response: { status: 401 } }))
  assert.equal(h.storage.get('token'), 'new')
  assert.equal(h.timers.length, 0)
  const current = h.context.beforeRequest({ headers: {} })
  await assert.rejects(h.context.onFailure({ config: current, response: { status: 401 } }))
  h.storage.set('token', 'newer')
  h.timers[0]()
  assert.equal(h.context.window.location.hash, '/home')
})
