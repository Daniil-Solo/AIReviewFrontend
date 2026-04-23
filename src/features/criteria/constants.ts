export const stageLabels: Record<string, string> = {
	PROJECT_DOC: 'Критерий проверяется только по ProjectDoc',
	CODEBASE: 'Критерий проверяется только по кодовой базе',
	MANUAL: 'Критерий проверяется только вручную',
	null: 'Критерий проверяется на всех стадиях до успешной проверки',
};

export const getCriterionAccessLabel = (
	workspaceId: number | null,
	taskId: number | null
): string => {
	if (workspaceId === null && taskId === null) {
		return 'Критерий доступен всем';
	}
	if (workspaceId !== null) {
		return 'Критерий доступен только в этом пространстве';
	}
	return 'Критерий доступен только для этой задачи';
};
