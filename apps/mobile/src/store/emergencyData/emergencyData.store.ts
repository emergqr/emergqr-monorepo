import { create } from 'zustand'
import {
  EmergencyData,
  EmergencyDataCreate,
  EmergencyDataUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/emergencyData.interface'
import api from '@/services/api'
import { getApiErrorMessage } from '@/services/apiErrors'
import { isAxiosError } from 'axios'

interface EmergencyDataState {
  data: EmergencyData | null
  isLoading: boolean
  isUpdating: boolean
  error: string | null
}

interface EmergencyDataActions {
  fetch: () => Promise<void>
  save: (data: EmergencyDataUpdate) => Promise<void>
  remove: () => Promise<void>
}

const initialState: EmergencyDataState = {
  data: null,
  isLoading: false,
  isUpdating: false,
  error: null,
}

export const useEmergencyDataStore = create<
  EmergencyDataState & EmergencyDataActions
>((set, get) => ({
  ...initialState,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<EmergencyData>('/emerg-data/me')
      set({ data: response.data, isLoading: false })
    } catch (error) {
      // Si el usuario no tiene datos (404), no es un error, es un estado válido.
      if (isAxiosError(error) && error.response?.status === 404) {
        set({ data: null, isLoading: false })
      } else {
        const errorMessage = getApiErrorMessage(error)
        set({ error: errorMessage, isLoading: false })
      }
    }
  },

  save: async (saveData: EmergencyDataUpdate) => {
    set({ isUpdating: true, error: null })
    const hasExistingData = !!get().data

    try {
      const response = hasExistingData
        ? await api.put<EmergencyData>('/emerg-data/me', saveData)
        : // Si no hay datos, el payload debe ser completo
          await api.post<EmergencyData>(
            '/emerg-data/',
            saveData as EmergencyDataCreate,
          )
      set({ data: response.data, isUpdating: false, error: null })
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({ error: errorMessage, isUpdating: false })
      throw error // Re-lanzamos para que la UI pueda manejarlo.
    }
  },

  remove: async () => {
    set({ isUpdating: true, error: null })
    try {
      await api.delete('/emerg-data/me')
      set({ data: null, isUpdating: false, error: null })
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({ error: errorMessage, isUpdating: false })
      throw error
    }
  },
}))
