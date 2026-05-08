import { Container, Title, Text, Card, Box, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconQuote, IconUsers, IconClock, IconSchool } from '@tabler/icons-react';
import styles from './SocialProof.module.css';

export function SocialProof() {
	return (
		<Box py={{ base: 60, md: 100 }} className={styles.section}>
			<Container size="lg">
				<Title order={2} ta="center" mb={8} fw={700} fz={{ base: 28, md: 36 }}>
					Результаты апробации
				</Title>
				<Text ta="center" c="dimmed" mb="xl" size="lg">
					Курс «Разработка AI/LLM-приложений на Python: от идеи до релиза»
				</Text>

				<Card className={styles.proofCard} padding="xl" radius="lg">
					<SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
						<Box>
							<ThemeIcon size={40} radius="xl" variant="light" color="blue" mb="md">
								<IconQuote size={20} />
							</ThemeIcon>
							<Text fz="lg" fw={500} lh={1.6} mb="md">
								Платформа прошла апробацию в рамках реального учебного процесса. Студенты загружали
								свои проекты в виде ссылок на GitHub, валидировали ProjectDoc и получали детальную
								проверку
							</Text>
							<Text fz="lg" fw={500} lh={1.6}>
								Преподаватель смог сократить время на проверку работ на 80%, сосредоточившись на
								оттачивании критериев проверки.
							</Text>
						</Box>
					</SimpleGrid>
				</Card>

				<SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt={48}>
					<Box className={styles.statCard}>
						<ThemeIcon size={48} radius="xl" variant="light" color="blue" mb="sm">
							<IconUsers size={24} />
						</ThemeIcon>
						<Text fw={800} fz={40} c="blue.5">
							50+
						</Text>
						<Text size="md" c="dimmed">
							студентов прошли проверку
						</Text>
					</Box>
					<Box className={styles.statCard}>
						<ThemeIcon size={48} radius="xl" variant="light" color="teal" mb="sm">
							<IconClock size={24} />
						</ThemeIcon>
						<Text fw={800} fz={40} c="teal.5">
							80%
						</Text>
						<Text size="md" c="dimmed">
							экономия времени преподавателей
						</Text>
					</Box>
					<Box className={styles.statCard}>
						<ThemeIcon size={48} radius="xl" variant="light" color="grape" mb="sm">
							<IconSchool size={24} />
						</ThemeIcon>
						<Text fw={800} fz={40} c="grape.5">
							1-5
						</Text>
						<Text size="md" c="dimmed">
							минут на полный анализ проекта
						</Text>
					</Box>
				</SimpleGrid>
			</Container>
		</Box>
	);
}
