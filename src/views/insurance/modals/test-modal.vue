<script lang="ts" setup>
import { ref } from "vue"

const visible = ref<boolean>(false)

const handleVisible = (value: boolean) => {
  visible.value = value
}

defineExpose({
  handleVisible
})
</script>

<template>
  <div class="app-container">
    <el-dialog v-model="visible">aaa</el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
