<script lang="ts" setup>
import { reactive, ref } from "vue"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { type CreateOrUpdateTableRequestData, type TableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { EmployeeInfoInterface, InsuranceCompanyInterface } from "./types"
import { cloneDeep } from "lodash-es"
import { usePagination } from "@/hooks/usePagination"

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const loading = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const searchFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)

const insuranceCompanyOptions = ref<InsuranceCompanyInterface[]>([])

const searchData = reactive({
  username: "",
  phone: ""
})

//#region 增
const DEFAULT_FORM_DATA: EmployeeInfoInterface = {
  EmployeeId: undefined,
  EmployeeName: "",
  Sex: undefined,
  PhoneNumber: "",
  Email: "",
  Birthday: "",
  Address: "",
  HireDate: "",
  LeavingDate: 0,
  EnrollmentStatus: 0,
  RankId: 0,
  Remarks: ""
}

const formData = ref<EmployeeInfoInterface>(cloneDeep(DEFAULT_FORM_DATA))

const getTableData = () => {
  loading.value = true

  setTimeout(() => (loading.value = false), 1000)
}

const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const handleUpdate = (row: TableData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}

//#region 删
const handleDelete = (row: TableData) => {
  // ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
  //   confirmButtonText: "确定",
  //   cancelButtonText: "取消",
  //   type: "warning"
  // }).then(() => {
  // })
}

const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}

// -------------------------------modal----------------------------
const formRules: FormRules<any> = {
  EmployeeId: [{ required: true, trigger: "blur", message: "選択してください" }],
  Sex: [{ required: true, message: "選択してください" }],
  PhoneNumber: [{ required: true, message: "请输入电话号码" }],
  Email: [{ required: true, message: "请输入email" }],
  HireDate: [{ required: true, message: "请输入生日" }]
}

const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    // const api = formData.value.id === undefined ? createTableDataApi : updateTableDataApi
  })
}
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
          <el-form-item prop="username" label="保険会社">
            <el-input v-model="searchData.username" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="phone" label="保単番号">
            <el-input v-model="searchData.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="phone" label="員工番号">
            <el-input placeholder="请输入" />
          </el-form-item>
          <el-form-item prop="phone" label="員工姓名">
            <el-input placeholder="请输入" />
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
          <el-table-column prop="EmployeeName" label="保険会社" align="center" />
          <el-table-column prop="roles" label="保険プラン名" align="center" />
          <el-table-column prop="phone" label="証券番号" align="center" />
          <el-table-column prop="email" label="契約者名(カタカナ)" align="center" />
          <el-table-column prop="status" label="契約者名(漢字)" align="center" />
          <el-table-column prop="createTime" label="被保険者(続)" align="center" />
          <el-table-column prop="createTime" label="被保険者(カタカナ)" align="center" />
          <el-table-column prop="createTime" label="被保険者(漢字)" align="center" />
          <el-table-column prop="Sex" label="性別" align="center" />
          <el-table-column prop="PhoneNumber" label="電話番号" align="center" />
          <el-table-column prop="Email" label="メール" align="center" />

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
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="formData.EmployeeId === undefined ? '新規保険契約' : '改修保険契約'"
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
            <el-form-item prop="EmployeeId" label="保険会社">
              <el-select v-model="formData.EmployeeId">
                <el-option
                  v-for="item in insuranceCompanyOptions"
                  :key="item.InsuranceCompanyId"
                  :label="item.InsuranceCompanyName"
                  :value="item.InsuranceCompanyId"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="password" label="保険プラン名">
              <el-select>
                <el-option
                  v-for="item in insuranceCompanyOptions"
                  :key="item.InsuranceCompanyId"
                  :label="item.InsuranceCompanyName"
                  :value="item.InsuranceCompanyId"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="" label="証券番号">
              <el-input />
            </el-form-item>
            <el-form-item prop="" label="契約者名">
              <el-row :gutter="2" w-full>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div>カタカナ</div>
                  <el-input />
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <div>漢字</div>
                  <el-input />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="" label="被保険者">
              <el-row :gutter="2" w-full>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>&nbsp;</div>
                  <el-select>
                    <el-option
                      v-for="item in insuranceCompanyOptions"
                      :key="item.InsuranceCompanyId"
                      :label="item.InsuranceCompanyName"
                      :value="item.InsuranceCompanyId"
                    />
                  </el-select>
                </el-col>

                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>カタカナ</div>
                  <el-input />
                </el-col>
                <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                  <div>漢字</div>
                  <el-input />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="Sex" label="性別">
              <el-radio-group v-model="formData.Sex">
                <el-radio :value="0" size="large">男</el-radio>
                <el-radio :value="1" size="large">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="PhoneNumber" label="電話番号">
              <el-input v-model="formData.PhoneNumber" />
            </el-form-item>
            <el-form-item prop="Email" label="メール">
              <el-input v-model="formData.Email" />
            </el-form-item>

            <el-form-item prop="HireDate" label="誕生日">
              <el-date-picker v-model="formData.HireDate" type="date" size="large" />
            </el-form-item>
            <el-form-item prop="LeavingDate" label="契約日">
              <el-date-picker v-model="formData.LeavingDate" type="date" size="large" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="保険金額">
              <el-input />
            </el-form-item>
            <el-form-item prop="Address" label="住所">
              <div min-w-full>
                <div><el-input v-model="formData.Address" /></div>
                <div mt-2 mb-2><el-input /></div>
                <div><el-input /></div>
              </div>
            </el-form-item>
            <el-form-item prop="Remarks" label="保険内容">
              <el-input type="textarea" size="large" h-full placeholder="Please input" />
            </el-form-item>
            <el-form-item label="社員番号">
              <el-input />
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
