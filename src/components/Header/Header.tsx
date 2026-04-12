import { Group, Anchor, ActionIcon, Button, Burger, Drawer, Stack } from '@mantine/core'
import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { IconSun, IconMoon, IconLogin, IconUserPlus } from '@tabler/icons-react'
import { Logo } from '../Logo/Logo'

interface HeaderProps {
  opened: boolean
  onToggle: () => void
}

export function Header({ opened, onToggle }: HeaderProps) {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  const toggleTheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <Group justify="space-between" h="100%" px="md">
        <Group gap="xs">
          <Burger
            opened={opened}
            onClick={onToggle}
            hiddenFrom="md"
            size="sm"
          />
          <Anchor href="/" underline="never">
            <Logo />
          </Anchor>
        </Group>

        <Group gap="sm" visibleFrom="md">
          <ActionIcon
            variant="default"
            size="lg"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
          <Button
            component="a"
            href="/login"
            variant="default"
            leftSection={<IconLogin size={16} />}
          >
            Войти
          </Button>
          <Button
            component="a"
            href="/register"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            leftSection={<IconUserPlus size={16} />}
          >
            Регистрация
          </Button>
        </Group>

        <Group gap="xs" hiddenFrom="md">
          <ActionIcon
            variant="default"
            size="lg"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Group>
      </Group>

      <Drawer
        opened={opened}
        onClose={onToggle}
        title="Меню"
        hiddenFrom="md"
        size="xs"
      >
        <Stack gap="md">
          <Button
            component="a"
            href="/login"
            variant="default"
            fullWidth
            leftSection={<IconLogin size={16} />}
          >
            Войти
          </Button>
          <Button
            component="a"
            href="/register"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            fullWidth
            leftSection={<IconUserPlus size={16} />}
          >
            Регистрация
          </Button>
        </Stack>
      </Drawer>
    </>
  )
}