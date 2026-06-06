# AI Grading

Платформа для автоматической проверки учебных проектов студентов с генерацией документации проекта (ProjectDoc), AI-ревью по критериям и вынесением итогового вердикта.

## Возможности

- **Рабочие пространства** — создание workspace'ов для управления курсами и группами студентов
- **Задачи с критериями** — назначение задач с набором критериев оценки и весами
- **Загрузка решений** — поддержка ZIP-архивов и ссылок на GitHub-репозитории
- **Автоматическое ревью** — многоэтапный AI-анализ:
  - Генерация ProjectDoc на основе кода
  - Проверка критериев по документации и коду
- **Вердикт** — выставление финальной оценки и генерация обратной связи

## Технологический стек

- **Frontend**: React 19 + TypeScript 6 (strict mode, es2023)
- **Build**: Vite 8
- **UI**: Mantine UI v9
- **Routing**: React Router v7
- **State**: TanStack Query v5 (server), Zustand (client)
- **HTTP**: Axios
- **Icons**: @tabler/icons-react
- **Styling**: CSS Modules
- **Markdown**: react-markdown + remark-gfm
- **Auth**: jose (JWT)

## Предварительная подготовка и запуск

```bash
npm install
npm run dev
```

## Структура проекта

```
src/
├── api/           # Axios инстанс и эндпоинты
├── components/   # Переиспользуемые UI-компоненты
├── features/     # Фичи (reviews, dashboard, ai-chat)
├── hooks/        # Кастомные хуки (useAuth, useStreaming)
├── lib/          # Утилиты и helpers
├── pages/        # Роуты страниц
├── store/        # Zustand хранилища
└── types/        # TypeScript типы API
```

## Компоненты

| Компонент    | Описание      | Ссылка                                                            |
| ------------ | ------------- | ----------------------------------------------------------------- |
| **Frontend** | Веб-интерфейс | Текущий репозиторий                                               |
| **Backend**  | API сервер    | [AIReviewBackend](https://github.com/Daniil-Solo/AIReviewBackend) |

## Документация

- [API схема](./docs/api.md) — описание всех эндпоинтов и схем данных
- [Описание системы](./docs/demo.md) — демонстрация интерфейса
