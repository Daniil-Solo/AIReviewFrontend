import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  SimpleGrid,
  Card,
  Text,
  Badge,
  Button,
  Group,
  Title,
  Stack,
  Loader,
  Center,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { getProfileWorkspaces } from '../../api/endpoints/workspaces';
import { useProfileStore } from '../../store/profile';

const roleLabels: Record<string, string> = {
  OWNER: 'Владелец',
  TEACHER: 'Преподаватель',
  STUDENT: 'Студент',
};

const roleColors: Record<string, string> = {
  OWNER: 'red',
  TEACHER: 'blue',
  STUDENT: 'gray',
};

export function WorkspacesPage() {
  const workspaces = useProfileStore((state) => state.workspaces);

  const { isLoading } = useQuery({
    queryKey: ['profileWorkspaces'],
    queryFn: getProfileWorkspaces,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Мои пространства</Title>
        <Button
          component={Link}
          to="/workspaces/new"
          leftSection={<IconPlus size={16} />}
        >
          Создать пространство
        </Button>
      </Group>

      {workspaces.length === 0 ? (
        <Text c="dimmed">Вы пока не состоите ни в одном пространстве</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
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
                <Group justify="space-between">
                  <Text fw={600} size="lg">
                    {ws.name}
                  </Text>
                  <Badge color={roleColors[ws.role]} variant="light">
                    {roleLabels[ws.role]}
                  </Badge>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}