import { api } from '../api';
import type {
  SolutionShortResponseDTO,
  PipelineInfoDTO,
} from '../../types';

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