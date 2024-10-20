<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import type { InsuranceCompanyInterface, OptionType, TableData } from "./types"
import type { InsuranceData } from "@/api/insurance/types"
import { cloneDeep } from "lodash-es"
import { usePagination } from "@/hooks/usePagination"
import {
  getInsuranceList,
  deleteInsurance,
  addInsurance,
  updateInsurance,
  getInsurancecompanyList,
  getInsuranceproductList
} from "@/api/insurance"
import { mapDataToOption } from "./utils"
import { isNumber } from "@/utils/validate"

const { paginationData, handleCurrentChange, handleSizeChange, handleMerge } = usePagination()
const loading = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const searchFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)

const insuranceCompanyOptions = ref<OptionType[]>([])
const insuranceproductidOptions = ref<OptionType[]>([])
const relationOptions = ref<OptionType[]>([
  { label: "本人", value: 1 },
  { label: "配偶者", value: 2 },
  { label: "父母", value: 3 },
  { label: "子", value: 4 },
  { label: "祖父母", value: 5 },
  { label: "孫", value: 6 },
  { label: "その他", value: 99 }
])

const searchData = reactive({
  employeeId: undefined, // 員工番号
  employeeName: "", // 員工姓名
  insuranceCompanyName: "", // 保険会社
  insurancecontractnumber: undefined //保単番号
})

//#region 增
const DEFAULT_FORM_DATA: InsuranceData = {
  insurancecontractid: undefined, // primarykey
  insurancecompanyid: undefined, // 保険会社
  insuranceproductid: "", // 保険プラン名
  insurancepapersno: "", // 証券番号
  contractorfamilynamek: "", // 契約者(セイ)
  contractorgivennamek: "", // 契約者(メイ)
  contractorfamilyname: "", // 契約者(姓)
  contractorgivenname: "", // 契約者(名)
  relationship: "", // 被保険者relation
  insuredpersonfamilynamek: "", //被保険者(セイ
  insuredpersongivennamek: "", // 被保険者(メイ)
  insuredpersonfamilyname: "", //被保険者(姓)
  insuredpersongivenname: "", //被保険者(名)
  age: 0, // 年齢(保険開始時)
  sex: 0, //性別
  phonenumber: "", //電話番号
  email: "", //メール
  birthday: "", //誕生日
  contractdate: "", //契約日
  insurancestartdate: "", // 保険開始日
  iscanceled: 0, //解約フラグ
  cancellationdate: "", //解約日
  paymentcycle: 0, //支払いサイクル
  relationshipother: "", //契約者との関係(補足)
  insuranceamount: 0, //保険金額
  addresspostcode: "", //住所(郵便番号)
  addressprefecture: "", // 住所(都道府県)
  addressmunicipalities: "", // 住所(市区町村)
  addressother: "", //住所(番地以降)
  remarks: "", //保険内容
  employeeid: "", //社員番号
  teamemployeeid: "", // 共同募集社員番号
  initialcommission: 0, // 初年度手数料
  paymentmethod: 0, // 支給方式
  paymentmonths: 0, // 支給月数
  totalamount: 0, //総額
  paymentpercentage: 0, //支給比率
  deleteflag: 0 //論理削除Flg
}

const formData = ref<InsuranceData>(cloneDeep(DEFAULT_FORM_DATA))
const tableData = ref<TableData[]>([])

onMounted(() => {
  getInsurancecompanyList().then((res) => {
    insuranceCompanyOptions.value = mapDataToOption(res.data)
  })
})

watch(
  () => formData.value.insurancecompanyid,
  (newV) => {
    if (newV) {
      getInsuranceproductList(String(newV)).then((res) => {
        formData.value.insuranceproductid = ""
        insuranceproductidOptions.value = mapDataToOption(res.data)
      })
    }
  }
)

const getTableData = () => {
  loading.value = true

  getInsuranceList({ ...paginationData, ...searchData })
    .then((res) => {
      tableData.value = res.data.list
      handleMerge({ pageNum: res.data.pageNum, pageSize: res.data.pageSize, total: res.data.total })
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
  insurancecompanyid: [{ required: true, message: "保険会社入力してください" }],
  contractorfamilyname: [{ required: true, message: "契約者(姓)入力してください" }],
  contractorgivenname: [{ required: true, message: "契約者(名)入力してください" }],
  contractorfamilynamek: [{ required: true, message: "契約者(セイ)入力してください" }],
  contractorgivennamek: [{ required: true, message: "契約者(メイ)入力してください" }],
  contractdate: [{ required: true, message: "契約日選択してください" }],
  insurancestartdate: [{ required: true, message: "保険開始日選択してください" }],
  insuranceamount: [{ required: true, message: "保険金額入力してください" }],
  relationship: [{ required: true, message: "契約者との関係選択してください" }],
  insuredpersonfamilyname: [{ required: true, message: "被保険者(姓)入力してください" }],
  insuredpersongivenname: [{ required: true, message: "被保険者(名)入力してください" }],
  insuredpersonfamilynamek: [{ required: true, message: "被保険者(セイ)入力してください" }],
  insuredpersongivennamek: [{ required: true, message: "被保険者(メイ)入力してください" }],
  sex: [{ required: true, message: "性別選択してください" }],
  employeeid: [{ required: true, message: "社員番号入力してください" }],
  initialcommission: [{ required: true, message: "初年度手数料入力してください" }],
  paymentmethod: [{ required: true, message: "支給方式選択してください" }] //
}

const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.insurancecontractid === undefined ? addInsurance : updateInsurance
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
          <el-table-column prop="insuranceproductids" label="保険プラン名" align="center" />
          <el-table-column prop="insurancepapersno" label="証券番号" align="center" />
          <el-table-column prop="contractorfamilyname" label="契約者名(カタカナ)" align="center" />
          <el-table-column prop="contractorgivenname" label="契約者名(漢字)" align="center" />
          <el-table-column prop="insuredpersonfamilynamek" label="被保険者(続)" align="center" />
          <el-table-column prop="insuredpersonfamilyname" label="被保険者(カタカナ)" align="center" />
          <el-table-column prop="insuredpersongivenname" label="被保険者(漢字)" align="center" />
          <el-table-column prop="sex" label="性別" align="center" />
          <el-table-column prop="phonenumber" label="電話番号" align="center" />
          <el-table-column prop="email" label="メール" align="center" />

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
      :title="formData.insurancecontractid === undefined ? '新規保険契約' : '改修保険契約'"
      @closed="resetForm"
      width="60%"
    >
      <el-form
        flex
        justify-around
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="left"
        hide-required-asterisk
        class="modal-form"
      >
        <el-row :gutter="10" w-full>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item v-show="false" prop="insurancecontractid" label="primarykey">
              <el-input v-model="formData.insurancecontractid" />
            </el-form-item>
            <el-form-item prop="insurancecompanyid" label="保険会社">
              <el-select-v2 v-model="formData.insurancecompanyid" :options="insuranceCompanyOptions" clearable>
              </el-select-v2>
            </el-form-item>
            <el-form-item prop="insuranceproductid" label="保険プラン名">
              <el-select-v2 v-model="formData.insuranceproductid" :options="insuranceproductidOptions" clearable>
              </el-select-v2>
            </el-form-item>
            <el-form-item prop="insurancepapersno" label="証券番号">
              <el-input v-model="formData.insurancepapersno" />
            </el-form-item>
            <el-form-item prop="" label="契約者名">
              <el-row :gutter="2" w-full>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div>契約者(セイ)</div>
                  <el-form-item prop="contractorfamilynamek" label="">
                    <el-input v-model="formData.contractorfamilynamek" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div>契約者(メイ)</div>
                  <el-form-item prop="contractorgivennamek">
                    <el-input v-model="formData.contractorgivennamek" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div>契約者(姓)</div>
                  <el-form-item prop="contractorfamilyname" label="">
                    <el-input v-model="formData.contractorfamilyname" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div>契約者(名)</div>
                  <el-form-item prop="contractorgivenname" label="">
                    <el-input v-model="formData.contractorgivenname" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="" label="被保険者">
              <el-row :gutter="2" w-full>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>&nbsp;</div>
                  <el-select-v2 v-model="formData.relationship" :options="relationOptions"> </el-select-v2>
                </el-col>

                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>被保険者(セイ)</div>
                  <el-form-item prop="insuredpersonfamilynamek" label="">
                    <el-input v-model="formData.insuredpersonfamilynamek" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>被保険者(メイ)</div>
                  <el-form-item prop="insuredpersongivennamek" label="">
                    <el-input v-model="formData.insuredpersongivennamek" />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>&nbsp;</div>
                  <el-select-v2 :options="[]" v-show="false"> </el-select-v2>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>被保険者(姓)</div>
                  <el-form-item prop="insuredpersonfamilyname" label="">
                    <el-input v-model="formData.insuredpersonfamilyname" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>被保険者(名)</div>
                  <el-form-item prop="insuredpersongivenname" label="">
                    <el-input v-model="formData.insuredpersongivenname" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="age" label="年齢(保険開始時)">
              <el-input v-model="formData.age" />
            </el-form-item>
            <el-form-item prop="sex" label="性別">
              <el-radio-group v-model="formData.sex">
                <el-radio :value="1" size="large">男</el-radio>
                <el-radio :value="2" size="large">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="phonenumber" label="電話番号">
              <el-input v-model="formData.phonenumber" />
            </el-form-item>
            <el-form-item prop="email" label="メール">
              <el-input v-model="formData.email" />
            </el-form-item>

            <el-form-item prop="birthday" label="誕生日">
              <el-date-picker
                v-model="formData.birthday"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="contractdate" label="契約日">
              <el-date-picker
                v-model="formData.contractdate"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="insurancestartdate" label="保険開始日">
              <el-date-picker
                v-model="formData.insurancestartdate"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item prop="insuranceamount" label="保険金額">
              <el-input v-model="formData.insuranceamount" />
              <!-- <el-input-number v-model="formData.insuranceamount" :min="0"> </el-input-number> -->
            </el-form-item>
            <el-form-item prop="initialcommission" label="初年度手数料">
              <el-input v-model="formData.initialcommission" />
            </el-form-item>
            <el-form-item prop="addresspostcode" label="住所">
              <el-input v-model="formData.addresspostcode" />
            </el-form-item>
            <el-form-item prop="addressprefecture" label="">
              <el-input v-model="formData.addressprefecture" />
            </el-form-item>
            <el-form-item prop="addressmunicipalities" label="">
              <el-input v-model="formData.addressmunicipalities" />
            </el-form-item>
            <el-form-item prop="remarks" label="保険内容">
              <el-input v-model="formData.remarks" type="textarea" size="large" h-full placeholder="Please input" />
            </el-form-item>
            <el-form-item prop="teamemployeeid" label="社員番号">
              <el-input v-model="formData.employeeid" />
            </el-form-item>
            <el-form-item prop="paymentmethod" label="支給方式">
              <el-radio-group v-model="formData.paymentmethod">
                <el-radio :value="1">月数支給</el-radio>
                <el-radio :value="2">比率支給</el-radio>
              </el-radio-group>
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
