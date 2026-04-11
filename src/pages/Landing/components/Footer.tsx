import { Container, Group, Anchor, Text, Stack, Divider, Box } from '@mantine/core'
import { IconBrandTelegram } from '@tabler/icons-react'
import styles from './Footer.module.css'

const links = [
  { label: 'О платформе', href: '#' },
  { label: 'Документация', href: '#' },
  { label: 'Контакты', href: '#' },
]

const legal = [
  { label: 'Политика конфиденциальности', href: '#' },
  { label: 'Условия использования', href: '#' },
]

export function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Container size="lg" py="xl">
        <Divider mb="xl" />
        
        <Group justify="space-between" wrap="wrap" gap="lg">
          <Stack gap="xs">
            <Group gap="xs">
              <Text fw={700} size="lg">AI Review</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Автоматическая проверка студенческих проектов с помощью ИИ
            </Text>
          </Stack>

          <Group gap="xl">
            <Stack gap="xs">
              <Text fw={600} size="sm">Навигация</Text>
              {links.map((link, index) => (
                <Anchor key={index} href={link.href} size="sm" c="dimmed" underline="hover">
                  {link.label}
                </Anchor>
              ))}
            </Stack>

            <Stack gap="xs">
              <Text fw={600} size="sm">Правовая информация</Text>
              {legal.map((link, index) => (
                <Anchor key={index} href={link.href} size="sm" c="dimmed" underline="hover">
                  {link.label}
                </Anchor>
              ))}
            </Stack>

            <Stack gap="xs">
              <Text fw={600} size="sm">Связаться</Text>
              <Anchor href="https://t.me" size="sm" c="dimmed" underline="hover">
                <Group gap={6}>
                  <IconBrandTelegram size={16} />
                  <Text>Автор в Telegram</Text>
                </Group>
              </Anchor>
            </Stack>
          </Group>
        </Group>

        <Divider my="lg" />

        <Text size="xs" c="dimmed" ta="center">
          © {new Date().getFullYear()} AI Review Platform. Все права защищены.
        </Text>
      </Container>
    </Box>
  )
}