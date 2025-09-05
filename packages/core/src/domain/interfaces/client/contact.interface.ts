/**
 * Esquema de respuesta para un Contacto, tal como lo devuelve la API.
 * Basado en el schema 'ContactRead' de openapi.json.
 */
export interface Contact {
  name: string
  email: string
  phone: string
  uuid: string
  relationship_type: string
  is_emergency_contact: boolean
}

/**
 * Esquema para crear un nuevo Contacto.
 * Basado en el schema 'ContactCreate' de openapi.json.
 * No incluye 'uuid' porque es generado por el backend.
 */
export interface ContactCreate {
  name: string
  email: string
  phone: string
  relationship_type: string
  is_emergency_contact?: boolean
}

/**
 * Esquema para actualizar un Contacto existente. Todos los campos son opcionales.
 * Basado en el schema 'ContactUpdate' de openapi.json.
 * Usamos 'Partial' para indicar que cualquier subconjunto de campos de ContactCreate es válido.
 */
export type ContactUpdate = Partial<ContactCreate>
