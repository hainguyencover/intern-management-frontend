import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: z.enum(['ADMIN', 'HR', 'MENTOR', 'INTERN'], {
    required_error: 'Vui lòng chọn vai trò'
  }),
  department: z.string().optional(),
  phone: z.string().optional()
});

export const updateUserSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  role: z.enum(['ADMIN', 'HR', 'MENTOR', 'INTERN']),
  department: z.string().optional(),
  phone: z.string().optional()
});
