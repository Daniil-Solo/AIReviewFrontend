import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	Stack,
	Title,
	Text,
	Button,
	Group,
	Select,
	TextInput,
	FileInput,
	Alert,
	Loader,
	Center,
	Card,
	Container,
} from '@mantine/core';
import { IconUpload, IconLink, IconSend, IconGitBranch } from '@tabler/icons-react';
import { createSolution } from '../../api/endpoints/solutions';
import { getTask } from '../../api/endpoints/tasks';
import type { ErrorResponseDTO } from '../../types';

export function SolutionCreatePage() {
	const { workspaceId, taskId } = useParams<{
		workspaceId: string;
		taskId: string;
	}>();
	const wsId = Number(workspaceId);
	const tId = Number(taskId);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [format, setFormat] = useState<string | null>(null);
	const [githubRepoLink, setGithubRepoLink] = useState('');
	const [githubRepoBranch, setGithubRepoBranch] = useState('');
	const [file, setFile] = useState<File | null>(null);

	const { data: task, isLoading: taskLoading } = useQuery({
		queryKey: ['task', tId],
		queryFn: () => getTask(tId),
		retry: false,
	});

	const createMutation = useMutation({
		mutationFn: () =>
			createSolution({
				task_id: tId,
				format: format as 'ZIP' | 'GITHUB',
				github_repo_link: format === 'GITHUB' ? githubRepoLink : undefined,
				github_repo_branch: format === 'GITHUB' ? githubRepoBranch : undefined,
				file: format === 'ZIP' ? (file ?? undefined) : undefined,
			}),
		onSuccess: (solution) => {
			queryClient.invalidateQueries({ queryKey: ['mySolutions', tId] });
			navigate(`/workspaces/${wsId}/tasks/${tId}/solutions/${solution.id}`);
		},
	});

	const handleSubmit = () => {
		if (!format) return;
		createMutation.mutate();
	};

	const isValid = () => {
		if (!format) return false;
		if (format === 'GITHUB' && (!githubRepoLink.trim() || !githubRepoBranch.trim())) return false;
		if (format === 'ZIP' && !file) return false;
		return true;
	};

	if (taskLoading) {
		return (
			<Center h={400}>
				<Loader size="lg" />
			</Center>
		);
	}

	return (
		<Container size="sm">
			<Stack gap="lg">
				<Group justify="space-between">
					<div>
						<Title order={2}>Отправить решение</Title>
						{task && (
							<Text c="dimmed" size="sm">
								Задача: {task.name}
							</Text>
						)}
					</div>
					<Button component={Link} to={`/workspaces/${wsId}/tasks/${tId}`} variant="subtle">
						Назад к задаче
					</Button>
				</Group>

				<Card withBorder padding="md">
					<Stack gap="md">
						<Select
							label="Формат решения"
							placeholder="Выберите формат"
							data={[
								{ value: 'ZIP', label: 'ZIP-архив' },
								{ value: 'GITHUB', label: 'Ссылка на GitHub' },
							]}
							value={format}
							onChange={(v) => {
								setFormat(v);
								setGithubRepoLink('');
								setGithubRepoBranch('');
								setFile(null);
							}}
							required
						/>

						{format === 'GITHUB' && (
							<>
								<TextInput
									label="Ссылка на репозиторий"
									placeholder="https://github.com/username/repo"
									value={githubRepoLink}
									onChange={(e) => setGithubRepoLink(e.target.value)}
									leftSection={<IconLink size={16} />}
									required
								/>
								<TextInput
									label="Ветка"
									placeholder="main"
									value={githubRepoBranch}
									onChange={(e) => setGithubRepoBranch(e.target.value)}
									leftSection={<IconGitBranch size={16} />}
									required
								/>
							</>
						)}

						{format === 'ZIP' && (
							<FileInput
								label="Файл с решением"
								placeholder="Загрузите ZIP-архив"
								leftSection={<IconUpload size={16} />}
								accept=".zip"
								value={file}
								onChange={setFile}
								required
							/>
						)}

						{createMutation.error && (
							<Alert color="red">
								{((createMutation.error as any).response?.data as ErrorResponseDTO)?.message ||
									((createMutation.error as any).data as ErrorResponseDTO)?.message ||
									'Ошибка при отправке решения'}
							</Alert>
						)}

						<Button
							leftSection={<IconSend size={16} />}
							onClick={handleSubmit}
							disabled={!isValid()}
							loading={createMutation.isPending}
						>
							Отправить решение
						</Button>
					</Stack>
				</Card>
			</Stack>
		</Container>
	);
}
