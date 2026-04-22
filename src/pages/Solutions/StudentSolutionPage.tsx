import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack, Title, Text, Button, Group, Alert, Badge } from '@mantine/core';
import { IconAlertCircle, IconArrowLeft, IconX } from '@tabler/icons-react';
import type { SolutionShortResponseDTO } from '../../types';
import { statusLabels, formatLabels } from '../../features/solutions/constants';
import { formatRelativeTime } from '../../lib/date';
import { cancelSolution } from '../../api/endpoints/solutions';

interface StudentSolutionPageProps {
  solution: SolutionShortResponseDTO;
  isOwner: boolean;
  isAuthor: boolean;
  workspaceId: number;
  taskId: number;
  isTeacher: boolean;
}

export function StudentSolutionPage({ solution, isOwner, isAuthor, workspaceId, taskId, isTeacher }: StudentSolutionPageProps) {
  const queryClient = useQueryClient();
  const progress = (solution.steps.length / 6) * 100;

  const cancelMutation = useMutation({
    mutationFn: () => cancelSolution(solution.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution', solution.id] });
      queryClient.invalidateQueries({ queryKey: ['solutionInfo', solution.id] });
      queryClient.invalidateQueries({ queryKey: ['solutionArtefact', solution.id] });
    },
  });

  const canCancel = isAuthor && !isTeacher && !['REVIEWED', 'ERROR'].includes(solution.status);

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
              href={solution.github_repo_link ?? undefined}
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

        {canCancel && (
          <Button
            leftSection={<IconX size={16} />}
            variant="light"
            color="red"
            onClick={() => cancelMutation.mutate()}
            loading={cancelMutation.isPending}
            mt="md"
          >
            Отменить
          </Button>
        )}
      </Stack>
    </Stack>
  );
}