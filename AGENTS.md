# AGENTS.md

## О проекте

Проект посвящен созданию фронтенда для платформы автоматического ревью проектов и репозиториев.
Платформа анализирует код студентов, генерирует документацию проекта (ProjectDoc) через LLM,
проводит ревью по критериям и выносит итоговый вердикт.

## Технологический стек
React 19 + TypeScript 6 (strict mode, es2023)
Vite 8 — сборка
Mantine UI v9 — основная UI-библиотека
React Router v7 — маршрутизация
TanStack Query v5 — серверное состояние
Zustand — клиентское состояние
Axios — HTTP-клиент
@tabler/icons-react — иконки
CSS Modules (*.module.css) — стилизация
react-markdown + remark-gfm — рендер markdown
jose — работа с JWT
mermaid — диаграммы Ганта

## Структура проекта
src/
├── api/                    # инстанс axios, эндпоинты
│   ├── endpoints/
│   │   ├── auth.ts         # авторизация
│   │   ├── criteria.ts    # критерии оценивания
│   │   ├── solutions.ts    # решения студентов
│   │   ├── tasks.ts       # задания
│   │   ├── transactions.ts # транзакции баланса
│   │   └── workspaces.ts  # рабочие пространства
│   ├── api.ts             # base instance
│   ├── index.ts          # exports
│   └── utils.ts          # утилиты
├── components/            # переиспользуемые UI-блоки
│   ├── AuthLayout/       # лayoут авторизации
│   ├── Header/          # хедер с навигацией
│   ├── Logo/            # логотип
│   ├── MainLayout/      # основной layout
│   ├── MarkdownRenderer/ # рендер markdown + подсветка + mermaid
│   ├── MermaidGantt/    # диаграммы Ганта
│   ├── WorkspaceInvitesTab/ # приглашения в workspace
│   └── WorkspaceTasksTab/   # задания workspace
├── features/             # фичи
│   ├── criteria/        # критерии (constants.ts)
│   └── solutions/       # решения (constants.ts)
├── lib/                # утилиты
│   ├── date.ts         # форматирование дат
│   └── jwt.ts          # работа с JWT
├── pages/              # страницы
│   ├── Criteria/       # CRUD критериев
│   ├── Home/           # главная
│   ├── Join/          # присоединение к workspace
│   ├── Landing/       # промо-страница + компоненты
│   ├── Login/        # вход
│   ├── NotFound/      # 404
│   ├── Register/     # регистрация
│   ├── Solutions/    # решения (CRUD + student/teacher view)
│   ├── Tasks/        # задания (CRUD)
│   ├── Transactions/ # история транзакций
│   └── Workspaces/   # рабочие пространства (CRUD)
├── store/             # zustand stores
│   ├── profile.ts    # профиль пользователя
│   └── register.ts   # регистрация
├── types/             # TypeScript типы API
│   └── index.ts
├── main.tsx          # точка входа
├── main.css          # глобальные стили
└── router.tsx        # маршрутизация

## Дополнительные сведения

`docs/api.md` - схема API существующих эндпоинтов
`docs/about.md` - описание возможностей платформы
`docs/roadmap.md` - план развития

## Важно
- всегда используй нативные UI-компоненты из Mantine UI и другие фичи этой библиотеки
- только в крайних случаях пиши свои кастомные компоненты
- всегда используй иконки из @tabler/icons-react, не используй смайлики
- разрабатывай с учетом того, что у нас есть темная и светлая сторона
- не используй стандартные confirm и alert для диалога с пользователем. Вместо это используй Modals manager из Mantine UI
- если во время выполнения запроса возникает ошибка в useMutation или useQuery, покажи ее сообщение (err.response.data.message) в Alert-компоненте из UI
- никогда не запускай сам dev-server