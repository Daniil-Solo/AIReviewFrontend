OpenAPI: 3.1.0
API: AI Review API v0.1.0

Endpoints:

POST   /api/v1/auth/login                                 -> req: UserLoginDTO, res: TokenDTO
POST   /api/v1/auth/register/start                        -> req: EmailRegistrationRequestDTO, res: SuccessOperationDTO
POST   /api/v1/auth/register/confirm                      -> req: EmailConfirmationRequestDTO, res: TokenDTO

POST   /api/v1/criteria                                    -> req: CriterionCreateDTO, res: CriterionResponseDTO
GET    /api/v1/criteria                                    -> query: tags(string[]|null), search(string|null), res: [CriterionResponseDTO]
GET    /api/v1/criteria/available_tags                     -> res: [string]
GET    /api/v1/criteria/{criterion_id}                     -> res: CriterionResponseDTO
PUT    /api/v1/criteria/{criterion_id}                     -> req: CriterionUpdateDTO, res: CriterionResponseDTO
DELETE /api/v1/criteria/{criterion_id}                     -> res: SuccessOperationDTO

GET    /api/v1/users                                        -> res: [UserResponseDTO]
POST   /api/v1/users                                        -> req: UserCreateDTO, res: UserResponseDTO
GET    /api/v1/users/{user_id}                              -> res: UserResponseDTO
POST   /api/v1/users/admin                                  -> req: UserCreateDTO, res: UserResponseDTO

POST   /api/v1/workspaces                                   -> req: WorkspaceCreateDTO, res: WorkspaceResponseDTO
PUT    /api/v1/workspaces/{workspace_id}                    -> req: WorkspaceUpdateDTO, res: WorkspaceResponseDTO
DELETE /api/v1/workspaces/{workspace_id}                    -> res: SuccessOperationDTO
GET    /api/v1/workspaces/{workspace_id}                    -> res: WorkspaceResponseDTO
GET    /api/v1/workspaces/{workspace_id}/tasks              -> res: [TaskResponseDTO]
GET    /api/v1/workspaces/{workspace_id}/members            -> res: [WorkspaceMemberResponseDTO]
GET    /api/v1/workspaces/{workspace_id}/join_rules         -> res: [WorkspaceJoinRuleResponseDTO]
POST   /api/v1/workspaces/{workspace_id}/join_rules         -> req: WorkspaceJoinRuleRequestCreateDTO, res: WorkspaceJoinRuleResponseDTO
PUT    /api/v1/workspaces/{workspace_id}/join_rules/{rule_id} -> req: WorkspaceJoinRuleRequestUpdateDTO, res: WorkspaceJoinRuleResponseDTO
DELETE /api/v1/workspaces/{workspace_id}/join_rules/{rule_id} -> res: SuccessOperationDTO
PATCH  /api/v1/workspaces/{workspace_id}/members/{member_id} -> req: WorkspaceMemberUpdateDTO, res: WorkspaceMemberResponseDTO
POST   /api/v1/workspaces/{workspace_id}/leave              -> res: SuccessOperationDTO
PATCH  /api/v1/workspaces/{workspace_id}/owner              -> req: TransferOwnershipDTO, res: WorkspaceResponseDTO
GET    /api/v1/workspaces/slugs/availability                -> query: slug(string), res: SlugCheckResponseDTO

POST   /api/v1/joins                                        -> req: JoinBySlugDTO, res: JoinResponseDTO

POST   /api/v1/tasks                                        -> req: TaskCreateDTO, res: TaskResponseDTO
PUT    /api/v1/tasks/{task_id}                              -> req: TaskUpdateDTO, res: TaskResponseDTO
GET    /api/v1/tasks/{task_id}                              -> res: TaskResponseDTO
DELETE /api/v1/tasks/{task_id}                              -> res: SuccessOperationDTO
GET    /api/v1/tasks/{task_id}/public                       -> res: TaskResponseDTO
POST   /api/v1/tasks/{task_id}/criteria                     -> req: TaskCriteriaCreateRequestDTO, res: TaskCriteriaResponseDTO
GET    /api/v1/tasks/{task_id}/criteria                     -> res: [TaskCriteriaFullResponseDTO]
POST   /api/v1/tasks/{task_id}/criteria/batch               -> req: TaskCriteriaCreateBatchDTO, res: SuccessOperationDTO
PATCH  /api/v1/tasks/{task_id}/criteria/{task_criterion_id} -> req: TaskCriteriaUpdateWeightDTO, res: TaskCriteriaResponseDTO
DELETE /api/v1/tasks/{task_id}/criteria/{task_criterion_id} -> res: SuccessOperationDTO
GET    /api/v1/tasks/{task_id}/solutions                    -> res: [SolutionShortResponseDTO]

POST   /api/v1/solutions                                    -> multipart/form-data: task_id(int), format(SolutionFormatEnum), link(string|null), file(binary|null) -> res: SolutionShortResponseDTO
GET    /api/v1/solutions/my                                 -> query: task_id(int|null), res: [SolutionShortResponseDTO]
GET    /api/v1/solutions/{solution_id}                      -> res: SolutionShortResponseDTO
POST   /api/v1/solutions/{solution_id}/cancel               -> res: SuccessOperationDTO
POST   /api/v1/solutions/{solution_id}/restart              -> res: SuccessOperationDTO
GET    /api/v1/solutions/{solution_id}/info                 -> res: PipelineInfoDTO
GET    /api/v1/solutions/{solution_id}/artefacts/{step}     -> res: (binary/any)

GET    /api/v1/profile/workspaces                           -> res: [UserWorkspaceResponseDTO]

GET    /api/v1/transactions/balance                         -> res: BalanceResponseDTO
POST   /api/v1/transactions                                 -> req: AdminTopUpDTO, res: TransactionResponseDTO
GET    /api/v1/transactions                                 -> query: started_at(date-time|null), ended_at(date-time|null), res: [TransactionHourlyGroupDTO]

GET    /api/internal/health                                 -> res: object

Schemas (key fields):

UserLoginDTO: email(string), password(string)
TokenDTO: access_token(string)
SuccessOperationDTO: message(string)
EmailRegistrationRequestDTO: fullname(string), email(string), password(string)
EmailConfirmationRequestDTO: email(string), code(string)

CriterionCreateDTO: description(string), tags(string[]), stage(CriterionStageEnum | null), is_public(boolean)
CriterionResponseDTO: id(int), description(string), tags(string[]), stage(CriterionStageEnum | null), is_public(boolean), created_by(int), created_at(date-time)
CriterionUpdateDTO: description(string), tags(string[]), stage(CriterionStageEnum | null), is_public(boolean)
CriterionStageEnum: "PROJECT_DOC", "CODEBASE", "MANUAL"

UserCreateDTO: fullname(string), email(string), password(string)
UserResponseDTO: id(int), email(string), fullname(string), is_admin(boolean), is_verified(boolean), created_at(date-time), hashed_password(string)

WorkspaceCreateDTO: name(string), description(string)
WorkspaceUpdateDTO: name(string), description(string)
WorkspaceResponseDTO: id(int), name(string), description(string), is_archived(boolean), created_at(date-time)

WorkspaceMemberResponseDTO: user_id(int), workspace_id(int), role(WorkspaceMemberRoleEnum), id(int), fullname(string), email(string)
WorkspaceMemberRoleEnum: "OWNER", "TEACHER", "STUDENT"
WorkspaceMemberUpdateDTO: role(WorkspaceMemberRoleEnum)

WorkspaceJoinRuleRequestCreateDTO: slug(string), role(WorkspaceMemberRoleEnum), is_active(boolean), expired_at(date-time|null), password(string|null)
WorkspaceJoinRuleRequestUpdateDTO: slug(string), role(WorkspaceMemberRoleEnum), is_active(boolean), expired_at(date-time|null), password(string|null)
WorkspaceJoinRuleResponseDTO: id(int), workspace_id(int), slug(string), role(WorkspaceMemberRoleEnum), expired_at(date-time|null), is_active(boolean), has_password(boolean), used_count(int)

TransferOwnershipDTO: member_id(int)
JoinBySlugDTO: slug(string), password(string|null)
JoinResponseDTO: workspace_id(int)
SlugCheckResponseDTO: slug(string), is_available(boolean)

TaskCreateDTO: workspace_id(int), name(string), description(string)
TaskUpdateDTO: name(string), description(string), is_active(boolean)
TaskResponseDTO: id(int), workspace_id(int), name(string), description(string), is_active(boolean), created_by(int), created_at(date-time), use_exam(boolean)

TaskCriteriaCreateRequestDTO: criterion_id(int), weight(number)
TaskCriteriaResponseDTO: id(int), task_id(int), criterion_id(int), weight(number)
TaskCriteriaFullResponseDTO: id(int), task_id(int), criterion_id(int), weight(number), criterion(CriterionResponseDTO)
TaskCriteriaCreateBatchDTO: criterion_ids(int[])
TaskCriteriaUpdateWeightDTO: weight(number)

SolutionFormatEnum: "ZIP", "GITHUB"
SolutionStatusEnum: "CREATED", "CANCELLED", "ERROR", "AI_REVIEW", "WAITING_EXAM", "EXAMINATION", "HUMAN_REVIEW", "REVIEWED"
PipelineStepEnum: "prepare_project_tree", "prepare_project_content", "create_project_doc", "critic", "resolve_gaps", "improve_doc"
PipelineTaskStatusEnum: "pending", "running", "completed", "failed"

SolutionShortResponseDTO: id(int), task_id(int), format(SolutionFormatEnum), link(string), status(SolutionStatusEnum), steps(PipelineStepEnum[]), human_grade(int|null), human_feedback(string|null), ai_feedback(string|null), created_at(date-time), created_by(int), author(ShortUserDTO|null)
ShortUserDTO: id(int), email(string), fullname(string), is_admin(boolean)

PipelineInfoDTO: solution_id(int), solution_status(SolutionStatusEnum), solution_steps(PipelineStepEnum[]), pipeline_tasks(PipelineTaskDTO[])
PipelineTaskDTO: id(int), solution_id(int), step(PipelineStepEnum), status(PipelineTaskStatusEnum), error_text(string|null), duration(number|null), last_checked_at(date-time|null), ran_at(date-time|null), created_at(date-time)

UserWorkspaceResponseDTO: workspace(WorkspaceResponseDTO), role(WorkspaceMemberRoleEnum)

BalanceResponseDTO: balance(number)
AdminTopUpDTO: user_id(int), amount(number)
TransactionResponseDTO: id(int), user_id(int), amount(number), type(TransactionTypeEnum), metadata(object|null), created_at(date-time)
TransactionHourlyGroupDTO: hour(date-time), amount(number)
TransactionTypeEnum: "WELCOME_BONUS", "REVIEW", "ADMIN_TOP_UP", "DEPOSIT"

HTTPValidationError: detail(ValidationError[])
ValidationError: loc((string|int)[]), msg(string), type(string)