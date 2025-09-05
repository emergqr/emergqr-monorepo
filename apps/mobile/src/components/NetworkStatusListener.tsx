import { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { useNetworkStore } from '@/store/network/network.store'

/**
 * Componente sin UI que escucha los cambios en el estado de la red
 * y actualiza el store global.
 */
const NetworkStatusListener = () => {
  const setIsOnline = useNetworkStore((state) => state.setIsOnline)

  useEffect(() => {
    // Creamos una suscripción a los cambios del estado de la red.
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected =
        state.isConnected != null &&
        state.isConnected &&
        state.isInternetReachable === true
      setIsOnline(isConnected)
    })

    // La función de limpieza de useEffect se encarga de remover el listener
    // cuando el componente se desmonta, para evitar fugas de memoria.
    return () => unsubscribe()
  }, [setIsOnline])

  return null // Este componente no renderiza nada.
}

export default NetworkStatusListener
