import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
} from '@mantine/core';
import { IconPlus, IconSearch, IconAlertCircle, IconX } from '@tabler/icons-react';
import { getCriteria, getAvailableTags } from '../../api/endpoints/criteria';
import { CriterionCard } from '../../components/CriterionCard/CriterionCard';
import { getUserData } from '../../lib/jwt';

export function CriteriaListPage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [debouncedSearch] = useDebouncedValue(search, 500);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [debouncedSelectedTags] = useDebouncedValue(selectedTags, 300);
	const [error, setError] = useState('');
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
					<Button component={Link} to="/criteria/new" leftSection={<IconPlus size={16} />}>
						Создать критерий
					</Button>
				)}
			</Group>

			{error && (
				<Alert
					color="red"
					icon={<IconAlertCircle size={16} />}
					onClose={() => setError('')}
					withCloseButton
				>
					{error}
				</Alert>
			)}

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
		</Stack>
	);
}
