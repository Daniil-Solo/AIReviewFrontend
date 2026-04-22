import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Title,
  Button,
  Loader,
  Center,
  Alert,
  Group,
  Menu,
  Divider,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconAlertCircle, IconArrowLeft, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { getWorkspaceCriteria } from '../../api/endpoints/workspaces';
import { deleteCriterion } from '../../api/endpoints/criteria';
import { CriterionDetail } from '../../components/CriterionDetail/CriterionDetail';
import type { ErrorResponseDTO } from '../../types';

export function WorkspaceCriterionDetailPage() {
  const navigate = useNavigate();
  const modals = useModals();
  const queryClient = useQueryClient();
  const { workspaceId, criterionId } = useParams<{ workspaceId: string; criterionId: string }>();
  const wsId = Number(workspaceId);
  const critId = Number(criterionId);

  const { data: criteria = [], isLoading, error } = useQuery({
    queryKey: ['workspaceCriteria', wsId],
    queryFn: () => getWorkspaceCriteria(wsId),
    enabled: !!wsId,
  });

  const criterion = criteria.find((c) => c.id === critId);

  const deleteMutation = useMutation({
    mutationFn: () => deleteCriterion(critId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceCriteria', wsId] });
      navigate(`/workspaces/${wsId}`);
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
        {(error as { response?: { data: ErrorResponseDTO } })?.response?.data?.message || 'Критерий не найден'}
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(`/workspaces/${wsId}`)}
        >
          Назад к пространству
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
              onClick={() => navigate(`/workspaces/${wsId}/criteria/${critId}/edit`)}
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