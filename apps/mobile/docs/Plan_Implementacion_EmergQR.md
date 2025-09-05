# 🚀 Plan de Implementación: EmergQR

**Versión:** 1.0  
**Estado:** **Revisado y Actualizado**  
**Última actualización:** **[Fecha Actual]**  
**Exclusión:** Perfiles públicos web (`/api/v1/public-profile/...` y `/api/v1/view/profile/...`)

---

## 📌 Introducción

Este documento detalla el plan de implementación de las funcionalidades de la aplicación **EmergQR**, basado en el análisis del archivo `openapi.json` v1.0.0 y el estado actual del código.

El objetivo es proporcionar una hoja de ruta clara, modular y secuencial que permita al equipo desarrollar, testear e integrar cada funcionalidad de forma independiente, asegurando cobertura total de la API sin duplicar esfuerzos.

---

## 🧩 Estructura Modular

Cada módulo representa una funcionalidad completa del perfil médico del usuario. Se recomienda seguir el orden de prioridad indicado para aprovechar dependencias y reutilización de código.

| Módulo | Nombre                                  | Prioridad   | Estado          |
| ------ | --------------------------------------- | ----------- | --------------- |
| ✅ 1   | Gestión de Datos de Emergencia (Legado) | **Media**   | Pendiente       |
| ✅ 2   | Gestión de Alergias (Estructurado)      | Alta        | Pendiente       |
| ✅ 3   | Gestión de Enfermedades (Estructurado)  | Alta        | Pendiente       |
| ✅ 4   | Gestión de Signos Vitales               | Alta        | **Nuevo**       |
| ✅ 5   | Historial Médico (Eventos y Documentos) | Media-Alta  | **En Progreso** |
| 🟡 6   | Planes de Medicación y Recordatorios    | Media       | **En Progreso** |
| ❌ 7   | Recordatorios                           |
| ❌ 8   | Infraestructura y Soporte               | Transversal | Pendiente       |

---

## 🔧 Convenciones

- ✅ = Completado
- 🟡 = En progreso
- ❌ = Pendiente
- 📄 = Documentación
- 💻 = Código
- ⚙️ = Configuración/Integración
- 🌐 = UI / Pantallas
- 🔄 = Store (Zustand)
- 📡 = Servicio API
- 🌍 = Internacionalización (i18n)

---

# Módulo 1: Gestión de Datos de Emergencia

> **Objetivo:** Permitir al usuario registrar y actualizar su información médica crítica en campos de texto libre. **Nota:** Este módulo parece ser un sistema legado. Se debe clarificar su relación con los módulos de datos estructurados (Alergias, Enfermedades).

### ✅ 1. Interfaces

- **Ruta:** `src/interfaces/client/emerg-data.interface.ts`
- **Tipos:**

  ```ts
  // Basado en EmergDataResponse, EmergDataCreate y EmergDataUpdate del openapi.json
  export interface EmergData {
    birdDate?: string | null
    direccion?: string | null
    blood?: string | null
    diseases?: string | null
    allergies?: string | null
    medications?: string | null
    socialSecurityHealthSystem?: string | null
  }

  export type EmergDataResponse = EmergData
  export type EmergDataCreate = EmergData
  export type EmergDataUpdate = Partial<EmergData>
  ```

### 💻 2. Servicio

- **Ruta:** `src/services/client/emergDataService.ts`
- **Funciones:**
  - `getMyEmergData(): Promise<EmergDataResponse>`
  - `updateMyEmergData(data: EmergDataUpdate): Promise<void>`
  - _(Opcional)_ `createEmergData()` / `deleteEmergData()`

### 🔁 3. Store (Zustand)

- **Ruta:** `src/store/emerg-data/emerg-data.store.ts`
- **Estado:**
  - `data: EmergDataResponse | null`
  - `loading: boolean`
  - `error: string | null`

### 🌐 4. UI: Pantalla

- **Ruta:** `src/screens/profile/EmergencyDataScreen.tsx`
- **Características:**
  - Formulario con campos: tipo de sangre, condiciones, notas.
  - Botones: Guardar, Cancelar.
  - Manejo de carga y errores.

### ⚙️ 5. Navegación

- **Conectar en:** `MyProfileScreen.tsx`
- **Botón:** "Datos de Emergencia" → navega a `EmergencyDataScreen`

### 🌍 6. Localización

- **Archivos:**
  - `src/i18n/en.json`
  - `src/i18n/es.json`
- **Claves:**
  ```json
  "emergency_data.title": "Emergency Data",
  "emergency_data.blood_type": "Blood Type",
  "emergency_data.conditions": "Pre-existing Conditions",
  "emergency_data.save_success": "Emergency data saved successfully"
  ```

---

# Módulo 2: Gestión de Alergias

> **Objetivo:** Implementar un CRUD completo para que el usuario gestione sus alergias y reacciones.

### ✅ 1. Interfaces

- **Ruta:** `src/interfaces/client/allergy.interface.ts`
- **Tipos:**
  ```ts
  interface AllergyRead { uuid: string; name: string; severity: string; ... }
  interface AllergyCreate { name: string; severity: string; ... }
  interface AllergyUpdate { severity?: string; notes?: string }
  interface ReactionHistoryRead { date: string; symptoms: string[]; ... }
  ```

### 💻 2. Servicio

- **Ruta:** `src/services/client/allergyService.ts`
- **Funciones:**
  - `getMyAllergies(): Promise<AllergyRead[]>`
  - `createAllergy(data: AllergyCreate): Promise<AllergyRead>`
  - `updateAllergy(uuid: string, data: AllergyUpdate): Promise<void>`
  - `deleteAllergy(uuid: string): Promise<void>`
  - `addReaction(allergyUuid: string, data: ReactionCreate): Promise<void>`

### 🔁 3. Store (Zustand)

- **Ruta:** `src/store/allergy/allergy.store.ts`
- **Estado:**
  - `allergies: AllergyRead[]`
  - `loading: boolean`
  - `error: string | null`

### 🌐 4. UI: Pantallas y Componentes

- `AllergyListScreen.tsx` – Lista con botones de añadir/editar.
- `AllergyFormScreen.tsx` – Formulario para crear/editar alergia.
- `AllergyDetailScreen.tsx` _(Opcional)_ – Detalles + historial de reacciones.
- `AllergyListItem.tsx` – Componente reutilizable para lista.

### ⚙️ 5. Navegación

- Agregar rutas en `ProfileStackNavigator`:
  ```ts
  <Stack.Screen name="AllergyList" component={AllergyListScreen} />
  <Stack.Screen name="AllergyForm" component={AllergyFormScreen} />
  <Stack.Screen name="AllergyDetail" component={AllergyDetailScreen} />
  ```
- Conectar desde `MyProfileScreen`.

### 🌍 6. Localización

- Añadir claves como:
  ```json
  "allergy.title": "Allergies",
  "allergy.add": "Add Allergy",
  "allergy.severity.high": "High",
  "allergy.reaction.add": "Add Reaction"
  ```

---

# Módulo 3: Gestión de Enfermedades y Diagnósticos

> **Objetivo:** Permitir al usuario registrar enfermedades o condiciones médicas.

### ✅ 1. Interfaces

- **Ruta:** `src/interfaces/client/disease.interface.ts`
- **Tipos:**
  ```ts
  interface PatientDiseaseRead { uuid: string; disease: DiseaseRead; diagnosedAt: string; ... }
  interface PatientDiseaseCreate { diseaseUuid: string; diagnosedAt: string; notes?: string }
  interface PatientDiseaseUpdate { notes?: string; status?: 'active'|'remission'|'resolved' }
  interface DiseaseRead { uuid: string; name: string; code?: string }
  ```

### 💻 2. Servicio

- **Ruta:** `src/services/client/diseaseService.ts`
- **Funciones:**
  - `getMyDiseases(): Promise<PatientDiseaseRead[]>`
  - `createDisease(data: PatientDiseaseCreate): Promise<PatientDiseaseRead>`
  - `updateDisease(uuid: string, data: PatientDiseaseUpdate): Promise<void>`
  - `deleteDisease(uuid: string): Promise<void>`

### 🔁 3. Store (Zustand)

- **Ruta:** `src/store/disease/disease.store.ts`
- Estado similar al de alergias.

### 🌐 4. UI: Pantallas y Componentes

- `DiseaseListScreen.tsx` – Lista de enfermedades.
- `DiseaseFormScreen.tsx` – Formulario con búsqueda de enfermedades (usar `medicalCodeService`).
- `DiseaseListItem.tsx` – Componente para lista.

### ⚙️ 5. Navegación

- Agregar rutas en `ProfileStackNavigator`.
- Conectar botón "Enfermedades" en `MyProfileScreen`.

### 🌍 6. Localización

- Claves como:
  ```json
  "disease.title": "Medical Conditions",
  "disease.search": "Search Disease",
  "disease.diagnosed_at": "Diagnosis Date"
  ```

---

# Módulo 4: Historial Médico (Eventos y Documentos)

> **Objetivo:** Crear una línea de tiempo con eventos médicos y documentos adjuntos.

### ✅ 1. Interfaces

- **Ruta:** `src/interfaces/client/medical-history.interface.ts`
- **Tipos:**
  ```ts
  interface MedicalEventRead {
    uuid: string
    title: string
    date: string
    description?: string
    documents: MedicalDocumentRead[]
  }
  interface MedicalEventCreate {
    title: string
    date: string
    description?: string
    files?: File[]
  }
  interface MedicalDocumentRead {
    uuid: string
    filename: string
    url: string
    uploadedAt: string
  }
  ```

### 💻 2. Servicio

- `src/services/client/medicalHistoryService.ts`:
  - CRUD de eventos: `getEvents`, `createEvent`, `updateEvent`, `deleteEvent`
- `src/services/fileUploadService.ts` o extensión de `ApiHandler`:
  - `uploadFiles(formData: FormData): Promise<MedicalDocumentRead[]>`

### 🔁 3. Store (Zustand)

- **Ruta:** `src/store/medical-history/medical-history.store.ts`
- Estado: eventos, carga, errores, documentos temporales.

### 🌐 4. UI: Pantallas y Componentes

- `MedicalHistoryScreen.tsx` – Timeline con eventos.
- `MedicalEventFormScreen.tsx` – Formulario con selector de archivos (usar `expo-document-picker` o `expo-image-picker`).
- Mostrar miniaturas o nombres de archivos subidos.

### ⚙️ 5. Navegación

- Agregar a `ProfileStackNavigator`.
- Conectar desde `MyProfileScreen`.

### 🌍 6. Localización

- Claves como:
  ```json
  "medical_history.title": "Medical History",
  "medical_history.add_event": "Add Event",
  "medical_history.attach_files": "Attach Files"
  ```

---

# Módulo 5: Planes de Medicación y Recordatorios

> **Objetivo:** Registrar medicamentos y configurar recordatorios.

### ✅ 1. Interfaces

- **Ruta:** `src/interfaces/client/medication.interface.ts`
- **Tipos:**
  ```ts
  interface MedicationScheduleRead {
    uuid: string
    medicationName: string
    dosage: string
    frequency: 'daily' | 'weekly' | 'custom'
    startDate: string
    endDate?: string
    reminders: Reminder[]
  }
  interface MedicationScheduleCreate {
    medicationName: string
    dosage: string
    frequency: string
    timeSlots: string[]
    startDate: string
    endDate?: string
  }
  interface Reminder {
    time: string
    enabled: boolean
  }
  ```

### 💻 2. Servicio

- **Ruta:** `src/services/client/medicationService.ts`
- Funciones: `getSchedules`, `createSchedule`, `updateSchedule`, `deleteSchedule`

### 🔁 3. Store (Zustand)

- **Ruta:** `src/store/medication/medication.store.ts`

### 🌐 4. UI: Pantallas y Componentes

- `MedicationListScreen.tsx` – Lista con estados de cumplimiento.
- `MedicationFormScreen.tsx` – Formulario con selector de frecuencia y horarios (usar `TimePicker`).

### ⚙️ 5. Navegación

- Agregar rutas al stack de perfil.
- Conectar desde `MyProfileScreen`.

### 🌍 6. Localización

- Claves como:
  ```json
  "medication.title": "Medications",
  "medication.dosage": "Dosage",
  "medication.reminders": "Reminders"
  ```

---

# Módulo 6: Infraestructura y Soporte

> **Objetivo:** Implementar funcionalidades transversales críticas.

## 6.1 📡 Notificaciones Push

### ✅ 1. Obtener Token Expo Push

- Usar `Notifications.getExpoPushTokenAsync()`

### 💻 2. Servicio

- `src/services/pushNotificationService.ts`
  ```ts
  registerDevice(token: string): Promise<void>
  unregisterDevice(token: string): Promise<void>
  ```

### ⚙️ 3. Integración

- En `auth.store.ts`:
  - Tras login exitoso → `registerDevice(token)`
  - En logout → `unregisterDevice(token)`

---

## 6.2 🔍 Búsqueda de Códigos Médicos

### 💻 1. Servicio

- `src/services/medicalCodeService.ts`
  ```ts
  searchMedicalTerm(query: string): Promise<{ uuid: string; name: string; code: string }[]>
  ```
- Endpoint: `GET /api/v1/medical-codes/search?q=...`

### ⚙️ 2. Integración

- Usar en `AllergyFormScreen` y `DiseaseFormScreen` para autocompletado.
- Implementar `SearchableSelect` o `AutocompleteInput`.

---

## 6.3 📊 Resumen de Salud (Dashboard)

### 💻 1. Servicio

- `src/services/analyticsService.ts`
  ```ts
  getHealthSummary(): Promise<HealthSummary>
  ```
- Ejemplo de respuesta:
  ```ts
  interface HealthSummary {
    totalAllergies: number
    activeMedications: number
    recentEvents: number
    criticalAlerts: string[]
  }
  ```

### 🌐 2. UI

- `HealthSummaryWidget.tsx` – Componente pequeño para mostrar en `DashboardScreen.tsx`
- Mostrar alertas (ej: "Tiene 3 alergias graves registradas")

### ⚙️ 3. Integración

- Cargar en `DashboardScreen` al iniciar.
- Usar store opcional (`analytics.store.ts`) o cargar directamente.

---

## 📅 Recomendación de Orden de Implementación

| Módulo | Nombre                                  | Prioridad   | Estado          |
| ------ | --------------------------------------- | ----------- | --------------- |
| ✅ 1   | Gestión de Datos de Emergencia (Legado) | **Media**   | Pendiente       |
| ✅ 2   | Gestión de Alergias (Estructurado)      | Alta        | Pendiente       |
| ✅ 3   | Gestión de Enfermedades (Estructurado)  | Alta        | Pendiente       |
| ✅ 4   | Gestión de Signos Vitales               | Alta        | **Nuevo**       |
| ✅ 5   | Historial Médico (Eventos y Documentos) | Media-Alta  | **En Progreso** |
| 🟡 6   | Planes de Medicación y Recordatorios    | Media       | Pendiente       |
| ❌ 7   | Recordatorios                           |
| ❌ 8   | Infraestructura y Soporte               | Transversal | Pendiente       |

---

## ✅ Checklist General (Por Módulo)

| Tarea         | M1  | M2  | M3  | M4  | M5  | M6  |
| ------------- | --- | --- | --- | --- | --- | --- |
| Interfaces ✔️ | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |
| Servicios 💻  | ❌  | ❌  | ❌  | ❌  | ❌  | ✅  |
| Store 🔁      | ❌  | ❌  | ❌  | ❌  | ❌  | ✅  |
| UI 🌐         | ❌  | ❌  | ❌  | ❌  | ❌  | ✅  |
| Navegación ⚙️ | ❌  | ❌  | ❌  | ❌  | ❌  | ✅  |
| i18n 🌍       | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  |

---

## 📁 Estructura de Carpetas Sugerida

```
src/
├── interfaces/
│   └── client/
│       ├── emerg-data.interface.ts
│       ├── allergy.interface.ts
│       ├── disease.interface.ts
│       ├── medical-history.interface.ts
│       └── medication.interface.ts
├── services/
│   ├── client/
│   │   ├── emergDataService.ts
│   │   ├── allergyService.ts
│   │   ├── diseaseService.ts
│   │   ├── medicalHistoryService.ts
│   │   └── medicationService.ts
│   ├── pushNotificationService.ts
│   ├── medicalCodeService.ts
│   ├── analyticsService.ts
│   └── fileUploadService.ts
├── store/
│   ├── emerg-data/
│   ├── allergy/
│   ├── disease/
│   ├── medical-history/
│   ├── medication/
│   └── auth.store.ts
├── screens/
│   └── profile/
│       ├── EmergencyDataScreen.tsx
│       ├── AllergyListScreen.tsx
│       ├── AllergyFormScreen.tsx
│       ├── DiseaseListScreen.tsx
│       ├── MedicalHistoryScreen.tsx
│       └── MedicationListScreen.tsx
├── components/
│   ├── AllergyListItem.tsx
│   ├── DiseaseListItem.tsx
│   └── HealthSummaryWidget.tsx
└── i18n/
    ├── en.json
    └── es.json
```

---

## 🛠️ Herramientas Recomendadas

- **API Client:** `axios` o `fetch` con `ApiHandler` centralizado.
- **Formularios:** `react-hook-form` + `zod` para validación.
- **UI:** `react-native-paper` o `native-base` para componentes.
- **Pickers:** `@react-native-community/datetimepicker`, `expo-document-picker`.
- **Notificaciones:** `expo-notifications`.
- **Internacionalización:** `i18next` + `react-i18next`.

---

## 📢 Próximos Pasos

1. Crear las interfaces de los 6 módulos.
2. Implementar servicios básicos (GET/POST).
3. Configurar stores con Zustand.
4. Desarrollar pantallas iniciales (List + Form).
5. Integrar navegación.
6. Añadir traducciones.
7. Probar cada módulo de forma aislada.
8. Realizar pruebas de integración.

---

✅ **¡Listos para comenzar!**  
Este documento servirá como guía viva del proyecto. Puedes actualizarlo con checkboxes reales o integrarlo con herramientas como GitHub Projects, Notion o Jira.

¿Quieres que genere los archivos base (interfaces, stores, etc.) en formato copiable?
