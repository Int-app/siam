export interface EmployeeInfoInterface {
  EmployeeId?: number
  EmployeeName: string
  Sex?: 0 | 1
  PhoneNumber: string
  Email: string
  Birthday: string
  Address: string
  HireDate: string
  LeavingDate: number
  EnrollmentStatus: number
  RankId: number
  Remarks: string
}

export interface InsuranceCompanyInterface {
  InsuranceCompanyId: number
  InsuranceCompanyName: string
}
