import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, 'Tiêu đề nhiệm vụ phải có ít nhất 3 ký tự').nonempty('Tiêu đề là bắt buộc'),
  description: z.string().min(5, 'Mô tả nhiệm vụ phải có ít nhất 5 ký tự').nonempty('Mô tả là bắt buộc'),
  assigneeId: z.string().nonempty('Vui lòng chọn Thực tập sinh'),
  dueDate: z.string().nonempty('Hạn hoàn thành là bắt buộc'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
});

export const dailyReportSchema = z.object({
  reportDate: z.string().nonempty('Ngày báo cáo là bắt buộc'),
  content: z.string().min(10, 'Nội dung báo cáo tối thiểu 10 ký tự').nonempty('Nội dung báo cáo là bắt buộc')
});
