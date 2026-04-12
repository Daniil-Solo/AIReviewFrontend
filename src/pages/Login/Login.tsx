import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Box,
} from '@mantine/core';
import { login } from '../../api/endpoints/auth';
import type { ErrorResponseDTO } from '../../types';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
      navigate(redirect || '/home', { replace: true });
    } catch (error: unknown) {
      const message = (error.response.data as ErrorResponseDTO).message;
      setPasswordError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFocus = () => setEmailError('');
  const handlePasswordFocus = () => setPasswordError('');

  return (
      <form>
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
            onClick={handleSubmit}
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
            <Anchor component="a" href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'} fw={600}>
              Зарегистрироваться
            </Anchor>
          </Box>
        </Stack>
      </form>
  );
}