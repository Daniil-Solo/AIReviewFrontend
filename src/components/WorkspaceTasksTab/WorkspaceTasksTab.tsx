import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Stack, Group, Button, Card, Text, Badge, Loader, Center, SimpleGrid } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { getWorkspaceTasks } from '../../api/endpoints/tasks';
import { useProfileStore } from '../../store/profile';

interface WorkspaceTasksTabProps {
	workspaceId: number;
	showTitle?: boolean;
}

export function WorkspaceTasksTab({ workspaceId, showTitle = false }: WorkspaceTasksTabProps) {
	const workspaces = useProfileStore((state) => state.workspaces);
	const workspace = workspaces.find((w) => w.workspaceId === workspaceId);
	const canEdit = useProfileStore((state) => state.canEdit);
	const canManage = workspace && canEdit(workspace.workspaceId);

	const { data: tasks, isLoading } = useQuery({
		queryKey: ['workspaceTasks', workspaceId],
		queryFn: () => getWorkspaceTasks(workspaceId),
		enabled: !!workspaceId,
	});

	if (isLoading) {
		return (
			<Center h={200}>
				<Loader size="md" />
			</Center>
		);
	}

	return (
		<Stack gap="md">
			{showTitle && canManage && (
				<Group>
					<Button
						component={Link}
						to={`/workspaces/${workspaceId}/tasks/new`}
						leftSection={<IconPlus size={16} />}
					>
						Создать задачу
					</Button>
				</Group>
			)}

			{tasks && tasks.length > 0 ? (
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
					{tasks.map((task) => (
						<Card
							key={task.id}
							component={Link}
							to={`/workspaces/${workspaceId}/tasks/${task.id}`}
							shadow="sm"
							padding="lg"
							radius="md"
							withBorder
							style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
						>
							<Stack gap="sm">
								<Group justify="space-between">
									<Text fw={600} size="lg" lineClamp={1}>
										{task.name}
									</Text>
									<Badge color={task.is_active ? 'green' : 'gray'} variant="light">
										{task.is_active ? 'Активна' : 'В архиве'}
									</Badge>
								</Group>

								{task.description && (
									<Text size="sm" c="dimmed" lineClamp={3}>
										{task.description.slice(0, 150)}
									</Text>
								)}

								{task.use_exam && (
									<Badge color="blue" variant="outline">
										С экзаменом
									</Badge>
								)}
							</Stack>
						</Card>
					))}
				</SimpleGrid>
			) : (
				<Text c="dimmed">В этом пространстве пока нет задач</Text>
			)}
		</Stack>
	);
}
