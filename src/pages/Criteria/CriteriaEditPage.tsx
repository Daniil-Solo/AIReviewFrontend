import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
	Textarea,
	Select,
	Button,
	Stack,
	Title,
	Alert,
	Group,
	MultiSelect,
	TextInput,
	Loader,
	Center,
	Box,
	Text,
} from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { getCriterion, updateCriterion, getAvailableTags } from '../../api/endpoints/criteria';
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer';
import type { CriterionStage, ErrorResponseDTO } from '../../types';

const stageOptions: { value: string; label: string }[] = [
	{ value: '', label: 'Автопроверка' },
	{ value: 'PROJECT_DOC', label: 'Проверка по ProjectDoc' },
	{ value: 'CODEBASE', label: 'Проверка по кодовой базе' },
	{ value: 'MANUAL', label: 'Ручная проверка' },
];

export function CriteriaEditPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { criterionId } = useParams<{ criterionId: string }>();
	const id = Number(criterionId);

	const [description, setDescription] = useState('');
	const [prompt, setPrompt] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState('');
	const [selectedStage, setSelectedStage] = useState<string | null | undefined>(null);
	const [descriptionError, setDescriptionError] = useState('');
	const [generalError, setGeneralError] = useState('');

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

	const {
		data: criterion,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['criterion', id],
		queryFn: () => getCriterion(id),
		enabled: !!id,
	});

	useEffect(() => {
		if (criterion) {
			setDescription(criterion.description);
			setPrompt(criterion.prompt || '');
			setTags(criterion.tags);
			setSelectedStage(criterion.stage);
		}
	}, [criterion]);

	const mutation = useMutation({
		mutationFn: (data: {
			description: string;
			prompt?: string;
			tags?: string[];
			stage?: CriterionStage;
		}) => updateCriterion(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['criteria'] });
			queryClient.invalidateQueries({ queryKey: ['criteriaTags'] });
			queryClient.invalidateQueries({ queryKey: ['availableTags'] });
			queryClient.invalidateQueries({ queryKey: ['criterion', id] });
			navigate(`/criteria/${id}`);
		},
		onError: (err: AxiosError<ErrorResponseDTO>) => {
			const data = err.response?.data;
			if (data) {
				setGeneralError(data.message);
			}
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
			prompt: prompt.trim() || undefined,
			tags: tags.length > 0 ? tags : undefined,
			stage: selectedStage === '' ? undefined : (selectedStage as CriterionStage),
		});
	};

	if (isLoading) {
		return (
			<Center h={400}>
				<Loader size="lg" />
			</Center>
		);
	}

	if (error) {
		const err = error as { response?: { status: number } };
		if (err.response?.status === 403) {
			return (
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					Доступ запрещён
				</Alert>
			);
		}
		return (
			<Alert color="red" icon={<IconAlertCircle size={16} />}>
				Критерий не найден
			</Alert>
		);
	}

	return (
		<Stack gap="lg" maw={600}>
			<Title order={2}>Редактировать критерий</Title>

			{generalError && (
				<Alert color="red" icon={<IconAlertCircle size={16} />}>
					{generalError}
				</Alert>
			)}

			<form onSubmit={handleSubmit}>
				<Stack gap="md">
					<Select
						label="Этап проверки"
						placeholder="Выберите этап (необязательно)"
						value={selectedStage}
						onChange={(val) => setSelectedStage(val === '' ? null : val)}
						data={stageOptions}
						allowDeselect
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

					<Textarea
						label="Промпт для LLM"
						placeholder="Промпт для автоматической проверки (необязательно)"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						autosize
						minRows={3}
						maxRows={8}
					/>

					{prompt && (
						<Box>
							<Text size="sm" c="dimmed" mb="xs">
								Предпросмотр
							</Text>
							<MarkdownRenderer content={prompt} />
						</Box>
					)}

					<Group>
						<Button type="submit" loading={mutation.isPending}>
							Сохранить
						</Button>
						<Button variant="subtle" onClick={() => navigate('/criteria')}>
							Отмена
						</Button>
					</Group>
				</Stack>
			</form>
		</Stack>
	);
}
