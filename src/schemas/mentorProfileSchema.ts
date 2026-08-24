import { z } from 'zod';

export const mentorProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(150, 'Họ tên không vượt quá 150 ký tự'),

  jobTitle: z
    .string()
    .min(1, 'Chức danh không được để trống')
    .max(100, 'Chức danh không vượt quá 100 ký tự'),

  department: z.string().max(150).optional(),
  specialization: z.string().max(255).optional(),
  bio: z.string().max(2000, 'Giới thiệu bản thân không vượt quá 2000 ký tự').optional(),

  yearsOfExperience: z
    .number({ invalid_type_error: 'Vui lòng nhập số' })
    .int()
    .min(0, 'Kinh nghiệm không được âm')
    .max(60, 'Kinh nghiệm tối đa 60 năm'),

  mentoringExperienceYears: z
    .number({ invalid_type_error: 'Vui lòng nhập số' })
    .int()
    .min(0, 'Kinh nghiệm hướng dẫn không được âm')
    .max(60, 'Kinh nghiệm hướng dẫn tối đa 60 năm'),

  maxInterns: z
    .number({ invalid_type_error: 'Vui lòng nhập số' })
    .int()
    .min(1, 'Số lượng tối thiểu là 1')
    .max(100, 'Số lượng tối đa là 100')
});

export const mentorSkillSchema = z.object({
  skillId: z.number({ required_error: 'Vui lòng chọn kỹ năng' }),
  proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], {
    required_error: 'Vui lòng chọn trình độ'
  }),
  yearsOfExperience: z.number().int().min(0).max(60).optional()
});

export const mentorExperienceSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Tên công ty không được để trống')
    .max(150, 'Tên công ty không vượt quá 150 ký tự'),

  position: z
    .string()
    .min(1, 'Vị trí công việc không được để trống')
    .max(150, 'Vị trí không vượt quá 150 ký tự'),

  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().optional(),
  description: z.string().max(2000).optional(),
  isCurrent: z.boolean().optional()
});

export const mentorCertificationSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên chứng chỉ không được để trống')
    .max(200, 'Tên chứng chỉ không vượt quá 200 ký tự'),

  issuingOrganization: z.string().max(200).optional(),
  credentialId: z.string().max(150).optional(),
  issuedDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().max(500).optional()
});
