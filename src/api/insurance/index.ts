import { request } from "@/utils/service"
import { InsuranceQuery, InsuranceResponseData, InsuranceData, resultsType } from "./types"
import { resOptionType } from "../common"

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
export const deleteInsurance = (insurancecontractid: string) => {
  return request<any>({
    url: `insurance/delete/${insurancecontractid}`,
    method: "delete"
  })
}

//code
export const getCodeList = (data: any) => {
  return request<any>({
    url: "code/list",
    method: "post",
    data
  })
}

// insurancecompany
export const getInsurancecompanyList = () => {
  return request<{ data: resOptionType[] }>({
    url: "insurancecompany/list",
    method: "post"
  })
}

//insuranceproduct
export const getInsuranceproductList = (data: string) => {
  return request<{ data: resOptionType[] }>({
    url: `insuranceproduct/list/${data}`,
    method: "post",
    data
  })
}

// selectById
export const getInsuranceById = (insurancecontractid: number) => {
  return request<{ data: InsuranceData }>({
    url: `insurance/get/${insurancecontractid}`,
    method: "post"
  })
}

// address
export const getAddressCode = (zipcode: string) => {
  return request<resultsType>({
    url: `code/zip/${zipcode}`,
    method: "get"
  })
}
