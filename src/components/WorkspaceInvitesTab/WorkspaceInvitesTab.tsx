import { useState, useEffect } from 'react';
import {
	Stack,
	Group,
	Button,
	Table,
	Badge,
	Text,
	ActionIcon,
	Tooltip,
	Modal,
	TextInput,
	Select,
	PasswordInput,
	Switch,
	Alert,
	Loader,
	Center,
	CopyButton,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	IconPlus,
	IconCopy,
	IconEdit,
	IconTrash,
	IconCheck,
	IconAlertCircle,
} from '@tabler/icons-react';
import {
	getJoinRules,
	createJoinRule,
	updateJoinRule,
	deleteJoinRule,
	checkSlugAvailability,
} from '../../api/endpoints/workspaces';
import type { JoinRuleDTO, JoinRuleCreateDTO } from '../../types';

interface InviteModalProps {
	opened: boolean;
	onClose: () => void;
	workspaceId: number;
	editRule?: JoinRuleDTO | null;
}

function InviteModal({ opened, onClose, workspaceId, editRule }: InviteModalProps) {
	const queryClient = useQueryClient();
	const [slug, setSlug] = useState(editRule?.slug || '');
	const [debouncedSlug] = useDebouncedValue(slug, 500);
	const [role, setRole] = useState<'TEACHER' | 'STUDENT'>(
		editRule?.role === 'TEACHER' || editRule?.role === 'STUDENT' ? editRule.role : 'STUDENT'
	);
	const [password, setPassword] = useState('');
	const [expiredAt, setExpiredAt] = useState<Date | null>(
		editRule?.expired_at ? new Date(editRule.expired_at) : null
	);
	const [isActive, setIsActive] = useState(editRule?.is_active ?? true);
	const [slugError, setSlugError] = useState('');
	const [slugLoading, setSlugLoading] = useState(false);
	const [generalError, setGeneralError] = useState('');

	useEffect(() => {
		setSlug(editRule?.slug || '');
		setRole(
			editRule?.role === 'TEACHER' || editRule?.role === 'STUDENT' ? editRule.role : 'STUDENT'
		);
		setPassword('');
		setExpiredAt(editRule?.expired_at ? new Date(editRule.expired_at) : null);
		setIsActive(editRule?.is_active ?? true);
		setSlugError('');
		setGeneralError('');
	}, [editRule]);

	useEffect(() => {
		if (!editRule) {
			if (!debouncedSlug.trim()) {
				setSlugError('');
				return;
			}
			setSlugLoading(true);
			checkSlugMutation.mutate(debouncedSlug, {
				onSettled: () => setSlugLoading(false),
			});
		}
	}, [debouncedSlug]);

	const createMutation = useMutation({
		mutationFn: (data: JoinRuleCreateDTO) => createJoinRule(workspaceId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['joinRules', workspaceId] });
			onClose();
			resetForm();
		},
		onError: (err: unknown) => {
			const e = err as { response?: { data?: { message?: string } } };
			setGeneralError(e.response?.data?.message || 'Ошибка создания');
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: JoinRuleCreateDTO) => updateJoinRule(workspaceId, editRule!.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['joinRules', workspaceId] });
			onClose();
		},
		onError: (err: unknown) => {
			const e = err as { response?: { data?: { message?: string } } };
			setGeneralError(e.response?.data?.message || 'Ошибка обновления');
		},
	});

	const checkSlugMutation = useMutation({
		mutationFn: (slugValue: string) => checkSlugAvailability(slugValue),
		onSuccess: (data) => {
			if (!data.is_available) {
				setSlugError('Этот slug уже занят');
			} else {
				setSlugError('');
			}
		},
	});

	const resetForm = () => {
		setSlug('');
		setRole('STUDENT');
		setPassword('');
		setExpiredAt(null);
		setIsActive(true);
		setSlugError('');
		setGeneralError('');
	};

	const handleSubmit = () => {
		if (!editRule && !slug.trim()) {
			setSlugError('Slug обязателен');
			return;
		}

		if (!editRule && slugError) {
			return;
		}

		const data: JoinRuleCreateDTO = {
			slug: slug.trim(),
			role,
			password: password || undefined,
			expired_at: expiredAt?.toISOString(),
			is_active: isActive,
		};

		if (editRule) {
			updateMutation.mutate(data);
		} else {
			createMutation.mutate(data);
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={editRule ? 'Редактирование приглашения' : 'Создание приглашения'}
		>
			<Stack gap="md">
				{!editRule && (
					<TextInput
						label="Slug (уникальный идентификатор)"
						description="Будет использоваться в ссылке"
						placeholder="abc123"
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						error={slugError}
						rightSection={slugLoading ? <Loader size={14} /> : null}
					/>
				)}

				<Switch
					label="Ссылка активная"
					checked={isActive}
					onChange={(e) => setIsActive(e.currentTarget.checked)}
				/>

				<Select
					label="Роль"
					value={role}
					onChange={(val) => setRole(val as 'TEACHER' | 'STUDENT')}
					data={[
						{ value: 'STUDENT', label: 'Студент' },
						{ value: 'TEACHER', label: 'Преподаватель' },
					]}
				/>

				<PasswordInput
					label="Пароль (опционально)"
					placeholder="Оставьте пустым для отсутствия пароля"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<TextInput
					label="Срок действия (опционально)"
					placeholder="Бессрочно"
					type="datetime-local"
					value={expiredAt ? expiredAt.toISOString().slice(0, 16) : ''}
					onChange={(e) => setExpiredAt(e.target.value ? new Date(e.target.value) : null)}
				/>

				{generalError && (
					<Alert color="red" icon={<IconAlertCircle size={16} />}>
						{generalError}
					</Alert>
				)}

				<Group justify="flex-end">
					<Button variant="default" onClick={onClose}>
						Отмена
					</Button>
					<Button onClick={handleSubmit} loading={isLoading}>
						{editRule ? 'Сохранить' : 'Создать'}
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
}

interface DeleteModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
}

function DeleteModal({ opened, onClose, onConfirm, isLoading }: DeleteModalProps) {
	return (
		<Modal opened={opened} onClose={onClose} title="Удаление приглашения">
			<Text>Вы уверены, что хотите удалить это приглашение? Ссылка перестанет работать.</Text>
			<Group justify="flex-end" mt="lg">
				<Button variant="default" onClick={onClose}>
					Отмена
				</Button>
				<Button color="red" onClick={onConfirm} loading={isLoading}>
					Удалить
				</Button>
			</Group>
		</Modal>
	);
}

interface WorkspaceInvitesTabProps {
	workspaceId: number;
}

const roleLabels: Record<string, string> = {
	TEACHER: 'Преподаватель',
	STUDENT: 'Студент',
};

const roleColors: Record<string, string> = {
	TEACHER: 'blue',
	STUDENT: 'gray',
};

export function WorkspaceInvitesTab({ workspaceId }: WorkspaceInvitesTabProps) {
	const queryClient = useQueryClient();
	const [modalOpen, setModalOpen] = useState(false);
	const [editRule, setEditRule] = useState<JoinRuleDTO | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedRule, setSelectedRule] = useState<JoinRuleDTO | null>(null);

	const { data: rules, isLoading } = useQuery({
		queryKey: ['joinRules', workspaceId],
		queryFn: () => getJoinRules(workspaceId),
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteJoinRule(workspaceId, selectedRule!.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['joinRules', workspaceId] });
			setDeleteModalOpen(false);
			setSelectedRule(null);
		},
	});

	const handleEdit = (rule: JoinRuleDTO) => {
		setEditRule(rule);
		setModalOpen(true);
	};

	const handleDelete = (rule: JoinRuleDTO) => {
		setSelectedRule(rule);
		setDeleteModalOpen(true);
	};

	const handleCreate = () => {
		setEditRule(null);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setEditRule(null);
	};

	if (isLoading) {
		return (
			<Center h={200}>
				<Loader size="lg" />
			</Center>
		);
	}

	const inviteUrl = (slug: string) => `${window.location.origin}/join/${slug}`;

	return (
		<Stack gap="md">
			<Group justify="flex-end">
				<Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
					Создать приглашение
				</Button>
			</Group>

			{rules && rules.length > 0 ? (
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Ссылка</Table.Th>
							<Table.Th>Роль</Table.Th>
							<Table.Th>Статус</Table.Th>
							<Table.Th>Срок</Table.Th>
							<Table.Th>Пароль</Table.Th>
							<Table.Th>Использовано</Table.Th>
							<Table.Th></Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{rules.map((rule) => (
							<Table.Tr key={rule.id}>
								<Table.Td>
									<Group gap="xs">
										<Text size="sm" ff="monospace">
											{rule.slug}
										</Text>
										<CopyButton value={inviteUrl(rule.slug)}>
											{({ copied, copy }) => (
												<Tooltip label={copied ? 'Скопировано!' : 'Копировать ссылку'}>
													<ActionIcon variant="subtle" onClick={copy} size="sm">
														{copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
													</ActionIcon>
												</Tooltip>
											)}
										</CopyButton>
									</Group>
								</Table.Td>
								<Table.Td>
									<Badge color={roleColors[rule.role]} variant="light">
										{roleLabels[rule.role]}
									</Badge>
								</Table.Td>
								<Table.Td>
									<Badge color={rule.is_active ? 'green' : 'gray'} variant="light">
										{rule.is_active ? 'Активно' : 'Неактивно'}
									</Badge>
								</Table.Td>
								<Table.Td>
									{rule.expired_at ? (
										<Text size="sm">{new Date(rule.expired_at).toLocaleString('ru-RU')}</Text>
									) : (
										<Text size="sm" c="dimmed">
											Бессрочно
										</Text>
									)}
								</Table.Td>
								<Table.Td>
									<Badge color={rule.has_password ? 'yellow' : 'gray'} variant="light">
										{rule.has_password ? 'Есть' : 'Нет'}
									</Badge>
								</Table.Td>
								<Table.Td>
									<Text size="sm">{rule.used_count}</Text>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<ActionIcon variant="subtle" onClick={() => handleEdit(rule)}>
											<IconEdit size={20} />
										</ActionIcon>
										<ActionIcon variant="subtle" color="red" onClick={() => handleDelete(rule)}>
											<IconTrash size={20} />
										</ActionIcon>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			) : (
				<Text c="dimmed" ta="center" py="xl">
					Приглашения отсутствуют. Создайте первое приглашение.
				</Text>
			)}

			<InviteModal
				opened={modalOpen}
				onClose={closeModal}
				workspaceId={workspaceId}
				editRule={editRule}
			/>

			<DeleteModal
				opened={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={() => deleteMutation.mutate()}
				isLoading={deleteMutation.isPending}
			/>
		</Stack>
	);
}

