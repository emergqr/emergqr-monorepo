/**
 * Define los tipos de signos vitales que se pueden registrar.
 * Basado en el schema 'VitalSignType' de openapi.json.
 */
export type VitalSignType =
  | 'Blood Pressure'
  | 'Heart Rate'
  | 'Blood Glucose'
  | 'Body Temperature'
  | 'Respiratory Rate'
  | 'Oxygen Saturation'
  | 'Weight'
  | 'Height'
  | 'Body Mass Index (BMI)'
  | 'Other'

/**
 * Representa un registro de signo vital leído desde la API.
 * Basado en el schema 'VitalSignRead' de openapi.json.
 */
export interface VitalSignRead {
  uuid: string
  type: VitalSignType
  value_numeric: number | null
  value_secondary: number | null
  value_text: string | null
  unit: string | null
  measured_at: string // ISO date-time string
  notes: string | null
  show_in_emergency: boolean
  created_at: string // ISO date-time string
}

/**
 * Schema para crear un nuevo registro de signo vital.
 * Basado en el schema 'VitalSignCreate' de openapi.json.
 */
export type VitalSignCreate = Omit<VitalSignRead, 'uuid' | 'created_at'>

/**
 * Schema para actualizar un registro de signo vital.
 * Basado en el schema 'VitalSignUpdate' de openapi.json.
 */
export interface VitalSignUpdate {
  type?: VitalSignType | null
  value_numeric?: number | null
  value_secondary?: number | null
  value_text?: string | null
  unit?: string | null
  measured_at?: string | null
  notes?: string | null
  // Campos de la API que no están en el formulario pero pueden ser parte de una actualización
  device_name?: string | null
  is_manual?: boolean | null
  show_in_emergency?: boolean | null
}
