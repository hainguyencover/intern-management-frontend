import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Định dạng email không hợp lệ').min(1, 'Email là bắt buộc'),
  password: z.string().min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự')
});
