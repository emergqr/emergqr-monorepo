# 🚀 **Proyecto: EmergQR **

**Tipo:** Aplicación móvil médica (React Native + Zustand + Expo)  
**Versión:** 1.0  
**Objetivo:** Permitir a los usuarios gestionar su perfil médico de emergencia desde una app móvil.

---

## 🏔️ **Epics Generales**

---

### 🌟 **Epic 1: Perfil Médico del Usuario**

> _Permitir al usuario gestionar su información médica crítica de forma segura y accesible._

#### **User Stories**

---

#### **US-01: Como usuario, quiero registrar mis datos de emergencia para que estén disponibles en situaciones críticas.**

- **Prioridad:** Alta
- **Estado:** Pendiente
- **Puntos de historia:** 3

##### **Tareas**

- [ ] Crear interfaz `EmergDataResponse` e `EmergDataUpdate`
- [ ] Implementar servicio `emergDataService` (GET/PUT)
- [ ] Crear store `emerg-data.store.ts`
- [ ] Diseñar `EmergencyDataScreen.tsx`
- [ ] Conectar desde `MyProfileScreen`
- [ ] Añadir traducciones (en/es)

---

#### **US-02: Como usuario, quiero gestionar mis alergias (CRUD) para mantener mi historial actualizado.**

- **Prioridad:** Alta
- **Estado:** Pendiente
- **Puntos de historia:** 5

##### **Tareas**

- [ ] Crear interfaces: `AllergyRead`, `AllergyCreate`, `ReactionHistoryRead`
- [ ] Implementar `allergyService` (GET/POST/PUT/DELETE + reacciones)
- [ ] Crear store `allergy.store.ts`
- [ ] Diseñar `AllergyListScreen`, `AllergyFormScreen`, `AllergyDetailScreen`
- [ ] Crear componente `AllergyListItem`
- [ ] Integrar en `ProfileStackNavigator`
- [ ] Añadir traducciones

---

#### **US-03: Como usuario, quiero registrar mis enfermedades y diagnósticos médicos.**

- **Prioridad:** Alta
- **Estado:** Pendiente
- **Puntos de historia:** 5

##### **Tareas**

- [ ] Crear interfaces: `PatientDiseaseRead`, `PatientDiseaseCreate`, `DiseaseRead`
- [ ] Implementar `diseaseService` (CRUD)
- [ ] Crear store `disease.store.ts`
- [ ] Diseñar `DiseaseListScreen` y `DiseaseFormScreen`
- [ ] Crear componente `DiseaseListItem`
- [ ] Integrar en `ProfileStackNavigator`
- [ ] Añadir traducciones

---

#### **US-04: Como usuario, quiero registrar eventos médicos y adjuntar documentos (cirugías, estudios, etc.).**

- **Prioridad:** Alta
- **Estado:** Pendiente
- **Puntos de historia:** 8

##### **Tareas**

- [ ] Crear interfaces: `MedicalEventRead`, `MedicalEventCreate`, `MedicalDocumentRead`
- [ ] Implementar `medicalHistoryService` (CRUD eventos)
- [ ] Crear `fileUploadService` para manejar `multipart/form-data`
- [ ] Crear store `medical-history.store.ts`
- [ ] Diseñar `MedicalHistoryScreen` (timeline)
- [ ] Diseñar `MedicalEventFormScreen` con selector de archivos
- [ ] Integrar en `ProfileStackNavigator`
- [ ] Añadir traducciones

---

#### **US-05: Como usuario, quiero registrar mis medicamentos y configurar recordatorios.**

- **Prioridad:** Media
- **Estado:** Pendiente
- **Puntos de historia:** 5

##### **Tareas**

- [ ] Crear interfaces: `MedicationScheduleRead`, `MedicationScheduleCreate`
- [ ] Implementar `medicationService` (CRUD)
- [ ] Crear store `medication.store.ts`
- [ ] Diseñar `MedicationListScreen` y `MedicationFormScreen`
- [ ] Integrar selector de horarios y frecuencia
- [ ] Integrar en `ProfileStackNavigator`
- [ ] Añadir traducciones

---

### 🌟 **Epic 2: Infraestructura y Funcionalidades Transversales**

> _Implementar funcionalidades técnicas que soportan toda la aplicación._

---

#### **US-06: Como sistema, quiero manejar notificaciones push para alertar al usuario sobre recordatorios médicos.**

- **Prioridad:** Alta
- **Estado:** Pendiente
- **Puntos de historia:** 3

##### **Tareas**

- [ ] Integrar `expo-notifications`
- [ ] Obtener token de push con `getExpoPushTokenAsync()`
- [ ] Crear `pushNotificationService.ts` (register/unregister)
- [ ] Llamar `registerDevice()` tras login exitoso
- [ ] Llamar `unregisterDevice()` en logout
- [ ] Probar flujo de notificaciones

---

#### **US-07: Como usuario, quiero buscar enfermedades o alergias por nombre para seleccionarlas fácilmente.**

- **Prioridad:** Media
- **Estado:** Pendiente
- **Puntos de historia:** 3

##### **Tareas**

- [ ] Crear `medicalCodeService.ts`
- [ ] Implementar `searchMedicalTerm(query: string)`
- [ ] Conectar con endpoint: `GET /api/v1/medical-codes/search?q=...`
- [ ] Integrar en `AllergyFormScreen` y `DiseaseFormScreen`
- [ ] Diseñar componente `SearchableSelect`

---

#### **US-08: Como usuario, quiero ver un resumen de mi salud en el dashboard principal.**

- **Prioridad:** Media
- **Estado:** Pendiente
- **Puntos de historia:** 3

##### **Tareas**

- [ ] Crear `analyticsService.ts`
- [ ] Implementar `getHealthSummary()`
- [ ] Definir interfaz `HealthSummary`
- [ ] Diseñar `HealthSummaryWidget.tsx`
- [ ] Integrar en `DashboardScreen.tsx`
- [ ] Mostrar alertas críticas (alergias graves, medicamentos activos, etc.)

---

### 🌟 **Epic 3: Experiencia de Usuario y Navegación**

> _Garantizar una navegación clara, consistente e intuitiva entre las secciones del perfil._

---

#### **US-09: Como usuario, quiero acceder a todas las secciones médicas desde mi perfil.**

- **Prioridad:** Alta
- **Estado:** Pendiente
- **Puntos de historia:** 2

##### **Tareas**

- [ ] Agregar botones en `MyProfileScreen`:
  - Datos de Emergencia
  - Alergias
  - Enfermedades
  - Historial Médico
  - Medicamentos
- [ ] Verificar que todos los enlaces naveguen correctamente
- [ ] Asegurar que el diseño sea coherente

---

#### **US-10: Como desarrollador, quiero una estructura de carpetas limpia y escalable.**

- **Prioridad:** Baja
- **Estado:** Pendiente
- **Puntos de historia:** 1

##### **Tareas**

- [ ] Crear carpetas:
  - `src/interfaces/client/`
  - `src/services/client/`
  - `src/store/`
  - `src/screens/profile/`
  - `src/components/`
- [ ] Asegurar nomenclatura consistente
- [ ] Documentar estructura en `README.md`

---

### 🌟 **Epic 4: Internacionalización (i18n)**

> _Soportar múltiples idiomas para mejorar la accesibilidad._

---

#### **US-11: Como usuario, quiero usar la app en español o inglés.**

- **Prioridad:** Media
- **Estado:** Pendiente
- **Puntos de historia:** 2

##### **Tareas**

- [ ] Configurar `i18next` + `react-i18next`
- [ ] Crear archivos:
  - `src/i18n/en.json`
  - `src/i18n/es.json`
- [ ] Añadir todas las claves de texto de las pantallas médicas
- [ ] Probar cambio de idioma

---

## 📊 Resumen de Epics

| Epic                      | Historias | Puntos Estimados | Prioridad |
| ------------------------- | --------- | ---------------- | --------- |
| Perfil Médico del Usuario | 5         | 26               | 🔴 Alta   |
| Infraestructura y Soporte | 3         | 9                | 🔴 Alta   |
| Experiencia de Usuario    | 2         | 3                | 🟡 Media  |
| Internacionalización      | 1         | 2                | 🟡 Media  |
| **Total**                 | **11**    | **40**           |           |

---

## 📅 Recomendación de Sprint (Sprint 1 - 2 semanas)

| Semana       | Objetivo                                                            |
| ------------ | ------------------------------------------------------------------- |
| **Semana 1** | Completar Epic 1: US-01, US-02, US-03 + estructura base             |
| **Semana 2** | Completar US-04, US-05 + integrar Epic 2 (notificaciones, búsqueda) |

> 🔄 Dejar Epic 4 (i18n) para paralelizar o completar al final.

---

## 📌 Estado General del Proyecto

| Categoría                   | Estado                           |
| --------------------------- | -------------------------------- |
| Backend analizado           | ✅                               |
| OpenAPI validado            | ✅                               |
| Módulos definidos           | ✅                               |
| Perfiles públicos excluidos | ✅                               |
| Plan técnico listo          | ✅                               |
| Próximo paso                | ⏩ Iniciar desarrollo (Módulo 1) |

---

## 🛠 Herramientas Recomendadas para Jira

- **Epic:** Etiqueta `Epic` + descripción detallada
- **User Story:** Tipo `Story` + estimación en puntos
- **Task:** Tipo `Task` + asignado a desarrollador
- **Subtask:** Tipo `Sub-task` para desglose técnico
- **Labels:** `profile`, `medical-data`, `api-integration`, `ui`, `i18n`
- **Sprints:** Crear `Sprint 1: Perfil Médico`

---

✅ **Este plan está listo para importar a Jira o cualquier herramienta ágil.**  
Puedo ayudarte a:

- Generar un CSV para importar a Jira
- Crear una versión en Notion con tablas interactivas
- Exportar como JSON para automatizar tareas
- Generar las plantillas de código (interfaces, stores, servicios)

¿Quieres que te genere ahora los **archivos base en código** (interfaces, servicios, stores) para comenzar con el primer módulo?
