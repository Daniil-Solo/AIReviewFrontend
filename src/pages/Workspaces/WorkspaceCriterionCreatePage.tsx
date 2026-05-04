import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
	Box,
	Text,
} from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { createCriterion, getAvailableTags } from '../../api/endpoints/criteria';
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer';
import type { CriterionStage, CriterionCreateDTO, ErrorResponseDTO } from '../../types';

const stageOptions = [
	{ value: '', label: 'Автопроверка' },
	{ value: 'PROJECT_DOC', label: 'Проверка по ProjectDoc' },
	{ value: 'CODEBASE', label: 'Проверка по кодовой базе' },
	{ value: 'MANUAL', label: 'Ручная проверка' },
];

export function WorkspaceCriterionCreatePage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { workspaceId } = useParams<{ workspaceId: string }>();
	const wsId = Number(workspaceId);

	const [description, setDescription] = useState('');
	const [prompt, setPrompt] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState('');
	const [selectedStage, setSelectedStage] = useState<string | null>(null);
	const [descriptionError, setDescriptionError] = useState('');
	const [promptError, setPromptError] = useState('');
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

	const mutation = useMutation({
		mutationFn: (data: CriterionCreateDTO) => createCriterion(data),
		onSuccess: (newCriterion) => {
			queryClient.invalidateQueries({ queryKey: ['workspaceCriteria', wsId] });
			queryClient.invalidateQueries({ queryKey: ['criteriaTags'] });
			queryClient.invalidateQueries({ queryKey: ['availableTags'] });
			navigate(`/workspaces/${wsId}/criteria/${newCriterion.id}`);
		},
		onError: (err) => {
			const data = (err as { response?: { data: ErrorResponseDTO } }).response?.data;
			setGeneralError(data?.message || 'Ошибка создания');
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
		if (!prompt.trim()) {
			setPromptError('Промпт обязателен');
			return;
		}

		setDescriptionError('');
		setPromptError('');
		mutation.mutate({
			description: description.trim(),
			prompt: prompt.trim(),
			tags: tags.length > 0 ? tags : undefined,
			stage: selectedStage === '' ? undefined : (selectedStage as CriterionStage),
			workspace_id: wsId,
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
					<Select
						label="Этап проверки"
						placeholder="Выберите этап (необязательно)"
						value={selectedStage}
						onChange={(val) => setSelectedStage(val)}
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
						placeholder="Промпт для автоматической проверки"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						error={promptError}
						onFocus={() => setPromptError('')}
						required
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
							Создать
						</Button>
						<Button variant="subtle" onClick={() => navigate(`/workspaces/${wsId}`)}>
							Отмена
						</Button>
					</Group>
				</Stack>
			</form>
		</Stack>
	);
}
