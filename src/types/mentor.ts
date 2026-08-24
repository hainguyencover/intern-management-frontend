export interface Mentor {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  maxCapacity: number;
  activeInternCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface MentorWorkload {
  mentorId: number;
  mentorName: string;
  maxCapacity: number;
  activeCount: number;
  availableSlots: number;
}

export interface CreateMentorRequest {
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  maxCapacity: number;
}

export interface MentorAssignmentRequest {
  internProfileId: number;
  mentorId: number;
  notes?: string;
}

export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type ProfileStatus = 'DRAFT' | 'COMPLETED' | 'VERIFIED';

export interface Skill {
  id: number;
  name: string;
  category?: string;
  isActive: boolean;
}

export interface MentorSkill {
  id: number;
  skillId: number;
  name: string;
  category?: string;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number;
}

export interface MentoringDomain {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface MentorExperience {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrent: boolean;
}

export interface MentorCertification {
  id: number;
  name: string;
  issuingOrganization?: string;
  credentialId?: string;
  issuedDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface MentorProfileDetail {
  id: number;
  userId: number;
  employeeCode: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  departmentId?: number;
  departmentName?: string;
  jobTitle?: string;
  position?: string;
  title?: string;
  specialization?: string;
  bio?: string;
  yearsOfExperience?: number;
  mentoringExperienceYears: number;
  maxInterns: number;
  currentInternCount: number;
  availableCapacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  profileStatus: ProfileStatus;
  skills: MentorSkill[];
  domains: MentoringDomain[];
  experiences: MentorExperience[];
  certifications: MentorCertification[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMentorProfilePayload {
  fullName?: string;
  jobTitle?: string;
  department?: string;
  specialization?: string;
  bio?: string;
  yearsOfExperience?: number;
  mentoringExperienceYears?: number;
  maxInterns?: number;
  domainIds?: number[];
}

export interface AddMentorSkillPayload {
  skillId: number;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
}

export interface MentorExperiencePayload {
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrent?: boolean;
}

export interface MentorCertificationPayload {
  name: string;
  issuingOrganization?: string;
  credentialId?: string;
  issuedDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface MentorMatchFilter {
  keyword?: string;
  departmentId?: number;
  skill?: string;
  minSkillLevel?: ProficiencyLevel;
  domain?: string;
  minExperience?: number;
  availableCapacityOnly?: boolean;
  requiredSkills?: string[];
  targetDomain?: string;
}

export interface MentorMatchResult {
  mentor: MentorProfileDetail;
  matchPercentage: number;
  skillMatchScore: number;
  experienceMatchScore: number;
  domainMatchScore: number;
  capacityMatchScore: number;
  matchedSkills: string[];
  matchedDomains: string[];
  matchReason: string;
}

export type MentorAssignmentStatusType = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ENDED' | 'UNASSIGNED' | 'REASSIGNED';

export interface MentorAssignmentHistory {
  id: number;
  enrollmentId?: number;
  internId: number;
  internName?: string;
  internEmail?: string;
  internCode?: string;
  mentorId: number;
  mentorName?: string;
  mentorEmail?: string;
  mentorEmployeeCode?: string;
  mentorDepartmentId?: number;
  mentorDepartmentName?: string;
  assignmentType: string;
  startDate: string;
  endDate?: string;
  status: MentorAssignmentStatusType;
  responsibility?: string;
  assignedAt: string;
  endedAt?: string;
  assignedById?: number;
  assignedByName?: string;
  unassignedAt?: string;
  unassignedBy?: number;
  unassignedByName?: string;
  unassignReason?: string;
  reason?: string;
}

export interface UnassignMentorPayload {
  reason: string;
}


