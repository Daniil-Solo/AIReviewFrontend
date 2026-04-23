Endpoints:

POST /api/v1/auth/login -> body: UserLoginDTO (email: string, password: string), resp: TokenDTO (access_token: string)
POST /api/v1/auth/register/start -> body: EmailRegistrationRequestDTO (fullname: string, email: string, password: string), resp: SuccessOperationDTO (message: string)
POST /api/v1/auth/register/confirm -> body: EmailConfirmationRequestDTO (email: string, code: string), resp: TokenDTO

POST /api/v1/criteria -> body: CriterionCreateDTO (description: string, tags: string[], stage: CriterionStageEnum|null, workspace_id: int|null, task_id: int|null), resp: CriterionResponseDTO
GET /api/v1/criteria -> query: tags: string[]|null, search: string|null, resp: CriterionResponseDTO[]
GET /api/v1/criteria/available_tags -> resp: string[]
GET /api/v1/criteria/{criterion_id} -> resp: CriterionResponseDTO
PUT /api/v1/criteria/{criterion_id} -> body: CriterionUpdateDTO (description: string, tags: string[], stage: CriterionStageEnum|null, workspace_id: int|null, task_id: int|null), resp: CriterionResponseDTO
DELETE /api/v1/criteria/{criterion_id} -> resp: SuccessOperationDTO

GET /api/v1/users -> resp: UserResponseDTO[]
POST /api/v1/users -> body: UserCreateDTO (fullname: string, email: string, password: string, min 8), resp: UserResponseDTO
GET /api/v1/users/{user_id} -> resp: UserResponseDTO
POST /api/v1/users/admin -> body: UserCreateDTO, resp: UserResponseDTO

POST /api/v1/workspaces -> body: WorkspaceCreateDTO (name: string, description: string|null), resp: WorkspaceResponseDTO
PUT /api/v1/workspaces/{workspace_id} -> body: WorkspaceUpdateDTO (name: string, description: string|null), resp: WorkspaceResponseDTO
DELETE /api/v1/workspaces/{workspace_id} -> resp: SuccessOperationDTO
GET /api/v1/workspaces/{workspace_id} -> resp: WorkspaceResponseDTO
GET /api/v1/workspaces/{workspace_id}/tasks -> resp: TaskResponseDTO[]
GET /api/v1/workspaces/{workspace_id}/members -> resp: WorkspaceMemberResponseDTO[]
GET /api/v1/workspaces/{workspace_id}/join_rules -> resp: WorkspaceJoinRuleResponseDTO[]
POST /api/v1/workspaces/{workspace_id}/join_rules -> body: WorkspaceJoinRuleRequestCreateDTO (slug: string, role: WorkspaceMemberRoleEnum, is_active: bool, expired_at: datetime|null, password: string|null), resp: WorkspaceJoinRuleResponseDTO
PUT /api/v1/workspaces/{workspace_id}/join_rules/{rule_id} -> body: WorkspaceJoinRuleRequestUpdateDTO (slug: string, role: WorkspaceMemberRoleEnum, is_active: bool, expired_at: datetime|null, password: string|null), resp: WorkspaceJoinRuleResponseDTO
DELETE /api/v1/workspaces/{workspace_id}/join_rules/{rule_id} -> resp: SuccessOperationDTO
PATCH /api/v1/workspaces/{workspace_id}/members/{member_id} -> body: WorkspaceMemberUpdateDTO (role: WorkspaceMemberRoleEnum), resp: WorkspaceMemberResponseDTO
POST /api/v1/workspaces/{workspace_id}/leave -> resp: SuccessOperationDTO
PATCH /api/v1/workspaces/{workspace_id}/owner -> body: TransferOwnershipDTO (member_id: int), resp: WorkspaceResponseDTO
GET /api/v1/workspaces/slugs/availability -> query: slug: string, resp: SlugCheckResponseDTO (slug: string, is_available: bool)
GET /api/v1/workspaces/{workspace_id}/criteria -> query: tags: string[]|null, search: string|null, resp: CriterionResponseDTO[]
GET /api/v1/workspaces/{workspace_id}/grades -> query: task_ids: int[]|null, user_ids: int[]|null, resp: StudentGradesDTO[]
GET /api/v1/workspaces/{workspace_id}/grades/csv -> query: task_ids: int[]|null, user_ids: int[]|null, resp: csv-file

POST /api/v1/joins -> body: JoinBySlugDTO (slug: string, password: string|null), resp: JoinResponseDTO (workspace_id: int)

POST /api/v1/tasks -> body: TaskCreateDTO (workspace_id: int, name: string, description: string), resp: TaskResponseDTO
PUT /api/v1/tasks/{task_id} -> body: TaskUpdateDTO (name: string, description: string, is_active: bool), resp: TaskResponseDTO
GET /api/v1/tasks/{task_id} -> resp: TaskResponseDTO
DELETE /api/v1/tasks/{task_id} -> resp: SuccessOperationDTO
GET /api/v1/tasks/{task_id}/public -> resp: TaskResponseDTO
POST /api/v1/tasks/{task_id}/criteria -> body: TaskCriteriaCreateRequestDTO (criterion_id: int, weight: float >=0), resp: TaskCriteriaResponseDTO
GET /api/v1/tasks/{task_id}/criteria -> resp: TaskCriteriaFullResponseDTO[]
POST /api/v1/tasks/{task_id}/criteria/batch -> body: TaskCriteriaCreateBatchDTO (criterion_ids: int[]), resp: SuccessOperationDTO
PATCH /api/v1/tasks/{task_id}/criteria/{task_criterion_id} -> body: TaskCriteriaUpdateWeightDTO (weight: float >=0), resp: TaskCriteriaResponseDTO
DELETE /api/v1/tasks/{task_id}/criteria/{task_criterion_id} -> resp: SuccessOperationDTO
GET /api/v1/tasks/{task_id}/solutions -> resp: SolutionShortResponseDTO[]
GET /api/v1/tasks/{task_id}/available_criteria -> query: tags: string[]|null, search: string|null, resp: CriterionResponseDTO[]

POST /api/v1/solutions -> multipart: task_id: int, solution_format: SolutionFormatEnum, github_repo_link: string|null, github_repo_branch: string|null, file: binary|null, resp: SolutionShortResponseDTO
GET /api/v1/solutions/my -> query: task_id: int|null, resp: SolutionShortResponseDTO[]
GET /api/v1/solutions/{solution_id} -> resp: SolutionShortResponseDTO
POST /api/v1/solutions/{solution_id}/cancel -> resp: SuccessOperationDTO
POST /api/v1/solutions/{solution_id}/restart -> resp: SuccessOperationDTO
GET /api/v1/solutions/{solution_id}/info -> resp: PipelineInfoDTO
GET /api/v1/solutions/{solution_id}/artefacts/{step} -> resp: binary (raw file)
POST /api/v1/solutions/{solution_id}/criteria-checks -> body: SolutionCriteriaCheckCreateRequestDTO (task_criterion_id: int, is_passed: bool, comment: string), resp: SuccessOperationDTO
GET /api/v1/solutions/{solution_id}/criteria-checks -> resp: CriteriaGradingReviewResponseDTO

GET /api/v1/profile/workspaces -> resp: UserWorkspaceResponseDTO[]

GET /api/v1/transactions/balance -> resp: BalanceResponseDTO (balance: float)
POST /api/v1/transactions -> body: AdminTopUpDTO (user_id: int, amount: float), resp: TransactionResponseDTO
GET /api/v1/transactions -> query: started_at: datetime|null, ended_at: datetime|null, types: TransactionTypeEnum[]|null, resp: TransactionResponseDTO[]

GET /api/internal/health -> resp: object (map[string]bool)

Schemas (key fields with types):

UserLoginDTO: email: string, password: string
TokenDTO: access_token: string
SuccessOperationDTO: message: string

EmailRegistrationRequestDTO: fullname: string, email: string, password: string
EmailConfirmationRequestDTO: email: string, code: string

CriterionStageEnum: "PROJECT_DOC", "CODEBASE", "MANUAL"
CriterionCreateDTO: description: string, tags: string[], stage: CriterionStageEnum|null, workspace_id: int|null, task_id: int|null
CriterionUpdateDTO: same as create
CriterionResponseDTO: id: int, description: string, tags: string[], stage: CriterionStageEnum|null, workspace_id: int|null, task_id: int|null, created_by: int, created_at: datetime, is_public: bool (readonly)

UserCreateDTO: fullname: string, email: string, password: string (min 8)
ShortUserDTO: id: int, email: string, fullname: string, is_admin: bool
UserResponseDTO: id: int, email: string, fullname: string, is_admin: bool, is_verified: bool, created_at: datetime, hashed_password: string

WorkspaceCreateDTO: name: string, description: string (default "")
WorkspaceUpdateDTO: name: string, description: string (default "")
WorkspaceResponseDTO: id: int, name: string, description: string, is_archived: bool, created_at: datetime

WorkspaceMemberRoleEnum: "OWNER", "TEACHER", "STUDENT"
WorkspaceMemberResponseDTO: user_id: int, workspace_id: int, role: WorkspaceMemberRoleEnum, id: int, fullname: string, email: string
WorkspaceMemberUpdateDTO: role: WorkspaceMemberRoleEnum

WorkspaceJoinRuleRequestCreateDTO: slug: string, role: WorkspaceMemberRoleEnum, is_active: bool (default true), expired_at: datetime|null, password: string|null
WorkspaceJoinRuleRequestUpdateDTO: slug: string, role: WorkspaceMemberRoleEnum, is_active: bool (default true), expired_at: datetime|null, password: string|null
WorkspaceJoinRuleResponseDTO: id: int, workspace_id: int, slug: string, role: WorkspaceMemberRoleEnum, expired_at: datetime|null, is_active: bool, has_password: bool, used_count: int

TaskGradeDTO: task_id: int, task_name: string, grade: int|null, best_solution_id: int|null
StudentGradesDTO: user: ShortUserDTO, tasks: TaskGradeDTO[]

TransferOwnershipDTO: member_id: int
JoinBySlugDTO: slug: string, password: string|null
JoinResponseDTO: workspace_id: int
SlugCheckResponseDTO: slug: string, is_available: bool

TaskCreateDTO: workspace_id: int, name: string, description: string (default "")
TaskUpdateDTO: name: string, description: string (default ""), is_active: bool
TaskResponseDTO: id: int, workspace_id: int, name: string, description: string, is_active: bool, created_by: int, created_at: datetime, use_exam: bool

TaskCriteriaCreateRequestDTO: criterion_id: int, weight: float (>=0)
TaskCriteriaResponseDTO: id: int, task_id: int, criterion_id: int, weight: float
TaskCriteriaFullResponseDTO: id: int, task_id: int, criterion_id: int, weight: float, criterion: CriterionResponseDTO
TaskCriteriaCreateBatchDTO: criterion_ids: int[]
TaskCriteriaUpdateWeightDTO: weight: float (>=0)

SolutionFormatEnum: "ZIP", "GITHUB"
SolutionStatusEnum: "CREATED", "CANCELLED", "ERROR", "AI_REVIEW", "WAITING_EXAM", "EXAMINATION", "HUMAN_REVIEW", "REVIEWED"
PipelineStepEnum: "prepare_project_tree", "prepare_project_content", "create_project_doc", "critic", "resolve_gaps", "improve_doc", "grade_by_project_doc", "grade_by_codebase"
PipelineTaskStatusEnum: "pending", "running", "completed", "failed"

ShortUserDTO: id: int, email: string, fullname: string, is_admin: bool
SolutionShortResponseDTO: id: int, task_id: int, format: SolutionFormatEnum, github_repo_link: string|null, github_repo_branch|null, status: SolutionStatusEnum, steps: PipelineStepEnum[], human_grade: int|null, human_feedback: string|null, ai_feedback: string|null, created_at: datetime, created_by: int, author: ShortUserDTO|null
SolutionResponseDTO: extends SolutionShortResponseDTO (additional fields? includes created_by and full solution info)

PipelineTaskDTO: id: int, solution_id: int, step: PipelineStepEnum, status: PipelineTaskStatusEnum, error_text: string|null, duration: float|null, last_checked_at: datetime|null, ran_at: datetime|null, created_at: datetime
PipelineInfoDTO: solution_id: int, solution_status: SolutionStatusEnum, solution_steps: PipelineStepEnum[], pipeline_tasks: PipelineTaskDTO[]

CriterionCheckStatusEnum: "SUFFICIENT", "NEEDS_CODE", "NEEDS_STUDENT", "NEEDS_MANUAL", "NOT_APPLICABLE"
SolutionCriteriaCheckResponseDTO: task_criterion_id: int, solution_id: int, comment: string, stage: CriterionStageEnum, status: CriterionCheckStatusEnum, is_passed: bool|null, id: int, created_at: datetime
SolutionCriteriaCheckCreateRequestDTO: task_criterion_id: int, is_passed: bool, comment: string (default "")
GradingCriterionDTO: criterion: CriterionResponseDTO, weight: float, checks: SolutionCriteriaCheckResponseDTO[]
CriteriaGradingReviewResponseDTO: solution: SolutionResponseDTO, task: TaskResponseDTO, criteria: GradingCriterionDTO[]

UserWorkspaceResponseDTO: workspace: WorkspaceResponseDTO, role: WorkspaceMemberRoleEnum

BalanceResponseDTO: balance: float
AdminTopUpDTO: user_id: int, amount: float
TransactionTypeEnum: "WELCOME_BONUS", "ADMIN_TOP_UP", "LLM_CALL"
TransactionResponseDTO: id: int, user_id: int, amount: float, type: TransactionTypeEnum, metadata: object|null, created_at: datetime

HTTPValidationError: detail: ValidationError[]
ValidationError: loc: (string|int)[], msg: string, type: string