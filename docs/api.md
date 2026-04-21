OpenAPI: 3.1.0
API: AI Review API v0.1.0

Endpoints:

POST   /api/v1/auth/login                                 -> body: UserLoginDTO, resp: TokenDTO
POST   /api/v1/auth/register/start                        -> body: EmailRegistrationRequestDTO, resp: SuccessOperationDTO
POST   /api/v1/auth/register/confirm                      -> body: EmailConfirmationRequestDTO, resp: TokenDTO

POST   /api/v1/criteria                                    -> body: CriterionCreateDTO, resp: CriterionResponseDTO
GET    /api/v1/criteria                                    -> query: tags(string[]|null), search(string|null), resp: [CriterionResponseDTO]
GET    /api/v1/criteria/available_tags                     -> resp: [string]
GET    /api/v1/criteria/{criterion_id}                     -> resp: CriterionResponseDTO
PUT    /api/v1/criteria/{criterion_id}                     -> body: CriterionUpdateDTO, resp: CriterionResponseDTO
DELETE /api/v1/criteria/{criterion_id}                     -> resp: SuccessOperationDTO

GET    /api/v1/users                                        -> resp: [UserResponseDTO]
POST   /api/v1/users                                        -> body: UserCreateDTO, resp: UserResponseDTO
GET    /api/v1/users/{user_id}                              -> resp: UserResponseDTO
POST   /api/v1/users/admin                                  -> body: UserCreateDTO, resp: UserResponseDTO

POST   /api/v1/workspaces                                   -> body: WorkspaceCreateDTO, resp: WorkspaceResponseDTO
PUT    /api/v1/workspaces/{workspace_id}                    -> body: WorkspaceUpdateDTO, resp: WorkspaceResponseDTO
DELETE /api/v1/workspaces/{workspace_id}                    -> resp: SuccessOperationDTO
GET    /api/v1/workspaces/{workspace_id}                    -> resp: WorkspaceResponseDTO
GET    /api/v1/workspaces/{workspace_id}/tasks              -> resp: [TaskResponseDTO]
GET    /api/v1/workspaces/{workspace_id}/members            -> resp: [WorkspaceMemberResponseDTO]
GET    /api/v1/workspaces/{workspace_id}/join_rules         -> resp: [WorkspaceJoinRuleResponseDTO]
POST   /api/v1/workspaces/{workspace_id}/join_rules         -> body: WorkspaceJoinRuleRequestCreateDTO, resp: WorkspaceJoinRuleResponseDTO
PUT    /api/v1/workspaces/{workspace_id}/join_rules/{rule_id} -> body: WorkspaceJoinRuleRequestUpdateDTO, resp: WorkspaceJoinRuleResponseDTO
DELETE /api/v1/workspaces/{workspace_id}/join_rules/{rule_id} -> resp: SuccessOperationDTO
PATCH  /api/v1/workspaces/{workspace_id}/members/{member_id} -> body: WorkspaceMemberUpdateDTO, resp: WorkspaceMemberResponseDTO
POST   /api/v1/workspaces/{workspace_id}/leave              -> resp: SuccessOperationDTO
PATCH  /api/v1/workspaces/{workspace_id}/owner              -> body: TransferOwnershipDTO, resp: WorkspaceResponseDTO
GET    /api/v1/workspaces/slugs/availability                -> query: slug(string), resp: SlugCheckResponseDTO
GET    /api/v1/workspaces/{workspace_id}/criteria           -> query: tags(string[]|null), search(string|null), resp: [CriterionResponseDTO]

POST   /api/v1/joins                                        -> body: JoinBySlugDTO, resp: JoinResponseDTO

POST   /api/v1/tasks                                        -> body: TaskCreateDTO, resp: TaskResponseDTO
PUT    /api/v1/tasks/{task_id}                              -> body: TaskUpdateDTO, resp: TaskResponseDTO
GET    /api/v1/tasks/{task_id}                              -> resp: TaskResponseDTO
DELETE /api/v1/tasks/{task_id}                              -> resp: SuccessOperationDTO
GET    /api/v1/tasks/{task_id}/public                       -> resp: TaskResponseDTO
POST   /api/v1/tasks/{task_id}/criteria                     -> body: TaskCriteriaCreateRequestDTO, resp: TaskCriteriaResponseDTO
GET    /api/v1/tasks/{task_id}/criteria                     -> resp: [TaskCriteriaFullResponseDTO]
POST   /api/v1/tasks/{task_id}/criteria/batch               -> body: TaskCriteriaCreateBatchDTO, resp: SuccessOperationDTO
PATCH  /api/v1/tasks/{task_id}/criteria/{task_criterion_id} -> body: TaskCriteriaUpdateWeightDTO, resp: TaskCriteriaResponseDTO
DELETE /api/v1/tasks/{task_id}/criteria/{task_criterion_id} -> resp: SuccessOperationDTO
GET    /api/v1/tasks/{task_id}/solutions                    -> resp: [SolutionShortResponseDTO]

POST   /api/v1/solutions                                    -> multipart: task_id(int), format(SolutionFormatEnum), link(string|null), file(binary|null), resp: SolutionShortResponseDTO
GET    /api/v1/solutions/my                                 -> query: task_id(int|null), resp: [SolutionShortResponseDTO]
GET    /api/v1/solutions/{solution_id}                      -> resp: SolutionShortResponseDTO
POST   /api/v1/solutions/{solution_id}/cancel               -> resp: SuccessOperationDTO
POST   /api/v1/solutions/{solution_id}/restart              -> resp: SuccessOperationDTO
GET    /api/v1/solutions/{solution_id}/info                 -> resp: PipelineInfoDTO
GET    /api/v1/solutions/{solution_id}/artefacts/{step}     -> resp: binary/any
POST   /api/v1/solutions/{solution_id}/criteria-checks      -> body: SolutionCriteriaCheckCreateRequestDTO, resp: SuccessOperationDTO

GET    /api/v1/profile/workspaces                           -> resp: [UserWorkspaceResponseDTO]

GET    /api/v1/transactions/balance                         -> resp: BalanceResponseDTO
POST   /api/v1/transactions                                 -> body: AdminTopUpDTO, resp: TransactionResponseDTO
GET    /api/v1/transactions                                 -> query: started_at(date-time|null), ended_at(date-time|null), types(TransactionTypeEnum[]|null), resp: [TransactionResponseDTO]

GET    /api/internal/health                                 -> resp: object

Schemas (key fields):

UserLoginDTO: email, password

TokenDTO: access_token

SuccessOperationDTO: message

EmailRegistrationRequestDTO: fullname, email, password

EmailConfirmationRequestDTO: email, code

CriterionCreateDTO: description, tags(string[]), stage(CriterionStageEnum|null), workspace_id(int|null), task_id(int|null)

CriterionUpdateDTO: description, tags(string[]), stage(CriterionStageEnum|null), workspace_id(int|null), task_id(int|null)

CriterionResponseDTO: id, description, tags, stage, workspace_id(int|null), task_id(int|null), created_by, created_at, is_public(readonly)

CriterionStageEnum: PROJECT_DOC, CODEBASE, MANUAL

UserCreateDTO: fullname, email, password(min 8)

UserResponseDTO: id, email, fullname, is_admin, is_verified, created_at, hashed_password

WorkspaceCreateDTO: name, description

WorkspaceUpdateDTO: name, description

WorkspaceResponseDTO: id, name, description, is_archived, created_at

WorkspaceMemberResponseDTO: user_id, workspace_id, role(OWNER/TEACHER/STUDENT), id, fullname, email

WorkspaceMemberUpdateDTO: role

WorkspaceJoinRuleRequestCreateDTO: slug, role, is_active(default true), expired_at(dt|null), password(string|null)

WorkspaceJoinRuleRequestUpdateDTO: slug, role, is_active, expired_at(dt|null), password(string|null)

WorkspaceJoinRuleResponseDTO: id, workspace_id, slug, role, expired_at(dt|null), is_active, has_password, used_count

TransferOwnershipDTO: member_id

JoinBySlugDTO: slug, password(string|null)

JoinResponseDTO: workspace_id

SlugCheckResponseDTO: slug, is_available

TaskCreateDTO: workspace_id, name, description

TaskUpdateDTO: name, description, is_active

TaskResponseDTO: id, workspace_id, name, description, is_active, created_by, created_at, use_exam

TaskCriteriaCreateRequestDTO: criterion_id, weight(number≥0)

TaskCriteriaResponseDTO: id, task_id, criterion_id, weight

TaskCriteriaFullResponseDTO: id, task_id, criterion_id, weight, criterion(CriterionResponseDTO)

TaskCriteriaCreateBatchDTO: criterion_ids(int[])

TaskCriteriaUpdateWeightDTO: weight

SolutionFormatEnum: ZIP, GITHUB

SolutionStatusEnum: CREATED, CANCELLED, ERROR, AI_REVIEW, WAITING_EXAM, EXAMINATION, HUMAN_REVIEW, REVIEWED

PipelineStepEnum: prepare_project_tree, prepare_project_content, create_project_doc, critic, resolve_gaps, improve_doc, grade_by_project_doc, grade_by_codebase

PipelineTaskStatusEnum: pending, running, completed, failed

SolutionShortResponseDTO: id, task_id, format, link, status, steps(PipelineStepEnum[]), human_grade(int|null), human_feedback, ai_feedback, created_at, created_by, author(ShortUserDTO|null)

ShortUserDTO: id, email, fullname, is_admin

PipelineInfoDTO: solution_id, solution_status, solution_steps(PipelineStepEnum[]), pipeline_tasks(PipelineTaskDTO[])

PipelineTaskDTO: id, solution_id, step, status, error_text, duration, last_checked_at, ran_at, created_at

SolutionCriteriaCheckCreateRequestDTO: task_criterion_id, is_passed, comment(default "")

UserWorkspaceResponseDTO: workspace(WorkspaceResponseDTO), role

BalanceResponseDTO: balance

AdminTopUpDTO: user_id, amount

TransactionResponseDTO: id, user_id, amount, type(WELCOME_BONUS/ADMIN_TOP_UP/LLM_CALL), metadata(object|null), created_at

HTTPValidationError: detail(ValidationError[])

ValidationError: loc((string|int)[]), msg, type