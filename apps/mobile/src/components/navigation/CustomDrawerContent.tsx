import React from 'react'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const insets = useSafeAreaInsets()

  return (
    <DrawerContentScrollView
      {...props}
      // Aplicamos el 'paddingTop' directamente al estilo del ScrollView.
      // Esto empuja todo el componente hacia abajo para respetar el área segura.
      style={{ paddingTop: insets.top }}
    >
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent
