const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm')
function dialog(globals) {
  const context=vm.createContext({localStorage:{getItem:()=> 'token'},FormData:class{append(){}},process:{env:{}},...globals})
  const source=fs.readFileSync(path.resolve(__dirname,'../src/views/drug/components/DrugDialog.vue'),'utf8').split('<script>')[1].split('</script>')[0].replace(/^import .*$/gm,'').replace('export default','globalThis.definition =')
  vm.runInContext(source,context)
  const page=context.definition.data()
  for(const [name,method] of Object.entries(context.definition.methods))page[name]=method.bind(page)
  page.visible=true;page.$set=(obj,key,value)=>{obj[key]=value};page.$message={info:()=>{},success:()=>{},warning:()=>{},error:()=>{}}
  return page
}
test('barcode lookup fills blanks without changing record id or overwriting edited values',async()=>{
  const page=dialog({scanDrug:async()=>({data:{drugId:999,name:'查询药名',tradeName:'查询商品名',spec:'10片'}})})
  page.form.barCode='12345678';page.form.drugId=1;page.form.name='手填药名'
  await page.handleScan();assert.equal(page.form.drugId,1);assert.equal(page.form.name,'手填药名');assert.equal(page.form.spec,'10片')
})
test('barcode response is ignored after changing the form',async()=>{
  let resolve;const promise=new Promise(ok=>{resolve=ok})
  const page=dialog({scanDrug:()=>promise});page.form.barCode='12345678'
  const first=page.handleScan();page.formVersion++;resolve({data:{name:'旧查询'}});await first
  assert.equal(page.form.name,'')
})
test('instruction upload validates size and does not replace a manually changed link',async()=>{
  let resolve;const promise=new Promise(ok=>{resolve=ok})
  const page=dialog({uploadInstruction:()=>promise})
  assert.equal(page.beforeInstructionUpload({name:'bad.html',size:10}),false)
  assert.equal(page.beforeInstructionUpload({name:'manual.pdf',size:10*1024*1024+1}),false)
  const first=page.uploadDrugInstruction({file:{}});page.form.instructionUrl='/files/manual-new.pdf'
  resolve({data:'/files/upload-old.pdf'});await first
  assert.equal(page.form.instructionUrl,'/files/manual-new.pdf');assert.equal(page.instructionUploading,false)
})
