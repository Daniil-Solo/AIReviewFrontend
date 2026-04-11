import { useState } from 'react'
import { Container, Title, Text, Tabs, Card, Stack, Box, ThemeIcon } from '@mantine/core'
import { IconSchool, IconUser, IconBuilding } from '@tabler/icons-react'
import styles from './TargetAudience.module.css'

const audiences = [
  {
    id: 'teachers',
    icon: IconSchool,
    title: 'Преподаватели и авторы курсов',
    points: [
      'Экономьте время на проверке.',
      'Сосредоточьтесь на творческих аспектах обучения.',
      'Получайте детальные отчёты по каждому студенту.',
    ],
  },
  {
    id: 'students',
    icon: IconUser,
    title: 'Студенты',
    points: [
      'Получайте обратную связь за минуты, а не дни.',
      'Улучшайте код с помощью AI-рекомендаций.',
      'Проходите экзамен и видите свои ошибки.',
    ],
  },
  {
    id: 'managers',
    icon: IconBuilding,
    title: 'Руководители образовательных платформ',
    points: [
      'Масштабируйте проверку на сотни студентов.',
      'Снижайте нагрузку на преподавательский состав.',
      'Повышайте честность оценок через экзамен.',
    ],
  },
]

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
  const [variant, setVariant] = useState<'tabs' | 'cards'>('tabs')

  return (
    <Box py={{ base: 60, md: 100 }} className={styles.section}>
      <Container size="lg">
        <Title order={2} ta="center" mb={16} fw={700} fz={{ base: 28, md: 36 }}>
          Для кого эта платформа
        </Title>
        
        <Box mb={32}>
          <Tabs defaultValue="tabs" onChange={(v) => setVariant(v as 'tabs' | 'cards')}>
            <Tabs.List justify="center">
              <Tabs.Tab value="tabs">Вариант А (Табы)</Tabs.Tab>
              <Tabs.Tab value="cards">Вариант Б (Карточки)</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Box>

        {variant === 'tabs' ? (
          <Tabs defaultValue="teachers" className={styles.tabsContainer}>
            <Tabs.List grow>
              {audiences.map((audience) => (
                <Tabs.Tab 
                  key={audience.id} 
                  value={audience.id}
                  leftSection={<ThemeIcon size={24} variant="light" color="blue"><audience.icon size={16} /></ThemeIcon>}
                >
                  <Text fw={600}>{audience.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            
            {audiences.map((audience) => (
              <Tabs.Panel key={audience.id} value={audience.id} pt="xl">
                <Card className={styles.tabCard} padding="xl" radius="md">
                  <Stack gap="md">
                    {audience.points.map((point, index) => (
                      <Text key={index} size="lg" lh={1.6}>
                        • {point}
                      </Text>
                    ))}
                  </Stack>
                </Card>
              </Tabs.Panel>
            ))}
          </Tabs>
        ) : (
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
        )}
      </Container>
    </Box>
  )
}