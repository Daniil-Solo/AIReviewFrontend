import { Container, Title, Text, SimpleGrid, ThemeIcon, Stack, Box } from '@mantine/core'
import { IconX, IconCheck } from '@tabler/icons-react'
import styles from './ProblemSolution.module.css'

const problems = [
  'Проверка работ по дисциплинами программной инженерии требует огромных временных затрат.',
  'Преподаватели перегружены, обратная связь задерживается на дни и недели.',
  'Студенты теряют мотивацию без своевременной обратной связи.',
  'При росте числа студентов масштабировать ручную проверку сложно и дорого.',
]

const solutions = [
  'Автоматическая генерация документации проекта.',
  'ИИ-ревью за 5-15 минут по любым критериям.',
  'Преподаватель только корректирует финальный вердикт, экономя 80% времени.',
]

export function ProblemSolution() {
  return (
    <Box py={{ base: 60, md: 100 }} className={styles.section}>
      <Container size="lg">
        <Title order={2} ta="center" mb={48} fw={700} fz={{ base: 28, md: 36 }}>
          Проблема и решение
        </Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 32, md: 48 }}>
          <Box className={styles.column}>
            <Stack gap="lg">
              <Text fw={700} fz="xl" c="red.5" ta="center">
                Проблема
              </Text>
              {problems.map((problem, index) => (
                <Box key={index} className={styles.item}>
                  <ThemeIcon 
                    size={28} 
                    radius="xl" 
                    variant="light" 
                    color="red"
                  >
                    <IconX size={16} />
                  </ThemeIcon>
                  <Text size="md" lh={1.6}>{problem}</Text>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box className={styles.column}>
            <Stack gap="lg">
              <Text fw={700} fz="xl" c="teal.5" ta="center">
                Решение
              </Text>
              {solutions.map((solution, index) => (
                <Box key={index} className={styles.item}>
                  <ThemeIcon 
                    size={28} 
                    radius="xl" 
                    variant="light" 
                    color="teal"
                  >
                    <IconCheck size={16} />
                  </ThemeIcon>
                  <Text size="md" lh={1.6}>{solution}</Text>
                </Box>
              ))}
            </Stack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}