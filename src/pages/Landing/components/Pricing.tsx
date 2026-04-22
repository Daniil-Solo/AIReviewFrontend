import { Container, Title, Text, SimpleGrid, Card, Button, Box, List, ThemeIcon } from '@mantine/core'
import { IconCheck, IconArrowRight } from '@tabler/icons-react'
import styles from './Pricing.module.css'

const plans = [
  {
    title: 'Бесплатный старт',
    price: '0 ₽',
    description: 'Попробуйте платформу бесплатно',
    features: [
      'Бесплатно проверка 1 большого или 2 средних проектов',
      'Все функции доступны',
      'Базовая аналитика',
      'Поддержка GitHub',
    ],
    cta: 'Начать бесплатно',
    highlighted: false,
  },
  {
    title: 'Оплата по факту использования',
    price: 'От 99 ₽',
    description: 'Платите только за то, что используете',
    features: [
      'Прозрачная система формирования баланса',
      'Все функции доступны',
      'Расширенная аналитика',
      'Приоритетная поддержка',
      'API доступ',
    ],
    cta: 'Перейти',
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <Box py={{ base: 60, md: 100 }} className={styles.section} id="pricing">
      <Container size="lg">
        <Title order={2} ta="center" mb={16} fw={700} fz={{ base: 28, md: 36 }}>
          Тарифы
        </Title>
        <Text ta="center" c="dimmed" mb={48} size="lg">
          Выберите подходящий план для ваших задач
        </Text>
        
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" maw={900} mx="auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`} 
              padding="xl" 
              radius="lg"
            >
              <Text fw={700} size="xl" mb="xs">{plan.title}</Text>
              <Text fw={800} fz={36} mb="xs" className={plan.highlighted ? styles.priceHighlight : ''}>
                {plan.price}
              </Text>
              <Text c="dimmed" size="sm" mb="xl">{plan.description}</Text>
              
              <List 
                spacing="sm" 
                mb="xl"
                icon={
                  <ThemeIcon size={20} radius="xl" color="teal" variant="light">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
              >
                {plan.features.map((feature, idx) => (
                  <List.Item key={idx}>
                    <Text size="sm">{feature}</Text>
                  </List.Item>
                ))}
              </List>
              
              <Button 
                size="lg" 
                fullWidth 
                variant={plan.highlighted ? 'gradient' : 'outline'}
                gradient={plan.highlighted ? { from: 'blue.5', to: 'cyan.5', deg: 45 } : undefined}
                rightSection={<IconArrowRight size={18} />}
                component="a"
                href="/register"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}