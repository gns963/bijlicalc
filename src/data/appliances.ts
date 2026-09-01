import appliancesJson from './appliances.json'

export interface ApplianceRef {
  name: string
  watts: number
  typicalHoursPerDay: number
  iseer?: number
  dutyCycle?: number
  category: string
}

export const APPLIANCE_CATEGORIES: { category: string; appliances: ApplianceRef[] }[] =
  appliancesJson.categories.map((c) => ({
    category: c.category,
    appliances: c.appliances.map((a) => ({ ...a, category: c.category })),
  }))

export const ALL_APPLIANCES: ApplianceRef[] = APPLIANCE_CATEGORIES.flatMap((c) => c.appliances)

export function findAppliance(name: string): ApplianceRef | undefined {
  return ALL_APPLIANCES.find((a) => a.name === name)
}
