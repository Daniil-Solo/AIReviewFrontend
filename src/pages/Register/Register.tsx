import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Box,
  PinInput,
} from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import type { FormEvent } from 'react';
import { registerStart, registerConfirm } from '../../api/endpoints/auth';
import { useRegisterStore } from '../../store/register';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const TIMER_DURATION = 60;

export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { step, fullname, email, password, setStep, setCredentials, reset } = useRegisterStore();

  const [formFullname, setFormFullname] = useState(fullname);
  const [formEmail, setFormEmail] = useState(email);
  const [formPassword, setFormPassword] = useState(password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [resendReady, setResendReady] = useState(false);

  const timerInterval = useInterval(() => {
    if (timer > 0) {
      setTimer((t) => t - 1);
    } else {
      setResendReady(true);
    }
  }, 1000);

  useEffect(() => {
    if (step === 2) {
      timerInterval.start();
    }
    return () => timerInterval.stop();
  }, [step]);

  useEffect(() => {
    return () => reset();
  }, []);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formFullname.trim()) {
      newErrors.fullname = 'Имя обязательно';
    }

    if (!formEmail) {
      newErrors.email = 'Email обязателен';
    }

    if (!PASSWORD_REGEX.test(formPassword)) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов, включая букву, цифру и специальный знак';
    }

    if (formPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateStep1()) return;

    setLoading(true);
    try {
      await registerStart({
        fullname: formFullname,
        email: formEmail,
        password: formPassword,
      });
      setCredentials({
        fullname: formFullname,
        email: formEmail,
        password: formPassword,
      });
      setStep(2);
      setTimer(TIMER_DURATION);
      setResendReady(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Ошибка регистрации';
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setErrors((prev) => ({ ...prev, code: '' }));
    try {
      await registerStart({
        fullname: formFullname,
        email: formEmail,
        password: formPassword,
      });
      setTimer(TIMER_DURATION);
      setResendReady(false);
      setCode('');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Ошибка отправки кода';
      setErrors({ code: message });
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setErrors({ code: 'Введите 6-значный код' });
      return;
    }

    setLoading(true);
    try {
      const response = await registerConfirm({
        email: formEmail,
        code,
      });
      localStorage.setItem('token', response.access_token);
      const target = redirect || '/home';
      navigate(target, { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Неверный код';
      setErrors({ code: message });
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (step === 2) {
    return (
        <form onSubmit={handleStep2Submit}>
          <Stack gap={24}>
            <Box ta="center" mb="md">
              <Text size="lg" fw={600}>
                Подтверждение email
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Мы отправили код на {formEmail}
              </Text>
            </Box>

            <PinInput
              length={6}
              value={code}
              onChange={(value) => {
                setCode(value);
                if (value.length === 6) {
                  handleStep2Submit(new Event('submit') as unknown as FormEvent);
                }
              }}
              error={!!errors.code}
              size="lg"
              style={{ justifyContent: 'center' }}
            />
            {errors.code && (
              <Text size="sm" c="red" ta="center">
                {errors.code}
              </Text>
            )}

            <Box ta="center">
              {resendReady ? (
                <Button
                  variant="subtle"
                  onClick={handleResend}
                  loading={loading}
                  size="sm"
                >
                  Отправить код повторно
                </Button>
              ) : (
                <Text size="sm" c="dimmed">
                  Повторить через {timer}с
                </Text>
              )}
            </Box>

            {!resendReady && (
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                variant="gradient"
                gradient={{ from: 'blue.5', to: 'cyan.5', deg: 45 }}
              >
                Подтвердить
              </Button>
            )}
          </Stack>
        </form>
    );
  }

  return (
      <form onSubmit={handleStep1Submit}>
        <Stack gap={24}>
          <TextInput
            label="Полное имя"
            placeholder="Иван Иванов"
            value={formFullname}
            onChange={(e) => setFormFullname(e.target.value)}
            error={errors.fullname}
            onFocus={() => clearError('fullname')}
            size="md"
            required
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            error={errors.email}
            onFocus={() => clearError('email')}
            size="md"
            required
          />
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
            error={errors.password}
            onFocus={() => clearError('password')}
            size="md"
            required
          />
          <PasswordInput
            label="Повторите пароль"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            onFocus={() => clearError('confirmPassword')}
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
            Зарегистрироваться
          </Button>
          <Box ta="center">
            <Text span c="dimmed">
              Уже есть аккаунт?{' '}
            </Text>
            <Anchor component="a" href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'} fw={600}>
              Войти
            </Anchor>
          </Box>
        </Stack>
      </form>
  );
}