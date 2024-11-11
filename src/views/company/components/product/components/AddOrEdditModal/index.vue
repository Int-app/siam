<script lang="ts" setup>
import { ref, reactive } from "vue"
import type { TabsPaneContext } from "element-plus"
import { baseLayout } from "../../../../constants"
import Product from "../Product/index.vue"
import Rule from "../Rule/index.vue"

const dialogVisible = ref<boolean>(false)
const activeName = ref("first")
const formData = reactive({ insurancecontractid: undefined })

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const resetForm = () => {}

const handleCreate = () => {
  dialogVisible.value = false
}

const setVisible = (value: boolean) => {
  dialogVisible.value = value
}
defineExpose({
  setVisible
})
</script>

<template>
  <div class="app-container">
    <el-dialog
      v-model="dialogVisible"
      :title="formData.insurancecontractid === undefined ? '保険商品登録' : '保険商品編集'"
      @closed="resetForm"
      :open-delay="500"
      width="60%"
    >
      <el-tabs v-model="activeName" type="card" w-full @tab-click="handleClick">
        <el-tab-pane label="保険商品" name="first">
          <Product />
        </el-tab-pane>
        <el-tab-pane label="手数料ルール" name="second">
          <Rule />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button type="primary" @click="handleCreate">追加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
