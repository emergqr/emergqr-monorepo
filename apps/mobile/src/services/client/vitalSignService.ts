import api from '@/services/api'
import { getApiErrorMessage } from '@/services/apiErrors'
import {
  VitalSignRead,
  VitalSignCreate,
  VitalSignUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/vital-sign.interface'

/**
 * Obtiene la lista de signos vitales del paciente autenticado.
 */
export const getMyVitalSigns = async (): Promise<VitalSignRead[]> => {
  try {
    const response = await api.get<VitalSignRead[]>('/vital-signs/')
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Obtiene la lista de tipos de signos vitales disponibles.
 */
export const getVitalSignTypes = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>('/vital-signs/types')
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Crea un nuevo registro de signo vital.
 */
export const createVitalSign = async (
  data: VitalSignCreate,
): Promise<VitalSignRead> => {
  try {
    const response = await api.post<VitalSignRead>('/vital-signs/', data)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Actualiza un registro de signo vital existente.
 */
export const updateVitalSign = async (
  uuid: string,
  data: VitalSignUpdate,
): Promise<VitalSignRead> => {
  try {
    const response = await api.put<VitalSignRead>(`/vital-signs/${uuid}`, data)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Elimina un registro de signo vital.
 */
export const deleteVitalSign = async (uuid: string): Promise<void> => {
  try {
    await api.delete(`/vital-signs/${uuid}`)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
