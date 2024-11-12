import AddOrEdditModal from "./components/AddOrEdditModal.vue"
export interface InsuranceCompanyInterface {
  InsuranceCompanyId: number
  InsuranceCompanyName: string
}

export type OptionType = { label: string; value: any; disabled?: boolean; text?: any }
export type AddOrEdditModalRefType =
  | (InstanceType<typeof AddOrEdditModal> & {
      setDialogVisible: (value: boolean) => void
      resetFormValue: () => void
      setFormValue: (value: object) => void
    })
  | null
