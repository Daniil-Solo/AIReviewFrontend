import { Title, Text, Button, Stack, Container, Box, SimpleGrid } from '@mantine/core'

export function Landing() {
  return (
    <Box>
      <Container size="xl" py={{ base: 40, md: 80 }} px={{ base: 'sm', md: 'md' }}>
        <Stack gap={60} align="center">
          <Stack gap={24} align="center" maw={700}>
            <Title order={1} ta="center" fw={800} fz={{ base: 28, sm: 32, md: 48 }} style={{ background: 'linear-gradient(45deg, #228BE6, #37B9F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Review Platform — автоматическая проверка студенческих проектов
            </Title>
            <Text ta="center" c="dimmed" fz={{ base: 'md', md: 'xl' }}>
              Платформа для автоматического ревью студенческих проектов. 
              Используйте LLM для генерации документации и проверки критериев заданий.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" w="100%">
              <Button size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 45 }} w="100%">
                Начать работу
              </Button>
              <Button size="lg" variant="outline" w="100%">
                Смотреть демо
              </Button>
            </SimpleGrid>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
