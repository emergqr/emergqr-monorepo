/**
 * Interfaces for the Allergy module, based on openapi.json.
 */

export interface ReactionHistoryRead {
  uuid: string
  reaction_date: string // format: date
  symptoms: string | null
}

export interface ReactionHistoryCreate {
  reaction_date: string // format: date
  symptoms?: string | null
}

export interface AllergyRead {
  uuid: string
  allergen: string
  reaction_type: string | null
  severity: string | null
  acute_treatment: string | null
  diagnosis_date: string | null // format: date
  show_in_emergency: boolean
  source_api: string | null
  source_code: string | null
  reaction_history: ReactionHistoryRead[]
}

export interface AllergyCreate {
  allergen: string
  reaction_type?: string | null
  severity?: string | null
  acute_treatment?: string | null
  diagnosis_date?: string | null // format: date
  show_in_emergency?: boolean
}

export interface AllergyUpdate {
  allergen?: string | null
  reaction_type?: string | null
  severity?: string | null
  acute_treatment?: string | null
  diagnosis_date?: string | null // format: date
  show_in_emergency?: boolean | null
}
