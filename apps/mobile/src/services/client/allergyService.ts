import api from '@/services/api'
import {
  AllergyCreate,
  AllergyRead,
  AllergyUpdate,
  ReactionHistoryCreate,
} from '../../../../../packages/core/src/domain/interfaces/client/allergy.interface'

const BASE_URL = '/allergies' // El prefijo /api/v1 ya está en la instancia de axios

export const getMyAllergies = (): Promise<AllergyRead[]> => {
  return api.get<AllergyRead[]>(`${BASE_URL}/`).then((res) => res.data)
}

export const createAllergy = async (
  data: AllergyCreate,
): Promise<AllergyRead> => {
  const response = await api.post<AllergyRead>(`${BASE_URL}/`, data)
  return response.data
}

export const updateAllergy = async (
  uuid: string,
  data: AllergyUpdate,
): Promise<AllergyRead> => {
  // La API devuelve el objeto actualizado, lo cual es útil para el store.
  const response = await api.put<AllergyRead>(`${BASE_URL}/${uuid}`, data)
  return response.data
}

export const deleteAllergy = async (uuid: string): Promise<void> => {
  await api.delete<void>(`${BASE_URL}/${uuid}`)
}

export const addReactionToAllergy = async (
  allergyUuid: string,
  data: ReactionHistoryCreate,
): Promise<AllergyRead> => {
  // La API devuelve la alergia actualizada con el nuevo historial de reacción.
  const response = await api.post<AllergyRead>(
    `${BASE_URL}/${allergyUuid}/reactions`,
    data,
  )
  return response.data
}
