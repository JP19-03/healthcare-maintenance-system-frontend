import api from './api';
import type {
  AssignTechnicianFormData,
  CreateTicketFormData,
  ResolveTicketFormData,
  Ticket,
  TicketStatus,
} from '../types';

export const ticketService = {
  async getAllTickets(): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>('/tickets');
    return response.data;
  },

  async getTicketById(ticketId: number): Promise<Ticket> {
    const response = await api.get<Ticket>(`/tickets/${ticketId}`);
    return response.data;
  },

  async getTicketsByTechId(techUserId: number): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>(`/tickets/tech/${techUserId}`);
    return response.data;
  },

  async getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>(`/tickets/status/${status}`);
    return response.data;
  },

  async getTicketsByEquipmentId(equipmentId: number): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>(`/tickets/equipment/${equipmentId}`);
    return response.data;
  },

  async createTicket(data: CreateTicketFormData): Promise<Ticket> {
    const response = await api.post<Ticket>('/tickets', data);
    return response.data;
  },

  async assignTechnician(ticketId: number, data: AssignTechnicianFormData): Promise<Ticket> {
    const response = await api.put<Ticket>(`/tickets/${ticketId}/assign`, data);
    return response.data;
  },

  async resolveTicket(ticketId: number, data: ResolveTicketFormData): Promise<Ticket> {
    const response = await api.put<Ticket>(`/tickets/${ticketId}/resolve`, data);
    return response.data;
  },

  async closeTicket(ticketId: number): Promise<Ticket> {
    const response = await api.put<Ticket>(`/tickets/${ticketId}/close`);
    return response.data;
  },
};
