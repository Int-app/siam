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

  /** 契約者(セイ) */
  contractorfamilynamek: string

  /**  契約者(メイ) */
  contractorgivennamek: string

  /**  契約者(姓) */
  contractorfamilyname: string

  /** 契約者(名) */
  contractorgivenname: string

  /** 被保険者relation */
  relationship: string

  /**  被保険者(セイ */
  insuredpersonfamilynamek: string

  /**  被保険者(メイ) */
  insuredpersongivennamek: string

  /**  被保険者(姓) */
  insuredpersonfamilyname: string

  /** 被保険者(名) */
  insuredpersongivenname: string

  /**  年齢(保険開始時) */
  age: number

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

  /**  保険開始日 */
  insurancestartdate: string

  /**  解約フラグ */
  iscanceled: number

  /**  解約日  */
  cancellationdate: string

  /**  支払いサイクル */
  paymentcycle?: number

  /**  契約者との関係(補足)  */
  relationshipother: string

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

  /**  社員番号 */
  employeeid: string

  /** 共同募集社員番号 */
  teamemployeeid: string

  /** 初年度手数料 */
  initialcommission: number

  /** 支給方式 */
  paymentmethod: number

  /** 支給月数 */
  paymentmonths: number

  /** 総額 */
  totalamount: number

  /**  支給比率 */
  paymentpercentage: number

  /** 論理削除Flg */
  deleteflag: number

  /** 社員名 */
  employeeName: string

  /**共同募集社員名 */
  teamemployeeName: string
}

export type InsuranceResponseData = ApiResponseData<{ list: InsuranceData[] } & PaginationType>
