import { create } from 'zustand'
import {
  AllergyCreate,
  AllergyRead,
  AllergyUpdate,
  ReactionHistoryCreate,
} from '../../../../../packages/core/src/domain/interfaces/client/allergy.interface'
import * as allergyService from '@/services/client/allergyService'

interface AllergyState {
  allergies: AllergyRead[]
  loading: boolean
  error: string | null
  fetchMyAllergies: () => Promise<void>
  addAllergy: (data: AllergyCreate) => Promise<AllergyRead>
  editAllergy: (uuid: string, data: AllergyUpdate) => Promise<AllergyRead>
  removeAllergy: (uuid: string) => Promise<void>
  addNewReaction: (
    allergyUuid: string,
    data: ReactionHistoryCreate,
  ) => Promise<void>
  clearError: () => void
}

export const useAllergyStore = create<AllergyState>((set, get) => ({
  allergies: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchMyAllergies: async () => {
    if (get().loading) return
    set({ loading: true, error: null })
    try {
      const allergies = await allergyService.getMyAllergies()
      set({ allergies, loading: false })
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to fetch allergies'
      set({ error: message, loading: false })
    }
  },

  addAllergy: async (data: AllergyCreate) => {
    set({ loading: true, error: null })
    try {
      const newAllergy = await allergyService.createAllergy(data)
      set((state) => ({
        allergies: [...state.allergies, newAllergy],
        loading: false,
      }))
      return newAllergy
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to add allergy'
      set({ error: message, loading: false })
      throw e
    }
  },

  editAllergy: async (uuid: string, data: AllergyUpdate) => {
    set({ loading: true, error: null })
    try {
      const updatedAllergy = await allergyService.updateAllergy(uuid, data)
      set((state) => ({
        allergies: state.allergies.map((a) =>
          a.uuid === uuid ? updatedAllergy : a,
        ),
        loading: false,
      }))
      return updatedAllergy
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to update allergy'
      set({ error: message, loading: false })
      throw e
    }
  },

  removeAllergy: async (uuid: string) => {
    try {
      await allergyService.deleteAllergy(uuid)
      set((state) => ({
        allergies: state.allergies.filter((a) => a.uuid !== uuid),
      }))
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to delete allergy'
      set({ error: message })
      throw e
    }
  },

  // Se deshabilita la regla de variables no utilizadas para esta función pendiente.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addNewReaction: async (allergyUuid: string, data: ReactionHistoryCreate) => {
    // Implementación similar a editAllergy
    // Llama al servicio y actualiza la alergia específica en el estado.
  },
}))
