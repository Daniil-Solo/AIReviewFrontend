import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
} from '@mantine/core';
import { IconArrowLeft, IconChevronDown, IconChevronUp, IconArrowUp, IconChartBar } from '@tabler/icons-react';
import { getSolutionInfo, getSolutionArtefact } from '../../api/endpoints/solutions';
import type { SolutionShortResponseDTO, PipelineStepEnum } from '../../types';
import { statusLabels, formatLabels, stepLabels } from '../../features/solutions/constants';
import { formatRelativeTime } from '../../lib/date';
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer';
import { MermaidGantt } from '../../components/MermaidGantt/MermaidGantt';

interface TeacherSolutionPageProps {
  solution: SolutionShortResponseDTO;
  workspaceId: number;
  taskId: number;
}

export function TeacherSolutionPage({ solution, workspaceId, taskId }: TeacherSolutionPageProps) {
  const [openSteps, setOpenSteps] = useState<Set<PipelineStepEnum>>(new Set());

  const { data: pipelineInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: ['solutionInfo', solution.id],
    queryFn: () => getSolutionInfo(solution.id),
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

      <Tabs defaultValue="main">
        <Tabs.List>
          <Tabs.Tab value="main">Основное</Tabs.Tab>
          <Tabs.Tab value="progress">Прогресс</Tabs.Tab>
          <Tabs.Tab value="artefacts">Артефакты решения</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="main" pt="md">
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

              <Stack gap={4}>
                <Text size="sm" c="dimmed">Автор</Text>
                <Tooltip label={solution.author.fullname}>
                  <Text size="sm" style={{ cursor: 'default' }}>
                    {solution.author.email}
                  </Text>
                </Tooltip>
              </Stack>
            </Group>

            {solution.human_grade !== null && (
              <Stack gap={4} mt="md">
                <Text size="sm" c="dimmed">Оценка</Text>
                <Text>{solution.human_grade}</Text>
              </Stack>
            )}

            {solution.human_feedback && (
              <Stack gap={4} mt="md">
                <Text size="sm" c="dimmed">Обратная связь</Text>
                <Text>{solution.human_feedback}</Text>
              </Stack>
            )}

            {solution.ai_feedback && (
              <Stack gap={4} mt="md">
                <Text size="sm" c="dimmed">AI отзыв</Text>
                <Text>{solution.ai_feedback}</Text>
              </Stack>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="progress" pt="md">
          {isLoadingInfo ? (
            <Loader size="sm" />
          ) : pipelineInfo?.pipeline_tasks ? (
            <MermaidGantt key={pipelineInfo.solution_id} tasks={pipelineInfo.pipeline_tasks} />
          ) : null}
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
            <Alert color="red">{error.response.data.message}</Alert>
          ) : null}
        </div>
      )}
    </div>
  );
}