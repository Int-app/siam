<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, CollapseModelValue } from "element-plus"
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
import { DEFAULT_FORM_DATA, relationOptions, formRules, paymentcycleOptions } from "./constants"
import MlTableColumn from "ml-table-column"

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
          <el-button type="primary" :icon="Search" @click="handleSearch">検索</el-button>
          <el-button :icon="Refresh" @click="resetSearch">クリア</el-button>
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
          <ml-table-column prop="insurancecompanyid" label="保険会社" align="center" />
          <ml-table-column prop="insuranceproductid" label="保険プラン名" align="center" />
          <ml-table-column prop="insurancepapersno" label="証券番号" align="center" />
          <ml-table-column prop="contractorfamilyname" label="契約者名(カタカナ)" align="center" width="150" />
          <ml-table-column prop="contractorgivenname" label="契約者名(漢字)" align="center" width="150"/>
          <ml-table-column prop="insuredpersonfamilynamek" label="被保険者(続)" align="center" />
          <ml-table-column prop="insuredpersonfamilyname" label="被保険者(カタカナ)" align="center" width="150"/>
          <ml-table-column prop="insuredpersongivenname" label="被保険者(漢字)" align="center" width="150"/>
          <el-table-column prop="sex" label="性別" align="center" />
          <ml-table-column prop="phonenumber" label="電話番号" align="center" />
          <ml-table-column prop="email" label="メール" align="center" />

          <el-table-column fixed="right" label="操作" width="150" align="center">
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
			<el-row>
				<el-col :span="12">
		            <el-form-item prop="insurancecompanyid" label="保険会社">
		              <el-select-v2 v-model="formData.insurancecompanyid" :options="insuranceCompanyOptions" clearable>
		              </el-select-v2>
		            </el-form-item>
				</el-col>
				<el-col :span="12"l>
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
			<el-row>
				<el-col :span="12">
		            <el-form-item prop="contractdate" label="契約日">
		              <el-date-picker
		                v-model="formData.contractdate"
		                format="YYYY-MM-DD"
		                value-format="YYYY-MM-DD"
		                type="date"
		                size="large"
		              />
		            </el-form-item>
				</el-col>
				<el-col :span="12">
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
			</el-row>
			<el-row>
				<el-col :span="12">
		            <el-form-item prop="insuranceamount" label="保険金額">
		              <el-input v-model="formData.insuranceamount" />
		            </el-form-item>
				</el-col>
				<el-col :span="12">
		            <el-form-item prop="paymentcycle" label="支払いサイクル">
		              <el-select-v2 v-model="formData.paymentcycle" :options="paymentcycleOptions"></el-select-v2>
		            </el-form-item>
				</el-col>
			</el-row>
          </el-collapse-item>
          <el-collapse-item w-full title="被保険者情報" name="2">
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
            <el-form-item prop="sex" label="性別">
              <el-radio-group v-model="formData.sex">
                <el-radio :value="1" size="large">男</el-radio>
                <el-radio :value="2" size="large">女</el-radio>
              </el-radio-group>
            </el-form-item>
			<el-row>
				<el-col :span="12">
		            <el-form-item prop="phonenumber" label="電話番号">
		              <el-input v-model="formData.phonenumber" />
		            </el-form-item>
				</el-col>
				<el-col :span="12">
		            <el-form-item prop="email" label="メール">
		              <el-input v-model="formData.email" />
		            </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
				    <el-form-item prop="insurancecompanyid" label="生年月日">
				      <el-select-v2 v-model="formData.insurancecompanyid" :options="insuranceCompanyOptions" clearable>
				      </el-select-v2>
				    </el-form-item>
				</el-col>
				<el-col :span="8">
				    <el-form-item prop="insurancecompanyid" label="">
				      <el-select-v2 v-model="formData.insurancecompanyid" :options="insuranceCompanyOptions" clearable>
				      </el-select-v2>
				    </el-form-item>
				</el-col>
				<el-col :span="8">
				    <el-form-item prop="insurancecompanyid" label="">
				      <el-select-v2 v-model="formData.insurancecompanyid" :options="insuranceCompanyOptions" clearable>
				      </el-select-v2>
				    </el-form-item>
				</el-col>
			</el-row>
            <el-form-item prop="age" label="年齢(保険開始時)">
              <el-input v-model="formData.age" />
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
			<el-form-item prop="addressmunicipalities" label="">
			  <el-input v-model="formData.addressmunicipalities" />
			</el-form-item>			
            <el-form-item prop="remarks" label="保険内容">
              <el-input v-model="formData.remarks" type="textarea" size="large" h-full placeholder="Please input" />
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item w-full title="社員情報" name="3">
			<el-row>
				<el-col :span="12">
            <el-form-item prop="teamemployeeid" label="社員番号">
              <el-input v-model="formData.employeeid" />
            </el-form-item>
				</el-col>
					<el-col :span="12">
				<el-form-item prop="teamemployeeid" label="社員名">
				  <el-input v-model="formData.employeeid" />
				</el-form-item>
					</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item prop="teamemployeeid" label="共同募集社員番号">
					  <el-input v-model="formData.employeeid" />
					</el-form-item>
				</el-col>
					<el-col :span="12">
						<el-form-item prop="teamemployeeid" label="共同募集社員名">
						  <el-input v-model="formData.employeeid" />
						</el-form-item>
					</el-col>
			</el-row>
          </el-collapse-item>
				<el-collapse-item w-full title="手数料" name="4">
					<el-row>
						<el-col  :span="12">
						  <el-form-item prop="initialcommission" label="初年度手数料">
						    <el-input v-model="formData.initialcommission" />
						  </el-form-item>
					 	 </el-col>
					  	<el-col  :span="12">
							<el-form-item prop="initialcommission" label="支給月数">
							  <el-input v-model="formData.initialcommission" />
							</el-form-item>
						</el-col>
		  			</el-row>
					<el-row>
						<el-col  :span="12">
							<el-form-item prop="initialcommission" label="総額">
							  <el-input v-model="formData.initialcommission" />
							</el-form-item>
						</el-col>
						<el-col  :span="12">
							<el-form-item prop="initialcommission" label="支給比率">
							  <el-input v-model="formData.initialcommission" />
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
