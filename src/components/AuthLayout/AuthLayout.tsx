import { Box, Container, Title, ThemeIcon } from '@mantine/core';
import { IconBrain } from '@tabler/icons-react';
import styles from './AuthLayout.module.css';
import { isAuthenticated } from '../../lib/jwt';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);
  
  return (
    <Box className={styles.wrapper}>
      <Container size={440} className={styles.container}>
        <Box className={styles.header}>
          <ThemeIcon
            size={56}
            radius="xl"
            variant="gradient"
            gradient={{ from: 'blue.5', to: 'cyan.5', deg: 45 }}
            className={styles.icon}
          >
            <IconBrain size={28} />
          </ThemeIcon>
          <Title order={2} className={styles.title}>
            AI Review
          </Title>
        </Box>
        <Box className={styles.content}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}