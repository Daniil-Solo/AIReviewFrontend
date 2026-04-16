import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Title,
  Text,
  Button,
  Group,
  Select,
  TextInput,
  FileInput,
  Alert,
  Loader,
  Center,
  Card,
  Container,
} from '@mantine/core';
import { IconUpload, IconLink, IconSend } from '@tabler/icons-react';
import { createSolution } from '../../api/endpoints/solutions';
import { getTask } from '../../api/endpoints/tasks';

export function SolutionCreatePage() {
  const { workspaceId, taskId } = useParams<{
    workspaceId: string;
    taskId: string;
  }>();
  const wsId = Number(workspaceId);
  const tId = Number(taskId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [format, setFormat] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ['task', tId],
    queryFn: () => getTask(tId),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createSolution({
        task_id: tId,
        format: format as 'ZIP' | 'GITHUB',
        link: format === 'GITHUB' ? link : undefined,
        file: format === 'ZIP' ? file ?? undefined : undefined,
      }),
    onSuccess: (solution) => {
      queryClient.invalidateQueries({ queryKey: ['mySolutions', tId] });
      navigate(`/workspaces/${wsId}/tasks/${tId}/solutions/${solution.id}`);
    },
  });

  const handleSubmit = () => {
    if (!format) return;
    createMutation.mutate();
  };

  const isValid = () => {
    if (!format) return false;
    if (format === 'GITHUB' && !link.trim()) return false;
    if (format === 'ZIP' && !file) return false;
    return true;
  };

  if (taskLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="sm">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Отправить решение</Title>
            {task && (
              <Text c="dimmed" size="sm">
                Задача: {task.name}
              </Text>
            )}
          </div>
          <Button
            component={Link}
            to={`/workspaces/${wsId}/tasks/${tId}`}
            variant="subtle"
          >
            Назад к задаче
          </Button>
        </Group>

        <Card withBorder padding="md">
          <Stack gap="md">
            <Select
              label="Формат решения"
              placeholder="Выберите формат"
              data={[
                { value: 'ZIP', label: 'ZIP-архив' },
                { value: 'GITHUB', label: 'Ссылка на GitHub' },
              ]}
              value={format}
              onChange={(v) => {
                setFormat(v);
                setLink('');
                setFile(null);
              }}
              required
            />

            {format === 'GITHUB' && (
              <TextInput
                label="Ссылка на репозиторий"
                placeholder="https://github.com/username/repo"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                leftSection={<IconLink size={16} />}
                required
              />
            )}

            {format === 'ZIP' && (
              <FileInput
                label="Файл с решением"
                placeholder="Загрузите ZIP-архив"
                leftSection={<IconUpload size={16} />}
                accept=".zip"
                value={file}
                onChange={setFile}
                required
              />
            )}

            {createMutation.error && (
              <Alert color="red">
                {(createMutation.error as Error).message ||
                  'Ошибка при отправке решения'}
              </Alert>
            )}

            <Button
              leftSection={<IconSend size={16} />}
              onClick={handleSubmit}
              disabled={!isValid()}
              loading={createMutation.isPending}
            >
              Отправить решение
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}