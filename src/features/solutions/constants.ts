import type { SolutionStatusEnum, SolutionFormatEnum, PipelineStepEnum, CriterionCheckStatusEnum, CriterionStage, GradingCriterionDTO } from '../../types';

export const statusLabels: Record<SolutionStatusEnum, string> = {
  CREATED: 'Создано',
  CANCELLED: 'Отменено',
  ERROR: 'Ошибка',
  AI_REVIEW: 'На AI-проверке',
  WAITING_EXAM: 'Ожидает экзамен',
  EXAMINATION: 'Экзамен',
  HUMAN_REVIEW: 'Ожидает ручной проверки',
  REVIEWED: 'Проверено',
};

export const formatLabels: Record<SolutionFormatEnum, string> = {
  ZIP: 'ZIP-архив',
  GITHUB: 'GitHub-репозиторий',
};

export const stepLabels: Record<PipelineStepEnum, string> = {
  prepare_project_tree: 'Дерево проекта',
  prepare_project_content: 'Контент проекта для проверки',
  create_project_doc: 'Документация проекта (изначальная версия)',
  critic: 'Критика документации',
  resolve_gaps: 'Правки документации по замечаниям из критики',
  improve_doc: 'Документация проекта (улучшенная версия)',
  grade_by_codebase: 'Проверка критериев по коду',
  grade_by_project_doc: 'Проверка критериев по ProjectDoc',
};

export const stepProcessLabels: Record<PipelineStepEnum, string> = {
  prepare_project_tree: 'Подготовка дерева проекта',
  prepare_project_content: 'Подготовка контента проекта',
  create_project_doc: 'Создание ProjectDoc',
  critic: 'Критика ProjectDoc',
  resolve_gaps: 'Создание правок ProjectDoc по критике',
  improve_doc: 'Улучшение ProjectDoc',
  grade_by_codebase: 'Проверка критериев по коду',
  grade_by_project_doc: 'Проверка критериев по ProjectDoc'
};

export const checkStatusLabels: Record<CriterionCheckStatusEnum, string> = {
  SUFFICIENT: 'Достаточно информации',
  NEEDS_CODE: 'Нужно посмотреть код',
  NEEDS_STUDENT: 'Нужен ответ студента',
  NEEDS_MANUAL: 'Нужна ручная проверка',
  NOT_APPLICABLE: 'Критерий не применим',
};

export const getCriterionStageLabel = (
  stage: CriterionStage,
): string => {
  if (stage === "PROJECT_DOC") {
    return 'Проверка по документации';
  } else if (stage === "CODEBASE") {
    return 'Проверка по коду';
  } else if (stage === "MANUAL") {
    return 'Ручная проверка';
  }
  return 'Автопроверка'
};


export const getCriterionCurrentStatus = (
  criterion: GradingCriterionDTO,
): string => {
  if (criterion.checks.length === 0) return "Требует проверки"
  const lastCheck = criterion.checks[criterion.checks.length - 1]
  return lastCheck.is_passed? "Выполнен": "Не выполнен"
};

export const getCriterionColor = (
  criterion: GradingCriterionDTO,
): string => {
  if (criterion.checks.length === 0) return "yellow"
  const lastCheck = criterion.checks[criterion.checks.length - 1]
  return lastCheck.is_passed? "green": "red"
};