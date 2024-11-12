<script lang="ts" setup>
import { baseLayout } from "@/constants/laylout"
</script>

<template>
  <div class="app-container">
    <el-row :gutter="10" flex justify-between>
      <el-col v-bind="baseLayout">
        <el-form-item label="保険商品Id">
          <el-input />
        </el-form-item>
      </el-col>
      <el-col v-bind="baseLayout">
        <el-form-item label="保険商品名">
          <el-input />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10" flex justify-between>
      <el-col v-bind="baseLayout">
        <el-form-item label="保険会社">
          <el-select> </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="baseLayout"></el-col>
    </el-row>
    <el-row :gutter="10" flex justify-between>
      <el-col v-bind="baseLayout">
        <el-form-item label="販売開始日">
          <el-date-picker format="YYYY/MM/DD" value-format="YYYY/MM/DD" type="date" size="large" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col v-bind="baseLayout">
        <el-form-item label="販売終了日">
          <el-date-picker format="YYYY/MM/DD" value-format="YYYY/MM/DD" type="date" size="large" style="width: 100%" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10" flex justify-between>
      <el-col v-bind="baseLayout">
        <el-form-item label="販売状態">
          <el-select-v2 :options="[]"></el-select-v2>
        </el-form-item>
      </el-col>
      <el-col v-bind="baseLayout">
        <el-form-item label="備考">
          <el-input />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-range-separator) {
  border: 1px;
}
</style>
