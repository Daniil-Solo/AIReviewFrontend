import { useState } from 'react';
import { AppShell, NavLink, Group, Text, Avatar, Stack, Burger, Divider } from '@mantine/core';
import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { IconHome, IconFolders, IconSettings, IconLogout, IconChevronLeft, IconChevronRight, IconSun, IconMoon } from '@tabler/icons-react';
import { getUserData, logout as logoutUtil } from '../../lib/jwt';
import styles from  "./MainLayout.module.css";
import { useDisclosure } from '@mantine/hooks';


export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserData();
  const [collapsed, setCollapsed] = useState(true);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [opened, { toggle }] = useDisclosure();

  const toggleTheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'Главная', icon: IconHome, path: '/home' },
    { label: 'Пространства', icon: IconFolders, path: '/workspaces' },
    { label: 'Настройки', icon: IconSettings, path: '/settings' },
  ];

  const handleLogout = () => {
    logoutUtil();
    navigate('/login', { replace: true });
  };

  const navLinkClass = `${styles.bordered_link} ${collapsed? styles.collapsed: ''}`

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: collapsed ? 80 : 260,
        breakpoint: 'xs',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Text fw={700} size="lg">
            AI Review
          </Text>
          <Avatar name={user?.fullname} alt={user?.fullname} size="md" radius="xl" color="initials"/>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="xs"
            size="sm"
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <Stack gap="xs">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                label={collapsed ? undefined : item.label}
                leftSection={<item.icon size={20} />}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                variant="light"
                className={navLinkClass}
              />
            ))}
          </Stack>

          <Stack gap="xs">
            <NavLink
              label={collapsed ? undefined : 'Сменить тему'}
              leftSection={computedColorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              onClick={toggleTheme}
              variant="light"
              className={navLinkClass}
            />
            <NavLink
              label={collapsed ? undefined : 'Выйти из аккаунта'}
              leftSection={<IconLogout size={20} />}
              onClick={handleLogout}
              variant="light"
              className={navLinkClass}
            />
            <Divider />
            <NavLink
              label={collapsed ? undefined : 'Свернуть'}
              leftSection={collapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
              onClick={() => setCollapsed(!collapsed)}
              variant="light"
              className={navLinkClass}
            />
          </Stack>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}