<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue"
import { type FormInstance, ElMessage, ElMessageBox, CollapseModelValue, dayjs } from "element-plus"
import { cloneDeep, concat, fill, map } from "lodash-es"
import type { InsuranceData, TableData } from "@/api/insurance/types"
import { DEFAULT_FORM_DATA, relationOptions, paymentcycleOptions, baseLayout } from "../constants"
import { COLLAPSE_TITLE, YEAR_TYPE, PAY_METHODS } from "../enums"
import type { OptionType } from "../types"
import { getLastDay, mapDataToOption } from "../utils"
import {
  addInsurance,
  updateInsurance,
  getInsuranceproductList,
  getAddressCode,
  getEmployeeInfoList
} from "@/api/insurance"
import { useUserStore } from "@/store/modules/user"

interface Props {
  getTableData: () => void
  insuranceCompanyOptions: OptionType[]
}

const props = withDefaults(defineProps<Props>(), {
  insuranceCompanyOptions: () => [] as OptionType[],
  getTableData: () => {}
})

const loading = defineModel()
const userStore = useUserStore()

const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<InsuranceData & { nowAge?: number }>(cloneDeep(DEFAULT_FORM_DATA))
const activeNames = ref<CollapseModelValue>([COLLAPSE_TITLE.契約情報])

const insuranceproductidOptions = ref<OptionType[]>([])
const employeeInfoOptions = ref<OptionType[]>([])

const birthday = ref({
  year: "",
  month: "",
  day: ""
})

const yearOption = computed(() => {
  const nowYear = dayjs().get("year")
  if (formData.value.type === YEAR_TYPE.和暦) {
    const res = []
    // 明治1868 - 1912
    const year1 = new Array(1912 - 1868)
      .fill(0)
      .map((_, index) => ({ label: `明治${index + 1}年`, value: String(1868 + index) }))
    // 大正1912 - 1926
    const year2 = new Array(1926 - 1912)
      .fill(0)
      .map((_, index) => ({ label: `大正${index + 1}年`, value: String(1912 + index) }))
    // 昭和1927 - 1989
    const year3 = new Array(1989 - 1927)
      .fill(0)
      .map((_, index) => ({ label: `昭和${index + 1}年`, value: String(1927 + index) }))
    // 平成1989 - 2019
    const year4 = new Array(2019 - 1989)
      .fill(0)
      .map((_, index) => ({ label: `平成${index + 1}年`, value: String(1989 + index) }))
    // 令和 2019
    const year5 = new Array(nowYear - 2019)
      .fill(0)
      .map((_, index) => ({ label: `令和${index + 1}`, value: String(2019 + index) }))
    return res.concat(year1, year2, year3, year4, year5)
  }

  return new Array(nowYear)
    .fill(0)
    .map((_, index) => ({ label: index + 1, value: String(index + 1) }))
    .filter((_, index) => index >= 1900)
})
const monthOption = new Array(12).fill(0).map((_, index) => ({ label: index + 1, value: String(index + 1) }))

const handleChange = (val: CollapseModelValue) => {
  console.log("val", val, activeNames.value)
}

const isDisabledRelationshipother = computed(
  () => Number(formData.value.relationship) !== relationOptions[relationOptions.length - 1].value
)

const isDisabledHi = computed(() =>
  birthday.value.year?.length > 0 && birthday.value.month?.length > 0 ? false : true
)

const hiOption = computed(() => {
  const lastIndex = getLastDay(Number(birthday.value.year), Number(birthday.value.month))
  const arr = new Array(lastIndex).fill(0).map((_, index) => ({ label: index + 1, value: String(index + 1) }))
  return arr
})

const isDisabledPayMethods = computed(() => formData.value.paymentmethod === PAY_METHODS.月数支給)

const formRules = {
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
  teamemployeeid: [{ required: true, message: "共同募集社員番号入力してください" }],
  initialcommission: [{ required: true, message: "初年度手数料入力してください" }],
  paymentmethod: [{ required: true, message: "支給方式選択してください" }],
  email: [
    {
      validator: function (rule: any, value: string, callback: (arg?: Error) => void) {
        if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) == false) {
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
  getEmployeeInfoList().then((res) => {
    employeeInfoOptions.value = res.data.map((item) => ({ label: item.value, value: item.value, text: item.text }))
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
      formData.value = {
        ...formData.value,
        insuredpersonfamilyname: formData.value.contractorfamilyname,
        insuredpersongivenname: formData.value.contractorgivenname,
        insuredpersongivennamek: formData.value.contractorgivennamek,
        insuredpersonfamilynamek: formData.value.contractorfamilynamek
      }
    } else {
      const resetArray = [
        "insuredpersonfamilyname",
        "insuredpersongivenname",
        "insuredpersongivennamek",
        "insuredpersonfamilynamek"
      ]
      formRef.value?.resetFields(resetArray)
    }
  }
)

watch(
  () => birthday.value.day,
  () => {
    formData.value.birthday = `${birthday.value.year}/${birthday.value.month}/${birthday.value.day}`
    formData.value.nowAge = dayjs().year() - Number(birthday.value.year)
  }
)

watch(
  () => formData.value.type,
  () => {
    birthday.value = {
      ...birthday.value,
      year: "",
      month: "",
      day: ""
    }
  }
)

watch(
  () => formData.value.paymentmethod,
  (newValue) => {
    if (newValue === PAY_METHODS.月数支給) {
      formData.value.paymentpercentage = undefined
    } else {
      formData.value.paymentmonths = undefined
    }
  }
)

const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}

const handleAddressSearch = () => {
  if (formData.value.addresspostcode) {
    getAddressCode(formData.value.addresspostcode).then((res) => {
      formData.value.addressprefecture = res.data.results[0]?.address1 + res.data.results[0]?.address2
      formData.value.addressmunicipalities = res.data.results[0]?.address3
    })
  }
}

const handleEmployeeidChange = () => {
  formData.value.employeeName =
    employeeInfoOptions.value.find((item) => item.value === formData.value.employeeid)?.text ?? ""
}

const handleTeamemployeeidChange = () => {
  formData.value.teamemployeeName =
    employeeInfoOptions.value.find((item) => item.value === formData.value.teamemployeeid)?.text ?? ""
}

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
        props.getTableData()
      })
      .finally(() => (loading.value = false))
  })
}

const setFormValue = (value: any) => {
  formData.value = value

  if (value.birthday?.length > 0) {
    const ymrDate = dayjs(value.birthday)
    birthday.value.year = ymrDate.year().toString()
    birthday.value.month = (ymrDate.month() + 1).toString()
    birthday.value.day = ymrDate.date().toString()
  }
}

const setDialogVisible = (value: boolean) => {
  dialogVisible.value = value
}

const resetFormValue = () => {
  birthday.value = {
    ...birthday.value,
    year: "",
    month: "",
    day: ""
  }
  formData.value = {
    ...formData.value,
    employeeid: userStore.employeeId,
    employeeName: userStore.employeeName,
    nowAge: undefined
  }
  activeNames.value = [COLLAPSE_TITLE.契約情報]
  formRef.value?.resetFields()
}

defineExpose({
  setFormValue,
  setDialogVisible,
  resetFormValue
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formData.insurancecontractid === undefined ? '新規' : '編集'"
    @closed="resetForm"
    :open-delay="500"
    width="60%"
  >
    <el-form
      flex
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      label-position="left"
      class="modal-form"
    >
      <el-collapse w-full v-bind:model-value="activeNames" @change="handleChange" simple>
        <el-collapse-item w-full :title="COLLAPSE_TITLE[COLLAPSE_TITLE.契約情報]" :name="COLLAPSE_TITLE.契約情報">
          <el-form-item v-show="false" prop="insurancecontractid" label="primarykey">
            <el-input v-model="formData.insurancecontractid" />
          </el-form-item>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="insurancecompanyid" label="保険会社">
                <el-select-v2 v-model="formData.insurancecompanyid" :options="insuranceCompanyOptions" clearable>
                </el-select-v2>
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="insuranceproductid" label="保険商品名">
                <el-select-v2 v-model="formData.insuranceproductid" :options="insuranceproductidOptions" clearable>
                </el-select-v2>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col v-bind="baseLayout">
              <el-form-item prop="insurancepapersno" label="証券番号">
                <el-input v-model="formData.insurancepapersno" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="contractdate" label="契約日">
                <el-date-picker
                  v-model="formData.contractdate"
                  format="YYYY/MM/DD"
                  value-format="YYYY/MM/DD"
                  type="date"
                  size="large"
                  style="width: 100%"
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
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="insuranceamount" label="保険金額">
                <el-input v-model="formData.insuranceamount" oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
                  <template #append>円</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="paymentcycle" label="支払いサイクル">
                <el-select-v2 v-model="formData.paymentcycle" :options="paymentcycleOptions"></el-select-v2>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item
          w-full
          :title="COLLAPSE_TITLE[COLLAPSE_TITLE.被保険者情報]"
          :name="COLLAPSE_TITLE.被保険者情報"
        >
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="contractorfamilynamek" label="契約者名">
                <el-input v-model="formData.contractorfamilynamek" placeholder="契約者(セイ)" />
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="contractorgivennamek">
                <el-input v-model="formData.contractorgivennamek" placeholder="契約者(メイ)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="contractorfamilyname" label="">
                <el-input v-model="formData.contractorfamilyname" placeholder="契約者(姓)" />
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="contractorgivenname" label="">
                <el-input v-model="formData.contractorgivenname" placeholder="契約者(名)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item label="被保険者名">
                <el-select-v2 v-model="formData.relationship" :options="relationOptions" clearable> </el-select-v2>
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="relationshipother" label="契約者との関係(補足)">
                <el-input :disabled="isDisabledRelationshipother" v-model="formData.relationshipother" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="insuredpersonfamilynamek" label="">
                <el-input v-model="formData.insuredpersonfamilynamek" placeholder="被保険者(セイ)" />
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="insuredpersongivennamek">
                <el-input v-model="formData.insuredpersongivennamek" placeholder="被保険者(メイ)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="insuredpersonfamilyname" label="">
                <el-input v-model="formData.insuredpersonfamilyname" placeholder="被保険者(姓)" />
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="insuredpersongivenname" label="">
                <el-input v-model="formData.insuredpersongivenname" placeholder="被保険者(名)" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="sex" label="性別">
            <el-radio-group v-model="formData.sex">
              <el-radio :value="1" size="large">男</el-radio>
              <el-radio :value="2" size="large">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="10" flex justify-between>
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
            <el-row :gutter="10" flex justify-between w-full>
              <el-col>
                <el-radio-group v-model="formData.type">
                  <el-radio :value="1">西暦</el-radio>
                  <el-radio :value="2">和暦</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="8">
                <el-select-v2
                  v-model="birthday.year"
                  :options="yearOption"
                  filterable
                  placeholder="年"
                  clearable
                  @change="() => (birthday.day = '')"
                >
                </el-select-v2>
              </el-col>
              <el-col :span="8">
                <el-select-v2
                  v-model="birthday.month"
                  :options="monthOption"
                  filterable
                  placeholder="月"
                  clearable
                  @change="() => (birthday.day = '')"
                >
                </el-select-v2>
              </el-col>
              <el-col :span="8">
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
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="age" label="年齢(保険開始時)">
                <el-input v-model="formData.age" />
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="" label="年齢(現在)">
                <el-input v-model="formData.nowAge" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="addresspostcode" label="住所">
            <el-row w-full>
              <el-col :span="8">
                <el-input
                  :maxlength="7"
                  v-model="formData.addresspostcode"
                  oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                  placeholder="住所(郵便番号)"
                />
              </el-col>
              <el-col :span="3">
                <el-button type="primary" ml-1 style="width: 80px" @click="handleAddressSearch">検索</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="addressprefecture" label="">
            <el-input :maxlength="100" v-model="formData.addressprefecture" placeholder="住所(都道府県)" />
          </el-form-item>
          <el-form-item prop="addressmunicipalities" label="">
            <el-input :maxlength="100" v-model="formData.addressmunicipalities" placeholder="住所(市区町村)" />
          </el-form-item>
          <el-form-item prop="addressother" label="">
            <el-input :maxlength="100" v-model="formData.addressother" placeholder="住所(番地以降)" />
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
        <el-collapse-item w-full :title="COLLAPSE_TITLE[COLLAPSE_TITLE.社員情報]" :name="COLLAPSE_TITLE.社員情報">
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="employeeid" label="社員番号">
                <el-select-v2
                  v-model="formData.employeeid"
                  :options="employeeInfoOptions"
                  @change="handleEmployeeidChange"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="employeeName" label="社員名">
                <el-input :disabled="true" v-model="formData.employeeName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="teamemployeeid" label="共同募集社員番号">
                <el-select-v2
                  v-model="formData.teamemployeeid"
                  :options="employeeInfoOptions"
                  @change="handleTeamemployeeidChange"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="teamemployeeName" label="共同募集社員名">
                <el-input :disabled="true" v-model="formData.teamemployeeName" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item w-full :title="COLLAPSE_TITLE[COLLAPSE_TITLE.手数料]" :name="COLLAPSE_TITLE.手数料">
          <el-form-item prop="paymentmethod" label="支給方式">
            <el-radio-group v-model="formData.paymentmethod">
              <el-radio :value="1">月数支給</el-radio>
              <el-radio :value="2">比率支給</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="initialcommission" label="初年度手数料">
                <el-input v-model="formData.initialcommission" oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
                  <template #append>円</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="paymentmonths" label="支給月数">
                <el-input
                  :maxlength="2"
                  :disabled="!isDisabledPayMethods"
                  v-model="formData.paymentmonths"
                  oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" flex justify-between>
            <el-col v-bind="baseLayout">
              <el-form-item prop="totalamount" label="総額">
                <el-input v-model="formData.totalamount" oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
                  <template #append>円</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col v-bind="baseLayout">
              <el-form-item prop="paymentpercentage" label="支給比率">
                <el-input
                  :maxlength="2"
                  :disabled="isDisabledPayMethods"
                  v-model="formData.paymentpercentage"
                  oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                >
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <template #footer>
      <el-button :disabled="true">解約</el-button>
      <el-button :disabled="true">失効</el-button>
      <el-button type="primary" @click="handleCreateOrUpdate" v-model="loading">登録</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label::before) {
  content: "";
  margin-right: 0;
}
:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label::after) {
  color: var(--el-color-danger);
  content: "*";
  font-size: 24px;
  margin-left: 4px;
}
</style>
