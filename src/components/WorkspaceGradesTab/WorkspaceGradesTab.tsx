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
	Button,
} from '@mantine/core';
import { IconAlertCircle, IconDownload } from '@tabler/icons-react';
import {
	getWorkspaceGrades,
	getWorkspaceMembers,
	downloadWorkspaceGradesCsv,
} from '../../api/endpoints/workspaces';
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
			label: `${task.name}`,
		})) || [];

	const userOptions =
		members?.map((member) => ({
			value: member.user_id.toString(),
			label: `${member.fullname}`,
		})) || [];

	const isLoading = tasksLoading || membersLoading || gradesLoading;
	const error = tasksError || membersError || gradesError;

	if (isLoading || grades === undefined) {
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

	return (
		<Stack gap="md">
			<Group justify="space-between">
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
				<Group pt={'22px'}>
					<Button
						variant="light"
						leftSection={<IconDownload size={16} />}
						onClick={async () => {
							try {
								const blob = await downloadWorkspaceGradesCsv(workspaceId, {
									task_ids: debouncedTaskIds.length > 0 ? debouncedTaskIds : undefined,
									user_ids: debouncedUserIds.length > 0 ? debouncedUserIds : undefined,
								});
								const url = window.URL.createObjectURL(blob);
								const a = document.createElement('a');
								a.href = url;
								a.download = `grades-${workspaceId}.csv`;
								document.body.appendChild(a);
								a.click();
								window.URL.revokeObjectURL(url);
								document.body.removeChild(a);
							} catch (e) {
								console.error('Ошибка скачивания CSV:', e);
							}
						}}
					>
						CSV
					</Button>
				</Group>
			</Group>

			{grades.length === 0 ? (
				<Text c="dimmed">Нет данных для отображения</Text>
			) : (
				<div style={{ overflowX: 'auto' }}>
					<Table>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Пользователь</Table.Th>
								{grades[0].tasks.map((task) => (
									<Table.Th key={task.task_id}>{task.task_name}</Table.Th>
								))}
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{grades.map((studentGrade) => (
								<Table.Tr key={studentGrade.user.id}>
									<Table.Td>
										<Text fw={400}>{studentGrade.user.fullname}</Text>
									</Table.Td>
									{studentGrade.tasks.map((task) => {
										const taskGrade = studentGrade.tasks.find((t) => t.task_id === task.task_id);
										return (
											<Table.Td key={task.task_id}>
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
