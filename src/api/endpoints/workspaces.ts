import { api } from '../api';
import type {
  WorkspaceCreateDTO,
  WorkspaceUpdateDTO,
  WorkspaceResponseDTO,
  WorkspaceMemberResponseDTO,
  WorkspaceMemberUpdateDTO,
  UserWorkspaceResponseDTO,
  JoinRuleDTO,
  JoinRuleCreateDTO,
  JoinRequestDTO,
  JoinResponseDTO,
  SlugAvailabilityResponseDTO,
  CriterionResponseDTO,
} from '../../types';

export const getProfileWorkspaces = async (): Promise<UserWorkspaceResponseDTO[]> => {
  const response = await api.get<UserWorkspaceResponseDTO[]>('/api/v1/profile/workspaces');
  return response.data;
};

export const refreshProfileWorkspaces = async (): Promise<UserWorkspaceResponseDTO[]> => {
  return getProfileWorkspaces();
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

export const getJoinRules = async (
  workspaceId: number
): Promise<JoinRuleDTO[]> => {
  const response = await api.get<JoinRuleDTO[]>(
    `/api/v1/workspaces/${workspaceId}/join_rules`
  );
  return response.data;
};

export const createJoinRule = async (
  workspaceId: number,
  data: JoinRuleCreateDTO
): Promise<JoinRuleDTO> => {
  const response = await api.post<JoinRuleDTO>(
    `/api/v1/workspaces/${workspaceId}/join_rules`,
    data
  );
  return response.data;
};

export const updateJoinRule = async (
  workspaceId: number,
  ruleId: number,
  data: JoinRuleCreateDTO
): Promise<JoinRuleDTO> => {
  const response = await api.put<JoinRuleDTO>(
    `/api/v1/workspaces/${workspaceId}/join_rules/${ruleId}`,
    data
  );
  return response.data;
};

export const deleteJoinRule = async (
  workspaceId: number,
  ruleId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/api/v1/workspaces/${workspaceId}/join_rules/${ruleId}`
  );
  return response.data;
};

export const checkSlugAvailability = async (
  slug: string
): Promise<SlugAvailabilityResponseDTO> => {
  const response = await api.get<SlugAvailabilityResponseDTO>(
    '/api/v1/workspaces/slugs/availability',
    { params: { slug } }
  );
  return response.data;
};

export const joinWorkspace = async (
  data: JoinRequestDTO
): Promise<JoinResponseDTO> => {
  const response = await api.post<JoinResponseDTO>('/api/v1/joins', data);
  return response.data;
};

export const getWorkspaceCriteria = async (
  workspaceId: number
): Promise<CriterionResponseDTO[]> => {
  const response = await api.get<CriterionResponseDTO[]>(
    `/api/v1/workspaces/${workspaceId}/criteria`
  );
  return response.data;
};