import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Title,
  TextInput,
  Textarea,
  Button,
  Group,
  Loader,
  Center,
  Checkbox,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { getTask, updateTask } from '../../api/endpoints/tasks';
import { useProfileStore } from '../../store/profile';

export function TaskEditPage() {
  const { workspaceId, taskId } = useParams<{ workspaceId: string; taskId: string }>();
  const wsId = Number(workspaceId);
  const tId = Number(taskId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const workspaces = useProfileStore((state) => state.workspaces);
  const workspace = workspaces.find((w) => w.workspaceId === wsId);
  const canEdit = useProfileStore((state) => state.canEdit);
  const isOwnerOrTeacher = workspace && canEdit(workspace.workspaceId);

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', tId],
    queryFn: () => getTask(tId),
    enabled: isOwnerOrTeacher,
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState('');
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description || '');
      setIsActive(task.is_active);
    }
  }, [task]);

  const mutation = useMutation({
    mutationFn: (data: { name: string; description: string; is_active: boolean }) =>
      updateTask(tId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', tId] });
      queryClient.invalidateQueries({ queryKey: ['workspaceTasks', wsId] });
      navigate(`/workspaces/${wsId}/tasks/${tId}`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      setGeneralError(err.response?.data?.message || 'Ошибка при обновлении задачи');
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
    mutation.mutate({
      name: name.trim(),
      description: description.trim(),
      is_active: isActive,
    });
  };

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isOwnerOrTeacher) {
    return (
      <Stack gap="md">
        <Alert color="red">У вас нет доступа к редактированию этой задачи</Alert>
        <Button component={Link} to={`/workspaces/${wsId}/tasks/${tId}`}>
          Вернуться к задаче
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" maw={600}>
      <Title order={2}>Редактирование задачи</Title>

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
            maxLength={5000}
            autosize
            minRows={4}
            maxRows={15}
          />

          <Checkbox
            label="Задача активна"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />

          <Group justify="flex-end">
            <Button variant="subtle" component={Link} to={`/workspaces/${wsId}/tasks/${tId}`}>
              Отмена
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}