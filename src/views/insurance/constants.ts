import { InsuranceData } from "@/api/insurance/types"
import { FormRules } from "element-plus"

//#region 增
export const DEFAULT_FORM_DATA: InsuranceData = {
  insurancecontractid: undefined, // primarykey
  insurancecompanyid: undefined, // 保険会社
  insuranceproductid: "", // 保険プラン名
  insurancepapersno: "", // 証券番号
  contractorfamilynamek: "", // 契約者(セイ)
  contractorgivennamek: "", // 契約者(メイ)
  contractorfamilyname: "", // 契約者(姓)
  contractorgivenname: "", // 契約者(名)
  relationship: "", // 被保険者relation
  insuredpersonfamilynamek: "", //被保険者(セイ
  insuredpersongivennamek: "", // 被保険者(メイ)
  insuredpersonfamilyname: "", //被保険者(姓)
  insuredpersongivenname: "", //被保険者(名)
  age: 0, // 年齢(保険開始時)
  sex: 1, //性別
  phonenumber: "", //電話番号
  email: "", //メール
  birthday: "", //誕生日
  contractdate: "", //契約日
  insurancestartdate: "", // 保険開始日
  iscanceled: 0, //解約フラグ
  cancellationdate: "", //解約日
  paymentcycle: 0, //支払いサイクル
  relationshipother: "", //契約者との関係(補足)
  insuranceamount: 0, //保険金額
  addresspostcode: "", //住所(郵便番号)
  addressprefecture: "", // 住所(都道府県)
  addressmunicipalities: "", // 住所(市区町村)
  addressother: "", //住所(番地以降)
  remarks: "", //保険内容
  employeeid: "", //社員番号
  teamemployeeid: "", // 共同募集社員番号
  initialcommission: 0, // 初年度手数料
  paymentmethod: 1, // 支給方式
  paymentmonths: 0, // 支給月数
  totalamount: 0, //総額
  paymentpercentage: 0, //支給比率
  deleteflag: 0 //論理削除Flg
}

export const relationOptions = [
  { label: "本人", value: 1 },
  { label: "配偶者", value: 2 },
  { label: "父母", value: 3 },
  { label: "子", value: 4 },
  { label: "祖父母", value: 5 },
  { label: "孫", value: 6 },
  { label: "その他", value: 99 }
]

export const paymentcycleOptions = [
  { label: "月払い", value: 1 },
  { label: "年払い", value: 2 }
]

export const formRules: FormRules<any> = {
  insurancecompanyid: [{ required: true, message: "保険会社入力してください" }],
  contractorfamilyname: [{ required: true, message: "契約者(姓)入力してください" }],
  contractorgivenname: [{ required: true, message: "契約者(名)入力してください" }],
  contractorfamilynamek: [{ required: true, message: "契約者(セイ)入力してください" }],
  contractorgivennamek: [{ required: true, message: "契約者(メイ)入力してください" }],
  contractdate: [{ required: true, message: "契約日選択してください" }],
  insurancestartdate: [{ required: true, message: "保険開始日選択してください" }],
  insuranceamount: [{ required: true, message: "保険金額入力してください" }],
  relationship: [{ required: true, message: "契約者との関係選択してください" }],
  insuredpersonfamilyname: [{ required: true, message: "被保険者(姓)入力してください" }],
  insuredpersongivenname: [{ required: true, message: "被保険者(名)入力してください" }],
  insuredpersonfamilynamek: [{ required: true, message: "被保険者(セイ)入力してください" }],
  insuredpersongivennamek: [{ required: true, message: "被保険者(メイ)入力してください" }],
  sex: [{ required: true, message: "性別選択してください" }],
  employeeid: [{ required: true, message: "社員番号入力してください" }],
  initialcommission: [{ required: true, message: "初年度手数料入力してください" }],
  paymentmethod: [{ required: true, message: "支給方式選択してください" }] //
}
