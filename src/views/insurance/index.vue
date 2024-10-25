<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, CollapseModelValue, dayjs } from "element-plus"
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
  getInsuranceproductList,
  getInsuranceById,
  getAddressCode
} from "@/api/insurance"
import { getLastDay, mapDataToOption } from "./utils"
import { DEFAULT_FORM_DATA, relationOptions, paymentcycleOptions } from "./constants"
import { computed } from "vue"

const baseLayout = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12
}

const { paginationData, handleCurrentChange, handleSizeChange, handleMerge } = usePagination()
const loading = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const searchFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)

const insuranceCompanyOptions = ref<OptionType[]>([])
const insuranceproductidOptions = ref<OptionType[]>([])

const activeNames = ref(["1"])
const handleChange = (val: CollapseModelValue) => {
  console.log(val)
}

const searchData = reactive({
  employeeId: undefined, // 員工番号
  employeeName: "", // 員工姓名
  insuranceCompanyName: "", // 保険会社
  insurancecontractnumber: undefined //保単番号
})

const birthday = ref({
  year: "",
  month: "",
  day: ""
})

const yearOption = new Array(dayjs().get("year"))
  .fill(0)
  .map((_, index) => ({ label: index + 1, value: String(index + 1) }))
const monthOption = new Array(12).fill(0).map((_, index) => ({ label: index + 1, value: String(index + 1) }))

const formData = ref<InsuranceData & { nowAge?: number }>(cloneDeep(DEFAULT_FORM_DATA))
const tableData = ref<TableData[]>([])

const isDisabledInsuredpersonName = computed(() => Number(formData.value.relationship) === relationOptions[0].value)
const isDisabledRelationshipother = computed(
  () =>
    Number(formData.value.relationship) === relationOptions[relationOptions.length - 1].value ||
    isDisabledInsuredpersonName.value
)
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
  insuredpersonfamilyname: [{ required: isDisabledInsuredpersonName.value, message: "被保険者(姓)入力してください" }],
  insuredpersongivenname: [{ required: isDisabledInsuredpersonName.value, message: "被保険者(名)入力してください" }],
  insuredpersonfamilynamek: [
    { required: isDisabledInsuredpersonName.value, message: "被保険者(セイ)入力してください" }
  ],
  insuredpersongivennamek: [{ required: isDisabledInsuredpersonName.value, message: "被保険者(メイ)入力してください" }],
  sex: [{ required: true, message: "性別選択してください" }],
  employeeid: [{ required: true, message: "社員番号入力してください" }],
  teamemployeeid: [{ required: true, message: "共同募集社員番号入力してください" }],
  initialcommission: [{ required: true, message: "初年度手数料入力してください" }],
  paymentmethod: [{ required: true, message: "支給方式選択してください" }],
  email: [
    {
      validator: function (rule, value, callback) {
        if (
          /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value) ==
          false
        ) {
          callback(new Error("メール入力してください"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
}

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

watch(
  () => formData.value.relationship,
  (newValue) => {
    if (Number(newValue) === relationOptions[0].value) {
      formData.value.insuredpersonfamilyname = formData.value.contractorfamilyname
      formData.value.insuredpersongivenname = formData.value.contractorgivenname
      formData.value.insuredpersongivennamek = formData.value.contractorgivennamek
      formData.value.insuredpersonfamilynamek = formData.value.contractorfamilynamek
    } else {
      formRef.value?.resetFields([
        "insuredpersonfamilyname",
        "insuredpersongivenname",
        "insuredpersongivennamek",
        "insuredpersonfamilynamek"
      ])
    }
  }
)

const isDisabledHi = computed(() => (birthday.value.year.length > 0 && birthday.value.month.length > 0 ? false : true))

const hiOption = computed(() => {
  const lastIndex = getLastDay(Number(birthday.value.year), Number(birthday.value.month))
  const arr = new Array(lastIndex).fill(0).map((_, index) => ({ label: index + 1, value: String(index + 1) }))
  return arr
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

watch([() => paginationData.pageNum, () => paginationData.pageSize], getTableData, { immediate: true })

watch(
  () => birthday.value.day,
  (newValue) => {
    formData.value.birthday = `${birthday.value.year}/${birthday.value.month}/${birthday.value.day}`
  }
)

const handleSearch = () => {
  paginationData.pageNum === 1 ? getTableData() : (paginationData.pageNum = 1)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
console.log("111")
const handleUpdate = (row: InsuranceData) => {
  loading.value = true
  dialogVisible.value = true
  if (!row.insurancecontractid) return

  getInsuranceById(row.insurancecontractid)
    .then((res) => {
      formData.value = res.data

      if (res.data.birthday?.length > 0) {
        const ymrDate = dayjs(res.data.birthday, "YYYY/MM/DD")
        birthday.value.year = ymrDate.year().toString()
        birthday.value.month = ymrDate.month().toString()
        birthday.value.day = ymrDate.day().toString()
      }
    })
    .finally(() => (loading.value = false))
}

//#region 删
const handleDelete = (row: InsuranceData) => {
  ElMessageBox.confirm(`削除ユーザ：削除しますか？`, "提示", {
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    if (row.insurancecontractid) {
      deleteInsurance(String(row.insurancecontractid)).then((res) => {
        getTableData()
      })
    }
  })
}

const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}

const handleAddressSearch = () => {
  if (formData.value.addresspostcode) {
    getAddressCode(formData.value.addresspostcode).then((res) => {
      console.log("res", res)
    })
  }
}

// -------------------------------modal----------------------------

const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("チェックエラー", fields)
    loading.value = true
    const api = formData.value.insurancecontractid === undefined ? addInsurance : updateInsurance
    api(formData.value)
      .then((res) => {
        ElMessage({
          message: "変更成功",
          type: "success"
        })
        dialogVisible.value = false
        formRef.value?.clearValidate()
        formRef.value?.resetFields()
        getTableData()
      })
      .finally(() => (loading.value = false))
  })
}
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-row>
          <el-col :span="24">
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
          </el-col>
        </el-row>
        <el-col :span="24" class="pager-wrapper">
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">検索</el-button>
            <el-button :icon="Refresh" @click="resetSearch">クリア</el-button>
          </el-form-item>
        </el-col>
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
          <el-table-column prop="insuranceproductid" label="保険プラン名" align="center" :width="120" />
          <el-table-column prop="insurancepapersno" label="証券番号" align="center" />
          <el-table-column prop="contractorfamilyname" label="契約者名(カタカナ)" align="center" :width="150" />
          <el-table-column prop="contractorgivenname" label="契約者名(漢字)" align="center" :width="120" />
          <el-table-column prop="insuredpersonfamilynamek" label="被保険者(続)" align="center" :width="150" />
          <el-table-column prop="insuredpersonfamilyname" label="被保険者(カタカナ)" align="center" :width="150" />
          <el-table-column prop="insuredpersongivenname" label="被保険者(漢字)" align="center" :width="120" />
          <el-table-column prop="sex" label="性別" align="center" />
          <el-table-column prop="phonenumber" label="電話番号" align="center" />
          <el-table-column prop="email" label="メール" align="center" />
          <el-table-column fixed="right" label="操作" :width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">編集</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">削除</el-button>
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
      :title="formData.insurancecontractid === undefined ? '新規' : '編集'"
      @closed="resetForm"
      width="60%"
    >
      <el-form
        flex
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="left"
        hide-required-asterisk
        class="modal-form"
      >
        <el-collapse w-full v-model="activeNames" @change="handleChange" simple>
          <el-collapse-item w-full title="契約情報" name="1">
            <el-form-item v-show="false" prop="insurancecontractid" label="primarykey">
              <el-input v-model="formData.insurancecontractid" />
            </el-form-item>
            <el-row :gutter="10">
              <el-col v-bind="baseLayout">
                <el-form-item prop="insurancecompanyid" label="保険会社">
                  <el-select-v2 v-model="formData.insurancecompanyid" :options="insuranceCompanyOptions" clearable>
                  </el-select-v2>
                </el-form-item>
              </el-col>
              <el-col v-bind="baseLayout">
                <el-form-item prop="insuranceproductid" label="保険プラン名">
                  <el-select-v2 v-model="formData.insuranceproductid" :options="insuranceproductidOptions" clearable>
                  </el-select-v2>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="insurancepapersno" label="証券番号">
              <el-input v-model="formData.insurancepapersno" />
            </el-form-item>
            <el-form-item prop="" label="契約者名">
              <el-row :gutter="10" w-full>
                <el-col v-bind="baseLayout">
                  <div>契約者(セイ)</div>
                  <el-form-item prop="contractorfamilynamek" label="">
                    <el-input v-model="formData.contractorfamilynamek" />
                  </el-form-item>
                </el-col>
                <el-col v-bind="baseLayout">
                  <div>契約者(メイ)</div>
                  <el-form-item prop="contractorgivennamek">
                    <el-input v-model="formData.contractorgivennamek" />
                  </el-form-item>
                </el-col>
                <el-col v-bind="baseLayout">
                  <div>契約者(姓)</div>
                  <el-form-item prop="contractorfamilyname" label="">
                    <el-input v-model="formData.contractorfamilyname" />
                  </el-form-item>
                </el-col>
                <el-col v-bind="baseLayout">
                  <div>契約者(名)</div>
                  <el-form-item prop="contractorgivenname" label="">
                    <el-input v-model="formData.contractorgivenname" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-row :gutter="10">
              <el-col v-bind="baseLayout">
                <el-form-item prop="contractdate" label="契約日">
                  <el-date-picker
                    v-model="formData.contractdate"
                    format="YYYY/MM/DD"
                    value-format="YYYY/MM/DD"
                    type="date"
                    size="large"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="baseLayout">
                <el-form-item prop="insurancestartdate" label="保険開始日">
                  <el-date-picker
                    v-model="formData.insurancestartdate"
                    format="YYYY/MM/DD"
                    value-format="YYYY/MM/DD"
                    type="date"
                    size="large"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col v-bind="baseLayout">
                <el-form-item prop="insuranceamount" label="保険金額">
                  <el-input v-model="formData.insuranceamount" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" />
                </el-form-item>
              </el-col>
              <el-col v-bind="baseLayout">
                <el-form-item prop="paymentcycle" label="支払いサイクル">
                  <el-select-v2 v-model="formData.paymentcycle" :options="paymentcycleOptions"></el-select-v2>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item w-full title="被保険者情報" name="2">
            <el-form-item prop="" label="被保険者">
              <el-row :gutter="10" w-full>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>&nbsp;</div>
                  <el-select-v2 v-model="formData.relationship" :options="relationOptions"> </el-select-v2>
                </el-col>

                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>被保険者(セイ)</div>
                  <el-form-item prop="insuredpersonfamilynamek" label="">
                    <el-input v-model="formData.insuredpersonfamilynamek" :disabled="isDisabledInsuredpersonName" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>被保険者(メイ)</div>
                  <el-form-item prop="insuredpersongivennamek" label="">
                    <el-input v-model="formData.insuredpersongivennamek" :disabled="isDisabledInsuredpersonName" />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>&nbsp;</div>
                  <el-select-v2 :options="[]" v-show="false"> </el-select-v2>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>被保険者(姓)</div>
                  <el-form-item prop="insuredpersonfamilyname" label="">
                    <el-input v-model="formData.insuredpersonfamilyname" :disabled="isDisabledInsuredpersonName" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>被保険者(名)</div>
                  <el-form-item prop="insuredpersongivenname" label="">
                    <el-input v-model="formData.insuredpersongivenname" :disabled="isDisabledInsuredpersonName" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="relationshipother" label="契約者との関係(補足)">
              <el-input
                :disabled="isDisabledRelationshipother"
                type="textarea"
                :maxlength="20"
                v-model="formData.relationshipother"
              />
            </el-form-item>
            <el-form-item prop="sex" label="性別">
              <el-radio-group v-model="formData.sex">
                <el-radio :value="1" size="large">男</el-radio>
                <el-radio :value="2" size="large">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row :gutter="10">
              <el-col v-bind="baseLayout">
                <el-form-item prop="phonenumber" label="電話番号">
                  <el-input
                    :maxlength="11"
                    v-model="formData.phonenumber"
                    oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="baseLayout">
                <el-form-item prop="email" label="メール">
                  <el-input v-model="formData.email" oninput="value=value.replace(/[^a-zA-Z0-9@.]/g,'')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="生年月日">
              <el-row w-full :gutter="10">
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <el-select-v2 v-model="birthday.year" :options="yearOption" filterable placeholder="年" clearable>
                  </el-select-v2>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <el-select-v2 v-model="birthday.month" :options="monthOption" filterable placeholder="月" clearable>
                  </el-select-v2>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <el-select-v2
                    :disabled="isDisabledHi"
                    v-model="birthday.day"
                    :options="hiOption"
                    filterable
                    placeholder="日"
                    clearable
                  >
                  </el-select-v2>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="age" label="年齢(保険開始時)">
              <el-input v-model="formData.age" />
            </el-form-item>
            <el-form-item prop="" label="年齢(現在)">
              <el-input v-model="formData.nowAge" />
            </el-form-item>
            <el-form-item prop="addresspostcode" label="住所">
              <el-row w-full>
                <el-col :span="21">
                  <el-input
                    :maxlength="7"
                    v-model="formData.addresspostcode"
                    oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                    placeholder="住所(郵便番号)入力してください"
                  />
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" ml-1 style="width: 80px" @click="handleAddressSearch">検索</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="addressprefecture" label="">
              <el-input
                :maxlength="100"
                v-model="formData.addressprefecture"
                placeholder="住所(都道府県)入力してください"
              />
            </el-form-item>
            <el-form-item prop="addressmunicipalities" label="">
              <el-input
                :maxlength="100"
                v-model="formData.addressmunicipalities"
                placeholder="住所(市区町村)入力してください"
              />
            </el-form-item>
            <el-form-item prop="addressother" label="">
              <el-input :maxlength="100" v-model="formData.addressother" placeholder="住所(番地以降)入力してください" />
            </el-form-item>
            <el-form-item prop="remarks" label="保険内容">
              <el-input
                :maxlength="300"
                v-model="formData.remarks"
                type="textarea"
                size="large"
                h-full
                placeholder="Please input"
              />
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item w-full title="社員情報" name="3">
            <el-row :gutter="10">
              <el-col v-bind="baseLayout">
                <el-form-item prop="employeeid" label="社員番号">
                  <el-input
                    :maxlength="8"
                    v-model="formData.employeeid"
                    oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="baseLayout">
                <el-form-item prop="employeeName" label="社員名">
                  <el-input v-model="formData.employeeName" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-bind="baseLayout">
                <el-form-item prop="teamemployeeid" label="共同募集社員番号">
                  <el-input
                    :maxlength="8"
                    v-model="formData.teamemployeeid"
                    oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="baseLayout">
                <el-form-item prop="teamemployeeName" label="共同募集社員名">
                  <el-input v-model="formData.teamemployeeName" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item w-full title="手数料" name="4">
            <el-row :gutter="10">
              <el-col v-bind="baseLayout">
                <el-form-item prop="initialcommission" label="初年度手数料">
                  <el-input v-model="formData.initialcommission" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" />
                </el-form-item>
              </el-col>
              <el-col v-bind="baseLayout">
                <el-form-item prop="paymentmonths" label="支給月数">
                  <el-input
                    :maxlength="2"
                    v-model="formData.paymentmonths"
                    oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col v-bind="baseLayout">
                <el-form-item prop="totalamount" label="総額">
                  <el-input v-model="formData.totalamount" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" />
                </el-form-item>
              </el-col>
              <el-col v-bind="baseLayout">
                <el-form-item prop="paymentpercentage" label="支給比率">
                  <el-input
                    :maxlength="2"
                    v-model="formData.paymentpercentage"
                    oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="paymentmethod" label="支給方式">
              <el-radio-group v-model="formData.paymentmethod">
                <el-radio :value="1">月数支給</el-radio>
                <el-radio :value="2">比率支給</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
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
