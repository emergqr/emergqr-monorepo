import { Client } from 'packages/core/src/domain/interfaces/client/client.interface'

export interface AuthResponse {
  access_token: string
  client: Client
}
