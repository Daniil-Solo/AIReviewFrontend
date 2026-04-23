import {
	Group,
	Anchor,
	ActionIcon,
	Button,
	Burger,
	Drawer,
	Stack,
	Avatar,
	Menu,
} from '@mantine/core';
import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import {
	IconSun,
	IconMoon,
	IconLogin,
	IconUserPlus,
	IconLogout,
	IconHome,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout as logoutUtil } from '../../lib/jwt';
import { Logo } from '../Logo/Logo';

interface HeaderProps {
	opened: boolean;
	onToggle: () => void;
}

export function Header({ opened, onToggle }: HeaderProps) {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
	const navigate = useNavigate();
	const user = getUserData();

	const toggleTheme = () => {
		setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
	};

	const handleLogout = () => {
		logoutUtil();
		navigate('/login', { replace: true });
	};

	return (
		<>
			<Group justify="space-between" h="100%" px="md">
				<Group gap="xs">
					<Burger opened={opened} onClick={onToggle} hiddenFrom="md" size="sm" />
					<Anchor href="/" underline="never">
						<Logo />
					</Anchor>
				</Group>

				<Group gap="sm" visibleFrom="md">
					<ActionIcon variant="default" size="lg" onClick={toggleTheme} aria-label="Toggle theme">
						{computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
					</ActionIcon>
					{user ? (
						<Menu shadow="md" width={200}>
							<Menu.Target>
								<Avatar
									name={user.fullname}
									alt={user.fullname}
									size="md"
									radius="xl"
									color="initials"
									style={{ cursor: 'pointer' }}
								/>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item leftSection={<IconHome size={16} />} onClick={() => navigate('/home')}>
									Главная
								</Menu.Item>
								<Menu.Divider />
								<Menu.Item
									color="red"
									leftSection={<IconLogout size={16} />}
									onClick={handleLogout}
								>
									Выйти из аккаунта
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					) : (
						<>
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
						</>
					)}
				</Group>

				<Group gap="xs" hiddenFrom="md">
					<ActionIcon variant="default" size="lg" onClick={toggleTheme} aria-label="Toggle theme">
						{computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
					</ActionIcon>
				</Group>
			</Group>

			<Drawer opened={opened} onClose={onToggle} title="Меню" hiddenFrom="md" size="xs">
				<Stack gap="md">
					{user ? (
						<>
							<Group justify="center" gap="sm">
								<Avatar
									name={user.fullname}
									alt={user.fullname}
									size="lg"
									radius="xl"
									color="initials"
								/>
							</Group>
							<Button
								variant="light"
								fullWidth
								leftSection={<IconHome size={16} />}
								onClick={() => {
									navigate('/home');
									onToggle();
								}}
							>
								Главная
							</Button>
							<Button
								variant="light"
								color="red"
								fullWidth
								leftSection={<IconLogout size={16} />}
								onClick={() => {
									handleLogout();
									onToggle();
								}}
							>
								Выйти из аккаунта
							</Button>
						</>
					) : (
						<>
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
						</>
					)}
				</Stack>
			</Drawer>
		</>
	);
}
