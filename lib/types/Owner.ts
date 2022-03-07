export type Owner = {
  label: string
  name: string
  ownerInfo?: string
}

export enum OwnerType {
  'student' = 'student',
  'teacher' = 'teacher',
  'location' = 'location',
}
