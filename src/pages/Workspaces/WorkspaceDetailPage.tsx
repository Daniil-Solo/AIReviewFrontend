import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Title,
	Text,
	Stack,
	Group,
	Tabs,
	Button,
	Table,
	Badge,
	Loader,
	Center,
	Alert,
	Select,
	Modal,
	Menu,
	SimpleGrid,
	FileInput,
	Code,
} from '@mantine/core';
import {
	IconAlertCircle,
	IconEdit,
	IconTrash,
	IconUsers,
	IconInfoCircle,
	IconDotsVertical,
	IconUserEdit,
	IconLink,
	IconBook,
	IconFileDescription,
	IconPlus,
	IconChartBar,
	IconBrain,
	IconUpload,
} from '@tabler/icons-react';
import {
	getWorkspace,
	getWorkspaceMembers,
	deleteWorkspace,
	updateMember,
	leaveWorkspace,
	getProfileWorkspaces,
	getWorkspaceCriteria,
} from '../../api/endpoints/workspaces';
import { importCriteria } from '../../api/endpoints/criteria';
import { useProfileStore } from '../../store/profile';
import { getUserData } from '../../lib/jwt';
import { WorkspaceInvitesTab } from '../../components/WorkspaceInvitesTab/WorkspaceInvitesTab';
import { WorkspaceTasksTab } from '../../components/WorkspaceTasksTab/WorkspaceTasksTab';
import { WorkspaceGradesTab } from '../../components/WorkspaceGradesTab/WorkspaceGradesTab';
import { WorkspaceModelsTab } from '../../components/WorkspaceModelsTab/WorkspaceModelsTab';
import { CriterionCard } from '../../components/CriterionCard/CriterionCard';
import type { WorkspaceMemberRole } from '../../types';

const roleLabels: Record<string, string> = {
	OWNER: 'Владелец',
	TEACHER: 'Преподаватель',
	STUDENT: 'Студент',
};

const roleColors: Record<string, string> = {
	OWNER: 'red',
	TEACHER: 'blue',
	STUDENT: 'gray',
};

export function WorkspaceDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const workspaceId = Number(id);
	const user = getUserData();
	const currentUserId = Number(user?.sub);

	const canEdit = useProfileStore((state) => state.canEdit(workspaceId));
	const canDelete = useProfileStore((state) => state.canDelete(workspaceId));
	const canChangeMemberRoles = useProfileStore((state) => state.canChangeMemberRoles(workspaceId));
	const canManageInvites = useProfileStore((state) => state.canManageInvites(workspaceId));
	const getRole = useProfileStore((state) => state.getRole);
	const currentRole = getRole(workspaceId) ?? 'STUDENT';
	const profileStore = useProfileStore();

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [roleModalOpen, setRoleModalOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState<{
		id: number;
		userId: number;
		fullname: string;
		email: string;
		role: string;
	} | null>(null);
	const [newRole, setNewRole] = useState<string>('');
	const [error, setError] = useState('');
	const [importModalOpen, setImportModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [importError, setImportError] = useState('');

	const { data: workspace, isLoading: wsLoading } = useQuery({
		queryKey: ['workspace', workspaceId],
		queryFn: () => getWorkspace(workspaceId),
	});

	const { data: members, isLoading: membersLoading } = useQuery({
		queryKey: ['workspaceMembers', workspaceId],
		queryFn: () => getWorkspaceMembers(workspaceId),
	});

	const { data: criteria = [], isLoading: criteriaLoading } = useQuery({
		queryKey: ['workspaceCriteria', workspaceId],
		queryFn: () => getWorkspaceCriteria(workspaceId),
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteWorkspace(workspaceId),
		onSuccess: () => {
			profileStore.setWorkspaces(
				profileStore.workspaces.filter((workspace) => workspace.workspaceId !== workspaceId)
			);
			navigate('/home');
		},
		onError: (err: unknown) => {
			const e = err as { response?: { data?: { message?: string } } };
			setError(e.response?.data?.message || 'Ошибка архивации');
		},
	});

	const leaveMutation = useMutation({
		mutationFn: () => leaveWorkspace(workspaceId),
		onSuccess: async () => {
			useProfileStore.getState().setWorkspaces([]);
			const response = await getProfileWorkspaces();
			useProfileStore.getState().setWorkspaces(
				response.map((item: { workspace: { id: number; name: string }; role: string }) => ({
					workspaceId: item.workspace.id,
					name: item.workspace.name,
					role: item.role as WorkspaceMemberRole,
				}))
			);
			navigate('/home');
		},
		onError: (err: unknown) => {
			const e = err as { response?: { data?: { message?: string } } };
			setError(e.response?.data?.message || 'Ошибка выхода');
		},
	});

	const updateRoleMutation = useMutation({
		mutationFn: ({ memberId, role }: { memberId: number; role: WorkspaceMemberRole }) =>
			updateMember(workspaceId, memberId, { role }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workspaceMembers', workspaceId] });
		},
	});

	const importMutation = useMutation({
		mutationFn: (file: File) => importCriteria(file, workspaceId, null),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['workspaceCriteria', workspaceId] });
			setImportModalOpen(false);
			setSelectedFile(null);
			setImportError('');
		},
		onError: (err: unknown) => {
			const message =
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
				'Ошибка при импорте критериев';
			setImportError(message);
		},
	});

	if (wsLoading || membersLoading) {
		return (
			<Center h={400}>
				<Loader size="lg" />
			</Center>
		);
	}

	if (!workspace) {
		return <Alert color="red">Пространство не найдено</Alert>;
	}

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>{workspace.name}</Title>
				{(canEdit || canDelete) && (
					<Menu shadow="md" width={200}>
						<Menu.Target>
							<Button variant="subtle" p={8}>
								<IconDotsVertical size={18} />
							</Button>
						</Menu.Target>
						<Menu.Dropdown>
							{canEdit && (
								<Menu.Item
									leftSection={<IconEdit size={14} />}
									onClick={() => navigate(`/workspaces/${workspaceId}/edit`)}
								>
									Редактировать
								</Menu.Item>
							)}
							{canDelete && !workspace.is_archived && (
								<Menu.Item
									leftSection={<IconTrash size={14} />}
									color="red"
									onClick={() => setDeleteModalOpen(true)}
								>
									Архивировать
								</Menu.Item>
							)}
						</Menu.Dropdown>
					</Menu>
				)}
			</Group>

			{error && (
				<Alert color="red" icon={<IconAlertCircle size={16} />} onClose={() => setError('')}>
					{error}
				</Alert>
			)}

			<Tabs defaultValue="main">
				<Tabs.List>
					<Tabs.Tab value="main" leftSection={<IconInfoCircle size={16} />}>
						Основное
					</Tabs.Tab>
					<Tabs.Tab value="tasks" leftSection={<IconBook size={16} />}>
						Задачи
					</Tabs.Tab>
					<Tabs.Tab value="grades" leftSection={<IconChartBar size={16} />}>
						Успеваемость
					</Tabs.Tab>
					<Tabs.Tab value="criteria" leftSection={<IconFileDescription size={16} />}>
						Критерии
					</Tabs.Tab>
					<Tabs.Tab value="members" leftSection={<IconUsers size={16} />}>
						Участники
					</Tabs.Tab>
					{canManageInvites && (
						<Tabs.Tab value="invites" leftSection={<IconLink size={16} />}>
							Приглашения
						</Tabs.Tab>
					)}
					{canEdit && (
						<Tabs.Tab value="models" leftSection={<IconBrain size={16} />}>
							Модели
						</Tabs.Tab>
					)}
				</Tabs.List>

				<Tabs.Panel value="main" pt="md">
					<Stack gap="md">
						<Stack gap={0}>
							<Text size="sm" c="dimmed">
								Описание
							</Text>
							<Text style={{ whiteSpace: 'pre-line' }}>
								{workspace.description || 'Описание не указано'}
							</Text>
						</Stack>
						<Text size="sm" c="dimmed">
							Создано {new Date(workspace.created_at).toLocaleDateString('ru-RU')}
						</Text>
						{workspace.is_archived && (
							<Badge color="red" size="lg">
								Архивировано
							</Badge>
						)}
						{currentRole !== 'OWNER' && !workspace.is_archived && (
							<Group>
								<Button
									variant="light"
									color="red"
									onClick={() => leaveMutation.mutate()}
									loading={leaveMutation.isPending}
								>
									Покинуть пространство
								</Button>
							</Group>
						)}
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="members" pt="md">
					<Table>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Имя</Table.Th>
								<Table.Th>Email</Table.Th>
								<Table.Th>Роль</Table.Th>
								{canEdit && <Table.Th></Table.Th>}
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{members?.map((member) => (
								<Table.Tr key={member.id}>
									<Table.Td>{member.fullname}</Table.Td>
									<Table.Td>{member.email}</Table.Td>
									<Table.Td>
										<Badge color={roleColors[member.role]} variant="light">
											{roleLabels[member.role]}
										</Badge>
									</Table.Td>
									<Table.Td>
										{canChangeMemberRoles && member.user_id !== currentUserId && (
											<Button
												size="xs"
												variant="light"
												leftSection={<IconUserEdit size={14} />}
												onClick={() => {
													setSelectedMember({
														id: member.id,
														userId: member.user_id,
														fullname: member.fullname,
														email: member.email,
														role: member.role,
													});
													setNewRole('TEACHER');
													setRoleModalOpen(true);
												}}
											>
												Изменить
											</Button>
										)}
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Tabs.Panel>

				<Tabs.Panel value="tasks" pt="md">
					<WorkspaceTasksTab workspaceId={workspaceId} showTitle />
				</Tabs.Panel>

				<Tabs.Panel value="grades" pt="md">
					<WorkspaceGradesTab workspaceId={workspaceId} />
				</Tabs.Panel>

				<Tabs.Panel value="criteria" pt="md">
					<Group justify="space-between" mb="md">
						<Group>
							<Button
								leftSection={<IconPlus size={16} />}
								onClick={() => navigate(`/workspaces/${workspaceId}/criteria/new`)}
							>
								Создать критерий
							</Button>
							{canEdit && (
								<Button
									variant="outline"
									leftSection={<IconUpload size={16} />}
									onClick={() => setImportModalOpen(true)}
								>
									Загрузить критерии
								</Button>
							)}
						</Group>
					</Group>
					{criteriaLoading ? (
						<Center h={200}>
							<Loader size="lg" />
						</Center>
					) : criteria.length === 0 ? (
						<Text c="dimmed">Критерии не найдены</Text>
					) : (
						<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
							{criteria.map((criterion) => (
								<CriterionCard
									key={criterion.id}
									criterion={criterion}
									onClick={() => navigate(`/workspaces/${workspaceId}/criteria/${criterion.id}`)}
								/>
							))}
						</SimpleGrid>
					)}
				</Tabs.Panel>

				{canManageInvites && (
					<Tabs.Panel value="invites" pt="md">
						<WorkspaceInvitesTab workspaceId={workspaceId} />
					</Tabs.Panel>
				)}

				{canEdit && (
					<Tabs.Panel value="models" pt="md">
						<WorkspaceModelsTab workspaceId={workspaceId} />
					</Tabs.Panel>
				)}
			</Tabs>

			<Modal
				opened={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Архивация пространства"
			>
				<Text>Вы уверены, что хотите архивировать пространство "{workspace.name}"?</Text>
				<Group justify="flex-end" mt="lg">
					<Button variant="default" onClick={() => setDeleteModalOpen(false)}>
						Отмена
					</Button>
					<Button
						color="red"
						onClick={() => deleteMutation.mutate()}
						loading={deleteMutation.isPending}
					>
						Архивировать
					</Button>
				</Group>
			</Modal>

			<Modal
				opened={roleModalOpen}
				onClose={() => setRoleModalOpen(false)}
				title="Изменение роли участника"
			>
				{selectedMember && (
					<Stack gap="md">
						<div>
							<Text size="sm" c="dimmed">
								Участник
							</Text>
							<Text fw={500}>
								{selectedMember.fullname} ({selectedMember.email})
							</Text>
						</div>
						<div>
							<Text size="sm" c="dimmed">
								Текущая роль
							</Text>
							<Badge color={roleColors[selectedMember.role]} variant="light">
								{roleLabels[selectedMember.role]}
							</Badge>
						</div>
						<Select
							label="Новая роль"
							value={newRole}
							onChange={(val: string | null) => setNewRole(val || '')}
							data={[
								{ value: 'TEACHER', label: 'Преподаватель' },
								{ value: 'STUDENT', label: 'Студент' },
							]}
						/>
						<Group justify="flex-end">
							<Button variant="default" onClick={() => setRoleModalOpen(false)}>
								Отмена
							</Button>
							<Button
								onClick={() => {
									if (selectedMember && newRole && newRole !== selectedMember.role) {
										updateRoleMutation.mutate({
											memberId: selectedMember.id,
											role: newRole as WorkspaceMemberRole,
										});
									}
									setRoleModalOpen(false);
								}}
								loading={updateRoleMutation.isPending}
								disabled={!newRole || newRole === selectedMember?.role}
							>
								Сохранить
							</Button>
						</Group>
					</Stack>
				)}
			</Modal>

			<Modal
				opened={importModalOpen}
				onClose={() => {
					setImportModalOpen(false);
					setSelectedFile(null);
				}}
				title="Импорт критериев"
				size="lg"
			>
				<Stack gap="md">
					<Text size="sm">Загрузите файл в формате JSON со списком критериев.</Text>

					<Stack gap="xs">
						<Text size="sm" fw={500}>
							Формат JSON:
						</Text>
						<Code block>{`[
  {
    "description": "Описание критерия",
    "prompt": "Промпт для проверки критерия (необязательно)",
    "stage": "CODEBASE",
    "tags": ["architecture", "backend"]
  }
]`}</Code>
					</Stack>

					<FileInput
						label="Файл"
						placeholder="Выберите файл"
						accept="application/json"
						value={selectedFile}
						onChange={(file) => {
							setSelectedFile(file);
							setImportError('');
						}}
						clearable
					/>

					{importError && (
						<Alert
							color="red"
							icon={<IconAlertCircle size={16} />}
							withCloseButton
							onClose={() => setImportError('')}
						>
							{importError}
						</Alert>
					)}

					<Group justify="flex-end">
						<Button
							variant="subtle"
							onClick={() => {
								setImportModalOpen(false);
								setSelectedFile(null);
							}}
						>
							Отмена
						</Button>
						<Button
							onClick={() => selectedFile && importMutation.mutate(selectedFile)}
							loading={importMutation.isPending}
							disabled={!selectedFile}
						>
							Загрузить
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Stack>
	);
}
