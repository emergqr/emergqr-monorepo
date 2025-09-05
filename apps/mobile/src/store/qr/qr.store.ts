import { create } from 'zustand'
import { useAuthStore } from '@/store/auth/auth.store'

interface QRState {
  qrData: string | null
  isLoading: boolean
  error: string | null
  fetchQR: () => void
  regenerateQR: () => void
}

export const useQRStore = create<QRState>((set) => ({
  qrData: null,
  isLoading: true,
  error: null,
  fetchQR: () => {
    set({ isLoading: true, error: null })
    const user = useAuthStore.getState().user

    if (user && user.uuid) {
      // El contenido del QR se construye a partir del UUID del usuario.
      const qrString = `https://www.emerqr.com/view/profile/${user.uuid}`
      set({ qrData: qrString, isLoading: false, error: null })
    } else {
      // Este caso ocurre si el usuario no está logueado o el perfil no se ha cargado.
      set({
        qrData: null,
        isLoading: false,
        error: 'Could not find user information to generate QR code.',
      })
    }
  },
  regenerateQR: () => {
    // El concepto de "regenerar" un QR basado en un UUID estático no es aplicable
    // ya que el backend no tiene un endpoint para cambiar el UUID del usuario.
    // Esta función simplemente vuelve a generar el string del QR para asegurar que esté actualizado.
    set({ isLoading: true, error: null })
    const user = useAuthStore.getState().user

    if (user && user.uuid) {
      const qrString = `https://www.emerqr.com/view/profile/${user.uuid}`
      set({ qrData: qrString, isLoading: false, error: null })
    } else {
      set({
        qrData: null,
        isLoading: false,
        error: 'Could not find user information to regenerate QR code.',
      })
    }
  },
}))
