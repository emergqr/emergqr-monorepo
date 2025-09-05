/**
 * @file Store de Zustand para gestionar el estado de los planes de medicación.
 */
import { create } from 'zustand'
import {
  MedicationScheduleCreate,
  MedicationScheduleRead,
  MedicationScheduleUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/medication.interface'
import * as medicationService from '../../services/client/medicationService'

interface MedicationState {
  schedules: MedicationScheduleRead[]
  loading: boolean
  error: string | null
  fetchSchedules: () => Promise<void>
  addSchedule: (data: MedicationScheduleCreate) => Promise<void>
  updateSchedule: (
    uuid: string,
    data: MedicationScheduleUpdate,
  ) => Promise<void>
  deleteSchedule: (uuid: string) => Promise<void>
}

export const useMedicationStore = create<MedicationState>((set) => ({
  schedules: [],
  loading: false,
  error: null,

  fetchSchedules: async () => {
    try {
      set({ loading: true, error: null })
      const schedules = await medicationService.getMySchedules()
      set({ schedules, loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido'
      set({ loading: false, error: errorMessage })
    }
  },

  addSchedule: async (data: MedicationScheduleCreate) => {
    try {
      set({ loading: true, error: null })
      const newSchedule = await medicationService.createSchedule(data)
      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        loading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al añadir medicación'
      set({ loading: false, error: errorMessage })
      throw error // Relanzamos para que la UI pueda manejarlo
    }
  },

  updateSchedule: async (uuid: string, data: MedicationScheduleUpdate) => {
    try {
      set({ loading: true, error: null })
      await medicationService.updateSchedule(uuid, data)
      // Actualización optimista: actualizamos el estado localmente.
      // Para datos críticos, se podría volver a llamar a fetchSchedules() o que el PATCH devuelva el objeto actualizado.
      set((state) => ({
        schedules: state.schedules.map((s) =>
          s.uuid === uuid ? { ...s, ...data } : s,
        ),
        loading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al actualizar medicación'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  deleteSchedule: async (uuid: string) => {
    try {
      set({ loading: true, error: null })
      await medicationService.deleteSchedule(uuid)
      set((state) => ({
        schedules: state.schedules.filter((s) => s.uuid !== uuid),
        loading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al eliminar medicación'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },
}))
