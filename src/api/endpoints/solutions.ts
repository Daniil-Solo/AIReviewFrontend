import { api } from '../api';
import type {
	SolutionShortResponseDTO,
	PipelineInfoDTO,
	SolutionFormatEnum,
	CriteriaGradingReviewResponseDTO,
	WindRosePointDTO,
	SolutionScoreDTO,
} from '../../types';

interface CreateCriteriaCheckDTO {
	task_criterion_id: number;
	is_passed: boolean;
	comment?: string;
}

interface SuccessOperationDTO {
	message: string;
}

interface SolutionFinalReviewDTO {
	human_grade: number;
	human_feedback?: string;
	ai_feedback?: string;
}

export const getMySolutions = async (taskId?: number): Promise<SolutionShortResponseDTO[]> => {
	const params = taskId ? { task_id: taskId } : {};
	const response = await api.get<SolutionShortResponseDTO[]>('/api/v1/solutions/my', { params });
	return response.data;
};

export const createSolution = async (data: {
	task_id: number;
	format: SolutionFormatEnum;
	github_repo_link?: string;
	github_repo_branch?: string;
	file?: File;
}): Promise<SolutionShortResponseDTO> => {
	const formData = new FormData();
	formData.append('task_id', String(data.task_id));
	formData.append('solution_format', data.format);
	if (data.github_repo_link) {
		formData.append('github_repo_link', data.github_repo_link);
	}
	if (data.github_repo_branch) {
		formData.append('github_repo_branch', data.github_repo_branch);
	}
	if (data.file) {
		formData.append('file', data.file);
	}

	const response = await api.post<SolutionShortResponseDTO>('/api/v1/solutions', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

export const getSolution = async (solutionId: number): Promise<SolutionShortResponseDTO> => {
	const response = await api.get<SolutionShortResponseDTO>(`/api/v1/solutions/${solutionId}`);
	return response.data;
};

export const getSolutionInfo = async (solutionId: number): Promise<PipelineInfoDTO> => {
	const response = await api.get<PipelineInfoDTO>(`/api/v1/solutions/${solutionId}/info`);
	return response.data;
};

export const getSolutionArtefact = async (solutionId: number, step: string): Promise<string> => {
	const response = await api.get<string>(`/api/v1/solutions/${solutionId}/artefacts/${step}`);
	return response.data;
};

export const restartSolution = async (solutionId: number): Promise<SuccessOperationDTO> => {
	const response = await api.post<SuccessOperationDTO>(`/api/v1/solutions/${solutionId}/restart`);
	return response.data;
};

export const cancelSolution = async (solutionId: number): Promise<SuccessOperationDTO> => {
	const response = await api.post<SuccessOperationDTO>(`/api/v1/solutions/${solutionId}/cancel`);
	return response.data;
};

export const getSolutionCriteriaChecks = async (
	solutionId: number
): Promise<CriteriaGradingReviewResponseDTO> => {
	const response = await api.get<CriteriaGradingReviewResponseDTO>(
		`/api/v1/solutions/${solutionId}/criteria-checks`
	);
	return response.data;
};

export const createSolutionCriteriaCheck = async (
	solutionId: number,
	data: CreateCriteriaCheckDTO
): Promise<SuccessOperationDTO> => {
	const response = await api.post<SuccessOperationDTO>(
		`/api/v1/solutions/${solutionId}/criteria-checks`,
		data
	);
	return response.data;
};

export const submitFinalReview = async (
	solutionId: number,
	data: SolutionFinalReviewDTO
): Promise<SolutionShortResponseDTO> => {
	const response = await api.post<SolutionShortResponseDTO>(
		`/api/v1/solutions/${solutionId}/final-review`,
		data
	);
	return response.data;
};

export const getSolutionWindRose = async (solutionId: number): Promise<WindRosePointDTO[]> => {
	const response = await api.get<WindRosePointDTO[]>(`/api/v1/solutions/${solutionId}/wind-rose`);
	return response.data;
};

export const approveSolution = async (
	solutionId: number,
	content: string
): Promise<SolutionShortResponseDTO> => {
	const formData = new FormData();
	const blob = new Blob([content], { type: 'text/markdown' });
	formData.append('file', blob, 'project_doc.md');
	const response = await api.post<SolutionShortResponseDTO>(
		`/api/v1/solutions/${solutionId}/approval`,
		formData,
		{ headers: { 'Content-Type': 'multipart/form-data' } }
	);
	return response.data;
};

export const getSolutionScore = async (solutionId: number): Promise<SolutionScoreDTO> => {
	const response = await api.get<SolutionScoreDTO>(`/api/v1/solutions/${solutionId}/score`);
	return response.data;
};
