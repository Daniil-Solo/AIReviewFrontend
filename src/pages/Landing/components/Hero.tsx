import { Title, Text, Button, Group, Container, Box, Stack } from '@mantine/core'
import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <Box py={{ base: 60, md: 120 }} className={styles.hero}>
      <Container size="lg">
        <Stack gap={48} align="center">
          <Stack gap={24} align="center" maw={700}>
            <Title 
              order={1} 
              ta="center" 
              fw={800} 
              fz={{ base: 32, sm: 40, md: 52 }} 
              lh={1.2}
            >
              Автоматическая проверка{' '}
              <Text 
                component="span" 
                inherit 
                variant="gradient"
                gradient={{ from: 'blue.5', to: 'cyan.5', deg: 45 }}
              >
                студенческих проектов
              </Text>{' '}
              с помощью ИИ
            </Title>
            <Text ta="center" c="dimmed" fz={{ base: 'lg', md: 'xl' }} maw={600}>
              Экономьте часы преподавателей. Давайте студентам мгновенную обратную связь.
            </Text>
            <Group gap="md" mt="md">
              <Button 
                size="xl" 
                variant="gradient" 
                gradient={{ from: 'blue.5', to: 'cyan.5', deg: 45 }}
                rightSection={<IconArrowRight size={20} />}
                component="a"
                href="/register"
              >
                Начать бесплатно
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                color="gray"
                leftSection={<IconPlayerPlay size={20} />}
              >
                Смотреть демо
              </Button>
            </Group>
          </Stack>

          <Box className={styles.pipeline}>
            <Box className={styles.pipelineStep}>
              <Box className={styles.codeIcon}>{}</Box>
              <Text fw={600} size="sm">Код</Text>
            </Box>
            <Box className={styles.arrow}>
              <IconArrowRight size={24} />
            </Box>
            <Box className={styles.pipelineSystem}>
              <Box className={styles.systemIcon}>⚡</Box>
              <Text fw={600} size="sm">AI System</Text>
              <Box className={styles.pulse} />
            </Box>
            <Box className={styles.arrow}>
              <IconArrowRight size={24} />
            </Box>
            <Box className={styles.pipelineResult}>
              <Box className={styles.resultIcon}>✓</Box>
              <Text fw={600} size="sm">Оценка</Text>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}