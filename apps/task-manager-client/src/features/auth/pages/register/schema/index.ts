import z from 'zod';

const RegisterSchema = z
  .object({
    name: z
      .string('Name is required')
      .min(3, 'Name must be at least 3 characters long')
      .max(100, 'Name must be at most 100 characters long'),

    lastname: z
      .string('Last name is required')
      .min(3, 'Last name must be at least 3 characters long')
      .max(100, 'Last name must be at most 100 characters long')
      .optional(),

    email: z
      .string('Email is required')
      .email('Invalid email format')
      .max(150, 'Email must be at most 150 characters long'),

    password: z
      .string('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must be at most 20 characters long'),

    confirmPassword: z
      .string('Confirm password is required')
      .min(8, 'Confirm password must be at least 8 characters long')
      .max(20, 'Confirm password must be at most 20 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default RegisterSchema;
