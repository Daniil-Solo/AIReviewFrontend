import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	TextInput,
	Textarea,
	Button,
	Stack,
	Title,
	Alert,
	Loader,
	Center,
	Group,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { getWorkspace, updateWorkspace } from '../../api/endpoints/workspaces';
import { useProfileStore } from '../../store/profile';

export function EditWorkspacePage() {
	const { workspaceId } = useParams<{ workspaceId: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const id = Number(workspaceId);

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [nameError, setNameError] = useState('');
	const [generalError, setGeneralError] = useState('');
	const profileStore = useProfileStore();

	const {
		data: workspace,
		isLoading: wsLoading,
		isSuccess,
	} = useQuery({
		queryKey: ['workspace', id],
		queryFn: () => getWorkspace(id),
	});

	useEffect(() => {
		if (isSuccess && workspace) {
			setName(workspace.name);
			setDescription(workspace.description || '');
		}
	}, [isSuccess, workspace]);

	const mutation = useMutation({
		mutationFn: (data: { name: string; description?: string }) => updateWorkspace(id, data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['workspace', id] });
			profileStore.setWorkspaces([
				...profileStore.workspaces.filter((ws) => ws.workspaceId == data.id),
				{
					workspaceId: data.id,
					name: data.name,
					role: profileStore.workspaces.find((ws) => ws.workspaceId == data.id)?.role || 'STUDENT',
				},
			]);
			navigate(`/workspaces/${id}`);
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			setGeneralError(err.response?.data?.message || 'Ошибка при сохранении');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			setNameError('Название обязательно');
			return;
		}
		if (name.length > 255) {
			setNameError('Название не должно превышать 255 символов');
			return;
		}
		if (description.length > 5000) {
			setNameError('Описание не должно превышать 5000 символов');
			return;
		}

		setNameError('');
		mutation.mutate({ name: name.trim(), description: description.trim() || undefined });
	};

	if (wsLoading) {
		return (
			<Center h={200}>
				<Loader />
			</Center>
		);
	}

	return (
		<Stack gap="lg" maw={600}>
			<Title order={2}>Редактировать пространство</Title>

			{generalError && (
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					{generalError}
				</Alert>
			)}

			<form onSubmit={handleSubmit}>
				<Stack gap="md">
					<TextInput
						label="Название"
						placeholder="Название пространства"
						value={name}
						onChange={(e) => setName(e.target.value)}
						error={nameError}
						onFocus={() => setNameError('')}
						required
						maxLength={255}
					/>
					<Textarea
						label="Описание"
						placeholder="Описание пространства (необязательно)"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						minRows={4}
						maxRows={24}
						autosize
					/>
					<Group gap="sm">
						<Button type="submit" loading={mutation.isPending}>
							Сохранить
						</Button>
						<Button variant="subtle" onClick={() => navigate(`/workspaces/${id}`)}>
							Отмена
						</Button>
					</Group>
				</Stack>
			</form>
		</Stack>
	);
}
