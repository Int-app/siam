import { resOptionType } from "@/api/common"
import { OptionType } from "./types"

export const mapDataToOption = (data: resOptionType[]): OptionType[] => {
  return data.map((item) => ({ ...item, label: item.text }))
}
