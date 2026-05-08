import { Container, Title, Text, Card, Stack, Box, ThemeIcon, Flex } from '@mantine/core';
import { IconSchool, IconUser, IconBuilding } from '@tabler/icons-react';
import styles from './TargetAudience.module.css';

const cards = [
	{
		icon: IconSchool,
		title: 'Преподаватели курсов',
		points: [
			'Экономьте время на проверке',
			'Сосредоточьтесь на творческих аспектах обучения',
			'Получайте детальные отчёты по каждому студенту',
		],
		color: 'blue',
	},
	{
		icon: IconUser,
		title: 'Студенты',
		points: [
			'Получайте обратную связь за минуты, а не дни',
			'Улучшайте код с помощью полезных рекомендаций',
		],
		color: 'teal',
	},
	{
		icon: IconBuilding,
		title: 'Руководители платформ',
		points: [
			'Масштабируйте проверку на сотни студентов',
			'Снижайте нагрузку на преподавателей',
			'Повышайте объективность оценок через критериальную проверку',
		],
		color: 'grape',
	},
];

export function TargetAudience() {
	return (
		<Box py={{ base: 60, md: 100 }} className={styles.section} id="for-whom">
			<Container size="lg">
				<Title order={2} ta="center" mb={16} fw={700} fz={{ base: 28, md: 36 }}>
					Для кого эта платформа
				</Title>

				<Box className={styles.cardsGrid}>
					{cards.map((card, index) => (
						<Card key={index} className={styles.audienceCard} radius="md">
							<Flex align={'center'} justify={'center'}>
								<ThemeIcon size={48} radius="xl" variant="light" color={card.color} mb="md">
									<card.icon size={24} />
								</ThemeIcon>
							</Flex>
							<Text fw={700} size="lg" mb="md" ta={'center'}>
								{card.title}
							</Text>
							<Stack gap="sm">
								{card.points.map((point, idx) => (
									<Text key={idx} size="md" c="dimmed" lh={1.5}>
										• {point}
									</Text>
								))}
							</Stack>
						</Card>
					))}
				</Box>
			</Container>
		</Box>
	);
}
