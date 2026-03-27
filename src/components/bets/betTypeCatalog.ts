import type { BetCreateInput } from '@/api/types'

export type BetTypeCatalogItem = {
  id: string
  label: string
  caption: string
  payloadBetType?: BetCreateInput['bet_type']
}

export const betTypeCatalog: BetTypeCatalogItem[] = [
  {
    id: '2D',
    label: '2D',
    caption: 'Two-digit quick rounds',
    payloadBetType: '2D',
  },
  {
    id: '3D',
    label: '3D',
    caption: 'Three-digit premium rounds',
    payloadBetType: '3D',
  },
]

