import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Landing } from './pages/Landing/Landing'
import { Header } from './components/Header/Header'

function App() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Header opened={opened} onToggle={toggle} />
      </AppShell.Header>
      <AppShell.Main p={0}>
        <Landing />
      </AppShell.Main>
    </AppShell>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
])