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
  features/      # фичи (reviews, dashboard, ai-chat)
  hooks/         # кастомные хуки (useAuth, useStreaming)
  lib/           # утилиты, helpers
  pages/         # роуты
  store/         # zustand stores
  types/         # TypeScript типы API


## Дополнительные сведения

`docs/api.md` - схема API существующих эндпоинтов
`docs/about.md` - описание возможностей платформы 

## Полезные ссылки

https://mantine.dev/llms.txt - актуальная документация Mantine


## Важно
- всегда используй нативные UI-компоненты из Mantine UI
- только в крайних случаях пиши свои компоненты
- всегда используй иконки из @tabler/icons-react, не используй смайлики
- разрабатывай с учетом того, что у нас есть темная и светлая сторона