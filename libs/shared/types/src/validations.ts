import * as z from 'zod';

export const bloodGroups = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
] as const;

export const addPatientSchema = z
  .object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    dateOfBirth: z.string().min(1, 'Required'),
    gender: z.enum(['male', 'female', 'other']),
    bloodGroup: z.enum(bloodGroups),
    email: z.string().email('Valid email required'),
    phone: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    status: z.enum([
      'active',
      'discharged',
      'critical',
      'stable',
      'observation',
    ]),
    department: z.string().min(1, 'Required'),
    assignedDoctor: z.string().min(1, 'Required'),
    admittedAt: z.string().min(1, 'Required'),
    dischargedAt: z.string().optional(),
  })
  .refine(
    (data) =>
      data.status !== 'discharged' ||
      (data.dischargedAt !== undefined && data.dischargedAt.length > 0),
    { message: 'Required when status is discharged', path: ['dischargedAt'] }
  );

export type AddPatientForm = z.infer<typeof addPatientSchema>;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  displayName: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
