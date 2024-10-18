import { PaginationType } from "@/hooks/usePagination"

export interface InsuranceQuery extends PaginationType {
  /** 員工番号  */
  employeeId?: number

  /** 員工姓名 */
  employeeName?: string

  /** 保険会社 */
  insuranceCompanyName?: string

  /** 保単番号 */
  insurancecontractnumber?: string
}

/** data */
export interface InsuranceData {
  /**保険会社 */
  insurancecompanyid?: number

  /**保険プラン名 */
  insuranceplanname: string

  /**証券番号 */
  insurancecontractnumber: string

  /**契約者名 カタカナ */
  customernamekana: string

  /**契約者名 漢字 */
  customername: string

  /** 被保険者relation */
  relationship: string

  /** 被保険者カタカナ */
  insurednamekana: string

  /** 被保険者漢字 */
  insuredname: string

  /**性別 */
  customersex: number

  /** 電話番号 */
  customerphonenumber: string

  /** メール */
  customeremail: string

  /** 誕生日 */
  customerbirthday: string

  /**契約日 */
  contractdate: string

  /** 保険金額 */
  contractamount: number

  /** 住所 */
  customeraddress: string

  /** 保険内容 */
  contractdetail: string

  /** 社員番号 */
  employeeid: string
}

export type InsuranceResponseData = ApiResponseData<{ list: InsuranceData[] }>
