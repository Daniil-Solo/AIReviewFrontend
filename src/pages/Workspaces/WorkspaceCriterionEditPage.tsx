import { useState, useEffect } from 'react';
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
  Loader,
  Center,
} from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { getCriterion, updateCriterion, getAvailableTags } from '../../api/endpoints/criteria';
import type { CriterionStage, CriterionUpdateDTO, ErrorResponseDTO } from '../../types';

const stageOptions = [
  { value: '', label: 'Автопроверка' },
  { value: 'PROJECT_DOC', label: 'Проверка по ProjectDoc' },
  { value: 'CODEBASE', label: 'Проверка по кодовой базе' },
  { value: 'MANUAL', label: 'Ручная проверка' },
];

export function WorkspaceCriterionEditPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { workspaceId, criterionId } = useParams<{ workspaceId: string; criterionId: string }>();
  const wsId = Number(workspaceId);
  const critId = Number(criterionId);

  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
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

  const { data: criterion, isLoading, error } = useQuery({
    queryKey: ['criterion', critId],
    queryFn: () => getCriterion(critId),
    enabled: !!critId,
  });

  useEffect(() => {
    if (criterion) {
      setDescription(criterion.description);
      setTags(criterion.tags);
      setSelectedStage(criterion.stage);
    }
  }, [criterion]);

  const mutation = useMutation({
    mutationFn: (data: CriterionUpdateDTO) =>
      updateCriterion(critId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceCriteria', wsId] });
      queryClient.invalidateQueries({ queryKey: ['criteria'] });
      queryClient.invalidateQueries({ queryKey: ['criteriaTags'] });
      queryClient.invalidateQueries({ queryKey: ['availableTags'] });
      queryClient.invalidateQueries({ queryKey: ['criterion', critId] });
      navigate(`/workspaces/${wsId}/criteria/${critId}`);
    },
    onError: (err) => {
      const data = (err as { response?: { data: ErrorResponseDTO } }).response?.data;
      setGeneralError(data?.message || 'Ошибка обновления');
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
      workspace_id: wsId,
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
          <Group>
            <Button type="submit" loading={mutation.isPending}>
              Сохранить
            </Button>
            <Button variant="subtle" onClick={() => navigate(`/workspaces/${wsId}/criteria/${critId}`)}>
              Отмена
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}