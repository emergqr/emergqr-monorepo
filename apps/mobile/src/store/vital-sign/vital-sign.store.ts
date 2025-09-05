import { create } from 'zustand'
import {
  VitalSignRead,
  VitalSignCreate,
  VitalSignUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/vital-sign.interface'
import * as vitalSignService from '@/services/client/vitalSignService'

interface VitalSignState {
  vitalSigns: VitalSignRead[]
  types: string[]
  loading: boolean
  error: string | null
  fetchMyVitalSigns: () => Promise<void>
  fetchVitalSignTypes: () => Promise<void>
  addVitalSign: (data: VitalSignCreate) => Promise<void>
  editVitalSign: (uuid: string, data: VitalSignUpdate) => Promise<void>
  removeVitalSign: (uuid: string) => Promise<void>
  clearError: () => void
}

export const useVitalSignStore = create<VitalSignState>((set, get) => ({
  vitalSigns: [],
  types: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchMyVitalSigns: async () => {
    if (get().loading) return
    set({ loading: true, error: null })
    try {
      const vitalSigns = await vitalSignService.getMyVitalSigns()
      set({ vitalSigns, loading: false })
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to fetch vital signs'
      set({ error: message, loading: false })
    }
  },

  fetchVitalSignTypes: async () => {
    if (get().types.length > 0) return // Evita re-fetching
    try {
      const types = await vitalSignService.getVitalSignTypes()
      set({ types })
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to fetch vital sign types'
      console.error('Failed to fetch vital sign types:', message)
    }
  },

  addVitalSign: async (data: VitalSignCreate) => {
    set({ error: null })
    try {
      const newSign = await vitalSignService.createVitalSign(data)
      set((state) => ({
        vitalSigns: [...state.vitalSigns, newSign].sort(
          (a, b) =>
            new Date(b.measured_at).getTime() -
            new Date(a.measured_at).getTime(),
        ),
      }))
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to add vital sign'
      set({ error: message })
      throw e
    }
  },

  editVitalSign: async (uuid: string, data: VitalSignUpdate) => {
    set({ error: null })
    try {
      const updatedSign = await vitalSignService.updateVitalSign(uuid, data)
      set((state) => ({
        vitalSigns: state.vitalSigns
          .map((s) => (s.uuid === uuid ? updatedSign : s))
          .sort(
            (a, b) =>
              new Date(b.measured_at).getTime() -
              new Date(a.measured_at).getTime(),
          ),
      }))
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to update vital sign'
      set({ error: message })
      throw e
    }
  },

  removeVitalSign: async (uuid: string) => {
    try {
      await vitalSignService.deleteVitalSign(uuid)
      set((state) => ({
        vitalSigns: state.vitalSigns.filter((s) => s.uuid !== uuid),
      }))
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to delete vital sign'
      set({ error: message })
      throw e
    }
  },
}))
