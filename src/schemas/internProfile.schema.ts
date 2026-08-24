import { z } from 'zod';

export const createInternProfileSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  university: z.string().optional(),
  major: z.string().optional(),
  gpa: z.number().min(0).max(4.0).optional(),
  programId: z.number().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional()
});

export const statusTransitionSchema = z.object({
  targetStatus: z.enum(['DRAFT', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'INTERNING', 'COMPLETED']),
  reason: z.string().min(3, 'Lý do chuyển trạng thái phải có ít nhất 3 ký tự').optional().or(z.literal(''))
});
