import { ApiHandler } from '../apiHandler'
import {
  EmergencyData,
  EmergencyDataCreate,
  EmergencyDataUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/emergencyData.interface'
import { EmergDataPaths } from '@/constants/apiPaths'

/**
 * Obtiene los datos de emergencia del usuario autenticado.
 * @returns {Promise<EmergencyData>} Una promesa que se resuelve con los datos de emergencia del usuario.
 */
export const getMyEmergencyData = async (): Promise<EmergencyData> => {
  return ApiHandler.get<EmergencyData>(EmergDataPaths.ME)
}

/**
 * Crea o actualiza los datos de emergencia del usuario autenticado.
 * @param {EmergDataUpdate} data - Los datos a actualizar.
 * @returns {Promise<EmergencyData>} Una promesa que se resuelve con los datos de emergencia actualizados.
 */
export const updateMyEmergencyData = async (
  data: EmergencyDataUpdate,
): Promise<EmergencyData> => {
  // This should be PUT
  return ApiHandler.put<EmergencyDataUpdate, EmergencyData>(
    EmergDataPaths.ME,
    data,
  )
}

/**
 * Crea un nuevo registro de datos de emergencia para el usuario autenticado.
 * @param {EmergencyDataCreate} data - Los datos a crear.
 * @returns {Promise<EmergencyData>} Una promesa que se resuelve con los datos recién creados.
 */
export const createEmergencyData = async (
  data: EmergencyDataCreate,
): Promise<EmergencyData> => {
  // This should be POST
  return ApiHandler.post<EmergencyDataCreate, EmergencyData>(
    EmergDataPaths.BASE,
    data,
  )
}

/**
 * Elimina los datos de emergencia del usuario autenticado.
 * @returns {Promise<void>}
 */
export const deleteMyEmergencyData = async (): Promise<void> => {
  return ApiHandler.delete<void>(EmergDataPaths.ME)
}
