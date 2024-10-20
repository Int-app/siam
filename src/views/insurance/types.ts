import { InsuranceData } from "@/api/insurance/types"

export interface InsuranceCompanyInterface {
  InsuranceCompanyId: number
  InsuranceCompanyName: string
}

export type TableData = Omit<
  InsuranceData,
  "customerbirthday" | "contractdate" | "contractamount" | "customeraddress" | "contractdetail" | "employeeid"
>

export type OptionType = { label: string; value: any; disabled?: boolean }
