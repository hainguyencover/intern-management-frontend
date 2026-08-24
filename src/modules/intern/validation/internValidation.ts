import { z } from 'zod';

export const internProfileSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự'),
  email: z.string().email('Định dạng email không hợp lệ'),
  phone: z.string().optional().or(z.literal('')),
  university: z.string().min(2, 'Trường đại học là bắt buộc'),
  major: z.string().min(2, 'Chuyên ngành là bắt buộc'),
  gpa: z.number().min(0, 'GPA từ 0 đến 4').max(4, 'GPA tối đa là 4.0').optional(),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal(''))
});
