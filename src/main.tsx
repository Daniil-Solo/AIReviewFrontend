import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { localStorageColorSchemeManager } from '@mantine/core'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@mantine/core/styles.css'
import './main.css'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
})

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'mantine-color-scheme',
})

createRoot(document.getElementById('root')!).render(
  /*<StrictMode>*/
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light" colorSchemeManager={colorSchemeManager}>
        <ModalsProvider>
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  /*</StrictMode>,*/
)