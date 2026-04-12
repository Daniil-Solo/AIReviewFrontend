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
}

export interface JoinRuleCreateDTO {
  slug: string;
  role: 'TEACHER' | 'STUDENT';
  password?: string;
  expired_at?: string;
  is_active?: boolean;
}

export interface JoinRuleUpdateDTO {
  role?: 'TEACHER' | 'STUDENT';
  password?: string;
  expired_at?: string | null;
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