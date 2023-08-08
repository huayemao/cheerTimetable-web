export type Owner = {
  label: string | undefined
  name: string | undefined
  ownerInfo?: string
}

export enum OwnerType {
  'student' = 'student',
  'teacher' = 'teacher',
  'location' = 'location',
  'profession'='profession'
}
