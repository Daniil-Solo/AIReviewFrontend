import { Link } from 'react-router-dom';
import { Stack, Title, Text, Button, Group, Alert, Badge } from '@mantine/core';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import type { SolutionShortResponseDTO } from '../../types';
import { statusLabels, formatLabels } from '../../features/solutions/constants';
import { formatRelativeTime } from '../../lib/date';

interface StudentSolutionPageProps {
  solution: SolutionShortResponseDTO;
  isOwner: boolean;
  workspaceId: number;
  taskId: number;
}

export function StudentSolutionPage({ solution, isOwner, workspaceId, taskId }: StudentSolutionPageProps) {
  const progress = (solution.steps.length / 6) * 100;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group gap="sm">
          <Button
            component={Link}
            to={`/workspaces/${workspaceId}/tasks/${taskId}`}
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            size="sm"
          >
            К задаче
          </Button>
        </Group>
      </Group>

      {!isOwner && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Решение не принадлежит данному студенту
        </Alert>
      )}

      <Stack gap="md">
        <Title order={3}>Решение #{solution.id}</Title>

        <Group gap="xl">
          <Stack gap={4}>
            <Text size="sm" c="dimmed">Формат</Text>
            <Badge variant="outline" color="gray" size="lg">
              {formatLabels[solution.format]}
            </Badge>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" c="dimmed">Статус</Text>
            <Badge variant="outline" color="gray" size="lg">
              {statusLabels[solution.status]}
            </Badge>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" c="dimmed">Прогресс</Text>
            <Text>{Math.round(progress)}%</Text>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" c="dimmed">Ссылка</Text>
            <Text
              component="a"
              href={solution.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#228be6', textDecoration: 'none' }}
            >
              Открыть
            </Text>
          </Stack>

          <Stack gap={4}>
            <Text size="sm" c="dimmed">Создано</Text>
            <Text size="sm">
              {formatRelativeTime(solution.created_at)}
            </Text>
          </Stack>
        </Group>
      </Stack>
    </Stack>
  );
}