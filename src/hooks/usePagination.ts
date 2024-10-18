import { reactive } from "vue"

interface DefaultPaginationData {
  total: number
  pageNum: number
  pageSizes: number[]
  pageSize: number
}

interface PaginationData {
  total?: number
  pageNum?: number
  pageSizes?: number[]
  pageSize?: number
}

export type PaginationType = Partial<Pick<PaginationData, "pageSize" | "total" | "pageNum">>

/** 默认的分页参数 */
const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  pageNum: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10
}

export function usePagination(initialPaginationData: PaginationData = {}) {
  /** 合并分页参数 */
  const paginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })
  /** 改变当前页码 */
  const handleCurrentChange = (value: number) => {
    paginationData.pageNum = value
  }
  /** 改变页面大小 */
  const handleSizeChange = (value: number) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}
