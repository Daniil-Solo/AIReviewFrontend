import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Button,
  PasswordInput,
  Alert,
  Loader,
  Center,
  Box,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { joinWorkspace, refreshProfileWorkspaces } from '../../api/endpoints/workspaces';
import { useProfileStore } from '../../store/profile';
import type { ErrorResponseDTO } from '../../types';


export function JoinWorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);

  const joinMutation = useMutation({
    mutationFn: (pwd: string | null) => joinWorkspace({ slug: slug, password: pwd }),
    onSuccess: async (data) => {
      await handleJoinSuccess(data.workspace_id);
    },
    onError: (err) => {
      const data = err.response.data as ErrorResponseDTO;
      if (data.code === 'required_joining_password') {
        setRequiresPassword(true);
      } 
      setError(data.message || 'Не удалось присоединиться к пространству');
    },
  });

  const handleJoinSuccess = useCallback(async (workspaceId: number) => {
    try {
      const workspaces = await refreshProfileWorkspaces();
      useProfileStore.getState().setWorkspaces(
        workspaces.map((ws) => ({
          workspaceId: ws.workspace.id,
          name: ws.workspace.name,
          role: ws.role,
        }))
      );
    } catch (err) {
      console.log('Failed to refresh workspaces after join:', err);
    }
    setTimeout(() => {
      navigate(`/workspaces/${workspaceId}`, { replace: true });
    }, 1000);
  }, [navigate]);

  useEffect(() => {
    joinMutation.mutate(null)
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setError('');
    joinMutation.mutate(password);
  };

  if (!requiresPassword && !error) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Paper p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Title order={2}>Присоединение к пространству</Title>
            
            <Text c="dimmed">
              Присоединение по приглашению: <Text fw={500} span>{slug}</Text>
            </Text>

            {error && (
              <Alert 
                color="red" 
                icon={<IconAlertCircle size={16} />} 
                onClose={() => setError('')} 
                withCloseButton
              >
                {error}
              </Alert>
            )}

            {requiresPassword && (
              <>
                <PasswordInput
                  label="Пароль приглашения"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={joinMutation.isPending}
                  autoFocus
                />
                <Box pos="relative">
                  <Button
                    type="submit"
                    disabled={!password || joinMutation.isPending}
                    loading={joinMutation.isPending}
                    fullWidth
                  >
                    Присоединиться
                  </Button>
                </Box>
              </>
            )}
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}