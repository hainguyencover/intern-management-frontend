import * as departmentService from './departmentService';
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  DepartmentQuery,
  DepartmentListResponse
} from '../models/department';

export class DepartmentFacade {
  static async loadDepartments(query?: DepartmentQuery): Promise<DepartmentListResponse> {
    return await departmentService.fetchDepartments(query);
  }

  static async createDepartment(payload: CreateDepartmentPayload): Promise<Department> {
    return await departmentService.createDepartment(payload);
  }

  static async updateDepartment(id: string, payload: UpdateDepartmentPayload): Promise<Department> {
    return await departmentService.updateDepartment(id, payload);
  }

  static async deleteDepartment(id: string): Promise<void> {
    await departmentService.deleteDepartment(id);
  }
}
