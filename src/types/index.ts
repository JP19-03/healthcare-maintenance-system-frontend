import { z } from 'zod'

/** IAM */
export const RoleEnum = z.enum(['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_TECH']);
export type Role = z.infer<typeof RoleEnum>;

export const SignUpSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(50, 'Username must not exceed 50 characters'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),
    fullName: z
        .string()
        .min(3, 'Full name must be at least 3 characters long'),
    role: RoleEnum,
    department: z
        .string()
        .min(2, 'Department is required'),
});
export type SignUpFormData = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});
export type SignInFormData = z.infer<typeof SignInSchema>;

export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    fullName: z.string(),
    role: RoleEnum,
    department: z.string(),
    createdAt: z.string().nullable().optional(),
});
export type UserProfile = z.infer<typeof UserSchema>;

export const AuthenticatedUserSchema = z.object({
    id: z.number(),
    username: z.string(),
    token: z.string(),
    role: RoleEnum,
    fullName: z.string(),
});
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;

/** INVENTORY BOUNDED CONTEXT */
export const EquipmentStatusEnum = z.enum(['ACTIVE', 'BROKEN', 'IN_MAINTENANCE']);
export type EquipmentStatus = z.infer<typeof EquipmentStatusEnum>;

export const CreateEquipmentSchema = z.object({
    name: z.string().min(2, 'Equipment name is required'),
    serialNumber: z.string().min(2, 'Serial number is required'),
    model: z.string().min(1, 'Model is required'),
    location: z.string().min(1, 'Location is required'),
    department: z.string().min(1, 'Department is required'),
});
export type CreateEquipmentFormData = z.infer<typeof CreateEquipmentSchema>;

export const UpdateEquipmentSchema = CreateEquipmentSchema;
export type UpdateEquipmentFormData = z.infer<typeof UpdateEquipmentSchema>;

export const EquipmentSchema = z.object({
    id: z.number(),
    name: z.string(),
    serialNumber: z.string(),
    model: z.string(),
    location: z.string(),
    department: z.string(),
    status: EquipmentStatusEnum,
    isDeleted: z.boolean().optional(),
});
export type Equipment = z.infer<typeof EquipmentSchema>;

/** MAINTENANCE BOUNDED CONTEXT */
export const TicketStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']);
export type TicketStatus = z.infer<typeof TicketStatusEnum>;

export const TicketPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type TicketPriority = z.infer<typeof TicketPriorityEnum>;

export const CreateTicketSchema = z.object({
    equipmentId: z.number().positive('Select a valid equipment'),
    reportedByUserId: z.number().positive('Reporting user is required'),
    issueDescription: z.string().min(5, 'Issue description must be at least 5 characters long'),
    photoUrl: z.string().optional(),
    priority: TicketPriorityEnum,
});
export type CreateTicketFormData = z.infer<typeof CreateTicketSchema>;

export const AssignTechnicianSchema = z.object({
    assignedTechUserId: z.number().positive('Select an assigned technician'),
});
export type AssignTechnicianFormData = z.infer<typeof AssignTechnicianSchema>;

export const ResolveTicketSchema = z.object({
    technicalNotes: z.string().min(3, 'Technical notes must be at least 3 characters long'),
});
export type ResolveTicketFormData = z.infer<typeof ResolveTicketSchema>;

export const TicketSchema = z.object({
    id: z.number(),
    equipmentId: z.number(),
    equipmentName: z.string().nullable().optional(),
    reportedByUserId: z.number(),
    reportedByUserName: z.string().nullable().optional(),
    assignedTechUserId: z.number().nullable().optional(),
    assignedTechUserName: z.string().nullable().optional(),
    issueDescription: z.string(),
    technicalNotes: z.string().nullable().optional(),
    photoUrl: z.string().nullable().optional(),
    status: TicketStatusEnum,
    priority: TicketPriorityEnum,
    createdAt: z.string().nullable().optional(),
    resolvedAt: z.string().nullable().optional(),
});
export type Ticket = z.infer<typeof TicketSchema>;

/** ANALYTICS BOUNDED CONTEXT */
export interface EquipmentStats {
    totalCount: number;
    activeCount: number;
    brokenCount: number;
    inMaintenanceCount: number;
    operationalRatePercentage: number;
}

export interface TicketStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    criticalPriorityTickets: number;
}

export interface EquipmentByDepartment {
    department: string;
    count: number;
}

export interface TechPerformance {
    techUserId: number;
    techName: string;
    totalAssigned: number;
    resolvedCount: number;
}

export interface DashboardSummary {
    equipmentStats: EquipmentStats;
    ticketStats: TicketStats;
    equipmentByDepartment: EquipmentByDepartment[];
    technicianPerformance: TechPerformance[];
    meanTimeToResolutionHours: number;
}