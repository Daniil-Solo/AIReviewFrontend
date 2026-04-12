import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Title,
  Text,
  Badge,
  Group,
  Button,
  Loader,
  Center,
  Alert,
  Menu,
  Divider,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
  IconAlertCircle,
  IconEdit,
  IconTrash,
  IconDotsVertical,
} from '@tabler/icons-react';
import { getCriterion, deleteCriterion } from '../../api/endpoints/criteria';
import { getCriterionAccessLabel, stageLabels } from '../../features/criteria/constants';
import type { ErrorResponseDTO } from '../../types';


export function CriteriaDetailPage() {
  const navigate = useNavigate();
  const { criterionId } = useParams<{ criterionId: string }>();
  const id = Number(criterionId);
  const queryClient = useQueryClient();
  const modals = useModals();

  const { data: criterion, isLoading, error } = useQuery({
    queryKey: ['criterion', id],
    queryFn: () => getCriterion(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCriterion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criteria'] });
      navigate('/criteria');
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      console.error(e.response?.data?.message || 'Не удалось удалить критерий');
    },
  });

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Вы действительно хотите удалить критерий?',
      labels: { cancel: 'Отмена', confirm: 'Удалить' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(id),
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
        {(error.response.data as ErrorResponseDTO).message}
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Критерий</Title>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="subtle" p={8}>
              <IconDotsVertical size={18} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => navigate(`/criteria/${id}/edit`)}
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

      <Stack gap="lg">
        <Stack gap={0}>
          <Text size="sm" c="dimmed">
            Доступ
          </Text>
          <Text size="sm">
            {getCriterionAccessLabel(criterion.is_public)}
          </Text>
        </Stack>
        
        <Stack gap={0}>
          <Text size="sm" c="dimmed">
            Стадия проверки
          </Text>
          <Text size="sm">
            {stageLabels[criterion.stage]}
          </Text>
        </Stack>

        <Stack gap={"xs"}>
          <Text size="sm" c="dimmed">
            Теги
          </Text>
          {criterion.tags.length > 0 && (
            <Group gap="xs">
              {criterion.tags.map((tag) => (
                <Badge key={tag} variant="outline" color='gray'>
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>
        
        <Stack gap={0}>
          <Text size="sm" c="dimmed">
            Описание
          </Text>
          <Text size="sm" mb="md" style={{ whiteSpace: 'pre-wrap' }}>
            {criterion.description}
          </Text>
        </Stack>
        
         
      </Stack>
    </Stack>
  );
}