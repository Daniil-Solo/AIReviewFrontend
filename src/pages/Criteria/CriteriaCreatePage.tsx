import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
	Textarea,
	Select,
	Button,
	Stack,
	Title,
	Alert,
	MultiSelect,
	TextInput,
	Group,
} from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { createCriterion, getAvailableTags } from '../../api/endpoints/criteria';
import type { CriterionStage } from '../../types';
import { getUserData } from '../../lib/jwt';

const stageOptions = [
	{ value: '', label: 'Не выбрано' },
	{ value: 'PROJECT_DOC', label: 'Документация' },
	{ value: 'CODEBASE', label: 'Код' },
	{ value: 'MANUAL', label: 'Ручная проверка' },
];

export function CriteriaCreatePage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [description, setDescription] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState('');
	const [selectedStage, setSelectedStage] = useState<string | null>('');
	const [descriptionError, setDescriptionError] = useState('');
	const [generalError, setGeneralError] = useState('');

	useEffect(() => {
		const user = getUserData();
		if (!user?.is_admin) {
			navigate('/criteria');
		}
	}, [navigate]);

	const { data: availableTags = [] } = useQuery({
		queryKey: ['availableTags'],
		queryFn: getAvailableTags,
	});

	const allTags = [...availableTags, ...tags.filter((t) => !availableTags.includes(t))];

	const handleAddTag = () => {
		const tag = newTag.trim().toLowerCase();
		if (tag && !tags.includes(tag)) {
			setTags([...tags, tag]);
			setNewTag('');
		}
	};

	const mutation = useMutation({
		mutationFn: createCriterion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['criteria'] });
			queryClient.invalidateQueries({ queryKey: ['criteriaTags'] });
			queryClient.invalidateQueries({ queryKey: ['availableTags'] });
			navigate('/criteria');
		},
		onError: (err: unknown) => {
			const e = err as { response?: { data?: { message?: string } } };
			setGeneralError(e.response?.data?.message || 'Ошибка при создании');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!description.trim()) {
			setDescriptionError('Описание обязательно');
			return;
		}
		if (description.length > 1000) {
			setDescriptionError('Описание не должно превышать 1000 символов');
			return;
		}

		setDescriptionError('');
		mutation.mutate({
			description: description.trim(),
			tags: tags.length > 0 ? tags : undefined,
			stage: selectedStage === '' ? undefined : (selectedStage as CriterionStage),
		});
	};

	return (
		<Stack gap="lg" maw={600}>
			<Title order={2}>Создать критерий</Title>

			{generalError && (
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					{generalError}
				</Alert>
			)}

			<form onSubmit={handleSubmit}>
				<Stack gap="md">
					<Textarea
						label="Описание"
						placeholder="Описание критерия оценки"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						error={descriptionError}
						onFocus={() => setDescriptionError('')}
						required
						autosize
						minRows={4}
						maxRows={10}
						maxLength={1000}
					/>

					<MultiSelect
						label="Теги"
						placeholder="Выберите теги"
						data={allTags}
						value={tags}
						onChange={setTags}
						searchable
					/>
					<Group gap="xs">
						<TextInput
							placeholder="Новый тег"
							value={newTag}
							onChange={(e) => setNewTag(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleAddTag();
								}
							}}
							style={{ flex: 1 }}
						/>
						<Button variant="light" onClick={handleAddTag} leftSection={<IconPlus size={14} />}>
							Добавить
						</Button>
					</Group>

					<Select
						label="Этап проверки"
						placeholder="Выберите этап (необязательно)"
						value={selectedStage}
						onChange={(val) => setSelectedStage(val)}
						data={stageOptions}
						allowDeselect
					/>

					<Button type="submit" loading={mutation.isPending}>
						Создать
					</Button>
				</Stack>
			</form>
		</Stack>
	);
}
