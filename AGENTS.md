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

## Структура проекта
src/
  api/           # инстанс axios, эндпоинты
  components/    # переиспользуемые UI-блоки
  features/      # фичи (reviews, dashboard, ai-chat, criteria, solutions)
  features/criteria/constants.ts   # константы критериев (stageLabels)
  features/solutions/constants.ts  # константы решений (statusLabels, formatLabels, stepLabels)
  hooks/         # кастомные хуки (useAuth, useStreaming)
  lib/           # утилиты, helpers
  pages/         # роуты
  store/         # zustand stores
  types/         # TypeScript типы API


## Дополнительные сведения

`docs/api.md` - схема API существующих эндпоинтов
`docs/about.md` - описание возможностей платформы 


## Важно
- всегда используй нативные UI-компоненты из Mantine UI и другие фичи этой библиотеки
- только в крайних случаях пиши свои кастомные компоненты
- всегда используй иконки из @tabler/icons-react, не используй смайлики
- разрабатывай с учетом того, что у нас есть темная и светлая сторона
- не используй стандартные confirm и alert для диалога с пользователем. Вместо это используй Modals manager из Mantine UI
- если во время выполнения запроса возникает ошибка в useMutation или useQuery, покажи ее сообщение (err.response.data.message) в Alert-компоненте из UI
- никогда не запускай сам dev-server