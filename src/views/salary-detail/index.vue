<script lang="ts" setup>
import { reactive, ref, onMounted, watch, computed, Ref } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Edit } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, CollapseModelValue, dayjs } from "element-plus"
import type { InsuranceData, TableData } from "@/api/insurance/types"
import { usePagination } from "@/hooks/usePagination"
import { getInsuranceList, deleteInsurance, getInsurancecompanyList, getInsuranceById } from "@/api/insurance"
import { base4Layout } from "@/constants/laylout"
import AddOrEdditModal from "./components/AddOrEdditModal/index.vue"

const { paginationData, handleCurrentChange, handleSizeChange, handleMerge } = usePagination()

const addOrEdditModalRef = ref<
  | (InstanceType<typeof AddOrEdditModal> & {
      setVisible: (value: boolean) => void
    })
  | null
>(null)
const loading = ref<boolean>(false)
const searchFormRef = ref<FormInstance | null>(null)
const insuranceCompanyOptions = ref<[]>([])
const value = ref<boolean>(false)

const searchData = reactive({
  companyNum: undefined, // 社員番号
  companyName: "", // 社員名
  product: "" // 社員ランク
})

const tableData = ref<TableData[]>([])

const resetSearch = () => {
  searchFormRef.value?.resetFields()
}

const handleCreat = () => {
  addOrEdditModalRef.value?.setVisible(true)
}

const handleUpdate = (row: InsuranceData) => {}

//#region 删
const handleDelete = (row: InsuranceData) => {}
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-row>
          <el-col v-bind="base4Layout">
            <el-form-item prop="contractdate" label="社員番号">
              <el-input :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="insurancecontractnumber" label="社員名">
              <el-input :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="insurancecontractnumber" label="社員ランク">
              <el-input :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div flex flex-justify-between flex-items-center>
        <div>
          <el-button type="primary" @click="handleCreat">給料調整登録</el-button>
        </div>
        <div flex flex-items-center>表示形式 <el-switch v-model="value" ml-1 /></div>
      </div>
      <div mb-3>
        <el-table :data="tableData">
          <el-table-column prop="insurancecompanyName" label="名目" align="center" :width="150" />
          <el-table-column prop="insuranceproductid" label="契約日" align="center" :width="150" />
          <el-table-column prop="insurancepapersno" label="契約者名" align="center" />
          <el-table-column prop="contractorfamilyname" label="保険会社" align="center" :width="150" />
          <el-table-column prop="contractorgivenname" label="保険商品" align="center" :width="120" />
          <el-table-column prop="insuredpersonfamilynamek" label="証券番号" align="center" :width="150" />
          <el-table-column prop="insuredpersonfamilyname" label="保険金額" align="center" :width="150" />
          <el-table-column prop="insuredpersongivenname" label="11月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="12月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="1月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="2月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="3月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="4月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="5月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="6月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="7月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="8月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="9月" align="center" :width="60" />
		  <el-table-column prop="insuredpersongivenname" label="10月" align="center" :width="60" />

          <el-table-column fixed="right" label="操作" align="center" :width="130">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">
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
