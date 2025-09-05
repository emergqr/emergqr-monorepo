import { create } from 'zustand'

interface NetworkState {
  isOnline: boolean
  setIsOnline: (status: boolean) => void
}

export const useNetworkStore = create<NetworkState>((set) => ({
  // Asumimos que la app inicia con conexión hasta que se demuestre lo contrario.
  isOnline: true,
  setIsOnline: (status: boolean) => {
    set({ isOnline: status })
  },
}))
