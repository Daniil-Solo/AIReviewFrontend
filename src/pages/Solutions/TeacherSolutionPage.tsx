import { useState, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Stack,
	Title,
	Text,
	Button,
	Group,
	Tabs,
	Loader,
	Badge,
	Tooltip,
	Alert,
	Card,
	SimpleGrid,
	Checkbox,
	Textarea,
	Modal,
	Collapse,
	Box,
	NumberInput,
} from '@mantine/core';
import {
	IconArrowLeft,
	IconChevronDown,
	IconChevronUp,
	IconArrowUp,
	IconPlayerPlay,
	IconFileZip,
	IconProgress,
	IconStar,
	IconCheck,
	IconX,
	IconPlus,
	IconSparkles,
} from '@tabler/icons-react';
import {
	getSolutionInfo,
	getSolutionArtefact,
	restartSolution,
	cancelSolution,
	getSolutionCriteriaChecks,
	createSolutionCriteriaCheck,
	submitFinalReview,
	getSolutionScore,
	generateAiFeedback,
} from '../../api/endpoints/solutions';
import type {
	SolutionShortResponseDTO,
	PipelineStepEnum,
	GradingCriterionDTO,
	SolutionScoreDTO,
} from '../../types';
import {
	statusLabels,
	formatLabels,
	stepLabels,
	checkStatusLabels,
	getCriterionStageLabel,
	getCriterionCurrentStatus,
	getCriterionColor,
	calculateProgress,
} from '../../features/solutions/constants';
import { formatRelativeTime } from '../../lib/date';
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer';
import { MermaidGantt } from '../../components/MermaidGantt/MermaidGantt';
import { SolutionWindRoseChart } from '../../components/SolutionWindRoseChart/SolutionWindRoseChart';

interface TeacherSolutionPageProps {
	solution: SolutionShortResponseDTO;
	workspaceId: number;
	taskId: number;
	isTeacher: boolean;
}

interface ManualCheckModalProps {
	opened: boolean;
	taskCriterionId: number | null;
	onClose: () => void;
	onSubmit: (taskCriterionId: number, isPassed: boolean, comment?: string) => void;
	isPending: boolean;
}

function ManualCheckModal({
	opened,
	taskCriterionId,
	onClose,
	onSubmit,
	isPending,
}: ManualCheckModalProps) {
	const [isPassed, setIsPassed] = useState(true);
	const [comment, setComment] = useState('');

	const handleSubmit = () => {
		if (taskCriterionId) {
			onSubmit(taskCriterionId, isPassed, comment || undefined);
			setIsPassed(true);
			setComment('');
		}
	};

	const handleClose = () => {
		setIsPassed(true);
		setComment('');
		onClose();
	};

	return (
		<Modal opened={opened} onClose={handleClose} title="Ручная проверка">
			<Stack gap="md">
				<Checkbox
					label="Пройден"
					checked={isPassed}
					onChange={(e) => setIsPassed(e.currentTarget.checked)}
				/>
				<Textarea
					label="Комментарий"
					placeholder="Комментарий (необязательно)"
					value={comment}
					onChange={(e) => setComment(e.currentTarget.value)}
					minRows={3}
				/>
				<Group justify="flex-end">
					<Button variant="subtle" onClick={handleClose}>
						Отмена
					</Button>
					<Button onClick={handleSubmit} loading={isPending}>
						Добавить
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
}

interface CriteriaCardProps {
	gradingCriterion: GradingCriterionDTO;
	isTeacher: boolean;
	onAddCheck: (taskCriterionId: number) => void;
	isMutationPending: boolean;
}

const CriteriaCard = memo(
	({ gradingCriterion, isTeacher, onAddCheck, isMutationPending }: CriteriaCardProps) => {
		const [isOpen, setIsOpen] = useState(false);
		const taskCriterionId = gradingCriterion.task_criterion_id;

		const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

		return (
			<Card withBorder padding="sm">
				<Stack gap="xs" p="xs" onClick={toggleOpen} style={{ cursor: 'pointer' }}>
					<Group>
						<Text style={{ flex: 1 }} c="black">
							{gradingCriterion.criterion.description}
						</Text>
						{isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
					</Group>
					<Group gap="xs">
						<Badge size="sm" variant="outline" color={getCriterionColor(gradingCriterion)}>
							{getCriterionCurrentStatus(gradingCriterion)}
						</Badge>
						<Badge size="sm" variant="outline" color="gray">
							Проверок: {gradingCriterion.checks.length}
						</Badge>
						<Badge size="sm" variant="outline" color="gray">
							Вес: {gradingCriterion.weight}
						</Badge>
					</Group>
				</Stack>

				<Collapse expanded={isOpen}>
					<Stack px="xs">
						<Box>
							<MarkdownRenderer content={gradingCriterion.criterion.prompt} />
						</Box>
						<Stack gap="sm">
							{gradingCriterion.checks.length > 0 ? (
								<Stack gap="xs">
									{gradingCriterion.checks.map((check, idx) => (
										<Card key={check.id} withBorder padding="xs">
											<Stack gap="xs">
												<Text size="sm" c="dimmed">
													Проверка № {idx + 1} ({getCriterionStageLabel(check.stage)})
												</Text>
												<Text size="sm">{check.comment}</Text>
												<Group gap="xs">
													<Badge color="gray" variant="outline" size="sm">
														{checkStatusLabels[check.status]}
													</Badge>
													{check.is_passed !== null &&
														(check.is_passed ? (
															<Badge
																color="green"
																variant="outline"
																leftSection={<IconCheck size={12} />}
															>
																Критерий выполнен
															</Badge>
														) : (
															<Badge
																color="red"
																variant="outline"
																leftSection={<IconX size={12} />}
															>
																Критерий не выполнен
															</Badge>
														))}
												</Group>
												<Text size="xs" c="dimmed">
													{formatRelativeTime(check.created_at)}
												</Text>
											</Stack>
										</Card>
									))}
								</Stack>
							) : (
								<Text size="sm" c="dimmed">
									Проверок пока нет
								</Text>
							)}
							{isTeacher && (
								<Group>
									<Button
										size="xs"
										variant="light"
										leftSection={<IconPlus size={14} />}
										onClick={(e) => {
											e.stopPropagation();
											onAddCheck(taskCriterionId);
										}}
										disabled={isMutationPending}
									>
										Добавить проверку
									</Button>
								</Group>
							)}
						</Stack>
					</Stack>
				</Collapse>
			</Card>
		);
	}
);

interface CriteriaChecksPanelProps {
	solutionId: number;
	isTeacher: boolean;
}

export function CriteriaChecksPanel({ solutionId, isTeacher }: CriteriaChecksPanelProps) {
	const [addCheckModal, setAddCheckModal] = useState<number | null>(null);
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const {
		data: criteriaData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['solutionCriteriaChecks', solutionId],
		queryFn: () => getSolutionCriteriaChecks(solutionId),
	});

	const uniqueTags = useMemo(() => {
		const tags = criteriaData?.criteria.flatMap((gc) => gc.criterion.tags) || [];
		return [...new Set(tags)].sort();
	}, [criteriaData]);

	const uniqueStatuses = useMemo(() => {
		const statuses = criteriaData?.criteria
			.map((gc) => getCriterionCurrentStatus(gc))
			.filter((status): status is string => status !== null);
		return [...new Set(statuses)];
	}, [criteriaData]);

	const createCheckMutation = useMutation({
		mutationFn: (data: { task_criterion_id: number; is_passed: boolean; comment?: string }) =>
			createSolutionCriteriaCheck(solutionId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['solutionCriteriaChecks', solutionId] });
			setAddCheckModal(null);
		},
	});

	const handleAddCheckRequest = useCallback((taskCriterionId: number) => {
		setAddCheckModal(taskCriterionId);
	}, []);

	const handleSubmitCheck = useCallback(
		(taskCriterionId: number, isPassed: boolean, comment?: string) => {
			createCheckMutation.mutate({
				task_criterion_id: taskCriterionId,
				is_passed: isPassed,
				comment,
			});
		},
		[createCheckMutation]
	);

	const filteredCriteria = useMemo(() => {
		if (!criteriaData?.criteria) return [];
		return criteriaData.criteria.filter((gc) => {
			const matchesTag = !selectedTag || gc.criterion.tags.includes(selectedTag);
			const matchesStatus = !selectedStatus || getCriterionCurrentStatus(gc) === selectedStatus;
			return matchesTag && matchesStatus;
		});
	}, [criteriaData, selectedTag, selectedStatus]);

	if (isLoading) return <Loader size="sm" />;
	if (error) return <Alert color="red">Ошибка загрузки критериев</Alert>;
	if (!criteriaData?.criteria.length)
		return <Alert color="gray">Нет критериев для этого задания</Alert>;

	return (
		<Stack gap="md">
			{uniqueTags.length > 0 && (
				<Group gap="xs">
					<Tooltip label="Нажмите для фильтрации">
						<Badge
							variant={selectedTag === null ? 'filled' : 'outline'}
							size="sm"
							style={{ cursor: 'pointer' }}
							onClick={() => setSelectedTag(null)}
						>
							Все
						</Badge>
					</Tooltip>
					{uniqueTags.map((tag) => (
						<Tooltip key={tag} label="Нажмите для фильтрации">
							<Badge
								variant={selectedTag === tag ? 'filled' : 'outline'}
								size="sm"
								style={{ cursor: 'pointer' }}
								onClick={() => setSelectedTag(tag)}
							>
								{tag}
							</Badge>
						</Tooltip>
					))}
				</Group>
			)}

			{uniqueStatuses.length > 0 && (
				<Group gap="xs">
					<Tooltip label="Нажмите для фильтрации">
						<Badge
							variant={selectedStatus === null ? 'filled' : 'outline'}
							size="sm"
							style={{ cursor: 'pointer' }}
							onClick={() => setSelectedStatus(null)}
						>
							Все
						</Badge>
					</Tooltip>
					{uniqueStatuses.map((status) => (
						<Tooltip key={status} label="Нажмите для фильтрации">
							<Badge
								variant={selectedStatus === status ? 'filled' : 'outline'}
								size="sm"
								style={{ cursor: 'pointer' }}
								onClick={() => setSelectedStatus(status)}
							>
								{status}
							</Badge>
						</Tooltip>
					))}
				</Group>
			)}

			<Stack gap="sm">
				{filteredCriteria.map((gradingCriterion) => (
					<CriteriaCard
						key={gradingCriterion.criterion.id}
						gradingCriterion={gradingCriterion}
						isTeacher={isTeacher}
						onAddCheck={handleAddCheckRequest}
						isMutationPending={createCheckMutation.isPending}
					/>
				))}
			</Stack>

			<ManualCheckModal
				opened={addCheckModal !== null}
				taskCriterionId={addCheckModal}
				onClose={() => setAddCheckModal(null)}
				onSubmit={handleSubmitCheck}
				isPending={createCheckMutation.isPending}
			/>
		</Stack>
	);
}

export function TeacherSolutionPage({
	solution,
	workspaceId,
	taskId,
	isTeacher,
}: TeacherSolutionPageProps) {
	const [activeTab, setActiveTab] = useState<string | null>('main');
	const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['main']));

	const handleTabChange = (value: string | null) => {
		if (value && !visitedTabs.has(value)) {
			setVisitedTabs(new Set(visitedTabs).add(value));
		}
		setActiveTab(value);
	};

	return (
		<Stack gap="lg">
			<Group justify="space-between">
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

			<Title order={3}>Решение #{solution.id}</Title>

			<Tabs value={activeTab} onChange={handleTabChange}>
				<Tabs.List>
					<Tabs.Tab value="main">Основное</Tabs.Tab>
					<Tabs.Tab value="artefacts">Артефакты решения</Tabs.Tab>
					<Tabs.Tab value="criteria">Проверка по критериям</Tabs.Tab>
					<Tabs.Tab value="final-review">Финальный вердикт</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="main" pt="md">
					{visitedTabs.has('main') && <SolutionMainTab solution={solution} isTeacher={isTeacher} />}
				</Tabs.Panel>

				<Tabs.Panel value="artefacts" pt="md">
					{visitedTabs.has('artefacts') && <SolutionArtefactsTab solutionId={solution.id} />}
				</Tabs.Panel>

				<Tabs.Panel value="criteria" pt="md">
					{visitedTabs.has('criteria') && (
						<SolutionCriteriaTab solutionId={solution.id} isTeacher={isTeacher} />
					)}
				</Tabs.Panel>

				<Tabs.Panel value="final-review" pt="md">
					{visitedTabs.has('final-review') && (
						<SolutionFinalReviewTab solution={solution} isTeacher={isTeacher} />
					)}
				</Tabs.Panel>
			</Tabs>
		</Stack>
	);
}

export function SolutionMainTab({
	solution,
	isTeacher,
}: {
	solution: SolutionShortResponseDTO;
	isTeacher: boolean;
}) {
	const queryClient = useQueryClient();
	const progress = calculateProgress(solution.status);
	const canCancel = isTeacher && !['REVIEWED', 'ERROR'].includes(solution.status);

	const { data: pipelineInfo, isLoading: isLoadingInfo } = useQuery({
		queryKey: ['solutionInfo', solution.id],
		queryFn: () => getSolutionInfo(solution.id),
	});

	const restartMutation = useMutation({
		mutationFn: () => restartSolution(solution.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['solution', solution.id] });
			queryClient.invalidateQueries({ queryKey: ['solutionInfo', solution.id] });
			queryClient.invalidateQueries({ queryKey: ['solutionArtefact', solution.id] });
		},
	});

	const cancelMutation = useMutation({
		mutationFn: () => cancelSolution(solution.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['solution', solution.id] });
			queryClient.invalidateQueries({ queryKey: ['solutionInfo', solution.id] });
			queryClient.invalidateQueries({ queryKey: ['solutionArtefact', solution.id] });
		},
	});

	return (
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
									Автор
								</Text>
								<Tooltip label={solution.author?.fullname}>
									<Text size="sm" style={{ cursor: 'default' }}>
										{solution.author?.email ?? 'Unknown'}
									</Text>
								</Tooltip>
							</Stack>
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
									<Text component="a" href={solution.github_repo_link} target="_blank" size="sm">
										Открыть
									</Text>
								</Stack>
							)}
						</Group>
					</Stack>
				</Card>
			</SimpleGrid>

			<SimpleGrid cols={{ base: 1, sm: 2 }}>
				{solution.human_grade !== null && (
					<Card withBorder>
						<Stack gap="sm">
							<Group gap="xs">
								<IconStar size={18} color="gray" />
								<Text fw={500} size="sm">
									Результаты
								</Text>
							</Group>
							<Stack gap={0}>
								<Text size="xs" c="dimmed">
									Оценка
								</Text>
								<Text size="sm">{solution.human_grade}</Text>
							</Stack>
						</Stack>
					</Card>
				)}

				{(isTeacher || canCancel) && (
					<Card withBorder>
						<Stack gap="sm">
							<Group gap="xs">
								<IconPlayerPlay size={18} color="gray" />
								<Text fw={500} size="sm">
									Управление
								</Text>
							</Group>
							<Group gap="sm">
								{isTeacher && (
									<Button
										variant="light"
										onClick={() => restartMutation.mutate()}
										loading={restartMutation.isPending}
									>
										Перезапустить
									</Button>
								)}
								{canCancel && (
									<Button
										variant="light"
										color="red"
										onClick={() => cancelMutation.mutate()}
										loading={cancelMutation.isPending}
									>
										Отменить
									</Button>
								)}
							</Group>
						</Stack>
					</Card>
				)}

				{solution.status === 'REVIEWED' && (
					<SolutionWindRoseChart solutionId={solution.id} status={solution.status} />
				)}
			</SimpleGrid>

			{!isLoadingInfo && pipelineInfo?.pipeline_tasks && (
				<Card withBorder>
					<Stack gap="sm">
						<Text fw={500}>Прогресс выполнения</Text>
						<MermaidGantt key={pipelineInfo.solution_id} tasks={pipelineInfo.pipeline_tasks} />
					</Stack>
				</Card>
			)}
		</Stack>
	);
}

export function SolutionArtefactsTab({ solutionId }: { solutionId: number }) {
	const [openSteps, setOpenSteps] = useState<Set<string>>(new Set());
	const { data: pipelineInfo, isLoading } = useQuery({
		queryKey: ['solutionInfo', solutionId],
		queryFn: () => getSolutionInfo(solutionId),
	});

	const toggleStep = (step: string) => {
		setOpenSteps((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(step)) newSet.delete(step);
			else newSet.add(step);
			return newSet;
		});
	};

	if (isLoading) return <Loader size="sm" />;

	return (
		<Stack gap="sm" style={{ position: 'relative' }}>
			{pipelineInfo?.solution_steps.map((step) => (
				<ArtefactCollapse
					key={step}
					step={step}
					solutionId={solutionId}
					isOpen={openSteps.has(step)}
					onToggle={() => toggleStep(step)}
				/>
			))}
			<Button
				variant="filled"
				size="sm"
				style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			>
				<IconArrowUp size={16} />
			</Button>
		</Stack>
	);
}

export function SolutionCriteriaTab({
	solutionId,
	isTeacher,
}: {
	solutionId: number;
	isTeacher: boolean;
}) {
	return <CriteriaChecksPanel solutionId={solutionId} isTeacher={isTeacher} />;
}

export function SolutionFinalReviewTab({
	solution,
}: {
	solution: SolutionShortResponseDTO;
	isTeacher: boolean;
}) {
	const [humanGrade, setHumanGrade] = useState<number | string>(solution.human_grade ?? '');
	const [humanFeedback, setHumanFeedback] = useState(solution.human_feedback ?? '');
	const [finalReviewEdit, setFinalReviewEdit] = useState(false);
	const [scoreInfo, setScoreInfo] = useState<null | SolutionScoreDTO>(null);
	const queryClient = useQueryClient();

	const fetchScoreMutation = useMutation({
		mutationFn: () => getSolutionScore(solution.id),
		onSuccess: (data: SolutionScoreDTO) => {
			setHumanGrade(data.score);
			setScoreInfo(data);
		},
	});

	const finalReviewMutation = useMutation({
		mutationFn: () =>
			submitFinalReview(solution.id, {
				human_grade: Number(humanGrade),
				human_feedback: humanFeedback,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['solution', solution.id] });
		},
	});

	const generateFeedbackMutation = useMutation({
		mutationFn: () => generateAiFeedback(solution.id),
		onSuccess: (data: string) => {
			setHumanFeedback(data);
		},
	});

	if (solution.status === 'HUMAN_REVIEW' || finalReviewEdit) {
		return (
			<Stack gap="md">
				<Group align="flex-end" gap="md">
					<NumberInput
						label="Оценка"
						placeholder="Введите оценку (0-100)"
						value={humanGrade}
						onChange={setHumanGrade}
						min={0}
						max={100}
						required
						style={{ flex: 1 }}
					/>
					<Button
						variant="light"
						onClick={() => fetchScoreMutation.mutate()}
						loading={fetchScoreMutation.isPending}
						leftSection={<IconSparkles size={16} />}
					>
						Рассчитать
					</Button>
				</Group>

				{scoreInfo && (
					<Text size="sm" c="dimmed">
						Вычислена на основе {scoreInfo.total_criteria} критериев, из которых пройдено{' '}
						{scoreInfo.passed_criteria}
					</Text>
				)}

				<SimpleGrid cols={{ base: 1, xs: 1, sm: 2, md: 2 }} spacing="md">
					<Stack gap={'xs'}>
						<Textarea
							label="Обратная связь"
							placeholder="Комментарий для студента (необязательно)"
							value={humanFeedback}
							onChange={(e) => setHumanFeedback(e.currentTarget.value)}
							autosize
							minRows={6}
							maxRows={12}
						/>
						<Group>
							<Button
								variant="light"
								onClick={() => generateFeedbackMutation.mutate()}
								loading={generateFeedbackMutation.isPending}
								leftSection={<IconSparkles size={16} />}
							>
								Сгенерировать
							</Button>
						</Group>
					</Stack>
					<Box mt={'22px'}>
						{humanFeedback ? (
							<div>
								<MarkdownRenderer content={humanFeedback} />
							</div>
						) : (
							<Text size="sm" c="dimmed">
								Предпросмотр обратной связи появится здесь
							</Text>
						)}
					</Box>
				</SimpleGrid>

				<Group mt="lg">
					<Button
						onClick={() => finalReviewMutation.mutate()}
						loading={finalReviewMutation.isPending}
						disabled={!humanGrade}
					>
						Сохранить вердикт
					</Button>
					{finalReviewEdit && (
						<Button variant="outline" color="gray" onClick={() => setFinalReviewEdit(false)}>
							Отмена
						</Button>
					)}
				</Group>
			</Stack>
		);
	}

	if (solution.status === 'REVIEWED') {
		return (
			<Stack gap="md">
				{solution.human_grade !== null && (
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
				)}
				{solution.human_feedback && (
					<Card withBorder>
						<Stack gap="0">
							<Text fw={500} size="sm">
								Обратная связь
							</Text>
							<div>
								<MarkdownRenderer content={solution.human_feedback} />
							</div>
						</Stack>
					</Card>
				)}
				<Group>
					<Button onClick={() => setFinalReviewEdit(true)}>Изменить</Button>
				</Group>
			</Stack>
		);
	}

	return (
		<Alert color="gray">
			Форма будет доступна, когда решение перейдёт в статус «Ожидает вердикта преподавателя»
		</Alert>
	);
}

interface ArtefactCollapseProps {
	step: PipelineStepEnum;
	solutionId: number;
	isOpen: boolean;
	onToggle: () => void;
}

function ArtefactCollapse({ step, solutionId, isOpen, onToggle }: ArtefactCollapseProps) {
	const {
		data: content,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['solutionArtefact', solutionId, step],
		queryFn: () => getSolutionArtefact(solutionId, step),
		enabled: isOpen,
	});

	return (
		<div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
			<Button
				variant="subtle"
				fullWidth
				justify="space-between"
				rightSection={isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
				onClick={onToggle}
				style={{ borderRadius: 8 }}
			>
				{stepLabels[step]}
			</Button>
			{isOpen && (
				<div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
					{isLoading ? (
						<Loader size="sm" />
					) : content ? (
						step === 'prepare_project_tree' || step === 'prepare_project_content' ? (
							<Text style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{content}</Text>
						) : (
							<MarkdownRenderer content={content} />
						)
					) : isError && error ? (
						<Alert color="red">
							{(error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
								'Ошибка'}
						</Alert>
					) : null}
				</div>
			)}
		</div>
	);
}
