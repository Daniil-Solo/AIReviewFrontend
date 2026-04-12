export const stageLabels: Record<string, string> = {
  PROJECT_DOC: 'Критерий проверяется только по ProjectDoc',
  CODEBASE:  'Критерий проверяется только по кодовой базе',
  MANUAL: 'Критерий проверяется только вручную',
  null: 'Критерий проверяется на всех стадиях до успешной проверки',
};

export const getCriterionAccessLabel = (is_public: boolean): string => {
    if (is_public)
        return"Критерий доступен всем"
    else
        return"Критерий доступен только вам"
}