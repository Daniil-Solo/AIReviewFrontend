import { Container, Title, Text, SimpleGrid, ThemeIcon, Box } from '@mantine/core'
import { IconUserPlus, IconUpload, IconBrain, IconChecklist } from '@tabler/icons-react'
import styles from './HowItWorks.module.css'

const steps = [
  {
    icon: IconUserPlus,
    title: 'Преподаватель подготавливает задачу',
    description: 'Создает задачу, выбирает критерии оценки из доступных или создает свои',
  },
  {
    icon: IconUpload,
    title: 'Студент загружает решение',
    description: 'Студент передает решение в виде ссылки на GitHub-репозиторий или загружает zip-файл',
  },
  {
    icon: IconBrain,
    title: 'ИИ проводит многоэтапную проверку',
    description: 'ИИ генерирует проектную документацию, проверяет работу на основе критериев, готовит вопросы для экзамена и проводит его',
  },
  {
    icon: IconChecklist,
    title: 'Преподаватель корректирует финальную оценку',
    description: 'Преподавателю доступны все артефакты проверки, на основе которых он делает финальный вердикт',
  },
]

export function HowItWorks() {
  return (
    <Box py={{ base: 60, md: 100 }} className={styles.section} id="how-it-works">
      <Container size="lg">
        <Title order={2} ta="center" mb={48} fw={700} fz={{ base: 28, md: 36 }}>
          Как это работает
        </Title>
        
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mt={48} spacing="lg">
          {steps.map((step, index) => (
            <Box key={index} className={styles.card}>
              <ThemeIcon 
                size={56} 
                radius="xl" 
                variant="gradient" 
                gradient={{ from: 'blue.5', to: 'cyan.5', deg: 45 }}
                mb="md"
              >
                <step.icon size={28} />
              </ThemeIcon>
              <Text fw={700} size="lg" mb="xs">Шаг {index + 1}</Text>
              <Text fw={600} size="md" mb="sm">{step.title}</Text>
              <Text size="sm" c="dimmed" lh={1.5}>{step.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}