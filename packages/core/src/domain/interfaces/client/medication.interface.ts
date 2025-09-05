/**
 * @file Contiene las interfaces para la gestión de planes de medicación.
 * @basedon Módulo 5 del Plan de Implementación.
 */

/**
 * Representa un recordatorio individual para una medicación.
 */
export interface Reminder {
  uuid: string
  time: string // Formato HH:mm, ej: "08:00"
  enabled: boolean
}

/**
 * Representa un plan de medicación tal como se lee desde la API.
 */
export interface MedicationScheduleRead {
  uuid: string
  medicationName: string
  dosage: string // ej: "1 pastilla", "10mg"
  frequency: 'daily' | 'weekly' | 'custom'
  startDate: string // Fecha en formato ISO 8601
  endDate?: string | null // Fecha en formato ISO 8601
  reminders: Reminder[]
  notes?: string | null
}

/**
 * Define la estructura de datos para crear un nuevo plan de medicación.
 */
export interface MedicationScheduleCreate {
  medicationName: string
  dosage: string
  frequency: 'daily' | 'weekly' | 'custom'
  timeSlots: string[] // ej: ["08:00", "20:00"]
  startDate: string
  endDate?: string | null
  notes?: string | null
}

/**
 * Define la estructura para actualizar un plan de medicación existente.
 * Todos los campos son opcionales.
 */
export type MedicationScheduleUpdate = Partial<MedicationScheduleCreate>
