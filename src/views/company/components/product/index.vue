<script lang="ts" setup>
import { ref, reactive } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Edit } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, CollapseModelValue, dayjs } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { base4Layout, baseLayout } from "../../constants"

import AddOrEdditModal from "./components/AddOrEdditModal/index.vue"

const { paginationData, handleCurrentChange, handleSizeChange, handleMerge } = usePagination()
const loading = ref<boolean>(false)
const addOrEdditModalRef = ref<
  | (InstanceType<typeof AddOrEdditModal> & {
      setVisible: (value: boolean) => void
    })
  | null
>(null)

const searchData = reactive({
  product: undefined, // 保険商品
  status: "", // 販売状態
  time1: "", // 販売開始日
  time2: undefined //販売終了日
})

const tableData = ref<any[]>([])

const handleSearch = () => {}

const resetSearch = () => {}

const handleCreat = () => {
  addOrEdditModalRef.value?.setVisible(true)
}
</script>

<template>
  <div>
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-row>
          <el-col v-bind="baseLayout">
            <el-form-item prop="insuranceCompanyName" label="保険商品">
              <el-select-v2 v-model="searchData.product" :options="[]" style="width: 200px" clearable> </el-select-v2>
            </el-form-item>
          </el-col>
          <el-col v-bind="baseLayout">
            <el-form-item prop="insurancecontractnumber" label="販売状態">
              <el-select-v2 :options="[]" style="width: 200px" clearable> </el-select-v2>
            </el-form-item>
          </el-col>
          <el-col v-bind="baseLayout">
            <el-form-item prop="employeeId" label="販売開始日">
              <el-date-picker v-model="searchData.time1" type="daterange" range-separator="~" size="large" />
            </el-form-item>
          </el-col>
          <el-col v-bind="baseLayout">
            <el-form-item prop="employeeName" label="販売終了日">
              <el-date-picker v-model="searchData.time2" type="daterange" range-separator="~" size="large" />
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
      <div flex justify-between mb-3>
        <div>
          <el-button type="primary" @click="handleCreat">保険商品追加</el-button>
        </div>
      </div>
      <div mb-3>
        <el-table :data="tableData">
          <el-table-column prop="insurancecompanyName" label="保険商品Id" align="center" :width="150" />
          <el-table-column prop="insuranceproductid" label="保険商品名" align="center" :width="150" />
          <el-table-column prop="insurancepapersno" label="販売開始日" align="center" />
          <el-table-column prop="contractorfamilyname" label="販売終了日" align="center" :width="150" />
          <el-table-column prop="contractorgivenname" label="販売状態" align="center" :width="120" />
          <el-table-column fixed="right" label="操作" align="center" :width="130">
            <template #default="scope">
              <el-button type="primary" text bg size="small">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" text bg size="small">
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
    <AddOrEdditModal ref="addOrEdditModalRef" />
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
