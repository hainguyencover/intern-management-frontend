import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Định dạng email không hợp lệ').min(1, 'Email là bắt buộc'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc')
});
