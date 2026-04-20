import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Title,
  Text,
  Stack,
  Paper,
  ThemeIcon,
  Group,
  Skeleton,
  Alert,
} from '@mantine/core';
import { IconWallet } from '@tabler/icons-react';
import { getBalance } from '../../api';
import { getUserData } from '../../lib/jwt';
import styles from './Home.module.css';

export function Home() {
  const navigate = useNavigate();
  const user = getUserData();

  const { data: balanceData, isLoading, error } = useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
    staleTime: 0,
  });

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const getFirstName = (fullname: string): string => {
    const parts = fullname.trim().split(' ');
    return parts[0];
  };

  return (
        <Stack gap="xl">
          <Box>
            <Title order={2} className={styles.greeting}>
              Добро пожаловать, {getFirstName(user.fullname)}!
            </Title>
            <Text c="dimmed" mt="xs">
              Рады видеть вас в системе автоматического ревью
            </Text>
          </Box>

          <Group>
              <Paper p="lg" radius="md" shadow="xs" withBorder style={{ cursor: 'pointer' }} onClick={() => navigate('/transactions')}>
                <Group>
                  <ThemeIcon variant="light" size="lg" radius="md" color="gray">
                    <IconWallet size={20} />
                  </ThemeIcon>
                  {error ? (
                    <Alert color="red">
                      {(error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Ошибка загрузки баланса'}
                    </Alert>
                  ) : (
                    <Box>
                      <Text size="sm" c="dimmed">Баланс</Text>
                      {isLoading ? (
                        <Skeleton width={100} height={28} />
                      ) : (
                        <Text size="xl" fw={700}>{balanceData?.balance.toFixed(1) ?? 0} ₽</Text>
                      )}
                    </Box>
                  )}  
                </Group>
              </Paper>
          </Group>
        </Stack>
  );
}