import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack, Title, Button, Loader, Center, Alert, Group, Menu, Divider } from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
	IconAlertCircle,
	IconArrowLeft,
	IconDotsVertical,
	IconEdit,
	IconTrash,
} from '@tabler/icons-react';
import { getTaskCriteria } from '../../api/endpoints/tasks';
import { deleteCriterion } from '../../api/endpoints/criteria';
import { CriterionDetail } from '../../components/CriterionDetail/CriterionDetail';
import type { ErrorResponseDTO } from '../../types';

export function TaskCriterionDetailPage() {
	const navigate = useNavigate();
	const modals = useModals();
	const queryClient = useQueryClient();
	const { workspaceId, taskId, criterionId } = useParams<{
		workspaceId: string;
		taskId: string;
		criterionId: string;
	}>();
	const wsId = Number(workspaceId);
	const tId = Number(taskId);
	const critId = Number(criterionId);

	const {
		data: taskCriteria = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ['taskCriteria', tId],
		queryFn: () => getTaskCriteria(tId),
		enabled: !!tId,
	});

	const taskCriterion = taskCriteria.find((tc) => tc.criterion.id === critId);
	const criterion = taskCriterion?.criterion;

	const deleteMutation = useMutation({
		mutationFn: () => deleteCriterion(critId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['taskCriteria', tId] });
			navigate(`/workspaces/${wsId}/tasks/${tId}`);
		},
		onError: (err: unknown) => {
			const e = err as { response?: { data?: { message?: string } } };
			console.error(e.response?.data?.message || 'Не удалось удалить критерий');
		},
	});

	const handleDelete = () => {
		modals.openConfirmModal({
			title: 'Удалить критерий?',
			labels: { cancel: 'Отмена', confirm: 'Удалить' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteMutation.mutate(),
		});
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (isLoading) {
		return (
			<Center h={400}>
				<Loader size="lg" />
			</Center>
		);
	}

	if (error || !criterion) {
		return (
			<Alert color="red" icon={<IconAlertCircle size={16} />}>
				{(error as { response?: { data: ErrorResponseDTO } })?.response?.data?.message ||
					'Критерий не найден'}
			</Alert>
		);
	}

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Button
					variant="subtle"
					leftSection={<IconArrowLeft size={16} />}
					onClick={() => navigate(`/workspaces/${wsId}/tasks/${tId}?tab=criteria`)}
				>
					Назад к задаче
				</Button>
				<Menu shadow="md" width={200}>
					<Menu.Target>
						<Button variant="subtle" p={8}>
							<IconDotsVertical size={18} />
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item
							leftSection={<IconEdit size={14} />}
							onClick={() => navigate(`/workspaces/${wsId}/tasks/${tId}/criteria/${critId}/edit`)}
						>
							Редактировать
						</Menu.Item>
						<Divider />
						<Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={handleDelete}>
							Удалить
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>

			<Title order={2}>Критерий</Title>

			<CriterionDetail criterion={criterion} />
		</Stack>
	);
}
