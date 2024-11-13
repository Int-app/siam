<script lang="ts" setup>
import { reactive, ref } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, CollapseModelValue, dayjs } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Edit } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { base4Layout, baseLayout } from "@/constants/laylout"
import type { TableData } from "@/api/insurance/types"

const { paginationData, handleCurrentChange, handleSizeChange, handleMerge } = usePagination()
const loading = ref<boolean>(false)
const searchFormRef = ref<FormInstance | null>(null)

const searchData = reactive({
  company: "", // 保険会社
  category: "", // 分類
  admin: "" //主担当
})

const tableData = ref<TableData[]>([])

const value = ref<boolean>(false)

const getTableData = () => {
  loading.value = true

  setTimeout(() => (loading.value = false), 1000)
}

const handleCreat = () => {}

const handleSearch = () => {
  paginationData.pageNum === 1 ? getTableData() : (paginationData.pageNum = 1)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const handleUpdate = () => {}

const handleDelete = () => {}
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-row>
          <el-col v-bind="baseLayout">
            <el-form-item prop="company" label="給料月">
              <el-date-picker type="daterange" range-separator="~" size="large" />
            </el-form-item>
          </el-col>
          <el-col v-bind="baseLayout">
            <el-form-item prop="category" label="社員">
              <el-select-v2 v-model="searchData.category" :options="[]" style="width: 200px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="end">
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">検索</el-button>
            <el-button :icon="Refresh" @click="resetSearch">クリア</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div mb-3>
        <div flex justify-end flex-items-center>表示形式 <el-switch v-model="value" ml-1 /></div>
      </div>
      <div mb-3>
        <el-table :data="tableData">
          <el-table-column prop="insurancecompanyName" label="給料月" align="center" :width="150" />
          <el-table-column prop="insuranceproductid" label="社員番号" align="center" :width="150" />
          <el-table-column prop="insurancepapersno" label="社員名" align="center" />
          <el-table-column prop="contractorfamilyname" label="社員ランク" align="center" :width="150" />
          <el-table-column prop="contractorgivenname" label="給料額" align="center" :width="120" />
          <el-table-column prop="insuredpersonfamilynamek" label="ステータス" align="center" :width="150" />
          <el-table-column fixed="right" label="操作" align="center" :width="130">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div flex justify-end>
        <el-pagination
          background
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.pageNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.modal-form {
  > div {
    margin: 0 10px;
  }
}

.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
</style>
