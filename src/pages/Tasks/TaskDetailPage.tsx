import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Loader,
  Center,
  Tabs,
  Card,
  ActionIcon,
  Modal,
  Select,
  NumberInput,
  Alert,
  Menu,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import {
  IconTrash,
  IconPlus,
  IconWeight,
  IconTag,
  IconChevronDown,
  IconChevronUp,
  IconDotsVertical,
  IconEdit,
} from '@tabler/icons-react';
import { getTask, getTaskPublic, deleteTask } from '../../api/endpoints/tasks';
import { getTaskCriteria, addTaskCriterion, updateTaskCriterionWeight, deleteTaskCriterion, getTaskSolutions } from '../../api/endpoints/tasks';
import { getCriteria } from '../../api/endpoints/criteria';
import { useProfileStore } from '../../store/profile';
import type { TaskResponseDTO, TaskCriteriaResponseDTO } from '../../types';

const stageLabels: Record<string, string> = {
  PROJECT_DOC: 'Project Doc',
  CODEBASE: 'Codebase',
  MANUAL: 'Manual',
};

const stageColors: Record<string, string> = {
  PROJECT_DOC: 'blue',
  CODEBASE: 'green',
  MANUAL: 'orange',
};

function TaskMainTab({ task }: { task: TaskResponseDTO }) {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Group gap="sm">
          <Badge color={task.is_active ? 'green' : 'gray'} size="lg" variant="light">
            {task.is_active ? 'Активна' : 'В архиве'}
          </Badge>
          {task.use_exam && (
            <Badge color="blue" variant="outline">
              С экзаменом
            </Badge>
          )}
        </Group>
      </Stack>

      <Stack gap={0}>
        <Text size="sm" c="dimmed">
          Описание
        </Text>
        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
          {task.description || 'Не указано'}
        </Text>
      </Stack>

      <Text size="sm" c="dimmed">
        Создано: {new Date(task.created_at).toLocaleString('ru-RU')}
      </Text>
    </Stack>
  );
}

function TaskCriteriaTab({ taskId, canEdit }: { taskId: number; canEdit: boolean }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCriterion, setSelectedCriterion] = useState<number | null>(null);
  const [weight, setWeight] = useState(0.5);
  const [search, setSearch] = useState('');

  const { data: taskCriteria, isLoading: criteriaLoading } = useQuery({
    queryKey: ['taskCriteria', taskId],
    queryFn: () => getTaskCriteria(taskId),
  });

  const { data: allCriteria } = useQuery({
    queryKey: ['criteria', search],
    queryFn: () => getCriteria({ search: search || undefined }),
  });

  const queryClient = useQueryClient();
  const modals = useModals();

  const addMutation = useMutation({
    mutationFn: (data: { criterion_id: number; weight: number }) =>
      addTaskCriterion(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCriteria', taskId] });
      close();
      setSelectedCriterion(null);
      setWeight(0.5);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, weight: w }: { id: number; weight: number }) =>
      updateTaskCriterionWeight(taskId, id, { weight: w }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCriteria', taskId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTaskCriterion(taskId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCriteria', taskId] });
    },
  });

  const availableCriteria = allCriteria?.filter(
    (c) => !taskCriteria?.some((tc) => tc.criterion_id === c.id)
  ) || [];

  const handleAdd = () => {
    if (selectedCriterion) {
      addMutation.mutate({ criterion_id: selectedCriterion, weight });
    }
  };

  const confirmDelete = (id: number, description: string) => {
    modals.openConfirmModal({
      title: 'Удаление критерия',
      children: <Text>Вы уверены, что хотите удалить критерий "{description.slice(0, 30)}..."?</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  if (criteriaLoading) {
    return <Loader size="sm" />;
  }

  return (
    <Stack gap="md">
      {canEdit && (
        <Button leftSection={<IconPlus size={16} />} onClick={open} variant="light">
          Добавить критерий
        </Button>
      )}

      {taskCriteria && taskCriteria.length > 0 ? (
        <Stack gap="sm">
          {taskCriteria.map((tc) => (
            <CriterionCard
              key={tc.id}
              tc={tc}
              canEdit={canEdit}
              onUpdateWeight={(w) => updateMutation.mutate({ id: tc.id, weight: w })}
              onDelete={() => confirmDelete(tc.id, tc.criterion.description)}
            />
          ))}
        </Stack>
      ) : (
        <Text c="dimmed">Критерии не привязаны к этой задаче</Text>
      )}

      <Modal opened={opened} onClose={close} title="Добавить критерий" centered>
        <Stack gap="md">
          <Select
            placeholder="Выберите критерий (введите для поиска)"
            data={availableCriteria.map((c) => ({
              value: String(c.id),
              label: c.description.slice(0, 50) + (c.description.length > 50 ? '...' : ''),
            }))}
            value={selectedCriterion ? String(selectedCriterion) : null}
            onChange={(v) => setSelectedCriterion(v ? Number(v) : null)}
            searchable
            onSearchChange={setSearch}
            searchValue={search}
          />
          <NumberInput
            label="Вес"
            value={weight}
            onChange={(v) => setWeight(Number(v) || 0)}
            min={0}
            max={1}
            step={0.1}
          />
          <Button onClick={handleAdd} disabled={!selectedCriterion} loading={addMutation.isPending}>
            Добавить
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

function CriterionCard({
  tc,
  canEdit,
  onUpdateWeight,
  onDelete,
}: {
  tc: TaskCriteriaResponseDTO;
  canEdit: boolean;
  onUpdateWeight: (weight: number) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [newWeight, setNewWeight] = useState(tc.weight);
  const [editing, setEditing] = useState(false);

  const firstLine = tc.criterion.description.split('\n')[0];
  const restLines = tc.criterion.description.split('\n').slice(1).join('\n');

  return (
    <Card withBorder padding="sm">
      <Stack gap="xs">
        <Group justify="space-between">
          <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
            <Text size="sm" fw={500} lineClamp={1} style={{ maxWidth: 300 }}>
              {firstLine}
            </Text>
            {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </Group>
          <Group gap="xs">
            <Badge size="sm" color={tc.criterion.stage ? stageColors[tc.criterion.stage] : 'gray'}>
              {tc.criterion.stage ? stageLabels[tc.criterion.stage] : '—'}
            </Badge>
            {tc.criterion.tags.map((tag) => (
              <Badge key={tag} size="sm" variant="outline" leftSection={<IconTag size={10} />}>
                {tag}
              </Badge>
            ))}
          </Group>
        </Group>

        {expanded && (
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{restLines}</Text>
        )}

        <Group justify="space-between">
          <Group gap="xs">
            <Text size="sm" fw={500}>Вес: </Text>
            {editing ? (
              <Group gap="xs">
                <NumberInput
                  size="xs"
                  value={newWeight}
                  onChange={(v) => setNewWeight(Number(v) || 0)}
                  min={0}
                  max={1}
                  step={0.1}
                  style={{ width: 80 }}
                />
                <Button size="xs" onClick={() => { onUpdateWeight(newWeight); setEditing(false); }}>
                  Сохранить
                </Button>
                <Button size="xs" variant="subtle" onClick={() => setEditing(false)}>
                  Отмена
                </Button>
              </Group>
            ) : (
              <Text size="sm">{tc.weight.toFixed(2)}</Text>
            )}
          </Group>

          {canEdit && !editing && (
            <Group gap="xs">
              <ActionIcon variant="subtle" size="sm" onClick={() => setEditing(true)}>
                <IconWeight size={14} />
              </ActionIcon>
              <ActionIcon variant="subtle" size="sm" color="red" onClick={onDelete}>
                <IconTrash size={14} />
              </ActionIcon>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );
}

function TaskSolutionsTab({ taskId }: { taskId: number }) {
  const { data: solutions, isLoading } = useQuery({
    queryKey: ['taskSolutions', taskId],
    queryFn: () => getTaskSolutions(taskId),
  });

  if (isLoading) {
    return <Loader size="sm" />;
  }

  return (
    <Stack gap="md">
      <Text c="dimmed">Список решений (скоро)</Text>
      <Text size="sm">Всего решений: {solutions?.length || 0}</Text>
    </Stack>
  );
}

export function TaskDetailPage() {
  const { workspaceId, taskId } = useParams<{ workspaceId: string; taskId: string }>();
  const wsId = Number(workspaceId);
  const tId = Number(taskId);
  const navigate = useNavigate();
  const modals = useModals();

  const workspaces = useProfileStore((state) => state.workspaces);
  const workspace = workspaces.find((w) => w.workspaceId === wsId);
  const canEdit = useProfileStore((state) => state.canEdit);
  const isOwnerOrTeacher = workspace && canEdit(workspace.workspaceId);

  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', tId],
    queryFn: () => isOwnerOrTeacher ? getTask(tId) : getTaskPublic(tId),
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(tId),
    onSuccess: () => {
      navigate(`/workspaces/${wsId}`);
    },
  });

  const confirmDelete = () => {
    modals.openConfirmModal({
      title: 'Удаление задачи',
      children: <Text>Вы уверены, что хотите удалить задачу "{task?.name}"?</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(),
    });
  };

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !task) {
    return (
      <Stack gap="md">
        <Alert color="red">Не удалось загрузить задачу</Alert>
        <Button component={Link} to={`/workspaces/${wsId}`}>
          Вернуться к пространству
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>{task.name}</Title>
        {isOwnerOrTeacher && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" p={8}>
                <IconDotsVertical size={18} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={14} />}
                component={Link}
                to={`/workspaces/${wsId}/tasks/${tId}/edit`}
              >
                Редактировать
              </Menu.Item>
              <Divider />
              <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={confirmDelete}>
                Удалить
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      <Tabs defaultValue="main">
        <Tabs.List>
          <Tabs.Tab value="main">Основное</Tabs.Tab>
          <Tabs.Tab value="criteria">Критерии</Tabs.Tab>
          <Tabs.Tab value="solutions">Решения</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="main" pt="md">
          <TaskMainTab task={task} />
        </Tabs.Panel>

        <Tabs.Panel value="criteria" pt="md">
          <TaskCriteriaTab taskId={tId} canEdit={!!isOwnerOrTeacher} />
        </Tabs.Panel>

        <Tabs.Panel value="solutions" pt="md">
          <TaskSolutionsTab taskId={tId} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}