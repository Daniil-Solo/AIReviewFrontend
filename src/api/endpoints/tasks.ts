import { api } from '../api';
import type {
  TaskCreateDTO,
  TaskUpdateDTO,
  TaskResponseDTO,
  TaskCriteriaCreateDTO,
  TaskCriteriaUpdateWeightDTO,
  TaskCriteriaResponseDTO,
  TaskCriteriaCreateBatchDTO,
  SolutionResponseDTO,
  SuccessOperationDTO,
} from '../../types';

export const getWorkspaceTasks = async (
  workspaceId: number
): Promise<TaskResponseDTO[]> => {
  const response = await api.get<TaskResponseDTO[]>(
    `/api/v1/workspaces/${workspaceId}/tasks`
  );
  return response.data;
};

export const getTask = async (taskId: number): Promise<TaskResponseDTO> => {
  const response = await api.get<TaskResponseDTO>(`/api/v1/tasks/${taskId}`);
  return response.data;
};

export const getTaskPublic = async (taskId: number): Promise<TaskResponseDTO> => {
  const response = await api.get<TaskResponseDTO>(`/api/v1/tasks/${taskId}/public`);
  return response.data;
};

export const createTask = async (
  data: TaskCreateDTO
): Promise<TaskResponseDTO> => {
  const response = await api.post<TaskResponseDTO>('/api/v1/tasks', data);
  return response.data;
};

export const updateTask = async (
  taskId: number,
  data: TaskUpdateDTO
): Promise<TaskResponseDTO> => {
  const response = await api.put<TaskResponseDTO>(`/api/v1/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (
  taskId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/api/v1/tasks/${taskId}`);
  return response.data;
};

export const getTaskCriteria = async (
  taskId: number
): Promise<TaskCriteriaResponseDTO[]> => {
  const response = await api.get<TaskCriteriaResponseDTO[]>(
    `/api/v1/tasks/${taskId}/criteria`
  );
  return response.data;
};

export const addTaskCriterion = async (
  taskId: number,
  data: TaskCriteriaCreateDTO
): Promise<TaskCriteriaResponseDTO> => {
  const response = await api.post<TaskCriteriaResponseDTO>(
    `/api/v1/tasks/${taskId}/criteria`,
    data
  );
  return response.data;
};

export const updateTaskCriterionWeight = async (
  taskId: number,
  taskCriterionId: number,
  data: TaskCriteriaUpdateWeightDTO
): Promise<TaskCriteriaResponseDTO> => {
  const response = await api.patch<TaskCriteriaResponseDTO>(
    `/api/v1/tasks/${taskId}/criteria/${taskCriterionId}`,
    data
  );
  return response.data;
};

export const deleteTaskCriterion = async (
  taskId: number,
  taskCriterionId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/api/v1/tasks/${taskId}/criteria/${taskCriterionId}`
  );
  return response.data;
};

export const getTaskSolutions = async (
  taskId: number
): Promise<SolutionResponseDTO[]> => {
  const response = await api.get<SolutionResponseDTO[]>(
    `/api/v1/tasks/${taskId}/solutions`
  );
  return response.data;
};

export const addTaskCriteriaBatch = async (
  taskId: number,
  data: TaskCriteriaCreateBatchDTO
): Promise<SuccessOperationDTO> => {
  const response = await api.post<SuccessOperationDTO>(
    `/api/v1/tasks/${taskId}/criteria/batch`,
    data
  );
  return response.data;
};