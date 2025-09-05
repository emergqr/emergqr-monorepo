import { create } from 'zustand'
import {
  MedicalEventCreate,
  MedicalEventRead,
  MedicalEventUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/medical-history.interface'
import * as DocumentPicker from 'expo-document-picker'
import * as medicalHistoryService from '@/services/client/medicalHistoryService'
import { uploadDocumentsForEvent } from '@/services/client/fileUploadService'

interface MedicalHistoryState {
  events: MedicalEventRead[]
  loading: boolean
  error: string | null
  fetchMedicalHistory: () => Promise<void>
  addMedicalEvent: (
    data: MedicalEventCreate,
    files: DocumentPicker.DocumentPickerAsset[],
  ) => Promise<MedicalEventRead>
  editMedicalEvent: (uuid: string, data: MedicalEventUpdate) => Promise<void>
  removeMedicalEvent: (uuid: string) => Promise<void>
}

export const useMedicalHistoryStore = create<MedicalHistoryState>((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchMedicalHistory: async () => {
    try {
      set({ loading: true, error: null })
      const events = await medicalHistoryService.getMedicalHistory()
      set({ events, loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch medical history'
      set({ loading: false, error: errorMessage })
    }
  },

  addMedicalEvent: async (
    data: MedicalEventCreate,
    files: DocumentPicker.DocumentPickerAsset[],
  ) => {
    set({ loading: true, error: null })
    try {
      // Paso 1: Crear el evento con los datos de texto.
      const newEvent = await medicalHistoryService.createMedicalEvent(data)

      // Paso 2: Si hay archivos, subirlos y asociarlos.
      if (files.length > 0) {
        const uploadedDocuments = await uploadDocumentsForEvent(
          newEvent.uuid,
          files,
        )
        // Actualizamos el evento local con los documentos recién subidos.
        newEvent.documents = uploadedDocuments
      }

      set((state) => ({
        events: [newEvent, ...state.events].sort(
          (a, b) =>
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime(),
        ),
        loading: false,
      }))
      return newEvent
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save medical event'
      set({ loading: false, error: errorMessage })
      throw new Error(errorMessage)
    }
  },

  editMedicalEvent: async (uuid: string, data: MedicalEventUpdate) => {
    set({ loading: true, error: null })
    try {
      const updatedEvent = await medicalHistoryService.updateMedicalEvent(
        uuid,
        data,
      )
      set((state) => ({
        events: state.events.map((event) =>
          event.uuid === uuid ? updatedEvent : event,
        ),
        loading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update medical event'
      set({ loading: false, error: errorMessage })
      throw new Error(errorMessage)
    }
  },

  removeMedicalEvent: async (uuid: string) => {
    set({ loading: true, error: null })
    try {
      await medicalHistoryService.deleteMedicalEvent(uuid)
      set((state) => ({
        events: state.events.filter((event) => event.uuid !== uuid),
        loading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete medical event'
      set({ loading: false, error: errorMessage })
      throw new Error(errorMessage)
    }
  },
}))
