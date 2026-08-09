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