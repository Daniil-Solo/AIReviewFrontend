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
  GITHUB: 'GitHub',
};

export const stepLabels: Record<PipelineStepEnum, string> = {
  prepare_project_tree: 'Дерево проекта',
  prepare_project_content: 'Контента проекта для проверки',
  create_project_doc: 'Документация проекта (изначальная версия)',
  critic: 'Критика документации',
  resolve_gaps: 'Правки документации по замечаниям из критики',
  improve_doc: 'Документация проекта (улучшенная версия)',
};