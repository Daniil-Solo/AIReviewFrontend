import { api } from '../api';
import type { BalanceResponseDTO, TransactionResponseDTO, TransactionTypeEnum } from '../../types';
import { paramsSerialize } from '../utils';

export const getBalance = async (): Promise<BalanceResponseDTO> => {
  const response = await api.get<BalanceResponseDTO>('/api/v1/transactions/balance');
  return response.data;
};

export interface GetTransactionsParams {
  started_at?: string;
  ended_at?: string;
  types?: TransactionTypeEnum[];
}

export const getTransactions = async (
  params?: GetTransactionsParams
): Promise<TransactionResponseDTO[]> => {
  const response = await api.get<TransactionResponseDTO[]>('/api/v1/transactions', {
    params: {
      started_at: params?.started_at || undefined,
      ended_at: params?.ended_at || undefined,
      types: params?.types?.length ? params.types : undefined,
    },
    paramsSerializer: paramsSerialize
  });
  return response.data;
};