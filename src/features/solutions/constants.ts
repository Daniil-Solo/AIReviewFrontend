import type { SolutionStatusEnum, SolutionFormatEnum, PipelineStepEnum } from '../../types';

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