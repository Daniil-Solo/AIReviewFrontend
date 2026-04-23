import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import {
	Title,
	Stack,
	Group,
	Loader,
	Center,
	Table,
	Text,
	Badge,
	MultiSelect,
	Button,
	TextInput,
} from '@mantine/core';
import { IconCalendar, IconPlus } from '@tabler/icons-react';
import { getTransactions, type GetTransactionsParams } from '../../api/endpoints/transactions';
import type { TransactionTypeEnum } from '../../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const transactionTypeLabels: Record<TransactionTypeEnum, string> = {
	WELCOME_BONUS: 'Бонус за регистрацию',
	ADMIN_TOP_UP: 'Пополнение админом',
	LLM_CALL: 'Вызов LLM',
};

const formatDateTime = (dateString: string): string => {
	return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: ru });
};

const TRANSACTION_TYPES: { value: TransactionTypeEnum; label: string }[] = [
	{ value: 'WELCOME_BONUS', label: 'Бонус за регистрацию' },
	{ value: 'ADMIN_TOP_UP', label: 'Пополнение админом' },
	{ value: 'LLM_CALL', label: 'Вызов LLM' },
];

const renderMetadataAsBadges = (metadata: Record<string, unknown> | null) => {
	if (!metadata || Object.keys(metadata).length === 0) {
		return <Text c="dimmed">Нет метаданных</Text>;
	}
	return (
		<Group gap="xs">
			{Object.entries(metadata).map(([key, value]) => (
				<Badge key={key} color="gray" variant="outline" size="sm">
					{key}={String(value)}
				</Badge>
			))}
		</Group>
	);
};

export function TransactionsPage() {
	const modals = useModals();
	const [startedAt, setStartedAt] = useState<string>('');
	const [endedAt, setEndedAt] = useState<string>('');
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

	const [debouncedStartedAt] = useDebouncedValue(startedAt, 300);
	const [debouncedEndedAt] = useDebouncedValue(endedAt, 300);
	const [debouncedSelectedTypes] = useDebouncedValue(selectedTypes, 300);

	const params: GetTransactionsParams = {
		started_at: debouncedStartedAt,
		ended_at: debouncedEndedAt,
		types: debouncedSelectedTypes as TransactionTypeEnum[],
	};

	const { data: transactions = [], isLoading } = useQuery({
		queryKey: ['transactions', debouncedStartedAt, debouncedEndedAt, debouncedSelectedTypes],
		queryFn: () => getTransactions(params),
	});

	const clearFilters = () => {
		setStartedAt('');
		setEndedAt('');
		setSelectedTypes([]);
	};

	const handleTopUp = () => {
		modals.openConfirmModal({
			title: 'Пополнение баланса',
			children: (
				<Text size="sm">
					Пополнение баланса сейчас в разработке. Вы можете обратиться к администратору платформы
					для ручного пополнения.
				</Text>
			),
			labels: { cancel: 'Отмена', confirm: 'ОК' },
			cancelProps: { display: 'none' },
		});
	};

	const hasFilters = startedAt || endedAt || selectedTypes.length > 0;

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
				<Title order={2}>Транзакции</Title>
				<Button leftSection={<IconPlus size={16} />} onClick={handleTopUp}>
					Пополнить
				</Button>
			</Group>

			<Group align="flex-end" justify="space-between" w="100%">
				<TextInput
					type="date"
					label="Начало периода"
					placeholder="Выберите дату"
					value={startedAt}
					onChange={(e) => setStartedAt(e.target.value)}
					leftSection={<IconCalendar size={16} />}
				/>
				<TextInput
					type="date"
					label="Конец периода"
					placeholder="Выберите дату"
					value={endedAt}
					onChange={(e) => setEndedAt(e.target.value)}
					leftSection={<IconCalendar size={16} />}
				/>
				<MultiSelect
					label="Тип транзакции"
					placeholder="Выберите типы"
					data={TRANSACTION_TYPES}
					value={selectedTypes}
					onChange={setSelectedTypes}
					style={{ flex: 1, minWidth: 250 }}
				/>
				<Button variant="subtle" onClick={clearFilters} disabled={!hasFilters}>
					Очистить
				</Button>
			</Group>

			<Table striped highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>ID</Table.Th>
						<Table.Th>Тип</Table.Th>
						<Table.Th miw={'120px'}>Сумма</Table.Th>
						<Table.Th>Метаданные</Table.Th>
						<Table.Th>Дата</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{transactions.length === 0 ? (
						<Table.Tr>
							<Table.Td colSpan={4}>
								<Text c="dimmed" ta="center">
									Транзакции не найдены
								</Text>
							</Table.Td>
						</Table.Tr>
					) : (
						transactions.map((tx) => (
							<Table.Tr key={tx.id}>
								<Table.Td>{tx.id}</Table.Td>
								<Table.Td>
									<Badge color="gray" variant="outline">
										{transactionTypeLabels[tx.type]}
									</Badge>
								</Table.Td>
								<Table.Td>
									<Text c={tx.amount < 0 ? 'dark' : undefined}>
										{tx.amount > 0 ? '+' : ''}
										{tx.amount.toFixed(1)} ₽
									</Text>
								</Table.Td>
								<Table.Td>{renderMetadataAsBadges(tx.metadata)}</Table.Td>
								<Table.Td>{formatDateTime(tx.created_at)}</Table.Td>
							</Table.Tr>
						))
					)}
				</Table.Tbody>
			</Table>
		</Stack>
	);
}
