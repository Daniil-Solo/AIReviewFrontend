import { decodeJwt } from 'jose';
import type { JWTPayload } from '../types';

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = decodeJwt(token);
    return decoded as unknown as JWTPayload;
  } catch {
    return null;
  }
};

export const getUserData = (): JWTPayload | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return decodeToken(token);
};

export const isAuthenticated = (): boolean => {
  const user = getUserData();
  return user !== null;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};