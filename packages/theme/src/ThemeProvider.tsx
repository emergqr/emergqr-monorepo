import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from 'react'
import { ActivityIndicator, View, StyleSheet, SafeAreaView } from 'react-native'
import { useThemeStore } from './theme.store'
import { colors } from './colors'
import { ThemeColors } from '@emergqr/core/src/domain/interfaces/ThemeColors.interface'

interface ThemeContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  themeColors: ThemeColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useThemeStore()
  const [isHydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsubscribe = useThemeStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    if (useThemeStore.persist.hasHydrated()) {
      setHydrated(true)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  const themeColors = useMemo(() => colors[theme], [theme])

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.light.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: colors.light.background,
    flex: 1,
  },
  loadingContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
