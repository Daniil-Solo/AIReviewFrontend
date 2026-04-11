import { Container, Text, Card, Box, ThemeIcon } from '@mantine/core'
import { IconQuote } from '@tabler/icons-react'
import styles from './SocialProof.module.css'

export function SocialProof() {
  return (
    <Box py={{ base: 60, md: 100 }} className={styles.section}>
      <Container size="md">
        <Card className={styles.proofCard} padding="xl" radius="lg">
          <ThemeIcon 
            size={48} 
            radius="xl" 
            variant="light" 
            color="blue"
            mb="lg"
          >
            <IconQuote size={24} />
          </ThemeIcon>
          <Text fz={{ base: 'lg', md: 'xl' }} fw={500} lh={1.6} ta="center" mb="lg">
            «Платформа прошла испытания на реальном курсе "Разработка AI/LLM-приложений 
            на Python: от идеи до релиза" с участием 50+ студентов. Преподаватели 
            сократили время проверки на 90%.»
          </Text>
          <Box ta="center">
            <Text fw={700} size="md">Результаты апробации</Text>
            <Text c="dimmed" size="sm">Курс "Разработка AI/LLM-приложений на Python"</Text>
          </Box>
        </Card>
        
        <Box className={styles.stats}>
          <Box className={styles.stat}>
            <Text fw={800} fz={48} c="blue.5">50+</Text>
            <Text size="md" c="dimmed">студентов</Text>
          </Box>
          <Box className={styles.stat}>
            <Text fw={800} fz={48} c="teal.5">90%</Text>
            <Text size="md" c="dimmed">экономия времени</Text>
          </Box>
          <Box className={styles.stat}>
            <Text fw={800} fz={48} c="grape.5">5-15</Text>
            <Text size="md" c="dimmed">минут на проверку</Text>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}