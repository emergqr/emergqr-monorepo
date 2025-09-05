/**
 * Define la estructura de datos que se envía para registrar un nuevo usuario.
 * Se basa en el esquema 'ClientRegister' de openapi.json.
 * El campo 'passwordRepeat' se maneja en la UI y se omite aquí.
 */
export interface RegisterPayload {
  email: string
  password: string
  name?: string | null
  phone?: string | null
  birth_date?: string | null
  sex?: string | null
  occupation?: string | null
  preferred_language?: string | null
}
