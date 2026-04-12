export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface EmailRegistrationRequestDTO {
  fullname: string;
  email: string;
  password: string;
}

export interface EmailConfirmationRequestDTO {
  email: string;
  code: string;
}

export interface TokenDTO {
  access_token: string;
}

export interface SuccessOperationDTO {
  message: string;
}

export interface JWTPayload {
  sub: number;
  email: string;
  fullname: string;
  is_admin: boolean;
  exp: number;
}

export interface WorkspaceCreateDTO {
  name: string;
  description?: string;
}

export interface WorkspaceUpdateDTO {
  name?: string;
  description?: string;
}

export interface WorkspaceResponseDTO {
  id: number;
  name: string;
  description: string;
  is_archived: boolean;
  created_at: string;
}

export type WorkspaceMemberRole = 'OWNER' | 'TEACHER' | 'STUDENT';

export interface WorkspaceMemberUpdateDTO {
  role: WorkspaceMemberRole;
}

export interface WorkspaceMemberResponseDTO {
  id: number;
  user_id: number;
  workspace_id: number;
  role: WorkspaceMemberRole;
  fullname: string;
  email: string;
}

export interface UserWorkspaceResponseDTO {
  workspace: WorkspaceResponseDTO;
  role: WorkspaceMemberRole;
}

export interface JoinRuleDTO {
  id: number;
  slug: string;
  role: WorkspaceMemberRole;
  is_active: boolean;
  has_password: boolean;
  expired_at: string | null;
  created_at: string;
  used_count: number;
}

export interface JoinRuleCreateDTO {
  slug: string;
  role: 'TEACHER' | 'STUDENT';
  password?: string;
  expired_at?: string;
  is_active?: boolean;
}

export interface JoinRequestDTO {
  slug: string;
  password?: string;
}

export interface JoinResponseDTO {
  workspace_id: number;
}

export interface SlugAvailabilityDTO {
  slug: string;
}

export interface SlugAvailabilityResponseDTO {
  slug: string;
  is_available: boolean;
}

export interface ErrorResponseDTO {
  message: string;
  code: string;
}

export type CriterionStage = 'PROJECT_DOC' | 'CODEBASE' | 'MANUAL' | null;

export interface CriterionCreateDTO {
  description: string;
  tags?: string[];
  stage?: CriterionStage;
  is_public?: boolean;
}

export interface CriterionUpdateDTO {
  description?: string;
  tags?: string[];
  stage?: CriterionStage;
  is_public?: boolean;
}

export interface CriterionResponseDTO {
  id: number;
  description: string;
  tags: string[];
  stage: CriterionStage;
  is_public: boolean;
  created_by: number;
  created_at: string;
}

export interface TaskCreateDTO {
  workspace_id: number;
  name: string;
  description?: string;
}

export interface TaskUpdateDTO {
  name: string;
  description?: string;
  is_active: boolean;
}

export interface TaskResponseDTO {
  id: number;
  workspace_id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  use_exam: boolean;
}

export interface TaskCriteriaCreateBatchDTO {
  criterion_ids: number[];
}

export interface TaskCriteriaCreateDTO {
  criterion_id: number;
  weight: number;
}

export interface TaskCriteriaUpdateWeightDTO {
  weight: number;
}

export interface TaskCriteriaResponseDTO {
  id: number;
  task_id: number;
  criterion_id: number;
  weight: number;
  criterion: CriterionResponseDTO;
}

export interface SolutionResponseDTO {
  id: number;
  task_id: number;
  student_id: number;
  student_fullname: string;
  status: string;
  submitted_at: string;
}