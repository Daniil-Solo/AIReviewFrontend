import { create } from 'zustand';

interface AppSettingsState {
	emailConfirmationEnabled: boolean;
	isLoading: boolean;
	setEmailConfirmationEnabled: (enabled: boolean) => void;
	setLoading: (loading: boolean) => void;
}

export const useAppSettingsStore = create<AppSettingsState>((set) => ({
	emailConfirmationEnabled: true,
	isLoading: false,
	setEmailConfirmationEnabled: (emailConfirmationEnabled) => set({ emailConfirmationEnabled }),
	setLoading: (isLoading) => set({ isLoading }),
}));
