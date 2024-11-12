<script lang="ts" setup>
import { reactive, ref, onMounted, watch, computed, Ref } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight, Edit } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, CollapseModelValue, dayjs } from "element-plus"
import type { OptionType, AddOrEdditModalRefType } from "./types"
import type { InsuranceData, TableData } from "@/api/insurance/types"
import { usePagination } from "@/hooks/usePagination"
import { getInsuranceList, deleteInsurance, getInsurancecompanyList, getInsuranceById } from "@/api/insurance"
import { mapDataToOption } from "./utils"
import { base4Layout } from "@/constants/laylout"
import AddOrEdditModal from "./components/AddOrEdditModal.vue"
import SelectModal from "./components/SelectModal.vue"

const { paginationData, handleCurrentChange, handleSizeChange, handleMerge } = usePagination()

const addOrEdditModalRef = ref<AddOrEdditModalRefType>(null)
const loading = ref<boolean>(false)
const searchFormRef = ref<FormInstance | null>(null)
const insuranceCompanyOptions = ref<OptionType[]>([])

const searchData = reactive({
  employeeId: undefined, // 員工番号
  employeeName: "", // 員工姓名
  insuranceCompanyName: "", // 保険会社
  insurancecontractnumber: undefined //保単番号
})

const selectModalRef = ref<
  | (InstanceType<typeof SelectModal> & {
      setVisible: (value: boolean) => void
    })
  | null
>(null)

const tableData = ref<TableData[]>([])

onMounted(() => {
  getInsurancecompanyList().then((res) => {
    insuranceCompanyOptions.value = mapDataToOption(res.data)
  })
})

const getTableData = () => {
  loading.value = true

  getInsuranceList({ ...paginationData, ...searchData })
    .then((res) => {
      tableData.value = res.data.list
      handleMerge({ pageNum: res.data.pageNum, pageSize: res.data.pageSize, total: res.data.total })
    })
    .finally(() => (loading.value = false))
}

watch(
  [paginationData.pageNum, paginationData.pageSize],
  () => {
    getTableData()
  },
  { immediate: true }
)

const handleSearch = () => {
  paginationData.pageNum === 1 ? getTableData() : (paginationData.pageNum = 1)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const handleCreat = () => {
  if (!addOrEdditModalRef.value) return

  addOrEdditModalRef.value.setDialogVisible(true)
  addOrEdditModalRef.value.resetFormValue()
}

const handleSelect = () => {
  if (!selectModalRef.value) return
  selectModalRef.value.setVisible(true)
}

const handleUpdate = (row: InsuranceData) => {
  if (!addOrEdditModalRef.value || !row.insurancecontractid) return
  addOrEdditModalRef.value.setDialogVisible(true)

  getInsuranceById(row.insurancecontractid).then((res) => {
    addOrEdditModalRef.value?.setFormValue(res.data)
  })
}

//#region 删
const handleDelete = (row: InsuranceData) => {
  ElMessageBox.confirm(`削除しますか？`, "確認", {
    confirmButtonText: "確定",
    cancelButtonText: "キャンセル",
    type: "warning"
  }).then(() => {
    if (row.insurancecontractid) {
      deleteInsurance(String(row.insurancecontractid)).then((res) => {
        getTableData()
      })
    }
  })
}

const value = ref(true)
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-row>
          <el-col v-bind="base4Layout">
            <el-form-item prop="insuranceCompanyName" label="保険会社">
              <el-select-v2
                v-model="searchData.insuranceCompanyName"
                :options="insuranceCompanyOptions"
                style="width: 200px"
                clearable
              >
              </el-select-v2>
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="insurancecontractnumber" label="保険商品">
              <el-select-v2
                v-model="searchData.insuranceCompanyName"
                :options="insuranceCompanyOptions"
                style="width: 200px"
                clearable
              >
              </el-select-v2>
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="employeeId" label="証券番号">
              <el-select-v2
                v-model="searchData.insuranceCompanyName"
                :options="insuranceCompanyOptions"
                style="width: 200px"
                clearable
              >
              </el-select-v2>
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="employeeName" label="契約者">
              <el-input v-model="searchData.employeeName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="base4Layout">
            <el-form-item prop="contractdate" label="契約日">
              <el-date-picker
                v-model="searchData.insurancecontractnumber"
                format="YYYY/MM/DD"
                value-format="YYYY/MM/DD"
                type="date"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="contractdate" label="～">
              <el-date-picker
                v-model="searchData.insurancecontractnumber"
                format="YYYY/MM/DD"
                value-format="YYYY/MM/DD"
                type="date"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="contractdate" label="保険開始日">
              <el-date-picker
                v-model="searchData.insurancecontractnumber"
                format="YYYY/MM/DD"
                value-format="YYYY/MM/DD"
                type="date"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="contractdate" label="～">
              <el-date-picker
                v-model="searchData.insurancecontractnumber"
                format="YYYY/MM/DD"
                value-format="YYYY/MM/DD"
                type="date"
                size="large"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="base4Layout">
            <el-form-item prop="employeeName" label="社員">
              <el-input v-model="searchData.employeeName" />
            </el-form-item>
          </el-col>
          <el-col v-bind="base4Layout">
            <el-form-item prop="insuranceCompanyName" label="保険状態">
              <el-select-v2
                v-model="searchData.insuranceCompanyName"
                :options="insuranceCompanyOptions"
                style="width: 200px"
                clearable
              >
              </el-select-v2>
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
          <el-button type="primary" @click="handleSelect">新規保険契約</el-button>
          <el-button type="primary" @click="handleCreat">確定</el-button>
          <el-button type="primary" @click="handleCreat">解約</el-button>
          <el-button type="primary" @click="handleCreat">失効</el-button>
          <el-button type="primary" @click="handleCreat">復活</el-button>
          <el-button type="primary" @click="handleCreat">削除</el-button>
          <el-switch v-model="value" size="large" active-text="一覧" inactive-text="カード" />
        </div>
      </div>
      <div mb-3>
        <el-table :data="tableData">
          <el-table-column prop="insurancecompanyName" label="契約者" align="center" :width="150" />
          <el-table-column prop="insuranceproductid" label="被保険者" align="center" :width="150" />
          <el-table-column prop="insurancepapersno" label="保険会社" align="center" />
          <el-table-column prop="contractorfamilyname" label="保険商品" align="center" :width="150" />
          <el-table-column prop="contractorgivenname" label="保険金額" align="center" :width="120" />
          <el-table-column prop="insuredpersonfamilynamek" label="契約日" align="center" :width="150" />
          <el-table-column prop="insuredpersonfamilyname" label="保険開始日" align="center" :width="150" />
          <el-table-column prop="insuredpersongivenname" label="保険状態" align="center" :width="120" />
          <el-table-column prop="insuredpersongivenname" label="営業社員" align="center" :width="120" />
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
    <AddOrEdditModal
      ref="addOrEdditModalRef"
      v-model="loading"
      :get-table-data="getTableData"
      :insuranceCompanyOptions="insuranceCompanyOptions"
    />
    <SelectModal ref="selectModalRef" :addOrEdditModalRef="addOrEdditModalRef" />
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
