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