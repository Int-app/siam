<script lang="ts" setup>
import { reactive, ref } from "vue"
import { baseLayout } from "@/constants/laylout"

const props = withDefaults(defineProps<{ disabled: boolean }>(), {
  disabled: false
})

const dialogVisible = ref<boolean>(false)
const formData = reactive({ insurancecontractid: undefined })

const resetForm = () => {}

const setVisible = (value: boolean) => {
  dialogVisible.value = value
}

const handleCreateOrUpdate = () => {
  dialogVisible.value = false
}

defineExpose({
  setVisible
})
</script>

<template>
  <div class="app-container">
    <el-dialog
      v-model="dialogVisible"
      :title="formData.insurancecontractid === undefined ? '保険契約登録' : '編集'"
      @closed="resetForm"
      :open-delay="500"
      width="60%"
    >
      <el-form
        ref="formRef"
        :disabled="disabled"
        :model="formData"
        label-width="120px"
        label-position="left"
        class="modal-form"
      >
        <el-row :gutter="10" flex justify-between>
          <el-col v-bind="baseLayout">
            <el-form-item label="ルールId">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col v-bind="baseLayout">
            <el-form-item label="保険会社">
              <el-input />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" flex justify-between>
          <el-col v-bind="baseLayout">
            <el-form-item label="社員ランク">
              <el-select> </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="baseLayout">
            <el-form-item label="支給方式">
              <el-radio-group>
                <el-radio :value="1">月数支給</el-radio>
                <el-radio :value="2">比率支給</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" flex justify-between>
          <el-col v-bind="baseLayout">
            <el-form-item label="支給月数">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col v-bind="baseLayout">
            <el-form-item label="支給比率">
              <el-input />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" flex justify-between>
          <el-col v-bind="baseLayout">
            <el-form-item label="支給期間">
              <el-input />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCreateOrUpdate">追加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
