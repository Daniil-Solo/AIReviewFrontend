import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader, Center, Alert } from '@mantine/core';
import { getSolution } from '../../api/endpoints/solutions';
import { useProfileStore } from '../../store/profile';
import { getUserData } from '../../lib/jwt';
import { StudentSolutionPage } from './StudentSolutionPage';
import { TeacherSolutionPage } from './TeacherSolutionPage';

export function SolutionDetailPage() {
  const { workspaceId, taskId, solutionId } = useParams<{
    workspaceId: string;
    taskId: string;
    solutionId: string;
  }>();

  const wsId = Number(workspaceId);
  const tId = Number(taskId);
  const sId = Number(solutionId);

  const canEdit = useProfileStore((state) => state.canEdit);
  const isTeacher = canEdit(wsId);

  const { data: solution, isLoading, error } = useQuery({
    queryKey: ['solution', sId],
    queryFn: () => getSolution(sId),
  });

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !solution) {
    return (
      <Alert color="red">Не удалось загрузить решение</Alert>
    );
  }

  if (isTeacher) {
    return (
      <TeacherSolutionPage
        solution={solution}
        workspaceId={wsId}
        taskId={tId}
      />
    );
  }

  const userData = getUserData();
  const currentUserId = userData?.sub;
  const isOwner = solution.created_by === currentUserId;

  return (
    <StudentSolutionPage
      solution={solution}
      isOwner={isOwner}
      workspaceId={wsId}
      taskId={tId}
    />
  );
}