import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
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
  Alert,
  Menu,
  Divider,
  TextInput,
  MultiSelect,
  Table,
  Checkbox,
  Tooltip,
  NumberInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { formatRelativeTime } from '../../lib/date';
import {
  IconTrash,
  IconPlus,
  IconDotsVertical,
  IconSearch,
  IconWorld,
  IconStack2,
  IconHelpOctagon,
  IconFileDescription,
  IconCode,
  IconSchool,
  IconExternalLink,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconCirclePlus,
} from '@tabler/icons-react';
import { getTask, getTaskPublic, deleteTask } from '../../api/endpoints/tasks';
import { getTaskCriteria, addTaskCriteriaBatch, updateTaskCriterionWeight, deleteTaskCriterion, getTaskSolutions, getAvailableTaskCriteria } from '../../api/endpoints/tasks';
import { getAvailableTags } from '../../api/endpoints/criteria';
import { getMySolutions } from '../../api/endpoints/solutions';
import { useProfileStore } from '../../store/profile';
import type { TaskResponseDTO, TaskCriteriaResponseDTO } from '../../types';
import { stageLabels as criterionStageLabels } from '../../features/criteria/constants';
import { statusLabels, formatLabels } from '../../features/solutions/constants';



const stageIcons: Record<string, React.ReactNode> = {
  PROJECT_DOC: <IconFileDescription size={16} color="gray" />,
  CODEBASE: <IconCode size={16} color="gray" />,
  MANUAL: <IconSchool size={16} color="gray" />,
  null: <IconStack2 size={16} color="gray" />,
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
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSelectedTags] = useDebouncedValue(selectedTags, 300);
  const [selectedCriterionIds, setSelectedCriterionIds] = useState<number[]>([]);

  const queryClient = useQueryClient();
  const modals = useModals();

  const handleOpen = () => {
    setSearch('');
    setSelectedTags([]);
    setSelectedCriterionIds([]);
    open();
  };

  const { data: taskCriteria, isLoading: criteriaLoading } = useQuery({
    queryKey: ['taskCriteria', taskId],
    queryFn: () => getTaskCriteria(taskId),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['criteriaTags'],
    queryFn: getAvailableTags,
  });

  const { data: allCriteria = [], isLoading: criteriaListLoading } = useQuery({
    queryKey: ['availableTaskCriteria', taskId, debouncedSearch, debouncedSelectedTags],
    queryFn: () =>
      getAvailableTaskCriteria(taskId, {
        search: debouncedSearch || undefined,
        tags: debouncedSelectedTags.length > 0 ? debouncedSelectedTags : undefined,
      }),
  });

  const addBatchMutation = useMutation({
    mutationFn: (criterionIds: number[]) =>
      addTaskCriteriaBatch(taskId, { criterion_ids: criterionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskCriteria', taskId] });
      queryClient.invalidateQueries({ queryKey: ['availableTaskCriteria', taskId] });
      close();
      setSelectedCriterionIds([]);
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
      queryClient.invalidateQueries({ queryKey: ['availableTaskCriteria', taskId] });
    },
  });

  const handleAdd = () => {
    if (selectedCriterionIds.length > 0) {
      addBatchMutation.mutate(selectedCriterionIds);
    }
  };

  const handleClose = () => {
    close();
    setSearch('');
    setSelectedTags([]);
    setSelectedCriterionIds([]);
  };

  const toggleCriterion = (id: number) => {
    setSelectedCriterionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
        <Group>
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpen} variant="light">
            Добавить критерий
          </Button>
        </Group>
      )}

      {taskCriteria && taskCriteria.length > 0 ? (
        <Stack gap="sm">
{taskCriteria.map((tc) => (
              <CriterionCard
                key={tc.id}
                tc={tc}
                canEdit={canEdit}
                onUpdateWeight={(weight) => updateMutation.mutate({ id: tc.id, weight })}
                onDelete={() => confirmDelete(tc.id, tc.criterion.description)}
              />
            ))}
        </Stack>
      ) : (
        <Text c="dimmed">Критерии не привязаны к этой задаче</Text>
      )}

      <Modal opened={opened} onClose={handleClose} title="Выбор критериев" centered size="lg">
        <Stack gap="md">
          <Group grow>
            <TextInput
              placeholder="Поиск по описанию..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              rightSection={
                search && (
                  <ActionIcon variant="transparent" onClick={() => setSearch('')}>
                    <IconX size={16} color="gray" />
                  </ActionIcon>
                )
              }
            />
            <MultiSelect
              data={tags}
              value={selectedTags}
              onChange={setSelectedTags}
              placeholder="Фильтр по тегам"
              searchable
              clearable
            />
          </Group>

          {criteriaListLoading ? (
            <Loader size="sm" />
          ) : allCriteria.length === 0 ? (
            <Text c="dimmed" ta="center" py="lg">Критерии не найдены</Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={40}></Table.Th>
                  <Table.Th></Table.Th>
                  <Table.Th w={100}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allCriteria.map((criterion) => (
                  <Table.Tr key={criterion.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedCriterionIds.includes(criterion.id)}
                        onChange={() => toggleCriterion(criterion.id)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={1}>
                        {criterion.description}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip
                          label={
                            criterion.workspace_id !== null
                              ? 'Критерий доступен только в этом пространстве'
                              : criterion.task_id !== null
                              ? 'Критерий доступен только для этой задачи'
                              : 'Критерий доступен всем'
                          }
                        >
                          {criterion.workspace_id !== null ? (
                            <IconStack2 size={16} color="gray" />
                          ) : criterion.task_id !== null ? (
                            <IconHelpOctagon size={16} color="gray" />
                          ) : (
                            <IconWorld size={16} color="gray" />
                          )}
                        </Tooltip>
                        <Tooltip label={criterionStageLabels[criterion.stage ?? 'null'] || 'Все стадии'}>
                          {stageIcons[criterion.stage ?? 'null']}
                        </Tooltip>
                        <Tooltip label="Перейти к критерию">
                          <ActionIcon
                            variant="subtle"
                            component="a"
                            href={`/criteria/${criterion.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconExternalLink size={16} />
                          </ActionIcon>
                        </Tooltip>
                        
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          <Button
            onClick={handleAdd}
            disabled={selectedCriterionIds.length === 0}
            loading={addBatchMutation.isPending}
          >
            Добавить ({selectedCriterionIds.length})
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
  const [editing, setEditing] = useState(false);
  const [newWeight, setNewWeight] = useState(tc.weight);

  const firstLine = tc.criterion.description.split('\n')[0];

  const workspaceId = tc.criterion.workspace_id;
  const taskId = tc.criterion.task_id;
  const stage = tc.criterion.stage ?? null;
  const tags = tc.criterion.tags;

  const handleSaveWeight = () => {
    onUpdateWeight(newWeight);
    setEditing(false);
  };

  return (
    <Card withBorder padding="sm">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Tooltip
              label={
                workspaceId !== null
                  ? 'Критерий доступен только в этом пространстве'
                  : taskId !== null
                  ? 'Критерий доступен только для этой задачи'
                  : 'Критерий доступен всем'
              }
            >
              {workspaceId !== null ? (
                <IconStack2 size={16} color="gray" />
              ) : taskId !== null ? (
                <IconHelpOctagon size={16} color="gray" />
              ) : (
                <IconWorld size={16} color="gray" />
              )}
            </Tooltip>
            <Tooltip label={criterionStageLabels[stage ?? 'null']}>
              {stageIcons[stage ?? 'null']}
            </Tooltip>
            {tags.map((tag) => (
              <Badge key={tag} size="sm" variant="outline" color="gray">
                {tag}
              </Badge>
            ))}
          </Group>

          {canEdit && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={!expanded? <IconChevronDown size={14} />: <IconChevronUp size={14} />} onClick={() => setExpanded(!expanded)}>
                  {expanded ? "Скрыть описание" : "Раскрыть описание"}
                </Menu.Item>
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => setEditing(true)}>
                  Изменить вес
                </Menu.Item>
                <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={onDelete}>
                  Удалить
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>

        <Group gap="xs" align='start' wrap="nowrap">
          <Text size="sm" fw={500} lineClamp={expanded ? undefined : 1} style={{ whiteSpace: 'pre-wrap' }}>
            {expanded ? tc.criterion.description : firstLine}
          </Text>
        </Group>

        {editing ? (
          <Group gap="xs">
            <NumberInput
              size="xs"
              value={newWeight}
              onChange={(v) => setNewWeight(Number(v) || 0)}
              min={0}
              step={0.1}
              style={{ width: 80 }}
            />
            <Button size="xs" onClick={handleSaveWeight}>
              Сохранить
            </Button>
            <Button size="xs" variant="subtle" onClick={() => setEditing(false)}>
              Отмена
            </Button>
          </Group>
        ) : (
          <Text fw={500} size="sm">Вес: {tc.weight.toFixed(1)}</Text>
        )}
      </Stack>
    </Card>
  );
}

function TaskSolutionsTab({ taskId, workspaceId }: { taskId: number; workspaceId: number }) {
  const { data: solutions, isLoading } = useQuery({
    queryKey: ['taskSolutions', taskId],
    queryFn: () => getTaskSolutions(taskId),
  });

  if (isLoading) {
    return <Loader size="sm" />;
  }

  return (
    <Stack gap="md">
      <Text size="sm">Всего решений: {solutions?.length || 0}</Text>
      <Table.ScrollContainer minWidth={600}>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Формат</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Автор</Table.Th>
              <Table.Th>Создано</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {solutions?.map((solution) => {
              const progress = (solution.steps.length / 8) * 100;
              const showProgress = solution.status === 'AI_REVIEW' || solution.status === 'ERROR';
              return (
                <Table.Tr key={solution.id}>
                  <Table.Td>{solution.id}</Table.Td>
                  <Table.Td>
                    <Badge variant="outline" color="gray" size="sm">
                      {formatLabels[solution.format]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Badge variant="outline" color="gray" size="sm">
                        {statusLabels[solution.status]}
                      </Badge>
                      {showProgress && (
                        <Badge variant="outline" color="gray" size="sm">
                          {Math.round(progress)}%
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={solution.author.fullname}>
                      <Text size="sm" style={{ cursor: 'default' }}>
                        {solution.author.email}
                      </Text>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {formatRelativeTime(solution.created_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Button 
                      component={Link} 
                      to={`/workspaces/${workspaceId}/tasks/${taskId}/solutions/${solution.id}`}
                      variant="subtle" 
                      size="xs"
                    >
                      Перейти
                    </Button>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}

function MySolutionsTab({ taskId, workspaceId }: { taskId: number; workspaceId: number }) {
  const { data: solutions, isLoading } = useQuery({
    queryKey: ['mySolutions', taskId],
    queryFn: () => getMySolutions(taskId),
  });

  if (isLoading) {
    return <Loader size="sm" />;
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm">Мои решения: {solutions?.length || 0}</Text>
        <Button
          component={Link}
          to={`/workspaces/${workspaceId}/tasks/${taskId}/solutions/new`}
          leftSection={<IconCirclePlus size={16} />}
          variant="light"
          size="sm"
        >
          Отправить решение
        </Button>
      </Group>
      
      {solutions && solutions.length > 0 ? (
        <Table.ScrollContainer minWidth={500}>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Формат</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Создано</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {solutions?.map((solution) => {
                const progress = (solution.steps.length / 8) * 100;
                const showProgress = solution.status === 'AI_REVIEW' || solution.status === 'ERROR';
                return (
                  <Table.Tr key={solution.id}>
                    <Table.Td>{solution.id}</Table.Td>
                    <Table.Td>
                      <Badge variant="outline" color="gray" size="sm">
                        {formatLabels[solution.format]}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Badge variant="outline" color="gray" size="sm">
                          {statusLabels[solution.status]}
                        </Badge>
                        {showProgress && (
                          <Badge variant="outline" color="gray" size="sm">
                            {Math.round(progress)}%
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {formatRelativeTime(solution.created_at)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Button 
                        component={Link} 
                        to={`/workspaces/${workspaceId}/tasks/${taskId}/solutions/${solution.id}`}
                        variant="subtle" 
                        size="xs"
                      >
                        Перейти
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          У вас пока нет решений для этой задачи
        </Text>
      )}
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
          <Tabs.Tab value="my-solutions">Мои решения</Tabs.Tab>
          <Tabs.Tab value="criteria">Критерии</Tabs.Tab>
          <Tabs.Tab value="solutions">Все решения</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="main" pt="md">
          <TaskMainTab task={task} />
        </Tabs.Panel>

        <Tabs.Panel value="my-solutions" pt="md">
          <MySolutionsTab taskId={tId} workspaceId={wsId} />
        </Tabs.Panel>

        <Tabs.Panel value="criteria" pt="md">
          <TaskCriteriaTab taskId={tId} canEdit={!!isOwnerOrTeacher} />
        </Tabs.Panel>

        <Tabs.Panel value="solutions" pt="md">
          <TaskSolutionsTab taskId={tId} workspaceId={wsId} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
