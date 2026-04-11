# AGENTS.md

## О проекте

Проект посвящен созданию фронтенда для платформы автоматического ревью проектов и репозиториев.
Платформа анализирует код студентов, генерирует документацию проекта (ProjectDoc) через LLM,
проводит ревью по критериям и выносит итоговый вердикт.

## Технологический стек

React, TypeScript
Vite - сборка
React Router v7 - Маршрутизация
TanStack Query - серверное состояние
Zustand - клиентское состояние
Mantine UI - UI-библиотека (формы, таблицы, графики)
Axios - HTTP-клиент
CSS Modules - стилизация
react-markdown + remark-gf - рендер markdown
jose - декодирование jwt-токена


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

## Полезные ссылки

https://mantine.dev/llms.txt - актуальная документация Mantine