import { useNavigate, Link } from 'react-router-dom';
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
  SimpleGrid,
  Card,
  Badge,
} from '@mantine/core';
import { IconWallet, IconPlus, IconUser, IconLock } from '@tabler/icons-react';
import { getBalance } from '../../api';
import { getUserData } from '../../lib/jwt';
import { useProfileStore } from '../../store/profile';
import styles from './Home.module.css';
import { roleColors, roleLabels } from '../../features/roles/constants';


export function Home() {
  const navigate = useNavigate();
  const user = getUserData();
  const workspaces = useProfileStore((state) => state.workspaces);

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
              Рады видеть вас в системе автоматизированной проверки работ
            </Text>
          </Box>

          <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
              <Paper p="lg" radius="md" shadow="xs" withBorder>
                <Group>
                  <ThemeIcon variant="outline" size="lg" radius="md" color="gray">
                    <IconUser size={24} />
                  </ThemeIcon>
                  <Text size="md" fw={600} c='dimmed'>
                      Профиль 
                    </Text>
                  </Group>
                  <Box mt="xs">
                    <Text size="sm" fw={600} c="dimmed">
                      Полное имя
                    </Text>
                    <Text size="sm" c="black">
                      {user?.fullname}
                    </Text>
                   <Text size="sm" fw={600} c="dimmed" mt="xs">
                      Электронная почта
                    </Text>
                    <Text size="sm" c="black">{user?.email}</Text>
                  </Box>
                
              </Paper>

              <Paper p="lg" radius="md" shadow="xs" withBorder>
                <Group gap="xs">
                  <ThemeIcon variant="outline" size="lg" radius="md" color="gray">
                    <IconLock size={24} />
                  </ThemeIcon>
                  <Text size="md" fw={600} c='dimmed'>Безопасность</Text>
                </Group>
                <Box mt="xs">
                  <Text size="sm" fw={600} c="dimmed">
                      Роль в системе
                    </Text>
                    <Text size="sm" c="black">
                      {user?.is_admin ? 'Админ' : 'Пользователь'}
                    </Text>
                  <Text size="sm" fw={600} c="dimmed" mt="xs">
                    ID пользователя
                  </Text>
                  <Text size="sm" c="black" mt={4}>{user?.sub}</Text>
                </Box>
              </Paper>

              <Paper p="lg" radius="md" shadow="xs" withBorder style={{ cursor: 'pointer' }} onClick={() => navigate('/transactions')}>
                <Group gap="xs">
                  <ThemeIcon variant="outline" size="lg" radius="md" color="gray">
                    <IconWallet size={24} />
                  </ThemeIcon>
                  <Text size="md" fw={600} c='dimmed'>Баланс</Text>
                </Group>
                  {error ? (
                    <Alert color="red">
                      {(error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Ошибка загрузки баланса'}
                    </Alert>
                  ) : (
                    <Box mt="xs">
                      {isLoading ? (
                        <Skeleton width={100} height={28} />
                      ) : (
                        <Text size="xl" fz={28} fw={500}>{balanceData?.balance.toFixed(1) ?? 0} ₽</Text>
                      )}
                    </Box>
                  )}  
              </Paper>

          </SimpleGrid>


          <Box>
            <Title order={3} mb="md">Мои пространства</Title>
            <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
              {workspaces.map((ws) => (
                <Card
                  key={ws.workspaceId}
                  component={Link}
                  to={`/workspaces/${ws.workspaceId}`}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Stack gap="xs">
                    <Badge color={roleColors[ws.role]} variant="outline">
                      {roleLabels[ws.role]}
                    </Badge>
                    <Text fw={500} size="lg" lineClamp={2}>
                      {ws.name}
                    </Text>
                  </Stack>
                </Card>
              ))}
              <Card
                component={Link}
                to="/workspaces/new"
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ textDecoration: 'none', color: 'inherit', borderStyle: 'dashed' }}
              >
                <Stack align="center" gap="xs" >
                  <ThemeIcon variant="outline" size="xl" radius="md" color="gray">
                    <IconPlus size={24} />
                  </ThemeIcon>
                  <Text size="md" c="dimmed">Новое пространство</Text>
                </Stack>
              </Card>
            </SimpleGrid>
          </Box>
        </Stack>
  );
}