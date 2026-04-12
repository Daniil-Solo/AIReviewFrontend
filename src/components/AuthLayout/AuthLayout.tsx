import { Box, Container } from '@mantine/core';
import styles from './AuthLayout.module.css';
import { isAuthenticated } from '../../lib/jwt';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Logo } from '../Logo/Logo';


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
        <Box className={styles.content}>
          <Outlet />
        </Box>
        <Box className={styles.footer}>
            <Logo />
          </Box>
      </Container>
    </Box>
  );
}