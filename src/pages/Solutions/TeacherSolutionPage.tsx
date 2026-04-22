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
  Checkbox,
  Textarea,
  Modal,
  Collapse,
  Box,
  NumberInput,
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
  IconCheck,
  IconX,
  IconPlus,
} from '@tabler/icons-react';
import { getSolutionInfo, getSolutionArtefact, restartSolution, cancelSolution, getSolutionCriteriaChecks, createSolutionCriteriaCheck, submitFinalReview } from '../../api/endpoints/solutions';
import type { SolutionShortResponseDTO, PipelineStepEnum, GradingCriterionDTO, SolutionCriteriaCheckResponseDTO } from '../../types';
import { statusLabels, formatLabels, stepLabels, checkStatusLabels, getCriterionStageLabel, getCriterionCurrentStatus, getCriterionColor } from '../../features/solutions/constants';
import { formatRelativeTime } from '../../lib/date';
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer';
import { MermaidGantt } from '../../components/MermaidGantt/MermaidGantt';

interface TeacherSolutionPageProps {
  solution: SolutionShortResponseDTO;
  workspaceId: number;
  taskId: number;
  isTeacher: boolean;
}

interface CriteriaChecksPanelProps {
  solutionId: number;
  isTeacher: boolean;
}




function CriteriaChecksPanel({ solutionId, isTeacher }: CriteriaChecksPanelProps) {
  const [addCheckModal, setAddCheckModal] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState(true);
  const [comment, setComment] = useState('');
  const [openCriteria, setOpenCriteria] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  const toggleCriterion = (criterionId: number) => {
    const newOpen = new Set(openCriteria);
    if (newOpen.has(criterionId)) {
      newOpen.delete(criterionId);
    } else {
      newOpen.add(criterionId);
    }
    setOpenCriteria(newOpen);
  };

  const { data: criteriaData, isLoading } = useQuery({
    queryKey: ['solutionCriteriaChecks', solutionId],
    queryFn: () => getSolutionCriteriaChecks(solutionId),
  });

  const createCheckMutation = useMutation({
    mutationFn: (data: { task_criterion_id: number; is_passed: boolean; comment?: string }) =>
      createSolutionCriteriaCheck(solutionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutionCriteriaChecks', solutionId] });
      setAddCheckModal(null);
      setIsPassed(true);
      setComment('');
    },
  });

  const handleAddCheck = (taskCriterionId: number) => {
    createCheckMutation.mutate({
      task_criterion_id: taskCriterionId,
      is_passed: isPassed,
      comment: comment || undefined,
    });
  };

  if (isLoading) {
    return <Loader size="sm" />;
  }

  if (!criteriaData?.criteria.length) {
    return <Alert color="gray">Нет критериев для этого задания</Alert>;
  }

  return (
    <Stack gap="md">
      <Stack gap="sm">
        {criteriaData.criteria.map((gradingCriterion: GradingCriterionDTO) => {
          const criterionId = gradingCriterion.criterion.id;
          const isOpen = openCriteria.has(criterionId);
          return (
            <Card
                key={criterionId}
                withBorder
                padding="sm"
              >
                  <Stack gap={"xs"} p="xs" onClick={() => toggleCriterion(criterionId)}style={{ cursor: 'pointer' }}>
                    <Group justify="space-between">
                      <Text c="black" >
                        Критерий № {gradingCriterion.criterion.id}
                      </Text>
                      {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </Group>
                    <Group gap="xs">
                      <Badge size="sm" variant="outline" color={getCriterionColor(gradingCriterion)}>
                        {getCriterionCurrentStatus(gradingCriterion)}
                      </Badge>
                      <Badge size="sm" variant="outline" color={"gray"}>
                        Проверок: {gradingCriterion.checks.length}
                      </Badge>
                      <Badge size="sm" variant="outline" color={"gray"}>
                        Вес: {gradingCriterion.weight}
                      </Badge>
                    </Group>
                  </Stack>
              <Collapse expanded={isOpen}>
                <Stack px="xs">
                  <Box>
                    <MarkdownRenderer content={gradingCriterion.criterion.description} />
                  </Box>
                  <Stack gap="sm">
                    {gradingCriterion.checks.length > 0 ? (
                      <Stack gap="xs">
                        {gradingCriterion.checks.map((check: SolutionCriteriaCheckResponseDTO, checkNumber: number) => (
                          <Card key={check.id} withBorder padding="xs">
                            <Stack gap="xs">
                              <Text size="sm" c="dimmed">
                                Проверка № {checkNumber + 1} ({getCriterionStageLabel(check.stage)})
                              </Text>
                              <Text size="sm">{check.comment}</Text>
                              <Group gap="xs">
                                <Badge
                                  color={"gray"}
                                  variant="outline"
                                  size="sm"
                                >
                                  {checkStatusLabels[check.status]}
                                </Badge>
                                {check.is_passed !== null && (
                                  check.is_passed ? (
                                    <Badge color="green" variant="outline" leftSection={<IconCheck size={12} />}>
                                      Критерий выполнен
                                    </Badge>
                                  ) : (
                                    <Badge color="red" variant="outline" leftSection={<IconX size={12} />}>
                                      Критерий не выполнен
                                    </Badge>
                                  )
                                )}
                              </Group>
                              <Text size="xs" c="dimmed">
                                {formatRelativeTime(check.created_at)}
                              </Text>
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Text size="sm" c="dimmed">Проверок пока нет</Text>
                    )}
                    {isTeacher && (
                        <Group>
                          <Button
                            size="xs"
                            variant="light"
                            leftSection={<IconPlus size={14} />}
                            onClick={() => setAddCheckModal(gradingCriterion.task_criterion_id)}
                          >
                            Добавить проверку
                          </Button>
                        </Group>
                      )}
                  </Stack>
                </Stack>
              </Collapse>
              </Card>
          );
        })}
      </Stack>

      <Modal
        opened={addCheckModal !== null}
        onClose={() => setAddCheckModal(null)}
        title="Ручная проверка"
      >
        <Stack gap="md">
          <Checkbox
            label="Пройден"
            checked={isPassed}
            onChange={(e) => setIsPassed(e.currentTarget.checked)}
          />
          <Textarea
            label="Комментарий"
            placeholder="Комментарий (необязательно)"
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            minRows={3}
          />
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setAddCheckModal(null)}>
              Отмена
            </Button>
            <Button
              onClick={() => addCheckModal && handleAddCheck(addCheckModal)}
              loading={createCheckMutation.isPending}
            >
              Добавить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export function TeacherSolutionPage({ solution, workspaceId, taskId, isTeacher }: TeacherSolutionPageProps) {
  const [openSteps, setOpenSteps] = useState<Set<PipelineStepEnum>>(new Set());
  const [humanGrade, setHumanGrade] = useState<number | string>(solution.human_grade ?? '');
  const [humanFeedback, setHumanFeedback] = useState(solution.human_feedback ?? '');
  const [aiFeedback, setAiFeedback] = useState(solution.ai_feedback ?? '');
  const [finalReviewEdit, setFinalReviewEdit] = useState(solution.human_grade === null);
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

  const finalReviewMutation = useMutation({
    mutationFn: () =>
      submitFinalReview(solution.id, {
        human_grade: Number(humanGrade),
        human_feedback: humanFeedback || undefined,
        ai_feedback: aiFeedback || undefined,
      }),
    onSuccess: () => {
      setFinalReviewEdit(false);
      queryClient.invalidateQueries({ queryKey: ['solution', solution.id] });
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
          <Tabs.Tab value="criteria">Проверка по критериям</Tabs.Tab>
          <Tabs.Tab value="final-review">Финальный вердикт</Tabs.Tab>
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
                      <Text size="sm">{statusLabels[solution.status]}</Text>
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
                      <Tooltip label={solution.author?.fullname}>
                        <Text size="sm" style={{ cursor: 'default' }}>{solution.author?.email ?? 'Unknown'}</Text>
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
                    {solution.format === 'GITHUB' && solution.github_repo_link && (
                      <Stack gap={0}>
                        <Text size="xs" c="dimmed">Ссылка</Text>
                        <Text
                          component="a"
                          href={solution.github_repo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          style={{ color: '#228be6', textDecoration: 'none' }}
                        >
                          Открыть
                        </Text>
                      </Stack>
                    )}
                  </Group>
                </Stack>
              </Card>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {(solution.human_grade !== null) && (
                <Card withBorder>
                  <Stack gap="sm">
                    <Group gap="xs">
                      <IconStar size={18} color="gray" />
                      <Text fw={500} size="sm">Результаты</Text>
                    </Group>
                    <Stack gap={0}>
                      <Text size="xs" c="dimmed">Оценка</Text>
                      <Text size="sm">{solution.human_grade}</Text>
                    </Stack>
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

        <Tabs.Panel value="criteria" pt="md">
          <CriteriaChecksPanel solutionId={solution.id} isTeacher={isTeacher} />
        </Tabs.Panel>

        <Tabs.Panel value="final-review" pt="md">
          {solution.status === 'HUMAN_REVIEW' || finalReviewEdit ? (
              <Stack gap="md">
                <Text size="sm" c="dimmed">
                  Оцените решение и оставьте обратную связь для студента
                </Text>

                <NumberInput
                  label="Оценка"
                  placeholder="Введите оценку (0-100)"
                  value={humanGrade}
                  onChange={setHumanGrade}
                  min={0}
                  max={100}
                  required
                />

                <Textarea
                  label="Обратная связь"
                  placeholder="Комментарий для студента (необязательно)"
                  value={humanFeedback}
                  onChange={(e) => setHumanFeedback(e.currentTarget.value)}
                  autosize
                  minRows={3}
                  maxRows={12}
                />

                <Textarea
                  label="AI отзыв"
                  placeholder="AI-комментарий (необязательно)"
                  value={aiFeedback}
                  onChange={(e) => setAiFeedback(e.currentTarget.value)}
                  autosize
                  minRows={3}
                  maxRows={12}
                />

                <Group>
                  <Button
                    onClick={() => finalReviewMutation.mutate()}
                    loading={finalReviewMutation.isPending}
                    disabled={!humanGrade}
                  >
                    Сохранить вердикт
                  </Button>
                </Group>
              </Stack>
          ): solution.status === 'REVIEWED' ? (
              <Stack gap="md">
                {solution.human_grade !== null && (
                  <Card withBorder>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <Text fw={500} size="sm">Оценка</Text>
                      </Group>
                      <Text size="xl" fw={700}>{solution.human_grade}</Text>
                    </Stack>
                  </Card>
                )}

                {solution.human_feedback && (
                  <Card withBorder>
                    <Stack gap="xs">
                      <Text fw={500} size="sm">Обратная связь</Text>
                      <div>
                        <MarkdownRenderer content={solution.human_feedback} />
                      </div>
                    </Stack>
                  </Card>
                )}

                {solution.ai_feedback && (
                  <Card withBorder>
                    <Stack gap="xs">
                      <Text fw={500} size="sm">AI отзыв</Text>
                      <div>
                        <MarkdownRenderer content={solution.ai_feedback} />
                      </div>
                    </Stack>
                  </Card>
                )}

                <Group>
                  <Button
                    onClick={() => setFinalReviewEdit(true)}
                  >
                    Изменить
                  </Button>
                </Group>
              </Stack>
          ) : (
            <Alert color="gray">
              Форма будет доступна, когда решение перейдёт в статус «Ожидает вердикта преподавателя»
            </Alert>
          )}
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