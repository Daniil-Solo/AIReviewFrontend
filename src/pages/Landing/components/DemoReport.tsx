import { Container, Title, Text, Tabs, Card, Box, ThemeIcon, Badge, Stack } from '@mantine/core'
import { IconFileText, IconCheckbox, IconChartBar, IconBook } from '@tabler/icons-react'
import styles from './DemoReport.module.css'

const criteriaData = [
  { status: 'success', title: 'Архитектура', comment: 'хорошее разделение слоёв' },
  { status: 'warning', title: 'Документация', comment: 'нет docstring у трёх функций' },
  { status: 'error', title: 'Безопасность', comment: 'Bandit нашёл уязвимость' },
]

export function DemoReport() {
  return (
    <Box py={{ base: 60, md: 100 }} className={styles.section}>
      <Container size="lg">
        <Title order={2} ta="center" mb={16} fw={700} fz={{ base: 28, md: 36 }}>
          Пример результата
        </Title>
        <Text ta="center" c="dimmed" mb={48} size="lg">
          Посмотрите, как выглядит отчёт о проверке студенческого проекта
        </Text>
        
        <Card className={styles.reportCard} padding="xl" radius="lg">
          <Tabs defaultValue="criteria" className={styles.tabs}>
            <Tabs.List mb="xl">
              <Tabs.Tab value="docs" leftSection={<IconFileText size={16} />}>
                Проектная документация
              </Tabs.Tab>
              <Tabs.Tab value="criteria" leftSection={<IconCheckbox size={16} />}>
                Критериальная проверка
              </Tabs.Tab>
              <Tabs.Tab value="analysis" leftSection={<IconChartBar size={16} />}>
                Статический анализ
              </Tabs.Tab>
              <Tabs.Tab value="exam" leftSection={<IconBook size={16} />}>
                Экзамен
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="docs">
              <Stack gap="md">
                <Text fw={600} size="lg">Сгенерированная документация проекта</Text>
                <Text c="dimmed">
                  Здесь будет автоматически сгенерированная документация: описание архитектуры, 
                  структура файлов, API эндпоинты, зависимости и т.д.
                </Text>
                <Badge variant="light" color="blue">AI Generated</Badge>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="criteria">
              <Stack gap="lg">
                <Text fw={600} size="lg">Результаты критериальной проверки</Text>
                {criteriaData.map((item, index) => (
                  <Box key={index} className={styles.criteriaItem}>
                    <ThemeIcon 
                      size={24} 
                      radius="xl" 
                      variant="light"
                      color={item.status === 'success' ? 'teal' : item.status === 'warning' ? 'yellow' : 'red'}
                    >
                      {item.status === 'success' ? '✓' : item.status === 'warning' ? '!' : '✗'}
                    </ThemeIcon>
                    <Box>
                      <Text fw={600}>{item.title}</Text>
                      <Text size="sm" c="dimmed">{item.comment}</Text>
                    </Box>
                    <Badge 
                      color={item.status === 'success' ? 'teal' : item.status === 'warning' ? 'yellow' : 'red'}
                      variant="light"
                    >
                      {item.status === 'success' ? 'Пройден' : item.status === 'warning' ? 'Частично' : 'Не пройден'}
                    </Badge>
                  </Box>
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="analysis">
              <Stack gap="md">
                <Text fw={600} size="lg">Результаты статического анализа</Text>
                <Text c="dimmed">
                  Результаты анализа кода с помощью Bandit, Pylint и других инструментов.
                  Список предупреждений, ошибок и рекомендаций по улучшению кода.
                </Text>
                <Box className={styles.codeBlock}>
                  <Text size="sm" style={{ fontFamily: 'monospace' }}>
                    banditi: Found 1 medium severity vulnerability<br/>
                    sql_injection: Line 42 - SQL statement constructed from user input
                  </Text>
                </Box>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="exam">
              <Stack gap="md">
                <Text fw={600} size="lg">Вопросы экзамена и ответы студента</Text>
                <Text c="dimmed">
                  AI генерирует вопросы на основе кода студента, проверяя понимание 
                  архитектуры, слабых мест и_best practices. Студент отвечает устно или письменно.
                </Text>
                <Box className={styles.examExample}>
                  <Text fw={600} mb="xs">Вопрос:</Text>
                  <Text>Объясните, почему вы выбрали именно эту архитектуру для микросервисов?</Text>
                  <Text fw={600} mt="md" mb="xs">Ответ студента:</Text>
                  <Text c="dimmed">[Здесь будет ответ студента]</Text>
                </Box>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Card>

        <Text ta="center" mt="xl">
          <Text component="span" c="blue" style={{ cursor: 'pointer' }}>
            Посмотреть полный отчёт →
          </Text>
        </Text>
      </Container>
    </Box>
  )
}