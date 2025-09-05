/**
 * @file Servicio para gestionar las operaciones CRUD de los planes de medicación del usuario.
 */
import {
  MedicationScheduleCreate,
  MedicationScheduleRead,
  MedicationScheduleUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/medication.interface'

// Mock de apiHandler para el ejemplo
const apiHandler = {
  get: async (path: string): Promise<MedicationScheduleRead[]> => {
    console.log(`GET: ${path}`)
    return []
  },
  // Se ha reemplazado 'any' por el tipo específico que espera la función.
  post: async (
    path: string,
    data: MedicationScheduleCreate,
  ): Promise<MedicationScheduleRead> => {
    console.log(`POST: ${path}`, data)
    // Se castea el resultado para que coincida con el tipo de retorno esperado.
    return { uuid: 'new-uuid', ...data } as unknown as MedicationScheduleRead
  },
  // Se ha reemplazado 'any' por el tipo específico que espera la función.
  patch: async (
    path: string,
    data: MedicationScheduleUpdate,
  ): Promise<void> => {
    console.log(`PATCH: ${path}`, data)
    return
  },
  delete: async (path: string): Promise<void> => {
    console.log(`DELETE: ${path}`)
    return
  },
}

const API_ENDPOINT = '/medication-schedules'

/**
 * Obtiene todos los planes de medicación del usuario actual.
 */
export const getMySchedules = async (): Promise<MedicationScheduleRead[]> => {
  return await apiHandler.get(`${API_ENDPOINT}/my`)
}

/**
 * Crea un nuevo plan de medicación.
 */
export const createSchedule = async (
  data: MedicationScheduleCreate,
): Promise<MedicationScheduleRead> => {
  return await apiHandler.post(`${API_ENDPOINT}/my`, data)
}

/**
 * Actualiza un plan de medicación existente.
 */
export const updateSchedule = async (
  uuid: string,
  data: MedicationScheduleUpdate,
): Promise<void> => {
  return await apiHandler.patch(`${API_ENDPOINT}/my/${uuid}`, data)
}

/**
 * Elimina un plan de medicación.
 */
export const deleteSchedule = async (uuid: string): Promise<void> => {
  return await apiHandler.delete(`${API_ENDPOINT}/my/${uuid}`)
}
