import { ApiHandler } from '../apiHandler'
import {
  Contact,
  ContactCreate,
  ContactUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/contact.interface'
import { ContactPaths } from '@/constants/apiPaths'

const { EXPO_PUBLIC_API_CONTACTS_BASE: CONTACTS_BASE_ENDPOINT } = process.env

if (!CONTACTS_BASE_ENDPOINT) {
  throw new Error(
    'The contacts API endpoint is not defined in environment variables.',
  )
}

/**
 * Obtiene la lista de contactos del usuario autenticado.
 * @returns {Promise<Contact[]>} Una promesa que resuelve con la lista de contactos.
 */
export const getContacts = async (): Promise<Contact[]> => {
  return ApiHandler.get<Contact[]>(
    `${CONTACTS_BASE_ENDPOINT}${ContactPaths.BASE}`,
  )
}

/**
 * Crea un nuevo contacto para el usuario autenticado.
 * @param {ContactCreate} data - Los datos del nuevo contacto.
 * @returns {Promise<Contact>} Una promesa que resuelve con el contacto recién creado.
 */
export const createContact = async (data: ContactCreate): Promise<Contact> => {
  return ApiHandler.post<ContactCreate, Contact>(
    `${CONTACTS_BASE_ENDPOINT}${ContactPaths.BASE}`,
    data,
  )
}

/**
 * Actualiza un contacto existente.
 * @param {string} uuid - El UUID del contacto a actualizar.
 * @param {ContactUpdate} data - Los datos a actualizar.
 * @returns {Promise<Contact>} Una promesa que resuelve con el contacto actualizado.
 */
export const updateContact = async (
  uuid: string,
  data: ContactUpdate,
): Promise<Contact> => {
  const path = ContactPaths.BY_UUID(uuid)
  return ApiHandler.put<ContactUpdate, Contact>(
    `${CONTACTS_BASE_ENDPOINT}${path}`,
    data,
  )
}

/**
 * Elimina un contacto.
 * @param {string} uuid - El UUID del contacto a eliminar.
 * @returns {Promise<void>} Una promesa que resuelve cuando la operación se completa.
 */
export const deleteContact = async (uuid: string): Promise<void> => {
  const path = ContactPaths.BY_UUID(uuid)
  return ApiHandler.delete<void>(`${CONTACTS_BASE_ENDPOINT}${path}`)
}
