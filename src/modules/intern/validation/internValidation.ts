import { z } from 'zod';

export const internProfileSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự').nonempty('Họ và tên là bắt buộc'),
  email: z.string().email('Định dạng email không hợp lệ').nonempty('Email là bắt buộc'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ').nonempty('Số điện thoại là bắt buộc'),
  university: z.string().min(2, 'Trường đại học là bắt buộc'),
  major: z.string().min(2, 'Chuyên ngành là bắt buộc'),
  gpa: z.number().min(0, 'GPA từ 0 đến 4').max(4, 'GPA tối đa là 4.0').optional(),
  startDate: z.string().nonempty('Ngày bắt đầu là bắt buộc'),
  endDate: z.string().nonempty('Ngày kết thúc là bắt buộc')
});
