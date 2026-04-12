import { Container, Title, Text, Card, Stack, Box, ThemeIcon } from '@mantine/core'
import { IconSchool, IconUser, IconBuilding } from '@tabler/icons-react'
import styles from './TargetAudience.module.css'

const cards = [
  {
    icon: IconSchool,
    title: 'Преподаватели и авторы курсов',
    points: [
      'Экономьте время на проверке',
      'Сосредоточьтесь на творческих аспектах обучения',
      'Получайте детальные отчёты по каждому студенту',
    ],
    color: 'blue',
  },
  {
    icon: IconUser,
    title: 'Студенты',
    points: [
      'Получайте обратную связь за минуты, а не дни',
      'Улучшайте код с помощью AI-рекомендаций',
      'Проходите экзамен и видите свои ошибки',
    ],
    color: 'teal',
  },
  {
    icon: IconBuilding,
    title: 'Руководители платформ',
    points: [
      'Масштабируйте проверку на сотни студентов',
      'Снижайте нагрузку на преподавателей',
      'Повышайте честность оценок через экзамен',
    ],
    color: 'grape',
  },
]

export function TargetAudience() {
  return (
    <Box py={{ base: 60, md: 100 }} className={styles.section} id="for-whom">
      <Container size="lg">
        <Title order={2} ta="center" mb={16} fw={700} fz={{ base: 28, md: 36 }}>
          Для кого эта платформа
        </Title>
        
        <Box className={styles.cardsGrid}>
          {cards.map((card, index) => (
            <Card key={index} className={styles.audienceCard} padding="xl" radius="md">
              <ThemeIcon 
                size={48} 
                radius="xl" 
                variant="light" 
                color={card.color}
                mb="md"
              >
                <card.icon size={24} />
              </ThemeIcon>
              <Text fw={700} size="lg" mb="md">{card.title}</Text>
              <Stack gap="sm">
                {card.points.map((point, idx) => (
                  <Text key={idx} size="md" c="dimmed" lh={1.5}>
                    • {point}
                  </Text>
                ))}
              </Stack>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}