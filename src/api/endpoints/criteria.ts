import { api } from '../api';
import type { CriterionCreateDTO, CriterionUpdateDTO, CriterionResponseDTO } from '../../types';
import { paramsSerialize } from '../utils';

export const getCriteria = async (params?: {
	search?: string;
	tags?: string[];
}): Promise<CriterionResponseDTO[]> => {
	const response = await api.get<CriterionResponseDTO[]>('/api/v1/criteria', {
		params,
		paramsSerializer: paramsSerialize,
	});
	return response.data;
};

export const getAvailableTags = async (): Promise<string[]> => {
	const response = await api.get<string[]>('/api/v1/criteria/available_tags');
	return response.data;
};

export const getCriterion = async (criterionId: number): Promise<CriterionResponseDTO> => {
	const response = await api.get<CriterionResponseDTO>(`/api/v1/criteria/${criterionId}`);
	return response.data;
};

export const createCriterion = async (data: CriterionCreateDTO): Promise<CriterionResponseDTO> => {
	const response = await api.post<CriterionResponseDTO>('/api/v1/criteria', data);
	return response.data;
};

export const updateCriterion = async (
	criterionId: number,
	data: CriterionUpdateDTO
): Promise<CriterionResponseDTO> => {
	const response = await api.put<CriterionResponseDTO>(`/api/v1/criteria/${criterionId}`, data);
	return response.data;
};

export const deleteCriterion = async (criterionId: number): Promise<{ message: string }> => {
	const response = await api.delete<{ message: string }>(`/api/v1/criteria/${criterionId}`);
	return response.data;
};

export const importCriteria = async (
	file: File,
	workspaceId?: number | null,
	taskId?: number | null
): Promise<CriterionResponseDTO[]> => {
	const formData = new FormData();
	formData.append('file', file);
	if (workspaceId !== undefined && workspaceId !== null) {
		formData.append('workspace_id', String(workspaceId));
	}
	if (taskId !== undefined && taskId !== null) {
		formData.append('task_id', String(taskId));
	}
	const response = await api.post<CriterionResponseDTO[]>('/api/v1/criteria/import', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return response.data;
};
