import { Container, Anchor, Text, Stack, Box, SimpleGrid } from '@mantine/core';
import styles from './Footer.module.css';

const navigation = [
	{ label: 'Возможности', href: '#features' },
	{ label: 'Как это работает', href: '#how-it-works' },
	{ label: 'Для кого', href: '#for-whom' },
	{ label: 'Тарифы', href: '#pricing' },
];

const legal = [
	{ label: 'Политика конфиденциальности', href: '/privacy' },
	{ label: 'Условия использования', href: '/terms' },
];

export function Footer() {
	return (
		<Box component="footer" className={styles.footer}>
			<Container size="lg" py="xl">
				<SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xl">
					<Stack gap="xs">
						<Text fw={700} size="lg">
							AI Review
						</Text>
						<Text size="sm" c="dimmed">
							Автоматическая проверка студенческих проектов с помощью ИИ
						</Text>
					</Stack>

					<Stack gap="xs" align="flex-start">
						<Text fw={600} size="sm">
							Навигация
						</Text>
						{navigation.map((link, index) => (
							<Anchor key={index} href={link.href} size="sm" c="dimmed" underline="hover">
								{link.label}
							</Anchor>
						))}
					</Stack>

					<Stack gap="xs" align="flex-start">
						<Text fw={600} size="sm">
							Правовая информация
						</Text>
						{legal.map((link, index) => (
							<Anchor key={index} href={link.href} size="sm" c="dimmed" underline="hover">
								{link.label}
							</Anchor>
						))}
					</Stack>

					<Stack gap="xs" align="flex-start">
						<Text fw={600} size="sm">
							Контакты
						</Text>
						<Anchor href="https://t.me" size="sm" c="dimmed" underline="hover">
							<Text>Автор в Telegram</Text>
						</Anchor>
					</Stack>
				</SimpleGrid>

				<Text size="xs" c="dimmed" ta="center" mt="xl">
					© {new Date().getFullYear()} AI Review Platform. Все права защищены.
				</Text>
			</Container>
		</Box>
	);
}
