<script lang="ts" setup>
import { ref, onMounted} from "vue"
import type { OptionType } from "../types"
import { mapDataToOption } from "../utils"
import {  getInsurancecompanyList } from "@/api/insurance"
import { type FormInstance } from "element-plus"
import type { TabsPaneContext } from "element-plus"
import AddOrEdditModal from "../components/addOrEdditModal.vue"

const insuranceCompanyOptions = ref<OptionType[]>([])
const addOrEdditModalRef = ref<
  | (InstanceType<typeof AddOrEdditModal> & {
      setDialogVisible: (value: boolean) => void
      resetFormValue: () => void
      setFormValue: (value: object) => void
    })
  | null
>(null)

const visible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)

const formData = ref({
  category: undefined
})

const resetForm = () => {
  formRef.value?.clearValidate()
}

const setVisible = (value: boolean) => {
  visible.value = value
}

const handleNext = () => {
	if (!addOrEdditModalRef.value) return
  addOrEdditModalRef.value.setDialogVisible(true)
}


defineExpose({
  setVisible
})


const loading = ref<boolean>(false)
	
onMounted(() => {
  getInsurancecompanyList().then((res) => {
    insuranceCompanyOptions.value = mapDataToOption(res.data)
  })
})

</script>

<template>
  <el-dialog
    v-model="visible"
    title="保険契約登録"
    @closed="resetForm"
    :open-delay="500"
    width="30%"
  >
    <el-form w-full flex ref="formRef" :model="formData" label-width="120px" label-position="left" class="modal-form">
		<el-form-item prop="category" label="保険種別">
		  <el-radio-group v-model="formData.category">
		    <el-radio :value="1" >生命保険</el-radio>
			<el-radio :value="2" >損害保険</el-radio>
			<el-radio :value="3" >その他保険</el-radio>
		  </el-radio-group>
		</el-form-item>
    </el-form>
	<AddOrEdditModal
	  ref="addOrEdditModalRef"
	  v-model="loading"
	  :insuranceCompanyOptions="insuranceCompanyOptions"
	/>
    <template #footer>
      <el-button type="primary"  @click="handleNext">次へ</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-radio-group) {
  display: block;
}

:deep(.el-radio) {
  display: block;
}
</style>
