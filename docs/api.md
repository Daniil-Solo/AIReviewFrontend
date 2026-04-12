OpenAPI: 3.1.0
API: AI Review API v0.1.0

Endpoints:

POST   /api/v1/auth/login                     -> req: UserLoginDTO, res: TokenDTO
POST   /api/v1/auth/register/start            -> req: EmailRegistrationRequestDTO, res: SuccessOperationDTO
POST   /api/v1/auth/register/confirm          -> req: EmailConfirmationRequestDTO, res: TokenDTO

POST   /api/v1/criteria                       -> auth, req: CriterionCreateDTO, res: CriterionResponseDTO
GET    /api/v1/criteria                       -> auth, params: tags[] (string, opt), search (string, opt), res: CriterionResponseDTO[]
GET    /api/v1/criteria/available_tags        -> auth, res: string[]
GET    /api/v1/criteria/{criterion_id}        -> auth, path: criterion_id(int), res: CriterionResponseDTO
PUT    /api/v1/criteria/{criterion_id}        -> auth, path: criterion_id, req: CriterionUpdateDTO, res: CriterionResponseDTO
DELETE /api/v1/criteria/{criterion_id}        -> auth, path: criterion_id, res: SuccessOperationDTO

GET    /api/v1/users                          -> auth, res: UserResponseDTO[]
POST   /api/v1/users                          -> req: UserCreateDTO, res: UserResponseDTO
GET    /api/v1/users/{user_id}                -> path: user_id(int), res: UserResponseDTO
POST   /api/v1/users/admin                    -> req: UserCreateDTO, res: UserResponseDTO

POST   /api/v1/workspaces                     -> auth, req: WorkspaceCreateDTO, res: WorkspaceResponseDTO
PUT    /api/v1/workspaces/{workspace_id}      -> auth, path: workspace_id(int), req: WorkspaceUpdateDTO, res: WorkspaceResponseDTO
DELETE /api/v1/workspaces/{workspace_id}      -> auth, path: workspace_id, res: SuccessOperationDTO
GET    /api/v1/workspaces/{workspace_id}      -> auth, path: workspace_id, res: WorkspaceResponseDTO
GET    /api/v1/workspaces/{workspace_id}/tasks -> auth, path: workspace_id, res: TaskResponseDTO[]
GET    /api/v1/workspaces/{workspace_id}/members -> auth, path: workspace_id, res: WorkspaceMemberResponseDTO[]
GET    /api/v1/workspaces/{workspace_id}/join_rules -> auth, path: workspace_id, res: WorkspaceJoinRuleResponseDTO[]
POST   /api/v1/workspaces/{workspace_id}/join_rules -> auth, path: workspace_id, req: WorkspaceJoinRuleRequestCreateDTO, res: WorkspaceJoinRuleResponseDTO
PUT    /api/v1/workspaces/{workspace_id}/join_rules/{rule_id} -> auth, path: workspace_id, rule_id(int), req: WorkspaceJoinRuleRequestUpdateDTO, res: WorkspaceJoinRuleResponseDTO
DELETE /api/v1/workspaces/{workspace_id}/join_rules/{rule_id} -> auth, path: workspace_id, rule_id, res: SuccessOperationDTO
PATCH  /api/v1/workspaces/{workspace_id}/members/{member_id} -> auth, path: workspace_id, member_id, req: WorkspaceMemberUpdateDTO, res: WorkspaceMemberResponseDTO
POST   /api/v1/workspaces/{workspace_id}/leave -> auth, path: workspace_id, res: SuccessOperationDTO
PATCH  /api/v1/workspaces/{workspace_id}/owner -> auth, path: workspace_id, req: TransferOwnershipDTO, res: WorkspaceResponseDTO
POST   /api/v1/workspaces/slugs/availability   -> query: slug(string), res: SlugCheckResponseDTO

POST   /api/v1/joins                          -> auth, req: JoinBySlugDTO, res: JoinResponseDTO

POST   /api/v1/tasks                          -> auth, req: TaskCreateDTO, res: TaskResponseDTO
PUT    /api/v1/tasks/{task_id}                -> auth, path: task_id(int), req: TaskUpdateDTO, res: TaskResponseDTO
GET    /api/v1/tasks/{task_id}                -> auth, path: task_id, res: TaskResponseDTO
DELETE /api/v1/tasks/{task_id}                -> auth, path: task_id, res: SuccessOperationDTO
GET    /api/v1/tasks/{task_id}/public         -> auth, path: task_id, res: TaskResponseDTO
POST   /api/v1/tasks/{task_id}/criteria       -> auth, path: task_id, req: TaskCriteriaCreateDTO, res: TaskCriteriaResponseDTO
GET    /api/v1/tasks/{task_id}/criteria       -> auth, path: task_id, res: TaskCriteriaResponseDTO[]
PATCH  /api/v1/tasks/{task_id}/criteria/{task_criterion_id} -> auth, path: task_id, task_criterion_id(int), req: TaskCriteriaUpdateWeightDTO, res: TaskCriteriaResponseDTO
DELETE /api/v1/tasks/{task_id}/criteria/{task_criterion_id} -> auth, path: task_id, task_criterion_id, res: SuccessOperationDTO
GET    /api/v1/tasks/{task_id}/solutions      -> auth, path: task_id, res: SolutionShortResponseDTO[]

GET /api/v1/profile/workspaces                -> auth, res: UserWorkspaceResponseDTO[]

POST   /api/v1/solutions                      -> auth, multipart/form-data: task_id(int), format(SolutionFormatEnum), link(string,opt), file(binary,opt), res: SolutionShortResponseDTO
GET    /api/v1/solutions/{solution_id}        -> auth, path: solution_id(int), res: SolutionShortResponseDTO
POST   /api/v1/solutions/{solution_id}/cancel -> auth, path: solution_id, res: SuccessOperationDTO

GET    /api/internal/health                   -> res: object (status)

Schemas (key fields):

UserLoginDTO: email(string), password(string)
EmailRegistrationRequestDTO: fullname, email, password
EmailConfirmationRequestDTO: email, code
TokenDTO: access_token
SuccessOperationDTO: message

CriterionCreateDTO: description(string,1-1000), tags(string[]), stage(PROJECT_DOC|CODEBASE|MANUAL|null), is_public(boolean,default true)
CriterionResponseDTO: id, description, tags, stage, is_public, created_by(int), created_at(datetime)
CriterionUpdateDTO: same as Create but all optional except description
CriterionStageEnum: PROJECT_DOC, CODEBASE, MANUAL

UserCreateDTO: fullname(1-255), email, password(min8)
UserResponseDTO: id, email, fullname, is_admin, is_verified, created_at, hashed_password

WorkspaceCreateDTO: name(1-255), description(0-5000,opt)
WorkspaceResponseDTO: id, name, description, is_archived, created_at
WorkspaceUpdateDTO: name, description(opt)
UserWorkspaceResponseDTO: workspace: WorkspaceResponseDTO, role: WorkspaceMemberRoleEnum

WorkspaceMemberResponseDTO: user_id, workspace_id, role(OWNER|TEACHER|STUDENT), id, fullname, email
WorkspaceMemberUpdateDTO: role
WorkspaceMemberRoleEnum: OWNER, TEACHER, STUDENT

WorkspaceJoinRuleRequestCreateDTO: slug(1-255), role, is_active(default true), expired_at(datetime|null), password(1-255|null)
WorkspaceJoinRuleRequestUpdateDTO: same
WorkspaceJoinRuleResponseDTO: id, workspace_id, slug, role, expired_at, is_active, has_password

JoinBySlugDTO: slug, password(opt)
JoinResponseDTO: workspace_id
SlugCheckResponseDTO: slug, is_available
TransferOwnershipDTO: member_id

TaskCreateDTO: workspace_id, name(1-255), description(0-5000,opt)
TaskResponseDTO: id, workspace_id, name, description, is_active, created_by, created_at, use_exam
TaskUpdateDTO: name, description(opt), is_active

TaskCriteriaCreateDTO: task_id, criterion_id, weight(0.0-1.0)
TaskCriteriaResponseDTO: id, task_id, criterion_id, weight
TaskCriteriaUpdateWeightDTO: weight(0.0-1.0)

SolutionFormatEnum: ZIP, GITHUB
SolutionStatusEnum: CREATED, CANCELLED, ERROR, AI_REVIEW, WAITING_EXAM, EXAMINATION, HUMAN_REVIEW, REVIEWED
SolutionShortResponseDTO: id, task_id, format, link, status, human_grade(int|null), human_feedback(string|null), ai_feedback(string|null), created_at, created_by

Body_create_endpoint_api_v1_solutions_post: task_id, format, link(opt), file(opt)

HTTPValidationError: detail (ValidationError[])
ValidationError: loc(list), msg, type, input, ctx

Security: HTTPBearer (bearer token)