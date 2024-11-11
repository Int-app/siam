<script lang="ts" setup>
import { ref, reactive } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Edit } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, CollapseModelValue, dayjs } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { base4Layout, baseLayout } from "../../constants"
import AddOrEdditModal from "./components/AddOrEdditModal.vue"

const { paginationData, handleCurrentChange, handleSizeChange, handleMerge } = usePagination()
const loading = ref<boolean>(false)
const addOrEdditModalRef = ref<
  | (InstanceType<typeof AddOrEdditModal> & {
      setVisible: (value: boolean) => void
    })
  | null
>(null)

const searchData = reactive({
  name: undefined // 担当者
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
              <el-input v-model="searchData.name" />
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
          <el-button type="primary" @click="handleCreat">担当者追加</el-button>
        </div>
      </div>
      <div mb-3>
        <el-table :data="tableData">
          <el-table-column prop="insurancecompanyName" label="担当者Id" align="center" :width="150" />
          <el-table-column prop="insuranceproductid" label="担当者名" align="center" :width="150" />
          <el-table-column prop="insurancepapersno" label="性別" align="center" />
          <el-table-column prop="contractorfamilyname" label="部署" align="center" :width="150" />
          <el-table-column prop="contractorgivenname" label="電話番号" align="center" :width="120" />
          <el-table-column prop="insuredpersonfamilynamek" label="メールアドレス" align="center" :width="150" />
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
