import api from '@/services/api'
import { MedicalDocumentRead } from '../../../../../packages/core/src/domain/interfaces/client/medical-history.interface'

/**
 * Define la estructura mínima de un archivo que necesita el servicio de subida.
 * Esto nos desacopla de la librería `expo-document-picker` en el servicio.
 */
export type FileAsset = { uri: string; name: string; mimeType?: string | null }

/**
 * Sube uno o más archivos y los asocia a un evento médico existente.
 * NOTA: Este endpoint es una propuesta y debe ser implementado en el backend.
 * Endpoint propuesto: POST /api/v1/medical-history/events/{event_uuid}/documents
 *
 * @param eventUuid El UUID del evento médico al que se adjuntarán los documentos.
 * @param files Un array de objetos de archivo a subir.
 * @returns Una promesa que se resuelve con la lista de documentos médicos creados.
 */
export const uploadDocumentsForEvent = async (
  eventUuid: string,
  files: FileAsset[],
): Promise<MedicalDocumentRead[]> => {
  const formData = new FormData()

  for (const file of files) {
    // Se ha reemplazado 'any' por un cast más seguro a través de 'unknown' a 'Blob'.
    // Esto es necesario por la forma en que React Native maneja los archivos en FormData.
    formData.append('files', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/octet-stream',
    } as unknown as Blob)
  }

  const response = await api.post<MedicalDocumentRead[]>(
    `/medical-history/events/${eventUuid}/documents`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return response.data
}
