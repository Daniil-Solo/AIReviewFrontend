import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { TextInput, Textarea, Button, Stack, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { createWorkspace } from '../../api/endpoints/workspaces';
import { useProfileStore } from '../../store/profile';

export function CreateWorkspacePage() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [nameError, setNameError] = useState('');
	const [generalError, setGeneralError] = useState('');
	const profileStore = useProfileStore();

	const mutation = useMutation({
		mutationFn: createWorkspace,
		onSuccess: (data) => {
			profileStore.setWorkspaces([
				...profileStore.workspaces,
				{ workspaceId: data.id, name: data.name, role: 'OWNER' },
			]);
			navigate(`/workspaces/${data.id}`);
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string } } };
			setGeneralError(err.response?.data?.message || 'Ошибка при создании');
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

	return (
		<Stack gap="lg" maw={600}>
			<Title order={2}>Создать пространство</Title>

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
					<Button type="submit" loading={mutation.isPending}>
						Создать
					</Button>
				</Stack>
			</form>
		</Stack>
	);
}
