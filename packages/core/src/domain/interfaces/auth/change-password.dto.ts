/**
 * Data Transfer Object for changing the password of an authenticated user.
 */
export interface ChangePasswordDto {
  new_password: string
  new_passwordRepeat: string
  old_password: string
}
