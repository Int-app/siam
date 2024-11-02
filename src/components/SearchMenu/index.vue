<script lang="ts" setup>
import { ref } from "vue"
import SearchModal from "./SearchModal.vue"

/**  modal 表示制御 */
const modalVisible = ref<boolean>(false)
/** modal開く閉じる */
const handleOpen = () => {
  modalVisible.value = true
}
</script>

<template>
  <div>
    <el-tooltip effect="dark" content="検索メニュー" placement="bottom">
      <SvgIcon name="search" @click="handleOpen" />
    </el-tooltip>
    <SearchModal v-model="modalVisible" />
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>
