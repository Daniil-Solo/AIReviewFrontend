import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useClipboard } from '@mantine/hooks';
import {
	Stack,
	Title,
	Text,
	Button,
	Group,
	Alert,
	Tabs,
	Card,
	SimpleGrid,
	Textarea,
	Loader,
} from '@mantine/core';
import {
	IconArrowLeft,
	IconX,
	IconProgress,
	IconFileZip,
	IconPlayerPlay,
	IconEdit,
	IconCheck,
	IconCopy,
	IconDownload,
} from '@tabler/icons-react';
import type { SolutionShortResponseDTO } from '../../types';
import { statusLabels, formatLabels, calculateProgress } from '../../features/solutions/constants';
import { formatRelativeTime } from '../../lib/date';
import {
	cancelSolution,
	getSolutionArtefact,
	approveSolution,
} from '../../api/endpoints/solutions';
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer';
import { SolutionWindRoseChart } from '../../components/SolutionWindRoseChart/SolutionWindRoseChart';
import { useDebounce } from '../../lib/debounce';

interface StudentSolutionPageProps {
	solution: SolutionShortResponseDTO;
	isAuthor: boolean;
	workspaceId: number;
	taskId: number;
	isTeacher: boolean;
}

function ProjectDocValidationTab({
	solutionId,
	onSuccess,
}: {
	solutionId: number;
	onSuccess: () => void;
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState('');
	const queryClient = useQueryClient();

	const debouncedContent = useDebounce(content, 500);

	const {
		data: artefact,
		isSuccess,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['solutionArtefact', solutionId, 'create_project_doc'],
		queryFn: () => getSolutionArtefact(solutionId, 'create_project_doc'),
	});

	useEffect(() => {
		if (isSuccess && artefact) {
			setContent(artefact);
		}
	}, [artefact, isSuccess]);

	const approveMutation = useMutation({
		mutationFn: (file: string) => approveSolution(solutionId, file),
		onSuccess: () => {
			setIsEditing(false);
			queryClient.invalidateQueries({ queryKey: ['solution', solutionId] });
			onSuccess();
		},
	});

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
	};

	const handleConfirm = () => {
		approveMutation.mutate(content);
	};

	if (isLoading) {
		return <Loader size="sm" />;
	}

	if (error) {
		return <Alert color="red">Не удалось загрузить документацию проекта</Alert>;
	}

	return (
		<Stack gap="md">
			<Alert color="blue" variant="light">
				Пожалуйста, проверьте ProjectDoc, отредактируйте при необходимости и подтвердите её
				валидность
			</Alert>

			<Group>
				{isEditing ? (
					<>
						<Button variant="outline" onClick={handleSave}>
							Сохранить
						</Button>
						<Button
							variant="subtle"
							onClick={() => {
								setIsEditing(false);
							}}
						>
							Отмена
						</Button>
					</>
				) : (
					<>
						<Button variant="outline" leftSection={<IconEdit size={16} />} onClick={handleEdit}>
							Редактировать
						</Button>
						<Button
							variant="outline"
							color="green"
							leftSection={<IconCheck size={16} />}
							onClick={handleConfirm}
							loading={approveMutation.isPending}
						>
							Подтвердить
						</Button>
					</>
				)}
			</Group>

			{isEditing ? (
				<Stack gap="md">
					<Textarea
						label="Редактирование документации"
						value={content}
						onChange={(e) => setContent(e.currentTarget.value)}
						minRows={10}
						maxRows={20}
						autosize
						styles={{ input: { fontFamily: 'monospace' } }}
					/>
					{content && (
						<Card withBorder>
							<Text size="sm" fw={500} mb="sm">
								Предпросмотр:
							</Text>
							<MarkdownRenderer content={debouncedContent} />
						</Card>
					)}
				</Stack>
			) : (
				<Card withBorder>
					<MarkdownRenderer content={content} />
				</Card>
			)}
		</Stack>
	);
}

function ProjectDocTab({ solutionId }: { solutionId: number }) {
	const clipboard = useClipboard({ timeout: 2000 });

	const {
		data: content,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['solutionArtefact', solutionId, 'validate_project_doc'],
		queryFn: () => getSolutionArtefact(solutionId, 'validate_project_doc'),
	});

	const handleDownload = () => {
		if (!content) return;
		const blob = new Blob([content], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'README.md';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	if (isLoading) {
		return <Loader size="sm" />;
	}

	if (error) {
		return <Alert color="red">Не удалось загрузить документацию проекта</Alert>;
	}

	return (
		<Stack gap="md">
			<Group justify="space-between">
				<Text size="sm" c="dimmed">
					Можете использовать этот ProjectDoc в качестве README в своём проекте
				</Text>
				<Group gap="xs">
					<Button
						variant="light"
						leftSection={clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
						onClick={() => clipboard.copy(content || '')}
					>
						{clipboard.copied ? 'Скопировано' : 'Скопировать'}
					</Button>
					<Button variant="light" leftSection={<IconDownload size={16} />} onClick={handleDownload}>
						Скачать
					</Button>
				</Group>
			</Group>

			<Card withBorder>
				<MarkdownRenderer content={content || ''} />
			</Card>
		</Stack>
	);
}

export function StudentSolutionPage({
	solution,
	isAuthor,
	workspaceId,
	taskId,
	isTeacher,
}: StudentSolutionPageProps) {
	const [activeTab, setActiveTab] = useState<string | null>('main');
	const queryClient = useQueryClient();
	const progress = calculateProgress(solution.status);

	const cancelMutation = useMutation({
		mutationFn: () => cancelSolution(solution.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['solution', solution.id] });
			queryClient.invalidateQueries({ queryKey: ['solutionInfo', solution.id] });
			queryClient.invalidateQueries({ queryKey: ['solutionArtefact', solution.id] });
		},
	});

	const canCancel =
		isAuthor &&
		!isTeacher &&
		['PROJECT_GENERATION', 'VALIDATION_WAITING', 'CRITERIA_GRADING', 'HUMAN_REVIEW'].includes(
			solution.status
		);

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Group gap="sm">
					<Button
						component={Link}
						to={`/workspaces/${workspaceId}/tasks/${taskId}`}
						variant="subtle"
						leftSection={<IconArrowLeft size={16} />}
						size="sm"
					>
						К задаче
					</Button>
				</Group>
			</Group>

			{!isAuthor && <Alert color="red">Решение не принадлежит данному студенту</Alert>}

			<Title order={3}>Решение #{solution.id}</Title>

			<Tabs value={activeTab} onChange={setActiveTab}>
				<Tabs.List>
					<Tabs.Tab value="main">Основное</Tabs.Tab>
					{(solution.status === 'HUMAN_REVIEW' || solution.status === 'REVIEWED') && (
						<Tabs.Tab value="project-doc">ProjectDoc</Tabs.Tab>
					)}
					{solution.status === 'VALIDATION_WAITING' && (
						<Tabs.Tab value="validation">Валидация ProjectDoc</Tabs.Tab>
					)}
					{solution.status === 'REVIEWED' && <Tabs.Tab value="review">Ревью</Tabs.Tab>}
				</Tabs.List>

				<Tabs.Panel value="main" pt="md">
					<Stack gap="md">
						<SimpleGrid cols={{ base: 1, sm: 2 }}>
							<Card withBorder>
								<Stack gap="sm">
									<Group gap="xs">
										<IconProgress size={18} color="gray" />
										<Text fw={500} size="sm">
											Основное
										</Text>
									</Group>
									<Group gap="lg">
										<Stack gap={0}>
											<Text size="xs" c="dimmed">
												Статус
											</Text>
											<Text size="sm">{statusLabels[solution.status]}</Text>
										</Stack>
										<Stack gap={0}>
											<Text size="xs" c="dimmed">
												Прогресс
											</Text>
											<Text size="sm">{Math.round(progress)}%</Text>
										</Stack>
									</Group>
								</Stack>
							</Card>

							<Card withBorder>
								<Stack gap="sm">
									<Group gap="xs">
										<IconFileZip size={18} color="gray" />
										<Text fw={500} size="sm">
											Попытка
										</Text>
									</Group>
									<Group gap="lg">
										<Stack gap={0}>
											<Text size="xs" c="dimmed">
												Создано
											</Text>
											<Text size="sm">{formatRelativeTime(solution.created_at)}</Text>
										</Stack>
										<Stack gap={0}>
											<Text size="xs" c="dimmed">
												Формат
											</Text>
											<Text size="sm">{formatLabels[solution.format]}</Text>
										</Stack>
										{solution.format === 'GITHUB' && solution.github_repo_link && (
											<Stack gap={0}>
												<Text size="xs" c="dimmed">
													Ссылка
												</Text>
												<Text
													component="a"
													href={solution.github_repo_link}
													target="_blank"
													rel="noopener noreferrer"
													size="sm"
													style={{ color: '#228be6', textDecoration: 'none' }}
												>
													Открыть
												</Text>
											</Stack>
										)}
									</Group>
								</Stack>
							</Card>

							{canCancel && (
								<Card withBorder>
									<Stack gap="sm">
										<Group gap="xs">
											<IconPlayerPlay size={18} color="gray" />
											<Text fw={500} size="sm">
												Управление
											</Text>
										</Group>
										<Group gap="xs">
											<Button
												leftSection={<IconX size={16} />}
												variant="light"
												color="red"
												onClick={() => cancelMutation.mutate()}
												loading={cancelMutation.isPending}
											>
												Отменить
											</Button>
										</Group>
									</Stack>
								</Card>
							)}
							{solution.status === 'REVIEWED' && (
								<SolutionWindRoseChart solutionId={solution.id} status={solution.status} />
							)}
						</SimpleGrid>
					</Stack>
				</Tabs.Panel>

				{(solution.status === 'HUMAN_REVIEW' || solution.status === 'REVIEWED') && (
					<Tabs.Panel value="project-doc" pt="md">
						<ProjectDocTab solutionId={solution.id} />
					</Tabs.Panel>
				)}

				{solution.status === 'VALIDATION_WAITING' && (
					<Tabs.Panel value="validation" pt="md">
						<ProjectDocValidationTab
							solutionId={solution.id}
							onSuccess={() => setActiveTab('main')}
						/>
					</Tabs.Panel>
				)}
				{solution.status === 'REVIEWED' && solution.human_feedback && (
					<Tabs.Panel value="review" pt="md">
						<Stack gap="xs">
							<Card withBorder>
								<Stack gap="xs">
									<Text fw={500} size="sm">
										Оценка
									</Text>
									<Text size="xl" fw={700}>
										{solution.human_grade}
									</Text>
								</Stack>
							</Card>
							<Card withBorder>
								<Text fw={500} size="sm">
									Обратная связь
								</Text>
								<div>
									<MarkdownRenderer content={solution.human_feedback} />
								</div>
							</Card>
						</Stack>
					</Tabs.Panel>
				)}
			</Tabs>
		</Stack>
	);
}
