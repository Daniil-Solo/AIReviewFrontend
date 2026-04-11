import { Container, Title, Text, SimpleGrid, Card, ThemeIcon, Box } from '@mantine/core'
import { IconBrain, IconCreditCard, IconChartLine, IconBrandGithub } from '@tabler/icons-react'
import styles from './Features.module.css'

const features = [
  {
    icon: IconBrain,
    title: 'Многоэтапное AI-ревью',
    description: 'Анализ кода в целом, критериальная проверка, проверка с помощью статических анализаторов, проведение экзамена',
    color: 'blue',
  },
  {
    icon: IconCreditCard,
    title: 'Кредитная система',
    description: 'Прозрачная система оплаты, вы платите соразмерно проектам студентов, а также бонус при регистрации',
    color: 'grape',
  },
  {
    icon: IconChartLine,
    title: 'Аналитика прогресса',
    description: 'Отслеживайте частые ошибки студентов и их прогресс с помощью детальной аналитики',
    color: 'teal',
  },
  {
    icon: IconBrandGithub,
    title: 'Интеграция с GitHub',
    description: 'Подключайте репозитории студентов напрямую через GitHub для автоматической проверки',
    color: 'orange',
  },
]

export function Features() {
  return (
    <Box py={{ base: 60, md: 100 }} className={styles.section}>
      <Container size="lg">
        <Title order={2} ta="center" mb={16} fw={700} fz={{ base: 28, md: 36 }}>
          Ключевые возможности
        </Title>
        <Text ta="center" c="dimmed" mb={48} size="lg">
          Всё необходимое для автоматизации проверки студенческих проектов
        </Text>
        
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {features.map((feature, index) => (
            <Card key={index} className={styles.card} padding="xl" radius="md">
              <ThemeIcon 
                size={56} 
                radius="xl" 
                variant="light" 
                color={feature.color}
                mb="md"
              >
                <feature.icon size={28} />
              </ThemeIcon>
              <Text fw={700} size="lg" mb="sm">{feature.title}</Text>
              <Text size="md" c="dimmed" lh={1.6}>{feature.description}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}