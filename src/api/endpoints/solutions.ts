import { api } from '../api';
import type {
  SolutionShortResponseDTO,
  PipelineInfoDTO,
  SolutionFormatEnum,
} from '../../types';

interface SuccessOperationDTO {
  message: string;
}

export const getMySolutions = async (
  taskId?: number
): Promise<SolutionShortResponseDTO[]> => {
  const params = taskId ? { task_id: taskId } : {};
  const response = await api.get<SolutionShortResponseDTO[]>(
    '/api/v1/solutions/my',
    { params }
  );
  return response.data;
};

export const createSolution = async (data: {
  task_id: number;
  format: SolutionFormatEnum;
  link?: string;
  file?: File;
}): Promise<SolutionShortResponseDTO> => {
  const formData = new FormData();
  formData.append('task_id', String(data.task_id));
  formData.append('format', data.format);
  if (data.link) {
    formData.append('link', data.link);
  }
  if (data.file) {
    formData.append('file', data.file);
  }

  const response = await api.post<SolutionShortResponseDTO>(
    '/api/v1/solutions',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getSolution = async (
  solutionId: number
): Promise<SolutionShortResponseDTO> => {
  const response = await api.get<SolutionShortResponseDTO>(
    `/api/v1/solutions/${solutionId}`
  );
  return response.data;
};

export const getSolutionInfo = async (
  solutionId: number
): Promise<PipelineInfoDTO> => {
  const response = await api.get<PipelineInfoDTO>(
    `/api/v1/solutions/${solutionId}/info`
  );
  return response.data;
};

export const getSolutionArtefact = async (
  solutionId: number,
  step: string
): Promise<string> => {
  const response = await api.get<string>(
    `/api/v1/solutions/${solutionId}/artefacts/${step}`
  );
  return response.data;
};

export const restartSolution = async (
  solutionId: number
): Promise<SuccessOperationDTO> => {
  const response = await api.post<SuccessOperationDTO>(
    `/api/v1/solutions/${solutionId}/restart`
  );
  return response.data;
};

export const cancelSolution = async (
  solutionId: number
): Promise<SuccessOperationDTO> => {
  const response = await api.post<SuccessOperationDTO>(
    `/api/v1/solutions/${solutionId}/cancel`
  );
  return response.data;
};