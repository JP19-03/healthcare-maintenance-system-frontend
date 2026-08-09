import api from './api';
import type { CreateEquipmentFormData, Equipment, EquipmentStatus, UpdateEquipmentFormData } from '../types';

const equipmentPath = "equipments";

export const equipmentService = {
  async getAllEquipment(): Promise<Equipment[]> {
    const response = await api.get<Equipment[]>(`${equipmentPath}`);
    return response.data;
  },

  async getEquipmentById(id: number): Promise<Equipment> {
    const response = await api.get<Equipment>(`${equipmentPath}/${id}`);
    return response.data;
  },

  async getEquipmentByDepartment(department: string): Promise<Equipment[]> {
    const response = await api.get<Equipment[]>(`${equipmentPath}/department/${department}`);
    return response.data;
  },

  async getEquipmentByStatus(status: EquipmentStatus): Promise<Equipment[]> {
    const response = await api.get<Equipment[]>(`${equipmentPath}/status/${status}`);
    return response.data;
  },

  async createEquipment(data: CreateEquipmentFormData): Promise<Equipment> {
    const response = await api.post<Equipment>(`${equipmentPath}`, data);
    return response.data;
  },

  async updateEquipment(id: number, data: UpdateEquipmentFormData): Promise<Equipment> {
    const response = await api.put<Equipment>(`${equipmentPath}/${id}`, data);
    return response.data;
  },

  async deleteEquipment(id: number): Promise<void> {
    await api.delete(`${equipmentPath}/${id}`);
  },
};
