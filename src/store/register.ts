import { create } from 'zustand';

interface RegisterState {
	step: 1 | 2;
	fullname: string;
	email: string;
	password: string;
	setStep: (step: 1 | 2) => void;
	setCredentials: (data: { fullname: string; email: string; password: string }) => void;
	reset: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
	step: 1,
	fullname: '',
	email: '',
	password: '',
	setStep: (step: 1 | 2): void => set({ step }),
	setCredentials: (data: { fullname: string; email: string; password: string }): void =>
		set({
			fullname: data.fullname,
			email: data.email,
			password: data.password,
		}),
	reset: (): void =>
		set({
			step: 1,
			fullname: '',
			email: '',
			password: '',
		}),
}));
