import React, { useState, useCallback } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { Control, Controller } from 'react-hook-form'
import {
  Modal,
  Portal,
  TextInput,
  HelperText,
  Card,
  List,
  Text,
  Button,
} from 'react-native-paper'
import { useTheme } from '@/contexts/ThemeContext'
import debounce from 'lodash.debounce'

// 1. Se ha hecho la interfaz genérica para el tipo del valor (value).
// 2. Se ha reemplazado `any` en el index signature por `unknown` para mayor seguridad.
export interface SearchableOption<TValue = string | number> {
  label: string
  value: TValue
  [key: string]: unknown
}

// 3. La interfaz de props también es genérica y usa un tipo más seguro para `control`.
interface SearchableSelectInputProps<TValue> {
  control: Control<Record<string, unknown>>
  name: string
  label: string
  placeholder?: string
  dialogTitle?: string
  onSearch: (query: string) => Promise<SearchableOption<TValue>[]>
}

// 4. El componente ahora es una función genérica.
const SearchableSelectInput = <TValue extends string | number>({
  control,
  name,
  label,
  placeholder,
  dialogTitle,
  onSearch,
}: SearchableSelectInputProps<TValue>) => {
  const { themeColors } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<
    SearchableOption<TValue>[]
  >([])
  const [isSearching, setIsSearching] = useState(false)

  const styles = StyleSheet.create({
    card: { maxHeight: '80%', width: '90%' },
    container: { marginBottom: 20 },
    loading: { paddingVertical: 20 },
    modalContainer: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      justifyContent: 'center',
    },
    noResults: {
      color: themeColors.placeholder,
      padding: 20,
      textAlign: 'center',
    },
    searchBar: { marginHorizontal: 16, marginTop: 16 },
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setSearchResults([])
        setIsSearching(false)
        return
      }
      setIsSearching(true)
      try {
        const results = await onSearch(query)
        setSearchResults(results)
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500),
    [onSearch],
  )

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    debouncedSearch(query)
  }

  // 5. El tipo del callback `fieldOnChange` ahora es seguro gracias al genérico.
  const handleSelect = (
    option: SearchableOption<TValue>,
    fieldOnChange: (value: TValue) => void,
  ) => {
    fieldOnChange(option.value)
    setModalVisible(false)
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // El valor que viene del controlador es `unknown`, se castea a string para el display.
        // La lógica para mostrar un valor legible cuando ya existe uno podría mejorarse.
        const displayValue = value
          ? `ID: ${(value as string).substring(0, 8)}...`
          : ''

        return (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View pointerEvents="none">
                <TextInput
                  label={label}
                  placeholder={placeholder}
                  value={displayValue}
                  editable={false}
                  error={!!error}
                  right={<TextInput.Icon icon="magnify" />}
                />
              </View>
            </TouchableOpacity>
            {error && <HelperText type="error">{error.message}</HelperText>}

            <Portal>
              <Modal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                contentContainerStyle={styles.modalContainer}
              >
                <Card style={styles.card}>
                  <Card.Title title={dialogTitle || label} />
                  <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                  />
                  {isSearching && (
                    <ActivityIndicator
                      style={styles.loading}
                      animating={true}
                      color={themeColors.primary}
                    />
                  )}
                  {!isSearching &&
                    searchResults.length === 0 &&
                    searchQuery.length >= 3 && (
                      <Text style={styles.noResults}>
                        No se encontraron resultados.
                      </Text>
                    )}
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => String(item.value)}
                    renderItem={({ item }) => (
                      <List.Item
                        title={item.label}
                        onPress={() => handleSelect(item, onChange)}
                      />
                    )}
                  />
                  <Card.Actions>
                    <Button onPress={() => setModalVisible(false)}>
                      Cancelar
                    </Button>
                  </Card.Actions>
                </Card>
              </Modal>
            </Portal>
          </View>
        )
      }}
    />
  )
}

export default SearchableSelectInput
