import { resOptionType } from "@/api/common"
import { OptionType } from "./types"

export const mapDataToOption = (data: resOptionType[]): OptionType[] => {
  return data.map((item) => ({ ...item, label: item.text }))
}

export function getLastDay(year: number, month: number) {
  const isLeapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
  const maxDays = [1, 3, 5, 7, 8, 10, 12]
  const middleDays = [4, 6, 9, 11]
  month = Number(month)
  if (month == 2) {
    if (isLeapYear) {
      return 29
    } else {
      return 28
    }
  } else if (maxDays.includes(month)) {
    return 31
  } else if (middleDays.includes(month)) {
    return 30
  }
}
