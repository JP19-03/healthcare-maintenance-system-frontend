import api from './api';
import type { Role, UserProfile } from '../types';

export const userService = {
  async getAllUsers(): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>('/users');
    return response.data;
  },

  async getUserById(id: number): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/users/${id}`);
    return response.data;
  },

  async getUsersByRole(role: Role): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>(`/users/role/${role}`);
    return response.data;
  },
};
