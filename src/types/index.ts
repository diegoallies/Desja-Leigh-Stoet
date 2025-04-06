export type SheepStatus = 'Healthy' | 'Sick' | 'Sold' | 'Dead'

export interface Sheep {
  id: string
  tag: string
  breed: string
  dob: string
  gender: 'Male' | 'Female'
  status: SheepStatus
  notes?: string
}

export interface Sale {
  id: string
  sheepId: string
  buyerName: string
  price: number
  dateOfSale: string
}
