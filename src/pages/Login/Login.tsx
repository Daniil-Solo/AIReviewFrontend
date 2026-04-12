import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Box,
} from '@mantine/core';
import type { FormEvent as ReactFormEvent } from 'react';
import { login } from '../../api/endpoints/auth';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: ReactFormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(
        'Пароль должен содержать минимум 8 символов, включая букву, цифру и специальный знак'
      );
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!email) {
      setEmailError('Email обязателен');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.access_token);
      navigate('/home', { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Ошибка входа';
      setPasswordError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFocus = () => setEmailError('');
  const handlePasswordFocus = () => setPasswordError('');

  return (
      <form onSubmit={handleSubmit}>
        <Stack gap={24}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            onFocus={handleEmailFocus}
            size="md"
            required
          />
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            onFocus={handlePasswordFocus}
            size="md"
            required
          />
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            variant="gradient"
            gradient={{ from: 'blue.5', to: 'cyan.5', deg: 45 }}
          >
            Войти
          </Button>
          <Box ta="center">
            <Text span c="dimmed">
              Нет аккаунта?{' '}
            </Text>
            <Anchor component="a" href="/register" fw={600}>
              Зарегистрироваться
            </Anchor>
          </Box>
        </Stack>
      </form>
  );
}