import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Title,
  TextInput,
  Textarea,
  Button,
  Group,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { createTask } from '../../api/endpoints/tasks';

export function TaskCreatePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const wsId = Number(workspaceId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const mutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createTask({
        workspace_id: wsId,
        name: data.name,
        description: data.description || undefined,
      }),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['workspaceTasks', wsId] });
      navigate(`/workspaces/${wsId}/tasks/${task.id}`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      setGeneralError(err.response?.data?.message || 'Ошибка при создании задачи');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('Название обязательно');
      return;
    }
    if (name.length > 255) {
      setNameError('Название должно содержать не более 255 символов');
      return;
    }
    if (description.length > 5000) {
      setNameError('Описание должно содержать не более 5000 символов');
      return;
    }

    setNameError('');
    mutation.mutate({ name: name.trim(), description: description.trim() || undefined });
  };

  if (mutation.isPending) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Stack gap="lg" maw={600}>
      <Title order={2}>Создание задачи</Title>

      {generalError && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          {generalError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Название"
            placeholder="Введите название задачи"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
            onFocus={() => setNameError('')}
            required
            maxLength={255}
          />

          <Textarea
            label="Описание"
            placeholder="Введите описание задачи (поддерживается Markdown)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={5}
            maxRows={15}
            maxLength={5000}
          />

          <Group justify="flex-end">
            <Button variant="subtle" component={Link} to={`/workspaces/${wsId}/tasks`}>
              Отмена
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Создать задачу
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}