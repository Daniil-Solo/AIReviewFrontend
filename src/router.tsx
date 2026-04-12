import { createBrowserRouter, redirect } from 'react-router-dom';
import { LandingPage } from './pages/Landing/Landing';
import { MainLayout } from './components/MainLayout/MainLayout';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Home } from './pages/Home/Home';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { NotFound } from './pages/NotFound/NotFound';
import { isAuthenticated } from './lib/jwt';

const protectedLoader = () => {
  if (!isAuthenticated()) {
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
      { path: '/workspaces', element: <Home /> },
      { path: '/settings', element: <Home /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);