import { create } from 'zustand'
import {
  Contact,
  ContactCreate,
  ContactUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/contact.interface'
import api from '@/services/api'
import { getApiErrorMessage } from '@/services/apiErrors'

interface ContactState {
  contacts: Contact[]
  isLoading: boolean
  error: string | null
}

interface ContactActions {
  fetchContacts: () => Promise<void>
  addContact: (data: ContactCreate) => Promise<void>
  editContact: (uuid: string, data: ContactUpdate) => Promise<void>
  removeContact: (uuid: string) => Promise<void>
}

const initialState: ContactState = {
  contacts: [],
  isLoading: false,
  error: null,
}

export const useContactStore = create<ContactState & ContactActions>((set) => ({
  ...initialState,

  /**
   * Obtiene los contactos del usuario y los carga en el estado.
   */
  fetchContacts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<Contact[]>('/contacts/')
      set({ contacts: response.data, isLoading: false })
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({ error: errorMessage, isLoading: false })
    }
  },

  /**
   * Crea un nuevo contacto y lo añade al estado.
   * @param data - Los datos del nuevo contacto.
   */
  addContact: async (data: ContactCreate) => {
    set({ error: null })
    try {
      const response = await api.post<Contact>('/contacts/', data)
      set((state) => ({
        contacts: [...state.contacts, response.data],
      }))
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({ error: errorMessage })
      throw error
    }
  },

  /**
   * Actualiza un contacto existente en el estado.
   * @param uuid - El UUID del contacto a actualizar.
   * @param data - Los nuevos datos para el contacto.
   */
  editContact: async (uuid: string, data: ContactUpdate) => {
    set({ error: null })
    try {
      const response = await api.put<Contact>(`/contacts/${uuid}`, data)
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact.uuid === uuid ? response.data : contact,
        ),
      }))
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({ error: errorMessage })
      throw error
    }
  },

  /**
   * Elimina un contacto del estado con actualización optimista.
   * @param uuid - El UUID del contacto a eliminar.
   */
  removeContact: async (uuid: string) => {
    const currentContacts = useContactStore.getState().contacts
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.uuid !== uuid),
      error: null,
    }))
    try {
      await api.delete(`/contacts/${uuid}`)
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({ error: errorMessage, contacts: currentContacts })
      throw error
    }
  },
}))
