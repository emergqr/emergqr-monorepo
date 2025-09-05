/**
 * Basado en los schemas MedicalEvent y MedicalDocument de openapi.json
 */

/**
 * Tipos de eventos médicos permitidos por el sistema.
 * Coincide con el schema MedicalEventType.
 */
export type MedicalEventType =
  | 'Cirugía'
  | 'Estudio de Imagen'
  | 'Análisis de Laboratorio'
  | 'Tratamiento'
  | 'Cita Médica'
  | 'Procedimiento Estético'
  | 'Otro'

/**
 * Representa un documento médico adjunto a un evento.
 * Coincide con el schema MedicalDocumentRead.
 */
export interface MedicalDocumentRead {
  uuid: string
  file_name: string
  mime_type: string
  description?: string | null
  url: string // Propiedad de solo lectura generada por el backend
}

/**
 * Representa un evento médico completo, tal como se lee desde la API.
 * Coincide con el schema MedicalEventRead.
 */
export interface MedicalEventRead {
  uuid: string
  event_type: MedicalEventType
  title: string
  description?: string | null
  event_date: string // Formato ISO 8601 (date-time)
  location?: string | null
  doctor_name?: string | null
  details?: Record<string, unknown> | null
  documents: MedicalDocumentRead[]
}

export type MedicalEventCreate = Omit<MedicalEventRead, 'uuid' | 'documents'>

export type MedicalEventUpdate = Partial<MedicalEventCreate>
