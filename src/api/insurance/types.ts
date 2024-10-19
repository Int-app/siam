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
  /** primarykey */
  insurancecontractid?: number

  /**保険会社 */
  insurancecompanyid?: number

  /**保険プラン名 */
  insuranceproductid: string

  /**証券番号 */
  insurancepapersno: string

  /**契約者名 カタカナ */
  contractorfamilyname: string

  /**契約者名 漢字 */
  contractorgivenname: string

  /** 被保険者relation */
  insuredpersonfamilynamek: string

  /** 被保険者カタカナ */
  insuredpersonfamilyname: string

  /** 被保険者漢字 */
  insuredpersongivenname: string

  /**性別 */
  sex: number

  /** 電話番号 */
  phonenumber: string

  /** メール */
  email: string

  /** 誕生日 */
  birthday: string

  /**契約日 */
  contractdate: string

  /** 保険金額 */
  insuranceamount: number

  /** 住所(郵便番号) */
  addresspostcode: string

  /**住所(都道府県) */
  addressprefecture: string

  /** 住所(市区町村) */
  addressmunicipalities: string

  /**住所(番地以降) */
  addressother: string

  /** 保険内容 */
  remarks: string

  /** 社員番号 */
  teamemployeeid: string
}

export type InsuranceResponseData = ApiResponseData<{ list: InsuranceData[] } & PaginationType>
