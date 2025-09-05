import React, { createContext, useState, useCallback, ReactNode } from 'react'
import { Snackbar, useTheme } from 'react-native-paper'

type SnackbarType = 'success' | 'error' | 'info'

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number,
  ) => void
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
)

interface SnackbarProviderProps {
  children: ReactNode
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [duration, setDuration] = useState(Snackbar.DURATION_SHORT)
  const [type, setType] = useState<SnackbarType>('info')

  const onDismissSnackBar = () => setVisible(false)

  const showSnackbar = useCallback(
    (msg: string, snackbarType: SnackbarType = 'info', dur?: number) => {
      setMessage(msg)
      setType(snackbarType)
      setDuration(dur || Snackbar.DURATION_SHORT)
      setVisible(true)
    },
    [],
  )

  const getBackgroundColor = () => {
    // Puedes personalizar estos colores en tu tema si lo deseas
    switch (type) {
      case 'success':
        return '#4CAF50' // Un verde estándar para éxito
      case 'error':
        return theme.colors.error
      case 'info':
      default:
        // Color por defecto del Snackbar de react-native-paper
        return theme.colors.onSurface
    }
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={duration}
        style={{ backgroundColor: getBackgroundColor() }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
