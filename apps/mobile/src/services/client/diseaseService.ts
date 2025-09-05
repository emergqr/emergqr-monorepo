import api from '@/services/api'
import { getApiErrorMessage } from '@/services/apiErrors'
import {
  PatientDiseaseRead,
  DiseaseRead,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/disease.interface'

/**
 * Obtiene la lista de enfermedades asociadas al paciente autenticado.
 * @returns Una promesa que se resuelve con un array de PatientDiseaseRead.
 */
export const getMyDiseases = async (): Promise<PatientDiseaseRead[]> => {
  try {
    const response = await api.get<PatientDiseaseRead[]>('/diseases/')
    return response.data
  } catch (error) {
    console.error('Error fetching diseases:', error)
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Obtiene la lista maestra de todas las enfermedades disponibles en el sistema.
 * @returns Una promesa que se resuelve con un array de DiseaseRead.
 */
export const getDiseasesMasterList = async (): Promise<DiseaseRead[]> => {
  try {
    const response = await api.get<DiseaseRead[]>('/diseases/master-list')
    return response.data
  } catch (error) {
    console.error('Error fetching diseases master list:', error)
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Asocia una nueva enfermedad al perfil del paciente.
 * @param data - Los datos para la nueva asociación de enfermedad.
 * @returns Una promesa que se resuelve con la nueva PatientDiseaseRead creada.
 */
export const createDisease = async (
  data: PatientDiseaseCreate,
): Promise<PatientDiseaseRead> => {
  try {
    const response = await api.post<PatientDiseaseRead>('/diseases/', data)
    return response.data
  } catch (error) {
    console.error('Error creating disease:', error)
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Actualiza los detalles de una enfermedad asociada.
 * @param associationUuid - El UUID de la asociación enfermedad-paciente.
 * @param data - Los datos a actualizar.
 * @returns Una promesa que se resuelve con la PatientDiseaseRead actualizada.
 */
export const updateDisease = async (
  associationUuid: string,
  data: PatientDiseaseUpdate,
): Promise<PatientDiseaseRead> => {
  try {
    const response = await api.put<PatientDiseaseRead>(
      `/diseases/${associationUuid}`,
      data,
    )
    return response.data
  } catch (error) {
    console.error(`Error updating disease ${associationUuid}:`, error)
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * Elimina la asociación de una enfermedad del perfil del paciente.
 * @param associationUuid - El UUID de la asociación a eliminar.
 * @returns Una promesa que se resuelve cuando la operación es exitosa.
 */
export const deleteDisease = async (associationUuid: string): Promise<void> => {
  try {
    await api.delete(`/diseases/${associationUuid}`)
  } catch (error) {
    console.error(`Error deleting disease ${associationUuid}:`, error)
    throw new Error(getApiErrorMessage(error))
  }
}
