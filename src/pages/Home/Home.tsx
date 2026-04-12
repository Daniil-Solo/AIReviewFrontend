import { useNavigate } from 'react-router-dom';
import {
  Box,
  Title,
  Text,
  Stack,
} from '@mantine/core';
import { getUserData } from '../../lib/jwt';
import styles from './Home.module.css';

export function Home() {
  const navigate = useNavigate();
  const user = getUserData();

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
        </Stack>
  );
}