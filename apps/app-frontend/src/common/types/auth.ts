export interface User {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  phone?: string;
  position?: string;
  birthDate?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface Session {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  revokedAt?: string;
}
