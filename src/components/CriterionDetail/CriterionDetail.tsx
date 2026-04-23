import type { ReactNode } from 'react';
import { Stack, Text, Badge, Group } from '@mantine/core';
import { getCriterionAccessLabel, stageLabels } from '../../features/criteria/constants';
import type { CriterionResponseDTO } from '../../types';

interface CriterionDetailProps {
	criterion: CriterionResponseDTO;
	actions?: ReactNode;
}

export function CriterionDetail({ criterion, actions }: CriterionDetailProps) {
	return (
		<Stack gap="lg">
			{actions && <Group justify="flex-end">{actions}</Group>}

			<Stack gap={0}>
				<Text size="sm" c="dimmed">
					Доступ
				</Text>
				<Text size="sm">{getCriterionAccessLabel(criterion.workspace_id, criterion.task_id)}</Text>
			</Stack>

			<Stack gap={0}>
				<Text size="sm" c="dimmed">
					Стадия проверки
				</Text>
				<Text size="sm">
					{stageLabels[criterion.stage as string] ?? stageLabels[null as unknown as string]}
				</Text>
			</Stack>

			<Stack gap="xs">
				<Text size="sm" c="dimmed">
					Теги
				</Text>
				{criterion.tags.length > 0 && (
					<Group gap="xs">
						{criterion.tags.map((tag) => (
							<Badge key={tag} variant="outline" color="gray">
								{tag}
							</Badge>
						))}
					</Group>
				)}
			</Stack>

			<Stack gap={0}>
				<Text size="sm" c="dimmed">
					Описание
				</Text>
				<Text size="sm" mb="md" style={{ whiteSpace: 'pre-wrap' }}>
					{criterion.description}
				</Text>
			</Stack>
		</Stack>
	);
}
