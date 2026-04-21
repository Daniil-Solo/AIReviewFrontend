import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Title,
  Text,
  Button,
  Group,
  Tabs,
  Loader,
  Badge,
  Tooltip,
  Alert,
  Card,
  SimpleGrid,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
  IconArrowUp,
  IconPlayerPlay,
  IconFileZip,
  IconProgress,
  IconStar,
} from '@tabler/icons-react';
import { getSolutionInfo, getSolutionArtefact, restartSolution, cancelSolution } from '../../api/endpoints/solutions';
import type { SolutionShortResponseDTO, PipelineStepEnum } from '../../types';
import { statusLabels, formatLabels, stepLabels } from '../../features/solutions/constants';
import { formatRelativeTime } from '../../lib/date';
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer';
import { MermaidGantt } from '../../components/MermaidGantt/MermaidGantt';

interface TeacherSolutionPageProps {
  solution: SolutionShortResponseDTO;
  workspaceId: number;
  taskId: number;
  isTeacher: boolean;
}

export function TeacherSolutionPage({ solution, workspaceId, taskId, isTeacher }: TeacherSolutionPageProps) {
  const [openSteps, setOpenSteps] = useState<Set<PipelineStepEnum>>(new Set());
  const queryClient = useQueryClient();

  const { data: pipelineInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: ['solutionInfo', solution.id],
    queryFn: () => getSolutionInfo(solution.id),
  });

  const restartMutation = useMutation({
    mutationFn: () => restartSolution(solution.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution', solution.id] });
      queryClient.invalidateQueries({ queryKey: ['solutionInfo', solution.id] });
      queryClient.invalidateQueries({ queryKey: ['solutionArtefact', solution.id] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelSolution(solution.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution', solution.id] });
      queryClient.invalidateQueries({ queryKey: ['solutionInfo', solution.id] });
      queryClient.invalidateQueries({ queryKey: ['solutionArtefact', solution.id] });
    },
  });

  const toggleStep = (step: PipelineStepEnum) => {
    const newOpen = new Set(openSteps);
    if (newOpen.has(step)) {
      newOpen.delete(step);
    } else {
      newOpen.add(step);
    }
    setOpenSteps(newOpen);
  };

  const progress = (solution.steps.length / 8) * 100;
  const canCancel = isTeacher && !['REVIEWED', 'ERROR'].includes(solution.status);

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

      <Title order={3}>Решение #{solution.id}</Title>

      <Tabs defaultValue="main">
        <Tabs.List>
          <Tabs.Tab value="main">Основное</Tabs.Tab>
          <Tabs.Tab value="artefacts">Артефакты решения</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="main" pt="md">
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Card withBorder>
                <Stack gap="sm">
                  <Group gap="xs">
                    <IconProgress size={18} color="gray" />
                    <Text fw={500} size="sm">Основное</Text>
                  </Group>
                  <Group gap="lg">
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">Статус</Text>
                      <Badge variant="outline" color="gray" size="sm">
                        {statusLabels[solution.status]}
                      </Badge>
                    </Stack>
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">Прогресс</Text>
                      <Text size="sm">{Math.round(progress)}%</Text>
                    </Stack>
                  </Group>
                </Stack>
              </Card>

              <Card withBorder>
                <Stack gap="sm">
                  <Group gap="xs">
                    <IconFileZip size={18} color="gray" />
                    <Text fw={500} size="sm">Попытка</Text>
                  </Group>
                  <Group gap="lg">
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">Автор</Text>
                      <Tooltip label={solution.author.fullname}>
                        <Text size="sm" style={{ cursor: 'default' }}>{solution.author.email}</Text>
                      </Tooltip>
                    </Stack>
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">Создано</Text>
                      <Text size="sm">{formatRelativeTime(solution.created_at)}</Text>
                    </Stack>
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">Формат</Text>
                      <Text size="sm">{formatLabels[solution.format]}</Text>
                    </Stack>
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">Ссылка</Text>
                      <Text
                        component="a"
                        href={solution.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        style={{ color: '#228be6', textDecoration: 'none' }}
                      >
                        Открыть
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Card>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {(solution.human_grade !== null || solution.human_feedback || solution.ai_feedback) && (
                <Card withBorder>
                  <Stack gap="sm">
                    <Group gap="xs">
                      <IconStar size={18} color="gray" />
                      <Text fw={500} size="sm">Результаты</Text>
                    </Group>
                    {solution.human_grade !== null && (
                      <Text size="sm">
                        <Text span c="dimmed">Оценка:</Text> {solution.human_grade}
                      </Text>
                    )}
                    {solution.human_feedback && (
                      <Stack gap={0}>
                        <Text size="xs" c="dimmed">Обратная связь</Text>
                        <Text size="sm">{solution.human_feedback}</Text>
                      </Stack>
                    )}
                    {solution.ai_feedback && (
                      <Stack gap={0}>
                        <Text size="xs" c="dimmed">AI отзыв</Text>
                        <Text size="sm">{solution.ai_feedback}</Text>
                      </Stack>
                    )}
                  </Stack>
                </Card>
              )}

              {(isTeacher || canCancel) && (
                <Card withBorder>
                  <Stack gap="sm">
                    <Group gap="xs">
                      <IconPlayerPlay size={18} color="gray" />
                      <Text fw={500} size="sm">Управление</Text>
                    </Group>
                    <Group gap="sm">
                      {isTeacher && (
                        <Button
                          variant="light"
                          onClick={() => restartMutation.mutate()}
                          loading={restartMutation.isPending}
                        >
                          Перезапустить
                        </Button>
                      )}
                      {canCancel && (
                        <Button
                          variant="light"
                          color="red"
                          onClick={() => cancelMutation.mutate()}
                          loading={cancelMutation.isPending}
                        >
                          Отменить
                        </Button>
                      )}
                    </Group>
                  </Stack>
                </Card>
              )}
            </SimpleGrid>

            {!isLoadingInfo && pipelineInfo?.pipeline_tasks && (
              <Card withBorder>
                <Stack gap="sm">
                  <Text fw={500}>График выполнения</Text>
                  <MermaidGantt key={pipelineInfo.solution_id} tasks={pipelineInfo.pipeline_tasks} />
                </Stack>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="artefacts" pt="md" style={{ position: 'relative' }}>
          {isLoadingInfo ? (
            <Loader size="sm" />
          ) : (
            <Stack gap="sm">
              {pipelineInfo?.solution_steps.map((step) => (
                <ArtefactCollapse
                  key={step}
                  step={step}
                  solutionId={solution.id}
                  isOpen={openSteps.has(step)}
                  onToggle={() => toggleStep(step)}
                />
              ))}
            </Stack>
          )}
          <Button
            variant="filled"
            size="sm"
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <IconArrowUp size={16} />
          </Button>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

interface ArtefactCollapseProps {
  step: PipelineStepEnum;
  solutionId: number;
  isOpen: boolean;
  onToggle: () => void;
}

function ArtefactCollapse({ step, solutionId, isOpen, onToggle }: ArtefactCollapseProps) {
  const { data: content, isLoading, isError, error } = useQuery({
    queryKey: ['solutionArtefact', solutionId, step],
    queryFn: () => getSolutionArtefact(solutionId, step),
    enabled: isOpen,
  });

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      <Button
        variant="subtle"
        fullWidth
        justify="space-between"
        rightSection={isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        onClick={onToggle}
        style={{ borderRadius: 8 }}
      >
        {stepLabels[step]}
      </Button>
      {isOpen && (
        <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
          {isLoading ? (
            <Loader size="sm" />
          ) : content ? (
            step === 'prepare_project_tree' || step === 'prepare_project_content' ? (
              <Text style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {content}
              </Text>
            ) : (
              <MarkdownRenderer content={content} />
            )
          ) : isError && error ? (
            <Alert color="red">{(error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Ошибка'}</Alert>
          ) : null}
        </div>
      )}
    </div>
  );
}