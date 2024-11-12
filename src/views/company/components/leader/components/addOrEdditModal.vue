<script lang="ts" setup>
import { reactive, ref } from "vue"
import { baseLayout } from "@/constants/laylout"

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
      <el-row :gutter="10" flex justify-between>
        <el-col v-bind="baseLayout">
          <el-form-item label="担当者Id">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" flex justify-between>
        <el-col v-bind="baseLayout">
          <el-form-item label="担当者名">
            <el-input placeholder="担当者(セイメイ)" />
          </el-form-item>
        </el-col>
        <el-col v-bind="baseLayout">
          <el-form-item label="">
            <el-input placeholder="担当者(姓名)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" flex justify-between>
        <el-col v-bind="baseLayout">
          <el-form-item label="性別">
            <el-radio-group>
              <el-radio :value="1" size="large">男</el-radio>
              <el-radio :value="2" size="large">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-bind="baseLayout">
          <el-form-item label="部署">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" flex justify-between>
        <el-col v-bind="baseLayout">
          <el-form-item label="電話番号">
            <el-input />
          </el-form-item>
        </el-col>
        <el-col v-bind="baseLayout">
          <el-form-item label="メール">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" flex justify-between>
        <el-col v-bind="baseLayout">
          <el-form-item label="備考">
            <el-input type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>

      <template #footer>
        <el-button type="primary" @click="handleCreateOrUpdate">追加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
