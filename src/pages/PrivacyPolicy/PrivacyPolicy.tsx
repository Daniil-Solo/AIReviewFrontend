import { Container, Title, Text, Stack } from '@mantine/core';

export function PrivacyPolicy() {
	return (
		<Container size="lg" py={80}>
			<Stack gap="lg">
				<Title order={1}>Политика конфиденциальности</Title>
				<Text c="dimmed">Здесь будет текст политики конфиденциальности.</Text>
			</Stack>
		</Container>
	);
}
