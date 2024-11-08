<script lang="ts" setup>
import { ref } from "vue"
import { baseLayout } from "../../constants"
</script>

<template>
  <div class="app-container">
    <el-row :gutter="10" flex justify-between>
      <el-col v-bind="baseLayout">
        <el-form-item label="保険会社Id">
          <el-input />
        </el-form-item>
      </el-col>
      <el-col v-bind="baseLayout">
        <el-form-item label="保険会社名">
          <el-input />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10" flex justify-between>
      <el-col v-bind="baseLayout">
        <el-form-item label="主担当">
          <el-select> </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="baseLayout">
        <el-form-item label="性別">
          <el-radio-group>
            <el-radio :value="1" size="large">男</el-radio>
            <el-radio :value="2" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10" flex justify-between>
      <el-col v-bind="baseLayout">
        <el-form-item label="部署">
          <el-input />
        </el-form-item>
      </el-col>
      <el-col v-bind="baseLayout">
        <el-form-item label="電話番号">
          <el-input />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10" flex justify-between>
      <el-col v-bind="baseLayout">
        <el-form-item label="メール">
          <el-input />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
