import { create } from 'zustand';
import type { WorkspaceMemberRole } from '../types';

export interface WorkspaceInfo {
	workspaceId: number;
	name: string;
	role: WorkspaceMemberRole;
}

interface ProfileState {
	workspaces: WorkspaceInfo[];
	isLoading: boolean;
	setWorkspaces: (workspaces: WorkspaceInfo[]) => void;
	setLoading: (loading: boolean) => void;
	getRole: (workspaceId: number) => WorkspaceMemberRole | undefined;
	getWorkspace: (workspaceId: number) => WorkspaceInfo | undefined;
	canEdit: (workspaceId: number) => boolean;
	canDelete: (workspaceId: number) => boolean;
	canChangeMemberRoles: (workspaceId: number) => boolean;
	canManageInvites: (workspaceId: number) => boolean;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
	workspaces: [],
	isLoading: false,
	setWorkspaces: (workspaces) => set({ workspaces }),
	setLoading: (isLoading) => set({ isLoading }),
	getRole: (workspaceId) => {
		const ws = get().workspaces.find((w) => w.workspaceId === workspaceId);
		return ws?.role;
	},
	getWorkspace: (workspaceId) => {
		return get().workspaces.find((w) => w.workspaceId === workspaceId);
	},
	canEdit: (workspaceId) => {
		const role = get().getRole(workspaceId);
		return role === 'OWNER' || role === 'TEACHER';
	},
	canDelete: (workspaceId) => {
		const role = get().getRole(workspaceId);
		return role === 'OWNER';
	},
	canChangeMemberRoles: (workspaceId) => {
		const role = get().getRole(workspaceId);
		return role === 'OWNER';
	},
	canManageInvites: (workspaceId) => {
		const role = get().getRole(workspaceId);
		return role === 'OWNER' || role === 'TEACHER';
	},
}));
