<script lang="ts" setup>
import { ref } from "vue"
import { type FormInstance, ElMessage, ElMessageBox, CollapseModelValue, dayjs } from "element-plus"
import cloneDeep from "lodash-es/cloneDeep"
import type { TabsPaneContext } from "element-plus"
import InsuranceCompany from "../insuranceCompany/index.vue"
import leader from "../leader/index.vue"
import product from "../product/index.vue"
import rule from "../rule/index.vue"

const visible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const activeName = ref("first")

const formData = ref({
  insurancecontractid: undefined
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const resetForm = () => {
  formRef.value?.clearValidate()
}

const setVisible = (value: boolean) => {
  visible.value = value
}

defineExpose({
  setVisible
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="formData.insurancecontractid === undefined ? '新規' : '編集'"
    @closed="resetForm"
    :open-delay="500"
    width="60%"
  >
    <el-form w-full flex ref="formRef" :model="formData" label-width="120px" label-position="left" class="modal-form">
      <el-tabs v-model="activeName" type="card" w-full @tab-click="handleClick">
        <el-tab-pane label="保険会社" name="first">
          <InsuranceCompany />
        </el-tab-pane>
        <el-tab-pane label="保険商品" name="second">
          <product />
        </el-tab-pane>
        <el-tab-pane label="担当者" name="third">
          <leader />
        </el-tab-pane>
        <el-tab-pane label="手数料ルール" name="fourth">
          <rule />
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <el-button type="primary">登録</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
