import api from './api';
import type { AuthenticatedUser, SignInFormData, SignUpFormData, UserProfile } from '../types';

export const authService = {
  async signUp(data: SignUpFormData): Promise<UserProfile> {
    const response = await api.post<UserProfile>('/authentication/sign-up', data);
    return response.data;
  },

  async signIn(data: SignInFormData): Promise<AuthenticatedUser> {
    const response = await api.post<AuthenticatedUser>('/authentication/sign-in', data);
    return response.data;
  },

  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/my-profile');
    return response.data;
  },
};
