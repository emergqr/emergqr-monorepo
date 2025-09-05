import { ApiHandler } from '../apiHandler'
import { Address } from '@emergqr/core'
import { AddressPaths } from '@/constants/apiPaths'

const { EXPO_PUBLIC_API_ADDRESSES_BASE: ADDRESSES_BASE_ENDPOINT } = process.env

if (!ADDRESSES_BASE_ENDPOINT) {
  throw new Error(
    'The addresses base API endpoint is not defined in environment variables.',
  )
}
/**
 * El tipo de datos que se envía a la API para crear o actualizar una dirección.
 * Omitimos los campos 'id' y 'uuid' porque son gestionados por el servidor.
 */
export type AddressPayload = Omit<Address, 'id' | 'uuid'>

/**
 * Obtiene la lista de todas las direcciones del usuario autenticado.
 * @returns {Promise<Address[]>} Una promesa que se resuelve con un array de direcciones.
 */
export const getAddresses = async (): Promise<Address[]> => {
  const url = `${ADDRESSES_BASE_ENDPOINT}${AddressPaths.BASE}`
  return ApiHandler.get<Address[]>(url)
}

/**
 * Crea una nueva dirección para el usuario.
 * @param {AddressPayload} data - Los datos de la dirección a crear.
 * @returns {Promise<Address>} Una promesa que se resuelve con la dirección recién creada.
 */
export const createAddress = async (data: AddressPayload): Promise<Address> => {
  const url = `${ADDRESSES_BASE_ENDPOINT}${AddressPaths.BASE}`
  return ApiHandler.post<AddressPayload, Address>(url, data)
}

/**
 * Actualiza una dirección existente.
 * @param {string} uuid - El UUID de la dirección a actualizar.
 * @param {AddressPayload} data - Los nuevos datos para la dirección.
 * @returns {Promise<Address>} Una promesa que se resuelve con la dirección actualizada.
 */
export const updateAddress = async (
  uuid: string,
  data: AddressPayload,
): Promise<Address> => {
  const url = `${ADDRESSES_BASE_ENDPOINT}${AddressPaths.BY_UUID(uuid)}`
  return ApiHandler.put<AddressPayload, Address>(url, data)
}

/**
 * Elimina una dirección.
 * @param {string} uuid - El UUID de la dirección a eliminar.
 */
export const deleteAddress = async (uuid: string): Promise<void> => {
  const url = `${ADDRESSES_BASE_ENDPOINT}${AddressPaths.BY_UUID(uuid)}`
  return ApiHandler.delete<void>(url)
}
