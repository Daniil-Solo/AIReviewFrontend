import { useState, useEffect } from 'react';
import {
	Stack,
	Group,
	Button,
	Table,
	Text,
	ActionIcon,
	Tooltip,
	Modal,
	TextInput,
	PasswordInput,
	Alert,
	Loader,
	Center,
} from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconPlus, IconEdit, IconTrash, IconAlertCircle } from '@tabler/icons-react';
import {
	getCustomModels,
	getCustomModelById,
	createCustomModel,
	updateCustomModel,
	deleteCustomModel,
} from '../../api/endpoints/workspaces';
import type {
	CustomModelDTO,
	CustomModelRequestCreateDTO,
	CustomModelRequestUpdateDTO,
} from '../../types';

interface ModelModalProps {
	opened: boolean;
	onClose: () => void;
	workspaceId: number;
	editModelId?: number | null;
}

function ModelModal({ opened, onClose, workspaceId, editModelId }: ModelModalProps) {
	const queryClient = useQueryClient();
	const [name, setName] = useState('');
	const [model, setModel] = useState('');
	const [baseUrl, setBaseUrl] = useState('');
	const [apiKey, setApiKey] = useState('');
	const [error, setError] = useState('');

	const isEdit = !!editModelId;

	const { data: fullModel, isLoading: isLoadingModel } = useQuery({
		queryKey: ['customModel', editModelId],
		queryFn: () => (editModelId ? getCustomModelById(editModelId) : undefined),
		enabled: opened && !!editModelId,
	});

	useEffect(() => {
		if (opened) {
			if (fullModel) {
				setName(fullModel.name);
				setModel(fullModel.model);
				setBaseUrl(fullModel.base_url);
				setApiKey(fullModel.api_key);
			} else if (!editModelId) {
				setName('');
				setModel('');
				setBaseUrl('');
				setApiKey('');
			}
			setError('');
		}
	}, [opened, fullModel, editModelId]);

	const createMutation = useMutation({
		mutationFn: (data: CustomModelRequestCreateDTO) => createCustomModel(workspaceId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customModels', workspaceId] });
			onClose();
			resetForm();
		},
		onError: (err: unknown) => {
			const e = err as { response?: { data?: { message?: string } } };
			setError(e.response?.data?.message || 'Ошибка создания');
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: CustomModelRequestUpdateDTO) => updateCustomModel(editModelId!, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customModels', workspaceId] });
			queryClient.invalidateQueries({ queryKey: ['customModel', editModelId] });
			onClose();
		},
		onError: (err: unknown) => {
			const e = err as { response?: { data?: { message?: string } } };
			setError(e.response?.data?.message || 'Ошибка обновления');
		},
	});

	const resetForm = () => {
		setName('');
		setModel('');
		setBaseUrl('');
		setApiKey('');
		setError('');
	};

	const handleSubmit = () => {
		if (!name.trim()) {
			setError('Название обязательно');
			return;
		}
		if (!model.trim()) {
			setError('Модель обязательна');
			return;
		}
		if (!baseUrl.trim()) {
			setError('URL обязателен');
			return;
		}

		const data = {
			name: name.trim(),
			model: model.trim(),
			base_url: baseUrl.trim(),
			api_key: apiKey,
		};

		if (isEdit) {
			updateMutation.mutate(data);
		} else {
			if (!apiKey) {
				setError('API ключ обязателен при создании');
				return;
			}
			createMutation.mutate(data);
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;
	const isModalLoading = isLoadingModel;

	if (!opened) return null;

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={isEdit ? 'Редактирование модели' : 'Создание модели'}
		>
			<Stack gap="md">
				{isModalLoading ? (
					<Center h={100}>
						<Loader size="lg" />
					</Center>
				) : (
					<>
						<TextInput
							label="Название"
							placeholder="My Custom Model"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						<TextInput
							label="Модель"
							placeholder="gpt-4, claude-3-opus, etc."
							value={model}
							onChange={(e) => setModel(e.target.value)}
						/>

						<TextInput
							label="Base URL"
							placeholder="https://api.openai.com/v1"
							value={baseUrl}
							onChange={(e) => setBaseUrl(e.target.value)}
						/>

						<PasswordInput
							label="API ключ"
							placeholder={isEdit ? 'Оставьте пустым, чтобы не менять' : 'Введите API ключ'}
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
						/>

						{error && (
							<Alert color="red" icon={<IconAlertCircle size={16} />}>
								{error}
							</Alert>
						)}

						<Group justify="flex-end">
							<Button variant="default" onClick={onClose}>
								Отмена
							</Button>
							<Button onClick={handleSubmit} loading={isLoading}>
								{isEdit ? 'Сохранить' : 'Создать'}
							</Button>
						</Group>
					</>
				)}
			</Stack>
		</Modal>
	);
}

interface DeleteModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading: boolean;
	modelName: string;
}

function DeleteModal({ opened, onClose, onConfirm, isLoading, modelName }: DeleteModalProps) {
	return (
		<Modal opened={opened} onClose={onClose} title="Удаление модели">
			<Text>
				Вы уверены, что хотите удалить модель "{modelName}"? Это действие нельзя отменить.
			</Text>
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

interface WorkspaceModelsTabProps {
	workspaceId: number;
}

export function WorkspaceModelsTab({ workspaceId }: WorkspaceModelsTabProps) {
	const queryClient = useQueryClient();
	const [modalOpen, setModalOpen] = useState(false);
	const [editModelId, setEditModelId] = useState<number | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedModel, setSelectedModel] = useState<CustomModelDTO | null>(null);

	const { data: models, isLoading } = useQuery({
		queryKey: ['customModels', workspaceId],
		queryFn: () => getCustomModels(workspaceId),
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteCustomModel(selectedModel!.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['customModels', workspaceId] });
			setDeleteModalOpen(false);
			setSelectedModel(null);
		},
	});

	const handleEdit = (model: CustomModelDTO) => {
		setEditModelId(model.id);
		setModalOpen(true);
	};

	const handleDelete = (model: CustomModelDTO) => {
		setSelectedModel(model);
		setDeleteModalOpen(true);
	};

	const handleCreate = () => {
		setEditModelId(null);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setEditModelId(null);
	};

	if (isLoading) {
		return (
			<Center h={200}>
				<Loader size="lg" />
			</Center>
		);
	}

	return (
		<Stack gap="md">
			<Group justify="flex-end">
				<Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
					Создать модель
				</Button>
			</Group>

			{models && models.length > 0 ? (
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Название</Table.Th>
							<Table.Th>Модель</Table.Th>
							<Table.Th>Base URL</Table.Th>
							<Table.Th></Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{models.map((model) => (
							<Table.Tr key={model.id}>
								<Table.Td>{model.name}</Table.Td>
								<Table.Td>
									<Text size="sm" ff="monospace">
										{model.model}
									</Text>
								</Table.Td>
								<Table.Td>
									<Text size="sm" c="dimmed">
										{model.base_url}
									</Text>
								</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Tooltip label="Редактировать">
											<ActionIcon variant="subtle" onClick={() => handleEdit(model)}>
												<IconEdit size={20} />
											</ActionIcon>
										</Tooltip>
										<Tooltip label="Удалить">
											<ActionIcon variant="subtle" color="red" onClick={() => handleDelete(model)}>
												<IconTrash size={20} />
											</ActionIcon>
										</Tooltip>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			) : (
				<Text c="dimmed" ta="center" py="xl">
					Модели отсутствуют. Создайте первую модель.
				</Text>
			)}

			<ModelModal
				opened={modalOpen}
				onClose={closeModal}
				workspaceId={workspaceId}
				editModelId={editModelId}
			/>

			{selectedModel && (
				<DeleteModal
					opened={deleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onConfirm={() => deleteMutation.mutate()}
					isLoading={deleteMutation.isPending}
					modelName={selectedModel.name}
				/>
			)}
		</Stack>
	);
}
