import { useState } from 'react';
import {
	Container,
	Title,
	Text,
	Tabs,
	Card,
	Box,
	Badge,
	Stack,
	Group,
	Collapse,
} from '@mantine/core';
import { RadarChart } from '@mantine/charts';
import {
	IconFileText,
	IconCheckbox,
	IconChartBar,
	IconMessageCircle,
	IconCheck,
	IconX,
	IconChevronDown,
	IconChevronUp,
} from '@tabler/icons-react';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer/MarkdownRenderer';
import styles from './DemoReport.module.css';

const projectDocContent = `# ProjectDoc: AITH Courses (Core Backend)

## 1. Общая информация о проекте

**Название проекта:** AITH Courses (Core Backend)

**Краткое описание:** Система управления образовательными курсами, предназначенная для администрирования учебного процесса и взаимодействия с пользователями (талантами). Проект обеспечивает функционал регистрации, ведения каталога курсов, управления запусками курсов (runs), формирования расписания, сбора отзывов и интеграции с внешними календарями.

**Глоссарий:**

| Название | Описание |
| :--- | :--- |
| **Талант (Talent)** | Роль пользователя системы, являющегося студентом или слушателем курсов. |
| **Администратор (Admin)** | Роль пользователя с полными правами на управление контентом, курсами и расписанием. |
| **Курс (Course)** | Образовательная единица, содержащая описание, программу, список компетенций и авторов. |
| **Запуск курса (Course Run)** | Конкретный экземпляр проведения курса в определенный период (например, «Весна 2024»). |
| **Расписание (Timetable)** | Набор правил (разовых или периодических), определяющих даты и время проведения занятий для конкретного запуска. |
| **Отзыв (Feedback)** | Оценка и текстовый комментарий пользователя о пройденном курсе с системой репутации (лайки/дизлайки). |
| **Плейлист (Playlist)** | Коллекция видеоматериалов (VK, YouTube), привязанная к конкретному запуску курса. |

---

## 2. Зависимости и технологический стек

*   **Язык программирования:** Python 3.11
*   **Веб-фреймворк:** FastAPI (0.111.0), Uvicorn
*   **Базы данных и ORM:**
    *   **PostgreSQL:** Основное хранилище данных.
    *   **SQLAlchemy (2.0.31):** ORM для работы с БД.
    *   **Asyncpg:** Асинхронный драйвер для PostgreSQL.
    *   **Alembic:** Система миграций базы данных.
*   **Кэширование и сессии:**
    *   **Redis (5.0.7):** Хранение сессий пользователей и кэширование данных курсов/отзывов.
*   **Валидация и настройки:**
    *   **Pydantic / Pydantic-settings:** Валидация данных и управление конфигурацией.
*   **Тестирование:**
    *   **Pytest:** Фреймворк для тестирования.
    *   **Httpx:** Клиент для интеграционных тестов API.
*   **Линтинг:**
    *   **Ruff:** Быстрый линтер и форматтер кода.

---

## 3. Архитектура

### Физическая структура директорий
\`\`\`text
/src
├── api             # Слой представления: маршруты FastAPI, зависимости (DI), схемы Pydantic
│   ├── admin       # Эндпоинты для административной панели
│   ├── auth        # Аутентификация и регистрация
│   └── ...         # Модули по бизнес-сущностям (courses, feedback, etc.)
├── domain          # Слой бизнес-логики: сущности, интерфейсы репозиториев, исключения
├── infrastructure  # Слой реализации: SQLAlchemy модели, Redis сервисы, безопасность
├── services        # Слой приложений: Command/Query сервисы, реализация Unit of Work
└── app.py          # Точка входа и инициализация FastAPI
\`\`\`

### Логическая архитектура
Проект построен с использованием принципов **Чистой архитектуры (Clean Architecture)** и паттерна **CQRS** (разделение на команды и запросы).

\`\`\`mermaid
graph TD
    subgraph Presentation
        Router[FastAPI Router]
        Deps[Dependencies/DI]
    end
    subgraph Application
        CmdService[CommandService - Write]
        QueryService[QueryService - Read]
        UoW[UnitOfWork Implementation]
    end
    subgraph Domain
        Entity[Domain Entity]
        RepoInterface[Repository Interface]
        VO[Value Objects]
    end
    subgraph Infrastructure
        SQLRepo[SQLAlchemy Repository]
        RedisCache[Redis Cache Service]
        Models[SQLAlchemy Models]
    end

    Router --> Deps
    Deps --> CmdService
    Deps --> QueryService
    CmdService --> UoW
    CmdService --> RepoInterface
    QueryService --> RepoInterface
    QueryService --> RedisCache
    SQLRepo -- implements --> RepoInterface
    UoW -- manages --> SQLRepo
\`\`\`

### Диаграмма верхнеуровневой архитектуры
\`\`\`mermaid
graph LR
    Client[Web/Mobile Client] -->|HTTP/JSON| FastAPI[FastAPI App :5000]
    FastAPI -->|TCP/Asyncpg| PostgreSQL[(PostgreSQL :5432)]
    FastAPI -->|TCP/Redis-py| Redis[(Redis :6379)]
    Admin[Admin User] -->|HTTP| FastAPI
    FastAPI -.->|External| GoogleCal[Google Calendar API]
\`\`\`
...
`;

const criteriaData = [
	{
		id: 1,
		status: 'success',
		description: 'Проверка структуры проекта и использования архитектурных паттернов',
		prompt:
			'Оцените:\n- Разделение на слои (presentation, business logic, data access)\n- Использование паттернов проектирования (MVC, Repository, Unit of Work)\n- Соответствие принципам SOLID\n- Наличие четкой структуры директорий',
		weight: 2,
		tags: ['architecture', 'backend'],
		checks: [
			{
				idx: 1,
				stage: 'auto',
				comment:
					'Хорошее разделение слоёв. Используется паттерн MVC. src/components/ | src/pages/ | src/api/ — чёткое разделение',
				status: 'approved',
				is_passed: true,
			},
		],
	},
	{
		id: 2,
		status: 'warning',
		description: 'Наличие и качество документации кода',
		prompt:
			'Оцените:\n- Наличие docstrings у функций и классов\n- Полнота документации API\n- Наличие README\n- Соответствие документации коду',
		weight: 2,
		tags: ['docs', 'backend'],
		checks: [
			{
				idx: 1,
				stage: 'auto',
				comment: 'Нет docstring у трёх функций: openCreateModal, handleDrop, filterTasks',
				status: 'needs_review',
				is_passed: null,
			},
		],
	},
	{
		id: 3,
		status: 'error',
		description: 'Проверка кода на уязвимости и проблемы безопасности',
		prompt:
			'Оцените:\n- Использование параметризованных запросов\n- Хранение паролей (хэширование)\n- Защита от XSS, CSRF\n- Безопасность API endpoints',
		weight: 3,
		tags: ['security', 'backend'],
		checks: [
			{
				idx: 1,
				stage: 'auto',
				comment:
					"Найдена уязвимость: SQL injection в src/api/tasks.ts\nСтрока 42: `query LIKE %' + search + '%'` — небезопасная конкатенация",
				status: 'rejected',
				is_passed: false,
			},
		],
	},
	{
		id: 4,
		status: 'success',
		description: 'Наличие и качество тестов',
		prompt:
			'Оцените:\n- Покрытие тестами\n- Типы тестов (unit, integration, e2e)\n- Качество тестовых данных\n- Использование mocks и stubs',
		weight: 3,
		tags: ['testing', 'backend'],
		checks: [
			{
				idx: 1,
				stage: 'auto',
				comment: 'Покрытие тестами — 78%\nsrc/__tests__/ — 23 теста',
				status: 'approved',
				is_passed: true,
			},
		],
	},
	{
		id: 5,
		status: 'success',
		description: 'Соблюдение стандартов кодирования',
		prompt:
			'Оцените:\n- Соответствие ESLint rules\n- Форматирование кода (Prettier)\n- Именование переменных и функций\n- Соглашения о коммитах',
		weight: 2,
		tags: ['style', 'backend'],
		checks: [
			{
				idx: 1,
				stage: 'auto',
				comment: 'Код соответствует настроенным правилам. Форматирование корректное.',
				status: 'approved',
				is_passed: true,
			},
		],
	},
];

const skillsData = [
	{ subject: 'architecture', value: 70, fullMark: 100 },
	{ subject: 'database', value: 65, fullMark: 100 },
	{ subject: 'api', value: 80, fullMark: 100 },
	{ subject: 'testing', value: 45, fullMark: 100 },
	{ subject: 'security', value: 50, fullMark: 100 },
];

const feedbackContent = `
Здравствуйте! Благодарю вас за предоставленный проект. Видно, что проделана большая работа по проектированию архитектуры: использование паттерна Unit of Work, разделение на слои (Domain, Infrastructure, API) и внедрение асинхронности во всех слоях приложения заслуживают отдельной похвалы.

**Что уже хорошо**

*   **Архитектурные решения:** Проект демонстрирует глубокое понимание паттернов. Использование Unit of Work гарантирует атомарность операций, а четкое разделение на репозитории и сервисы делает код тестируемым и поддерживаемым.
*   **Работа с данными и БД:** Вы грамотно используете асинхронную SQLAlchemy 2.0 и предотвращаете проблему N+1 с помощью \`joinedload\` в \`SQLAlchemyCourseRepository\`. Также отлично реализовано хранение временных меток в UTC на уровне базы данных.
*   **Качество кода и тесты:** Наличие настроенного линтера Ruff и использование \`httpx.AsyncClient\` с \`ASGITransport\` в интеграционных тестах говорят о высоком техническом уровне реализации.

**Что можно улучшить**

*   **Валидация входных данных:** В Pydantic-моделях (например, в \`src/api/auth/schemas.py\`) сейчас используются только базовые типы. Это критично, так как отсутствие ограничений (например, \`min_length\` для паролей или \`EmailStr\` для почты) позволяет передавать в систему некорректные данные. Рекомендую добавить параметры \`Field(...)\` и использовать встроенные типы Pydantic для строгой валидации.
*   **Информативность OpenAPI:** В схемах отсутствуют описания полей (\`description\`). Это затрудняет понимание API другими разработчиками или фронтенд-командой. Добавление описаний в \`Field\` сделает вашу документацию \`/docs\` по-настоящему профессиональной.


Ваш проект выполнен на очень высоком уровне, особенно в части реализации Domain-Driven Design. Исправление замечаний по валидации и безопасности превратит его в эталонный production-ready сервис. У вас отличная база, продолжайте в том же духе!
`;

interface DemoCriterion {
	id: number;
	status: 'success' | 'warning' | 'error';
	title: string;
	description: string;
	prompt: string;
	weight: number;
	tags: string[];
	checks: {
		idx: number;
		stage: string;
		comment: string;
		status: 'approved' | 'needs_review' | 'rejected';
		is_passed: boolean | null;
	}[];
}

interface DemoCriteriaCardProps {
	criterion: DemoCriterion;
}

function DemoCriteriaCard({ criterion }: DemoCriteriaCardProps) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => setIsOpen((prev) => !prev);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'success':
				return 'green';
			case 'warning':
				return 'yellow';
			case 'error':
				return 'red';
			default:
				return 'gray';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'success':
				return 'Выполнен';
			case 'warning':
				return 'Требуется проверка';
			case 'error':
				return 'Не выполнен';
			default:
				return 'Неизвестно';
		}
	};

	const getCheckStatusBadge = (check: DemoCriterion['checks'][0]) => {
		if (check.is_passed === true) {
			return (
				<Badge color="green" variant="outline" size="sm" leftSection={<IconCheck size={12} />}>
					Критерий выполнен
				</Badge>
			);
		}
		if (check.is_passed === false) {
			return (
				<Badge color="red" variant="outline" size="sm" leftSection={<IconX size={12} />}>
					Критерий не выполнен
				</Badge>
			);
		}
		return (
			<Badge color="gray" variant="outline" size="sm">
				На проверке
			</Badge>
		);
	};

	const getStageLabel = (stage: string) => {
		switch (stage) {
			case 'auto':
				return 'Автоматическая';
			case 'manual':
				return 'Ручная';
			default:
				return stage;
		}
	};

	return (
		<Card withBorder padding="sm">
			<Stack gap="xs" onClick={toggleOpen} style={{ cursor: 'pointer' }}>
				<Group>
					<Text style={{ flex: 1 }} fw={600}>
						{criterion.description}
					</Text>
					{isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
				</Group>
				<Group gap="xs">
					<Badge size="sm" variant="outline" color={getStatusColor(criterion.status)}>
						{getStatusLabel(criterion.status)}
					</Badge>
					<Badge size="sm" variant="outline" color="gray">
						Вес: {criterion.weight}
					</Badge>
				</Group>
			</Stack>

			<Collapse expanded={isOpen}>
				<Stack gap="sm" mt="md">
					<Box>
						<MarkdownRenderer content={criterion.prompt} />
					</Box>
					<Stack gap="xs">
						<Text size="sm" fw={500}>
							Результаты проверок
						</Text>
						{criterion.checks.map((check) => (
							<Card key={check.idx} withBorder padding="xs">
								<Stack gap="xs">
									<Text size="sm" c="dimmed">
										Проверка № {check.idx} ({getStageLabel(check.stage)})
									</Text>
									<div>
										<MarkdownRenderer content={check.comment} />
									</div>
									<Group gap="xs">{getCheckStatusBadge(check)}</Group>
								</Stack>
							</Card>
						))}
					</Stack>
				</Stack>
			</Collapse>
		</Card>
	);
}

export function DemoReport() {
	return (
		<Box py={{ base: 60, md: 100 }} className={styles.section}>
			<Container size="lg">
				<Title order={2} ta="center" mb={16} fw={700} fz={{ base: 28, md: 36 }}>
					Пример результата
				</Title>
				<Text ta="center" c="dimmed" mb={48} size="lg">
					Посмотрите, как выглядит отчёт о проверке студенческого проекта
				</Text>

				<Card className={styles.reportCard} padding="xl" radius="lg">
					<Tabs defaultValue="docs" className={styles.tabs}>
						<Tabs.List mb="xl">
							<Tabs.Tab value="docs" leftSection={<IconFileText size={16} />}>
								Проектная документация
							</Tabs.Tab>
							<Tabs.Tab value="criteria" leftSection={<IconCheckbox size={16} />}>
								Критериальная проверка
							</Tabs.Tab>
							<Tabs.Tab value="skills" leftSection={<IconChartBar size={16} />}>
								Оценка компетенций
							</Tabs.Tab>
							<Tabs.Tab value="feedback" leftSection={<IconMessageCircle size={16} />}>
								Обратная связь
							</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value="docs">
							<Stack gap="md">
								<Card withBorder padding="lg">
									<MarkdownRenderer content={projectDocContent} />
								</Card>
							</Stack>
						</Tabs.Panel>

						<Tabs.Panel value="criteria">
							<Stack gap="sm">
								{criteriaData.map((item) => (
									<DemoCriteriaCard key={item.id} criterion={item as DemoCriterion} />
								))}
							</Stack>
						</Tabs.Panel>

						<Tabs.Panel value="skills">
							<Stack gap="md">
								<Card withBorder padding="lg">
									<RadarChart
										h={350}
										data={skillsData}
										dataKey="subject"
										withPolarRadiusAxis
										polarRadiusAxisProps={{ domain: [0, 100], ticks: [25, 50, 75, 100] }}
										series={[{ name: 'value', color: 'blue.6' }]}
										withPolarAngleAxis
										withTooltip
										withDots
									/>
								</Card>
							</Stack>
						</Tabs.Panel>

						<Tabs.Panel value="feedback">
							<Stack gap="md">
								<Card withBorder padding="lg">
									<MarkdownRenderer content={feedbackContent} />
								</Card>
							</Stack>
						</Tabs.Panel>
					</Tabs>
				</Card>
			</Container>
		</Box>
	);
}
