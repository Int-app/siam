<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
// 将 Element Plus 的语言设置为中文
// import zhCn from "element-plus/es/locale/lang/zh-cn"
import ja from "element-plus/es/locale/lang/ja"

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()
</script>

<template>
  <el-config-provider :locale="ja">
    <router-view />
  </el-config-provider>
</template>
