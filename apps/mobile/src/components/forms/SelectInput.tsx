import React, { useState } from 'react'
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { Control, Controller } from 'react-hook-form'
import {
  Modal,
  Portal,
  Button,
  Card,
  TextInput,
  Checkbox,
  RadioButton,
  HelperText,
} from 'react-native-paper'

export interface Option {
  label: string
  value: string
}

interface SelectInputProps {
  control: Control<Record<string, unknown>> // Se ha reemplazado 'any' por un tipo más seguro
  name: string
  label: string
  placeholder?: string
  options: Option[]
  multiSelect?: boolean
  dialogTitle?: string
  disabled?: boolean
}

const SelectInput: React.FC<SelectInputProps> = ({
  control,
  name,
  label,
  placeholder,
  options,
  multiSelect = false,
  dialogTitle,
  disabled = false,
}) => {
  // Se ha eliminado 'themeColors' porque no se utilizaba
  const [modalVisible, setModalVisible] = useState(false)
  const [tempSelection, setTempSelection] = useState<string[]>([])

  const styles = StyleSheet.create({
    actions: {
      justifyContent: 'flex-end',
    },
    card: {
      maxHeight: '80%',
      width: '90%',
    },
    cardContent: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    container: {
      marginBottom: 20,
    },
    itemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 8,
    },
    modalContainer: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      justifyContent: 'center',
    },
  })

  const getDisplayValue = (value: unknown): string => {
    if (!value) return ''
    if (multiSelect) {
      if (!Array.isArray(value) || value.length === 0) return ''
      return (
        (value as string[])
          .map((v) => options.find((o) => o.value === v)?.label)
          .filter(Boolean)
          .join(', ') || ''
      )
    }
    return options.find((o) => o.value === value)?.label || ''
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleOpen = () => {
          if (disabled) {
            return
          }
          if (multiSelect && Array.isArray(value)) {
            setTempSelection(value as string[])
          }
          setModalVisible(true)
        }

        const handleSingleSelect = (selectedValue: string) => {
          onChange(selectedValue)
          setModalVisible(false)
        }

        const handleMultiSelectToggle = (selectedValue: string) => {
          const newSelection = tempSelection.includes(selectedValue)
            ? tempSelection.filter((item) => item !== selectedValue)
            : [...tempSelection, selectedValue]
          setTempSelection(newSelection)
        }

        const handleConfirmMultiSelect = () => {
          onChange(tempSelection)
          setModalVisible(false)
        }

        return (
          <View style={styles.container}>
            <TouchableOpacity onPress={handleOpen} disabled={disabled}>
              <View pointerEvents="none">
                <TextInput
                  label={label}
                  placeholder={placeholder}
                  value={getDisplayValue(value)}
                  editable={false}
                  error={!!error}
                  right={
                    <TextInput.Icon icon="chevron-down" onPress={handleOpen} />
                  }
                  disabled={disabled}
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
                  <Card.Content style={styles.cardContent}>
                    <FlatList
                      data={options}
                      keyExtractor={(item) => item.value}
                      renderItem={({ item }) =>
                        multiSelect ? (
                          <Checkbox.Item
                            label={item.label}
                            status={
                              tempSelection.includes(item.value)
                                ? 'checked'
                                : 'unchecked'
                            }
                            onPress={() => handleMultiSelectToggle(item.value)}
                          />
                        ) : (
                          <RadioButton.Item
                            label={item.label}
                            value={item.value}
                            status={
                              value === item.value ? 'checked' : 'unchecked'
                            }
                            onPress={() => handleSingleSelect(item.value)}
                          />
                        )
                      }
                    />
                  </Card.Content>
                  {multiSelect && (
                    <Card.Actions style={styles.actions}>
                      <Button onPress={() => setModalVisible(false)}>
                        Cancelar
                      </Button>
                      <Button onPress={handleConfirmMultiSelect}>
                        Aceptar
                      </Button>
                    </Card.Actions>
                  )}
                </Card>
              </Modal>
            </Portal>
          </View>
        )
      }}
    />
  )
}

export default SelectInput
