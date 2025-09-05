/**
 * Define la estructura para la paleta de colores de un tema.
 * Esto asegura la consistencia entre los temas claro y oscuro.
 * Las propiedades están agrupadas lógicamente para facilitar su mantenimiento.
 */
export interface ThemeColors {
  // --- Colores Base ---
  primary: string // Color principal para botones, enlaces y elementos activos.
  primaryText: string // Texto sobre el color primario (generalmente blanco o negro).
  secondary: string // Color secundario para elementos menos prominentes.
  background: string // Color de fondo principal de las pantallas.
  card: string // Color de fondo para tarjetas y superficies elevadas.
  text: string // Color de texto principal.
  secondaryText: string // Color para texto secundario, subtítulos y descripciones.
  onSurfaceVariant: string // Texto de énfasis medio sobre superficies (ej. etiquetas de forms).
  border: string // Color para bordes y separadores.

  // --- Colores de Estado ---
  success: string // Indica éxito (ej. notificaciones, validaciones).
  alert: string // Indica peligro o error (ej. alertas, campos inválidos).
  alertSoft: string // Un fondo suave para alertas, para no ser tan estridente.
  disabled: string // Color para elementos deshabilitados (botones, inputs).

  // --- Colores de UI Específicos ---
  inputBackground: string // Fondo específico para campos de texto.
  placeholder: string // Color para el texto de placeholder en los inputs.
  neutral: string // Color neutro para fondos de badges o elementos informativos.
  tabIconDefault: string // Color para íconos de pestañas no seleccionadas.
  tabIconSelected: string // Color para el ícono de la pestaña activa.
  //------------------- colores de fgraficos -------------------
  surface: string
}
