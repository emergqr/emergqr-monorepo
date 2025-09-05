import { Allergy } from './allergy.interface'
import { Deseases } from './disease.interface'
import { Medication } from './medication.interface'

export interface VitalBase {
  blood_group: string
  condition: Deseases
  allergy: Allergy
  medication: Medication
  healthcare_system: string
  active: boolean
}
