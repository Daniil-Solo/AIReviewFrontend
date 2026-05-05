import { useQuery } from '@tanstack/react-query';
import { Stack, Text, Card } from '@mantine/core';
import { RadarChart } from '@mantine/charts';
import { getSolutionWindRose } from '../../api/endpoints/solutions';

interface SolutionWindRoseChartProps {
	solutionId: number;
	status: string;
}

export function SolutionWindRoseChart({ solutionId, status }: SolutionWindRoseChartProps) {
	const { data: windRoseData } = useQuery({
		queryKey: ['solutionWindRose', solutionId],
		queryFn: () => getSolutionWindRose(solutionId),
		enabled: status === 'REVIEWED',
	});

	if (status !== 'REVIEWED' || !windRoseData || windRoseData.length === 0) {
		return null;
	}

	return (
		<Card withBorder>
			<Stack gap="sm">
				<Text fw={500}>Оценка компетенций</Text>
				<RadarChart
					h={300}
					data={windRoseData
						.filter((point) => point.count > 1)
						.map((point) => ({
							subject: point.tag,
							value: point.value,
							fullMark: 1,
						}))}
					dataKey="subject"
					withPolarRadiusAxis
					polarRadiusAxisProps={{ domain: [0, 120], ticks: [20, 40, 60, 80, 100] }}
					series={[{ name: 'value', color: 'blue.6' }]}
					withTooltip
					withDots
				/>
			</Stack>
		</Card>
	);
}
