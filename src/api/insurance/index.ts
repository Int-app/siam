import { request } from "@/utils/service"
import { InsuranceQuery, InsuranceResponseData, InsuranceData } from "./types"

// list
export const getInsuranceList = (data?: InsuranceQuery) => {
  return request<InsuranceResponseData>({
    url: "insurance/get_list_bypage",
    method: "post",
    data
  })
}

// add
export const addInsurance = (data: InsuranceData) => {
  return request<any>({
    url: "insurance/create",
    method: "post",
    data
  })
}

// update
export const updateInsurance = (data: InsuranceData) => {
  return request<any>({
    url: "insurance/update",
    method: "put",
    data
  })
}

// delete
export const deleteInsurance = (data: InsuranceData) => {
  return request<any>({
    url: "insurance/delete",
    method: "delete",
    data
  })
}
