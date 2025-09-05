/**
 * Representa una enfermedad del sistema (maestro de enfermedades).
 * Basado en el schema 'DiseaseRead' de openapi.json.
 */
export interface DiseaseRead {
  uuid: string
  name: string
  icd10_code: string
  snomed_ct_code: string | null
  category: string | null
  description: string | null
}

/**
 * Representa la asociación de una enfermedad con un paciente.
 * Basado en el schema 'PatientDiseaseRead' de openapi.json.
 */
export interface PatientDiseaseRead {
  uuid: string
  diagnosis_date: string // ISO date string
  severity: string | null
  notes: string | null
  is_active: boolean
  show_in_emergency: boolean
  disease: DiseaseRead
}

/**
 * Schema para asociar una enfermedad existente a un paciente.
 * Basado en el schema 'PatientDiseaseCreate' de openapi.json.
 */
export interface PatientDiseaseCreate {
  disease_uuid: string
  diagnosis_date: string // ISO date string
  severity?: string | null
  notes?: string | null
  is_active?: boolean
  show_in_emergency?: boolean
}

/**
 * Schema para actualizar los detalles de la asociación.
 * Basado en el schema 'PatientDiseaseUpdate' de openapi.json.
 */
export interface PatientDiseaseUpdate {
  diagnosis_date?: string | null
  severity?: string | null
  notes?: string | null
  is_active?: boolean | null
  show_in_emergency?: boolean | null
}
