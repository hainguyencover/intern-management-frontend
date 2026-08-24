import { z } from 'zod';

export const mentorSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  department: z.string().min(2, 'Vui lòng nhập phòng ban'),
  position: z.string().min(2, 'Vui lòng nhập vị trí công tác'),
  maxCapacity: z.number().min(1, 'Sức chứa tối đa phải lớn hơn 0')
});

export const mentorAssignSchema = z.object({
  mentorId: z.number({ required_error: 'Vui lòng chọn Mentor' }),
  notes: z.string().optional()
});
