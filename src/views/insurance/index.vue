<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import type { InsuranceCompanyInterface, TableData } from "./types"
import type { InsuranceData } from "@/api/insurance/types"
import { cloneDeep } from "lodash-es"
import { usePagination } from "@/hooks/usePagination"
import { getInsuranceList, deleteInsurance, addInsurance, updateInsurance } from "@/api/insurance"

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const loading = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const searchFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)

const insuranceCompanyOptions = ref<InsuranceCompanyInterface[]>([])

const searchData = reactive({
  employeeId: undefined, // 員工番号
  employeeName: "", // 員工姓名
  insuranceCompanyName: "", // 保険会社
  insurancecontractnumber: undefined //保単番号
})

//#region 增
const DEFAULT_FORM_DATA: InsuranceData = {
  insurancecompanyid: undefined, // 保険会社
  insuranceplanname: "", // 保険プラン名
  insurancecontractnumber: "", // 証券番号
  customernamekana: "", // 契約者名 カタカナ
  customername: "", // 契約者名 漢字
  relationship: "", // 被保険者relation
  insurednamekana: "", // 被保険者カタカナ
  insuredname: "", // 被保険者漢字
  customersex: 0, //性別
  customerphonenumber: "", // 電話番号
  customeremail: "", // メール
  customerbirthday: "", // 誕生日
  contractdate: "", //契約日
  contractamount: 0, //保険金額
  customeraddress: "", // 住所
  contractdetail: "", // 保険内容
  employeeid: "" //社員番号
}

const formData = ref<InsuranceData>(cloneDeep(DEFAULT_FORM_DATA))
const tableData = ref<TableData[]>()

onMounted(() => {
  getTableData()
})

const getTableData = () => {
  loading.value = true

  getInsuranceList({ ...paginationData, ...searchData })
    .then((res) => {
      tableData.value = res.data.list
    })
    .finally(() => (loading.value = false))
}

watch([() => paginationData.pageNum, () => paginationData.pageSize], getTableData, { immediate: true })

const handleSearch = () => {
  paginationData.pageNum === 1 ? getTableData() : (paginationData.pageNum = 1)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const handleUpdate = (row: InsuranceData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row as InsuranceData)
}

//#region 删
const handleDelete = (row: InsuranceData) => {
  ElMessageBox.confirm(`正在删除用户：确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteInsurance(row).then((res) => {
      getTableData()
    })
  })
}

const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}

// -------------------------------modal----------------------------
const formRules: FormRules<any> = {
  // EmployeeId: [{ required: true, trigger: "blur", message: "選択してください" }],
  // Sex: [{ required: true, message: "選択してください" }],
  // PhoneNumber: [{ required: true, message: "请输入电话号码" }],
  // Email: [{ required: true, message: "请输入email" }],
  // HireDate: [{ required: true, message: "请输入生日" }]
}

const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.employeeid === undefined ? addInsurance : updateInsurance
    api(formData.value)
      .then((res) => {
        ElMessage({
          message: "编辑成功",
          type: "success"
        })
        dialogVisible.value = false
        formRef.value?.clearValidate()
      })
      .finally(() => (loading.value = false))
  })
}
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="保険会社">
          <el-input v-model="searchData.insuranceCompanyName" placeholder="入力してください" />
        </el-form-item>
        <el-form-item prop="phone" label="保単番号">
          <el-input v-model="searchData.insurancecontractnumber" placeholder="入力してください" />
        </el-form-item>
        <el-form-item prop="phone" label="員工番号">
          <el-input v-model="searchData.employeeId" placeholder="入力してください" />
        </el-form-item>
        <el-form-item prop="phone" label="員工姓名">
          <el-input v-model="searchData.employeeName" placeholder="入力してください" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新規保険契約</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="insurancecompanyid" label="保険会社" align="center" />
          <el-table-column prop="insuranceplanname" label="保険プラン名" align="center" />
          <el-table-column prop="insurancecontractnumber" label="証券番号" align="center" />
          <el-table-column prop="customernamekana" label="契約者名(カタカナ)" align="center" />
          <el-table-column prop="customername" label="契約者名(漢字)" align="center" />
          <el-table-column prop="relationship" label="被保険者(続)" align="center" />
          <el-table-column prop="insurednamekana" label="被保険者(カタカナ)" align="center" />
          <el-table-column prop="insuredname" label="被保険者(漢字)" align="center" />
          <el-table-column prop="customersex" label="性別" align="center" />
          <el-table-column prop="customerphonenumber" label="電話番号" align="center" />
          <el-table-column prop="customeremail" label="メール" align="center" />

          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">改修</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">消除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
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
    <el-dialog
      v-model="dialogVisible"
      :title="formData.employeeid === undefined ? '新規保険契約' : '改修保険契約'"
      @closed="resetForm"
      width="60%"
    >
      <el-form
        flex
        justify-around
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="left"
        class="modal-form"
      >
        <el-row :gutter="10" w-full>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item prop="insurancecompanyid" label="保険会社">
              <el-select v-model="formData.insurancecompanyid">
                <el-option
                  v-for="item in insuranceCompanyOptions"
                  :key="item.InsuranceCompanyId"
                  :label="item.InsuranceCompanyName"
                  :value="item.InsuranceCompanyId"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="insuranceplanname" label="保険プラン名">
              <el-select-v2 v-model="formData.insuranceplanname" :options="[]"> </el-select-v2>
            </el-form-item>
            <el-form-item prop="insurancecontractnumber" label="証券番号">
              <el-input v-model="formData.insurancecontractnumber" />
            </el-form-item>
            <el-form-item prop="" label="契約者名">
              <el-row :gutter="2" w-full>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div>カタカナ</div>
                  <el-form-item prop="customernamekana" label="">
                    <el-input v-model="formData.customernamekana" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div>漢字</div>
                  <el-form-item prop="customername" label="">
                    <el-input v-model="formData.customername" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="" label="被保険者">
              <el-row :gutter="2" w-full>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>&nbsp;</div>
                  <el-select-v2 v-model="formData.relationship" :options="[]"> </el-select-v2>
                </el-col>

                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>カタカナ</div>
                  <el-form-item prop="insurednamekana" label="">
                    <el-input v-model="formData.insurednamekana" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>漢字</div>
                  <el-form-item prop="insuredname" label="">
                    <el-input v-model="formData.insuredname" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="customersex" label="性別">
              <el-radio-group v-model="formData.customersex">
                <el-radio :value="0" size="large">男</el-radio>
                <el-radio :value="1" size="large">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="customerphonenumber" label="電話番号">
              <el-input v-model="formData.customerphonenumber" />
            </el-form-item>
            <el-form-item prop="customeremail" label="メール">
              <el-input v-model="formData.customeremail" />
            </el-form-item>

            <el-form-item prop="customerbirthday" label="誕生日">
              <el-date-picker v-model="formData.customerbirthday" type="date" size="large" />
            </el-form-item>
            <el-form-item prop="contractdate" label="契約日">
              <el-date-picker v-model="formData.contractdate" type="date" size="large" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item prop="contractamount" label="保険金額">
              <!-- <el-input v-model="formData.contractamount" /> -->
              <el-input-number v-model="formData.contractamount" :min="0"> </el-input-number>
            </el-form-item>
            <el-form-item prop="customeraddress" label="住所">
              <div min-w-full>
                <div><el-input v-model="formData.customeraddress" /></div>
                <div mt-2 mb-2><el-input /></div>
                <div><el-input /></div>
              </div>
            </el-form-item>
            <el-form-item prop="contractdetail" label="保険内容">
              <el-input
                v-model="formData.contractdetail"
                type="textarea"
                size="large"
                h-full
                placeholder="Please input"
              />
            </el-form-item>
            <el-form-item prop="employeeid" label="社員番号">
              <el-input v-model="formData.employeeid" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">登録</el-button>
      </template>
    </el-dialog>
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

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
