import api from './api'
import { Client } from '../../../../packages/core/src/domain/interfaces/client/client.interface'

/**
 * Sube la imagen de avatar de un usuario al backend.
 * @param uri El URI local de la imagen seleccionada.
 * @returns Una promesa que se resuelve con el perfil del cliente actualizado.
 */
export const uploadAvatar = async (uri: string): Promise<Client> => {
  const formData = new FormData()

  // Extraemos el nombre del archivo del URI.
  const filename = uri.split('/').pop()
  // Inferimos el tipo MIME de la extensión del archivo.
  const match = /\.(\w+)$/.exec(filename!)
  const type = match ? `image/${match[1]}` : `image`

  // Se ha reemplazado 'any' por un cast más seguro a través de 'unknown' a 'Blob'.
  // Esto es necesario por la forma en que React Native maneja los archivos en FormData.
  formData.append('file', {
    uri,
    name: filename,
    type,
  } as unknown as Blob)

  // Hacemos la petición POST, pero sobreescribimos las cabeceras
  // para indicar que estamos enviando 'multipart/form-data'.
  const response = await api.post<Client>('/clients/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
