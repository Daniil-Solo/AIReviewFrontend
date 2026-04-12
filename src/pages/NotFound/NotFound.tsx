import { Container, Title, Text, Button, Center, Stack } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Container size="sm" py={80}>
      <Center>
        <Stack align="center" gap="md">
          <Title order={1} size={120} fw={700} c="gray.2">
            404
          </Title>
          <Title order={2} ta="center">
            Страница не найдена
          </Title>
          <Text c="dimmed" ta="center" maw={400}>
            Извините, запрашиваемая страница не существует или была перемещена.
          </Text>
          <Button
            leftSection={<IconHome size={18} />}
            variant="light"
            mt="md"
            onClick={() => navigate('/')}
          >
            На главную
          </Button>
        </Stack>
      </Center>
    </Container>
  );
}