import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Tooltip,
} from '@mantine/core';
import {
  IconWorld,
  IconStack2,
  IconHelpOctagon,
  IconFileDescription,
  IconCode,
  IconSchool,
} from '@tabler/icons-react';
import type { CriterionResponseDTO } from '../../types';
import { getCriterionAccessLabel, stageLabels } from '../../features/criteria/constants';

interface CriterionCardProps {
  criterion: CriterionResponseDTO;
  onClick?: () => void;
}

export function CriterionCard({ criterion, onClick }: CriterionCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Stack gap="xs">
        <Group gap="xs">
          <Tooltip
            label={getCriterionAccessLabel(
              criterion.workspace_id,
              criterion.task_id
            )}
          >
            {criterion.workspace_id !== null ? (
              <IconStack2 size={16} color="gray" />
            ) : criterion.task_id !== null ? (
              <IconHelpOctagon size={16} color="gray" />
            ) : (
              <IconWorld size={16} color="gray" />
            )}
          </Tooltip>
          <Tooltip label={stageLabels[criterion.stage ?? 'null']}>
            {criterion.stage === 'PROJECT_DOC' && (
              <IconFileDescription size={16} color="gray" />
            )}
            {criterion.stage === 'CODEBASE' && (
              <IconCode size={16} color="gray" />
            )}
            {criterion.stage === 'MANUAL' && (
              <IconSchool size={16} color="gray" />
            )}
            {criterion.stage === null && (
              <IconStack2 size={16} color="gray" />
            )}
          </Tooltip>
        </Group>

        {criterion.tags.length > 0 && (
          <Group gap="xs">
            {criterion.tags.map((tag) => (
              <Badge key={tag} variant="outline" size="sm" color="gray">
                {tag}
              </Badge>
            ))}
          </Group>
        )}

        <Text lineClamp={2}>
          {criterion.description}
        </Text>
      </Stack>
    </Card>
  );
}