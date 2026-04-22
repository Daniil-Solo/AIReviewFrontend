import { Container, Title, Text, Stack } from '@mantine/core';

export function TermsOfUse() {
  return (
    <Container size="lg" py={80}>
      <Stack gap="lg">
        <Title order={1}>Условия использования</Title>
        <Text c="dimmed">Здесь будет текст условий использования.</Text>
      </Stack>
    </Container>
  );
}