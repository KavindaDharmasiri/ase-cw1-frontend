export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface UserRole {
  id: number;
  name: 'RETAILER' | 'RDC_STAFF' | 'LOGISTICS' | 'HEAD_OFFICE_MANAGER';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
  fullName: string;
  id: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  roleName: string;
}