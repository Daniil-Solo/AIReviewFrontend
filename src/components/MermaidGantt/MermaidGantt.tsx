import { Box, Table, Text } from '@mantine/core';
import styles from './MermaidGantt.module.css';
import type { PipelineTaskDTO } from '../../types';
import { stepProcessLabels } from '../../features/solutions/constants';
import { formatDate } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MermaidGanttProps {
	tasks: PipelineTaskDTO[];
}

export function MermaidGantt({ tasks }: MermaidGanttProps) {
	return (
		<Box className={styles.container}>
			{tasks.length > 0 ? (
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Шаг</Table.Th>
							<Table.Th>Описание</Table.Th>
							<Table.Th>Статус</Table.Th>
							<Table.Th>Запущен</Table.Th>
							<Table.Th>Время, с</Table.Th>
							<Table.Th></Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{tasks.map((task) => (
							<Table.Tr key={task.id}>
								<Table.Td>{task.step}</Table.Td>
								<Table.Td>{stepProcessLabels[task.step]}</Table.Td>
								<Table.Td>{task.status}</Table.Td>
								<Table.Td>
									{task.ran_at === null
										? 'Нет'
										: formatDate(task.ran_at, 'yyyy-MM-dd hh:mm:ss', {
												locale: ru,
											})}
								</Table.Td>
								<Table.Td>{task.duration === null ? 'Нет' : task.duration.toFixed(1)}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			) : (
				<Text c="dimmed">Нет информации о прогрессе</Text>
			)}
		</Box>
	);
}
