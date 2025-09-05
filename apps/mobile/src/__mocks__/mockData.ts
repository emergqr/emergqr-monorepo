import { Client } from '@/interfaces/client/client.interface'

/**
 * A reusable mock client object for testing purposes.
 */
export const mockClient: Client = {
  id: 17,
  uuid: 'ec9777f5-7845-4e1e-8b7e-24b0fdaaec5e',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  username: null,
  avatar_url: null,
  is_active: true,
  is_admin: false,
  created_at: '2025-01-01T12:00:00.000Z',
  full_avatar_url: null,
}

/**
 * A reusable mock JWT token for testing purposes.
 */
export const mockToken = 'fake-jwt-token'
