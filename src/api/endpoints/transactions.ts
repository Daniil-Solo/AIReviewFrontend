import { api } from '../api';
import type { BalanceResponseDTO } from '../../types';

export const getBalance = async (): Promise<BalanceResponseDTO> => {
  const response = await api.get<BalanceResponseDTO>('/api/v1/transactions/balance');
  return response.data;
};