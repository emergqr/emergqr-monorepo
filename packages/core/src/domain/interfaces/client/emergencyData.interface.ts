/**
 * Representa la estructura de los datos de emergencia de un cliente,
 * tal como se define en los esquemas 'EmergDataResponse' y 'EmergDataCreate'
 * del archivo openapi.json.
 *
 * @notice La especificación de la API contiene un typo ('bird_date') que se
 * respeta aquí para mantener la consistencia con el backend.
 */
export interface EmergencyData {
  bird_date?: string | null
  direccion?: string | null
  blood?: string | null
  diseases?: string | null
  allergies?: string | null
  medications?: string | null
  social_security_health_system?: string | null
}

/**
 * Define la estructura para actualizar los datos de emergencia.
 * Todos los campos son opcionales.
 */
export type EmergencyDataUpdate = Partial<EmergencyData>

/**
 * Define la estructura para crear datos de emergencia.
 * Es idéntica a EmergencyData, pero se usa para mayor claridad semántica.
 */
export type EmergencyDataCreate = EmergencyData
