import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import {
	SimpleGrid,
	Text,
	Button,
	Group,
	Title,
	Stack,
	Loader,
	Center,
	TextInput,
	MultiSelect,
	ActionIcon,
	Alert,
	Modal,
	FileInput,
	Code,
} from '@mantine/core';
import { IconPlus, IconSearch, IconAlertCircle, IconX, IconUpload } from '@tabler/icons-react';
import { getCriteria, getAvailableTags, importCriteria } from '../../api/endpoints/criteria';
import { CriterionCard } from '../../components/CriterionCard/CriterionCard';
import { getUserData } from '../../lib/jwt';

export function CriteriaListPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [search, setSearch] = useState('');
	const [debouncedSearch] = useDebouncedValue(search, 500);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [debouncedSelectedTags] = useDebouncedValue(selectedTags, 300);
	const [importModalOpen, setImportModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [importError, setImportError] = useState('');
	const user = getUserData();

	const { data: tags = [] } = useQuery({
		queryKey: ['criteriaTags'],
		queryFn: getAvailableTags,
	});

	const { data: criteria = [], isLoading } = useQuery({
		queryKey: ['criteria', debouncedSearch, debouncedSelectedTags],
		queryFn: () =>
			getCriteria({
				search: debouncedSearch || undefined,
				tags: debouncedSelectedTags.length > 0 ? debouncedSelectedTags : undefined,
			}),
	});

	const importMutation = useMutation({
		mutationFn: (file: File) => importCriteria(file, null, null),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['criteria'] });
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

	if (isLoading) {
		return (
			<Center h={400}>
				<Loader size="lg" />
			</Center>
		);
	}

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>Глобальные критерии</Title>
				{user?.is_admin && (
					<Group>
						<Button component={Link} to="/criteria/new" leftSection={<IconPlus size={16} />}>
							Создать критерий
						</Button>
						<Button
							variant="outline"
							leftSection={<IconUpload size={16} />}
							onClick={() => setImportModalOpen(true)}
						>
							Загрузить критерии
						</Button>
					</Group>
				)}
			</Group>

			<Group grow>
				<TextInput
					placeholder="Поиск по описанию..."
					leftSection={<IconSearch size={16} />}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					rightSection={
						<ActionIcon variant="transparent" onClick={() => setSearch('')}>
							<IconX size={16} color="gray" />
						</ActionIcon>
					}
				/>
				<MultiSelect
					data={tags}
					value={selectedTags}
					onChange={setSelectedTags}
					placeholder="Фильтр по тегам"
					searchable
					clearable
				/>
			</Group>

			{criteria.length === 0 ? (
				<Text c="dimmed">Критерии не найдены</Text>
			) : (
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
					{criteria.map((criterion) => (
						<CriterionCard
							key={criterion.id}
							criterion={criterion}
							onClick={() => navigate(`/criteria/${criterion.id}`)}
						/>
					))}
				</SimpleGrid>
			)}

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
					<Text size="sm">
						Загрузите файл в формате JSON со списком критериев. Критерии будут добавлены как
						глобальные (workspace_id=null, task_id=null).
					</Text>

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
