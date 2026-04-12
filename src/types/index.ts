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