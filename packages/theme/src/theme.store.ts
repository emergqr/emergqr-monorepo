import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  // 1. Envolvemos nuestro store con el middleware `persist`
  persist(
    (set) => ({
      // El valor inicial ahora es el tema del dispositivo o 'light' por defecto
      theme: Appearance.getColorScheme() ?? 'light',

      // La acción para cambiar el tema sigue siendo la misma
      setTheme: (theme) => set({ theme }),
    }),
    {
      // 2. Configuramos el middleware
      name: 'theme-storage', // Un nombre único para el almacenamiento

      // 3. Le decimos a `persist` que use AsyncStorage para guardar los datos
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
