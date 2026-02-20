export interface AuthUserModel {
    id: number;
    username: string;
    password: string;
    email?: string;
    displayName?: string;
    avatar?: string;
    cover?: string;
    role?: AuthUserModelRoles | string;
    privacy?: AuthUserModelPrivacy | string;
    usersInfoId?: number;
}

export interface AuthUserLoginModel {
    username: string;
    password: string;
}

export interface AuthUserRegModel {
    username: string;
    email: string;
    password: string;
}

export interface AuthUserForgotPassModel {
    email: string;
    password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id?: number;
  displayName?: string;
  username?: string;
  role?: string;
  jwtToken?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string; // ISO date from backend
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export enum AuthUserModelRoles { 
    user = 0,
    admin = 1,
    moderator = 2,
    guest = 3,
    vip = 4,
    banned = 5
}

export enum AuthUserModelPrivacy {
    private = 0,
    public = 1
}