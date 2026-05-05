import { api } from '../api';
import type {
	UserLoginDTO,
	EmailRegistrationRequestDTO,
	EmailConfirmationRequestDTO,
	TokenDTO,
	SuccessOperationDTO,
} from '../../types';

export const login = async (data: UserLoginDTO): Promise<TokenDTO> => {
	const response = await api.post<TokenDTO>('/api/v1/auth/login', data);
	return response.data;
};

export const registerStart = async (
	data: EmailRegistrationRequestDTO
): Promise<SuccessOperationDTO> => {
	const response = await api.post<SuccessOperationDTO>('/api/v1/auth/register/start', data);
	return response.data;
};

export const registerConfirm = async (data: EmailConfirmationRequestDTO): Promise<TokenDTO> => {
	const response = await api.post<TokenDTO>('/api/v1/auth/register/confirm', data);
	return response.data;
};

export const register = async (data: EmailRegistrationRequestDTO): Promise<TokenDTO> => {
	const response = await api.post<TokenDTO>('/api/v1/auth/register', data);
	return response.data;
};
