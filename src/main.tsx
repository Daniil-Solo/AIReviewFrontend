import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { localStorageColorSchemeManager } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useState, useEffect } from 'react';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import './main.css';
import { router } from './router';
import { getAppSettings } from './api/endpoints/app';
import { useAppSettingsStore } from './store/appSettings';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0,
			retry: 1,
			refetchOnMount: true,
			refetchOnWindowFocus: true,
		},
	},
});

const theme = createTheme({
	primaryColor: 'blue',
	fontFamily: 'system-ui, -apple-system, sans-serif',
	headings: {
		fontFamily: 'system-ui, -apple-system, sans-serif',
	},
});

const colorSchemeManager = localStorageColorSchemeManager({
	key: 'mantine-color-scheme',
});

function App() {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		getAppSettings()
			.then((settings) => {
				useAppSettingsStore
					.getState()
					.setEmailConfirmationEnabled(settings.email_confirmation_enabled);
			})
			.catch(() => {
				useAppSettingsStore.getState().setEmailConfirmationEnabled(true);
			})
			.finally(() => {
				setIsReady(true);
			});
	}, []);

	if (!isReady) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider
				theme={theme}
				defaultColorScheme="light"
				colorSchemeManager={colorSchemeManager}
			>
				<ModalsProvider>
					<RouterProvider router={router} />
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	);
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
