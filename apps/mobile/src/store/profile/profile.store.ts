import { create } from 'zustand'

import api from '@/services/api'
import { getApiErrorMessage } from '@/services/apiErrors'
import { uploadAvatar as uploadAvatarService } from '@/services/profileService'
import { useAuthStore } from '../auth/auth.store'
import { ClientFullProfile } from '../../../../../packages/core/src/domain/interfaces/client/client-full-profile.interface'
import { ClientUpdate } from '../../../../../packages/core/src/domain/interfaces/client/client-update.interface'

// --- STORE INTERFACE ---
interface ProfileState {
  profile: ClientFullProfile | null
  isFetching: boolean // For initial profile load
  isUpdating: boolean // For updating profile fields
  isUploadingAvatar: boolean // For avatar upload specifically
  error: string | null
  fetchProfile: () => Promise<void>
  uploadAvatar: (uri: string) => Promise<void> // Corrected type: accepts URI string
  updateProfile: (data: ClientUpdate) => Promise<void>
}

// --- ZUSTAND STORE ---
export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isFetching: false,
  isUpdating: false,
  isUploadingAvatar: false,
  error: null,

  fetchProfile: async () => {
    set({ isFetching: true, error: null })
    try {
      const response = await api.get<ClientFullProfile>('/clients/me/profile')
      set({ profile: response.data, isFetching: false })

      // Update the user in the auth store to keep them in sync.
      // This ensures that if the profile is re-fetched, the header/drawer
      // also get the latest information (e.g., updated name).
      useAuthStore.getState().setUser(response.data)
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({ isFetching: false, error: errorMessage, profile: null })
    }
  },

  updateProfile: async (data: ClientUpdate) => {
    set({ isUpdating: true, error: null })
    try {
      await api.put('/clients/me', data)
      // Re-fetch the full profile to ensure all data is consistent after update.
      await get().fetchProfile()
      set({ isUpdating: false })
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({
        isUpdating: false,
        error: errorMessage,
      })
      throw new Error(errorMessage)
    }
  },

  uploadAvatar: async (uri: string) => {
    set({ isUploadingAvatar: true, error: null })
    try {
      await uploadAvatarService(uri)
      // Re-fetch the full profile to get the new avatar URL and ensure consistency.
      await get().fetchProfile()
      set({ isUploadingAvatar: false })
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      set({ isUploadingAvatar: false, error: errorMessage })
      throw new Error(errorMessage)
    }
  },
}))
