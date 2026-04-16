import { createBrowserRouter, redirect } from 'react-router-dom';
import { LandingPage } from './pages/Landing/Landing';
import { MainLayout } from './components/MainLayout/MainLayout';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Home } from './pages/Home/Home';
import { WorkspacesPage } from './pages/Workspaces/WorkspacesPage';
import { CreateWorkspacePage } from './pages/Workspaces/CreateWorkspacePage';
import { WorkspaceDetailPage } from './pages/Workspaces/WorkspaceDetailPage';
import { EditWorkspacePage } from './pages/Workspaces/EditWorkspacePage';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { NotFound } from './pages/NotFound/NotFound';
import { JoinWorkspacePage } from './pages/Join/JoinWorkspacePage';
import { CriteriaListPage } from './pages/Criteria/CriteriaListPage';
import { CriteriaCreatePage } from './pages/Criteria/CriteriaCreatePage';
import { CriteriaDetailPage } from './pages/Criteria/CriteriaDetailPage';
import { CriteriaEditPage } from './pages/Criteria/CriteriaEditPage';
import { TaskCreatePage } from './pages/Tasks/TaskCreatePage';
import { TaskDetailPage } from './pages/Tasks/TaskDetailPage';
import { TaskEditPage } from './pages/Tasks/TaskEditPage';
import { SolutionDetailPage } from './pages/Solutions/SolutionDetailPage';
import { SolutionCreatePage } from './pages/Solutions/SolutionCreatePage';
import { isAuthenticated } from './lib/jwt';
import { api } from './api/api';
import { useProfileStore } from './store/profile';

const protectedLoader = async () => {
  if (!isAuthenticated()) {
    return redirect('/login');
  }

  try {
    const response = await api.get<{ workspace: { id: number; name: string }; role: string }[]>('/api/v1/profile/workspaces');
    const workspaces = response.data.map((item) => ({
      workspaceId: item.workspace.id,
      name: item.workspace.name,
      role: item.role as 'OWNER' | 'TEACHER' | 'STUDENT',
    }));
    useProfileStore.getState().setWorkspaces(workspaces);
  } catch {
    return redirect('/login');
  }

  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    element: <AuthLayout/>,
    children: [
      {path: '/login', element: <Login />},
      {path: '/register', element: <Register />},
    ]
  },
  {
    element: <MainLayout/>,
    loader: protectedLoader,
    children: [
      { path: '/home', element: <Home /> },
      { path: '/workspaces', element: <WorkspacesPage /> },
      { path: '/workspaces/new', element: <CreateWorkspacePage /> },
      { path: '/workspaces/:id', element: <WorkspaceDetailPage /> },
      { path: '/workspaces/:workspaceId/edit', element: <EditWorkspacePage /> },
      { path: '/workspaces/:workspaceId/tasks/new', element: <TaskCreatePage /> },
      { path: '/workspaces/:workspaceId/tasks/:taskId', element: <TaskDetailPage /> },
      { path: '/workspaces/:workspaceId/tasks/:taskId/edit', element: <TaskEditPage /> },
      { path: '/workspaces/:workspaceId/tasks/:taskId/solutions/:solutionId', element: <SolutionDetailPage /> },
      { path: '/workspaces/:workspaceId/tasks/:taskId/solutions/new', element: <SolutionCreatePage /> },
      { path: '/criteria', element: <CriteriaListPage /> },
      { path: '/criteria/new', element: <CriteriaCreatePage /> },
      { path: '/criteria/:criterionId', element: <CriteriaDetailPage /> },
      { path: '/criteria/:criterionId/edit', element: <CriteriaEditPage /> },
      { path: '/settings', element: <Home /> },
    ],
  },
  {
    path: '/join/:slug',
    loader: async () => {
      if (!isAuthenticated()) {
        return redirect('/login');
      }
      return null;
    },
    element: <JoinWorkspacePage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);