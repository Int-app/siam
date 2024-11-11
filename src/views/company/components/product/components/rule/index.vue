<script lang="ts" setup>
import { ref, reactive } from "vue"
import { usePagination } from "@/hooks/usePagination"
import { baseLayout } from "../../../../constants"

const { paginationData, handleCurrentChange, handleSizeChange, handleMerge } = usePagination()

const handleSelect = () => {}
</script>

<template>
  <div class="app-container">
    <div flex justify-between mb-3>
      <div>
        <el-button type="primary" @click="handleSelect">ルール追加</el-button>
      </div>
    </div>
    <div mb-3>
      <el-table :data="tableData">
        <el-table-column prop="insurancecompanyName" label="ルールId" align="center" :width="150" />
        <el-table-column prop="insuranceproductid" label="社員ランク" align="center" :width="150" />
        <el-table-column prop="insurancepapersno" label="支給方式" align="center" />
        <el-table-column prop="contractorfamilyname" label="支給月数" align="center" :width="150" />
        <el-table-column prop="contractorgivenname" label="支給比率" align="center" :width="120" />
        <el-table-column prop="insuredpersonfamilynamek" label="支給期間" align="center" :width="150" />
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
  </div>
</template>

<style scoped></style>
