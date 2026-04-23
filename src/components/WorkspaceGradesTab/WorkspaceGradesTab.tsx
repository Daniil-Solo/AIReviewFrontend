import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
	Stack,
	Group,
	MultiSelect,
	Table,
	Text,
	Alert,
	Loader,
	Center,
	Anchor,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { getWorkspaceGrades, getWorkspaceMembers } from '../../api/endpoints/workspaces';
import { getWorkspaceTasks } from '../../api/endpoints/tasks';
import { useDebouncedValue } from '@mantine/hooks';

interface WorkspaceGradesTabProps {
	workspaceId: number;
}

export function WorkspaceGradesTab({ workspaceId }: WorkspaceGradesTabProps) {
	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
	const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);

	const [debouncedUserIds] = useDebouncedValue(selectedUserIds, 300);
	const [debouncedTaskIds] = useDebouncedValue(selectedTaskIds, 300);

	const {
		data: tasks,
		isLoading: tasksLoading,
		error: tasksError,
	} = useQuery({
		queryKey: ['workspaceTasks', workspaceId],
		queryFn: () => getWorkspaceTasks(workspaceId),
		enabled: !!workspaceId,
	});

	const {
		data: members,
		isLoading: membersLoading,
		error: membersError,
	} = useQuery({
		queryKey: ['workspaceMembers', workspaceId],
		queryFn: () => getWorkspaceMembers(workspaceId),
		enabled: !!workspaceId,
	});

	const {
		data: grades,
		isLoading: gradesLoading,
		error: gradesError,
	} = useQuery({
		queryKey: ['workspaceGrades', workspaceId, debouncedUserIds, debouncedTaskIds],
		queryFn: () =>
			getWorkspaceGrades(workspaceId, {
				task_ids: debouncedTaskIds.length > 0 ? debouncedTaskIds : undefined,
				user_ids: debouncedUserIds.length > 0 ? debouncedUserIds : undefined,
			}),
		enabled: !!workspaceId,
	});

	const taskOptions =
		tasks?.map((task) => ({
			value: task.id.toString(),
			label: `${task.id}: ${task.name}`,
		})) || [];

	const userOptions =
		members?.map((member) => ({
			value: member.user_id.toString(),
			label: `${member.user_id}: ${member.fullname}`,
		})) || [];

	const isLoading = tasksLoading || membersLoading || gradesLoading;
	const error = tasksError || membersError || gradesError;

	if (isLoading) {
		return (
			<Center h={200}>
				<Loader size="md" />
			</Center>
		);
	}

	if (error) {
		const e = error as { response?: { data?: { message?: string } } };
		return (
			<Alert color="red" icon={<IconAlertCircle size={16} />}>
				{e.response?.data?.message || 'Ошибка загрузки данных'}
			</Alert>
		);
	}

	const displayTasks =
		selectedTaskIds.length > 0
			? tasks?.filter((task) => selectedTaskIds.includes(task.id)) || []
			: tasks || [];

	const displayGrades = grades || [];

	return (
		<Stack gap="md">
			<Group>
				<MultiSelect
					label="Пользователи"
					placeholder="Выберите пользователей"
					data={userOptions}
					value={selectedUserIds.map(String)}
					onChange={(values) => setSelectedUserIds(values.map(Number))}
					clearable
					searchable
					nothingFoundMessage="Пользователи не найдены"
					style={{ flex: 1 }}
				/>
				<MultiSelect
					label="Задачи"
					placeholder="Выберите задачи"
					data={taskOptions}
					value={selectedTaskIds.map(String)}
					onChange={(values) => setSelectedTaskIds(values.map(Number))}
					clearable
					searchable
					nothingFoundMessage="Задачи не найдены"
					style={{ flex: 1 }}
				/>
			</Group>

			{displayGrades.length === 0 ? (
				<Text c="dimmed">Нет данных для отображения</Text>
			) : (
				<div style={{ overflowX: 'auto' }}>
					<Table>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Пользователь</Table.Th>
								{displayTasks.map((task) => (
									<Table.Th key={task.id}>{task.name}</Table.Th>
								))}
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{displayGrades.map((studentGrade) => (
								<Table.Tr key={studentGrade.user.id}>
									<Table.Td>
										<Text fw={500}>{studentGrade.user.fullname}</Text>
										<Text size="xs" c="dimmed">
											ID: {studentGrade.user.id}
										</Text>
									</Table.Td>
									{displayTasks.map((task) => {
										const taskGrade = studentGrade.tasks.find((t) => t.task_id === task.id);
										return (
											<Table.Td key={task.id}>
												{!taskGrade || taskGrade.grade === null ? (
													<Text size="sm" c="dimmed">
														Оценки нет
													</Text>
												) : (
													<Anchor
														component={Link}
														to={`/solutions/${taskGrade.best_solution_id}`}
														size="sm"
														fw={500}
													>
														{taskGrade.grade}
													</Anchor>
												)}
											</Table.Td>
										);
									})}
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</div>
			)}
		</Stack>
	);
}
