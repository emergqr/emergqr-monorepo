import { create } from 'zustand'
import {
  PatientDiseaseRead,
  DiseaseRead,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/disease.interface'
import * as diseaseService from '@/services/client/diseaseService'

/**
 * Define la forma del estado y las acciones para el store de enfermedades.
 */
interface DiseaseState {
  diseases: PatientDiseaseRead[]
  loading: boolean
  error: string | null
  masterList: DiseaseRead[]
  masterListLoading: boolean
  fetchMyDiseases: () => Promise<void>
  addDisease: (data: PatientDiseaseCreate) => Promise<void>
  editDisease: (uuid: string, data: PatientDiseaseUpdate) => Promise<void>
  removeDisease: (uuid: string) => Promise<void>
  fetchMasterList: () => Promise<void>
  clearError: () => void
}

/**
 * Store de Zustand para gestionar el estado de las enfermedades del paciente.
 */
export const useDiseaseStore = create<DiseaseState>((set, get) => ({
  // Estado inicial
  diseases: [],
  loading: false,
  error: null,
  masterList: [],
  masterListLoading: false,

  // --- ACCIONES ---

  /** Limpia el estado de error. */
  clearError: () => set({ error: null }),

  /** Obtiene todas las enfermedades del paciente desde la API. */
  fetchMyDiseases: async () => {
    if (get().loading) return
    set({ loading: true, error: null })
    try {
      const diseases = await diseaseService.getMyDiseases()
      set({ diseases, loading: false })
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to fetch diseases'
      set({ error: message, loading: false })
    }
  },

  /** Añade una nueva enfermedad y la agrega al estado local. */
  addDisease: async (data: PatientDiseaseCreate) => {
    set({ error: null }) // Limpia errores previos
    try {
      const newDisease = await diseaseService.createDisease(data)
      set((state) => ({
        diseases: [...state.diseases, newDisease].sort(
          (a, b) =>
            new Date(b.diagnosis_date).getTime() -
            new Date(a.diagnosis_date).getTime(),
        ),
      }))
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to add disease'
      set({ error: message })
      throw e // Re-lanza para que la UI pueda manejarlo (e.g., Toast)
    }
  },

  /** Edita una enfermedad y actualiza el estado local. */
  editDisease: async (uuid: string, data: PatientDiseaseUpdate) => {
    set({ error: null })
    try {
      const updatedDisease = await diseaseService.updateDisease(uuid, data)
      set((state) => ({
        diseases: state.diseases
          .map((d) => (d.uuid === uuid ? updatedDisease : d))
          .sort(
            (a, b) =>
              new Date(b.diagnosis_date).getTime() -
              new Date(a.diagnosis_date).getTime(),
          ),
      }))
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to update disease'
      set({ error: message })
      throw e
    }
  },

  /** Elimina una enfermedad del estado local y de la API. */
  removeDisease: async (uuid: string) => {
    await diseaseService.deleteDisease(uuid)
    set((state) => ({
      diseases: state.diseases.filter((d) => d.uuid !== uuid),
    }))
  },

  /** Obtiene la lista maestra de enfermedades desde la API. */
  fetchMasterList: async () => {
    // Evita re-fetching si ya está cargando o si ya tenemos la lista.
    if (get().masterListLoading || get().masterList.length > 0) return
    set({ masterListLoading: true })
    try {
      const masterList = await diseaseService.getDiseasesMasterList()
      set({ masterList, masterListLoading: false })
    } catch (e: unknown) {
      // No es un error crítico para el usuario, lo logueamos para depuración.
      const message =
        e instanceof Error ? e.message : 'Failed to fetch master list'
      console.error('Failed to fetch diseases master list:', message)
      set({ masterListLoading: false })
    }
  },
}))
