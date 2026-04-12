import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './pages/Landing/Landing';
import { MainLayout } from './components/MainLayout/MainLayout';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Home } from './pages/Home/Home';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { NotFound } from './pages/NotFound/NotFound';

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
    children: [
      { path: '/home', element: <Home /> },
      { path: '/workspaces', element: <Home /> },
      { path: '/settings', element: <Home /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);