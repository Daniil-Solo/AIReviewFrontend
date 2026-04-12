import { api } from '../api';
import type {
  WorkspaceCreateDTO,
  WorkspaceUpdateDTO,
  WorkspaceResponseDTO,
  WorkspaceMemberResponseDTO,
  WorkspaceMemberUpdateDTO,
  UserWorkspaceResponseDTO,
} from '../../types';

export const getProfileWorkspaces = async (): Promise<UserWorkspaceResponseDTO[]> => {
  const response = await api.get<UserWorkspaceResponseDTO[]>('/api/v1/profile/workspaces');
  return response.data;
};

export const getWorkspace = async (workspaceId: number): Promise<WorkspaceResponseDTO> => {
  const response = await api.get<WorkspaceResponseDTO>(`/api/v1/workspaces/${workspaceId}`);
  return response.data;
};

export const createWorkspace = async (
  data: WorkspaceCreateDTO
): Promise<WorkspaceResponseDTO> => {
  const response = await api.post<WorkspaceResponseDTO>('/api/v1/workspaces', data);
  return response.data;
};

export const updateWorkspace = async (
  workspaceId: number,
  data: WorkspaceUpdateDTO
): Promise<WorkspaceResponseDTO> => {
  const response = await api.put<WorkspaceResponseDTO>(
    `/api/v1/workspaces/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspace = async (
  workspaceId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/api/v1/workspaces/${workspaceId}`
  );
  return response.data;
};

export const getWorkspaceMembers = async (
  workspaceId: number
): Promise<WorkspaceMemberResponseDTO[]> => {
  const response = await api.get<WorkspaceMemberResponseDTO[]>(
    `/api/v1/workspaces/${workspaceId}/members`
  );
  return response.data;
};

export const updateMember = async (
  workspaceId: number,
  memberId: number,
  data: WorkspaceMemberUpdateDTO
): Promise<WorkspaceMemberResponseDTO> => {
  const response = await api.patch<WorkspaceMemberResponseDTO>(
    `/api/v1/workspaces/${workspaceId}/members/${memberId}`,
    data
  );
  return response.data;
};

export const leaveWorkspace = async (
  workspaceId: number
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    `/api/v1/workspaces/${workspaceId}/leave`
  );
  return response.data;
};