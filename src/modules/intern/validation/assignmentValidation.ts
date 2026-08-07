import { z } from 'zod';

export const assignmentSchema = z.object({
  mentorId: z.string().min(1, 'Vui lòng chọn Mentor phụ trách'),
  departmentId: z.string().min(1, 'Vui lòng chọn Phòng ban thực tập'),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc')
});

export const reassignSchema = z.object({
  newMentorId: z.string().min(1, 'Vui lòng chọn Mentor mới'),
  reason: z.string().min(5, 'Lý do chuyển đổi phải ít nhất 5 ký tự')
});
