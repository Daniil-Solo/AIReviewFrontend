import { api } from '../api';
import type { AppSettingsResponseDTO } from '../../types';

export const getAppSettings = async (): Promise<AppSettingsResponseDTO> => {
	const response = await api.get<AppSettingsResponseDTO>('/api/v1/app/settings');
	return response.data;
};
