// Endpoints

// DELETE /api/v1/criteria/{criterion_id}
// Path: {criterion_id: number}
// Response: SuccessOperationDTO

// DELETE /api/v1/custom-models/{model_id}
// Path: {model_id: number}
// Response: SuccessOperationDTO

// DELETE /api/v1/tasks/{task_id}
// Path: {task_id: number}
// Response: SuccessOperationDTO

// DELETE /api/v1/tasks/{task_id}/criteria/{task_criterion_id}
// Path: {task_criterion_id: number}
// Response: SuccessOperationDTO

// DELETE /api/v1/workspaces/{workspace_id}
// Path: {workspace_id: number}
// Response: SuccessOperationDTO

// DELETE /api/v1/workspaces/{workspace_id}/join_rules/{rule_id}
// Path: {workspace_id: number, rule_id: number}
// Response: SuccessOperationDTO

// DELETE /api/v1/workspaces/{workspace_id}/members/{member_id}
// Path: {workspace_id: number, member_id: number}
// Response: SuccessOperationDTO

// GET /api/internal/health
// Response: any

// GET /api/v1/app/settings
// Response: AppSettingsResponseDTO

// GET /api/v1/criteria
// Query: { tags?: (string[] | null) | null, search?: (string | null) | null }
// Response: CriterionResponseDTO[]

// GET /api/v1/criteria/available_tags
// Response: string[]

// GET /api/v1/criteria/{criterion_id}
// Path: {criterion_id: number}
// Response: CriterionResponseDTO

// GET /api/v1/custom-models/{model_id}
// Path: {model_id: number}
// Response: CustomModelWithAPIKeyDTO

// GET /api/v1/profile/workspaces
// Response: UserWorkspaceResponseDTO[]

// GET /api/v1/solutions/my
// Query: { task_id?: (number | null) | null }
// Response: SolutionShortResponseDTO[]

// GET /api/v1/solutions/{solution_id}
// Path: {solution_id: number}
// Response: SolutionShortResponseDTO

// GET /api/v1/solutions/{solution_id}/artefacts/{step}
// Path: {solution_id: number, step: string}
// Response: any

// GET /api/v1/solutions/{solution_id}/criteria-checks
// Path: {solution_id: number}
// Response: CriteriaGradingReviewResponseDTO

// GET /api/v1/solutions/{solution_id}/info
// Path: {solution_id: number}
// Response: PipelineInfoDTO

// GET /api/v1/solutions/{solution_id}/score
// Path: {solution_id: number}
// Response: SolutionScoreDTO

// GET /api/v1/solutions/{solution_id}/wind-rose
// Path: {solution_id: number}
// Response: WindRosePointDTO[]

// GET /api/v1/tasks/{task_id}
// Path: {task_id: number}
// Response: TaskResponseDTO

// GET /api/v1/tasks/{task_id}/available_criteria
// Path: {task_id: number}
// Query: { tags?: (string[] | null) | null, search?: (string | null) | null }
// Response: CriterionResponseDTO[]

// GET /api/v1/tasks/{task_id}/criteria
// Path: {task_id: number}
// Response: TaskCriteriaFullResponseDTO[]

// GET /api/v1/tasks/{task_id}/public
// Path: {task_id: number}
// Response: TaskResponseDTO

// GET /api/v1/tasks/{task_id}/solutions
// Path: {task_id: number}
// Response: SolutionShortResponseDTO[]

// GET /api/v1/tasks/{task_id}/steps-models
// Path: {task_id: number}
// Response: TaskStepsModelDTO

// GET /api/v1/transactions
// Query: { started_at?: (string | null) | null, ended_at?: (string | null) | null, types?: (string[] | null) | null }
// Response: TransactionResponseDTO[]

// GET /api/v1/transactions/balance
// Response: BalanceResponseDTO

// GET /api/v1/users
// Response: UserResponseDTO[]

// GET /api/v1/users/{user_id}
// Path: {user_id: number}
// Response: UserResponseDTO

// GET /api/v1/workspaces/slugs/availability
// Query: { slug: string }
// Response: SlugCheckResponseDTO

// GET /api/v1/workspaces/{workspace_id}
// Path: {workspace_id: number}
// Response: WorkspaceResponseDTO

// GET /api/v1/workspaces/{workspace_id}/criteria
// Path: {workspace_id: number}
// Query: { tags?: (string[] | null) | null, search?: (string | null) | null }
// Response: CriterionResponseDTO[]

// GET /api/v1/workspaces/{workspace_id}/custom-models
// Path: {workspace_id: number}
// Response: CustomModelDTO[]

// GET /api/v1/workspaces/{workspace_id}/grades
// Path: {workspace_id: number}
// Query: { task_ids?: (number[] | null) | null, user_ids?: (number[] | null) | null }
// Response: StudentGradesDTO[]

// GET /api/v1/workspaces/{workspace_id}/grades/csv
// Path: {workspace_id: number}
// Query: { task_ids?: (number[] | null) | null, user_ids?: (number[] | null) | null }
// Response: any

// GET /api/v1/workspaces/{workspace_id}/join_rules
// Path: {workspace_id: number}
// Response: WorkspaceJoinRuleResponseDTO[]

// GET /api/v1/workspaces/{workspace_id}/members
// Path: {workspace_id: number}
// Response: WorkspaceMemberResponseDTO[]

// GET /api/v1/workspaces/{workspace_id}/tasks
// Path: {workspace_id: number}
// Response: TaskResponseDTO[]

// PATCH /api/v1/solutions/{solution_id}/label
// Path: {solution_id: number}
// Body: SolutionLabelUpdateDTO
// Response: SolutionShortResponseDTO

// PATCH /api/v1/tasks/{task_id}/criteria/{task_criterion_id}
// Path: {task_criterion_id: number}
// Body: TaskCriteriaUpdateWeightDTO
// Response: TaskCriteriaResponseDTO

// PATCH /api/v1/workspaces/{workspace_id}/members/{member_id}
// Path: {workspace_id: number, member_id: number}
// Body: WorkspaceMemberUpdateDTO
// Response: WorkspaceMemberResponseDTO

// PATCH /api/v1/workspaces/{workspace_id}/owner
// Path: {workspace_id: number}
// Body: TransferOwnershipDTO
// Response: WorkspaceResponseDTO

// POST /api/v1/auth/login
// Body: UserLoginDTO
// Response: TokenDTO

// POST /api/v1/auth/register
// Body: EmailRegistrationRequestDTO
// Response: TokenDTO

// POST /api/v1/auth/register/confirm
// Body: EmailConfirmationRequestDTO
// Response: TokenDTO

// POST /api/v1/auth/register/start
// Body: EmailRegistrationRequestDTO
// Response: SuccessOperationDTO

// POST /api/v1/criteria
// Body: CriterionCreateDTO
// Response: CriterionResponseDTO

// POST /api/v1/criteria/import
// Body: FormData { file: string, workspace_id?: (number | null), task_id?: (number | null) }
// Response: CriterionResponseDTO[]

// POST /api/v1/joins
// Body: JoinBySlugDTO
// Response: JoinResponseDTO

// POST /api/v1/solutions
// Body: FormData { task_id: number, solution_format: string, github_repo_link?: (string | null), github_repo_branch?: (string | null), file?: (string | null) }
// Response: SolutionShortResponseDTO

// POST /api/v1/solutions/{solution_id}/approval
// Path: {solution_id: number}
// Body: FormData { file: string }
// Response: SolutionShortResponseDTO

// POST /api/v1/solutions/{solution_id}/cancel
// Path: {solution_id: number}
// Response: SuccessOperationDTO

// POST /api/v1/solutions/{solution_id}/criteria-checks
// Path: {solution_id: number}
// Body: SolutionCriteriaCheckCreateRequestDTO
// Response: SuccessOperationDTO

// POST /api/v1/solutions/{solution_id}/final-review
// Path: {solution_id: number}
// Body: SolutionFinalReviewDTO
// Response: SolutionShortResponseDTO

// POST /api/v1/solutions/{solution_id}/restart
// Path: {solution_id: number}
// Response: SuccessOperationDTO

// POST /api/v1/tasks
// Body: TaskCreateDTO
// Response: TaskResponseDTO

// POST /api/v1/tasks/{task_id}/criteria
// Path: {task_id: number}
// Body: TaskCriteriaCreateRequestDTO
// Response: TaskCriteriaResponseDTO

// POST /api/v1/tasks/{task_id}/criteria/batch
// Path: {task_id: number}
// Body: TaskCriteriaCreateBatchDTO
// Response: SuccessOperationDTO

// POST /api/v1/tasks/{task_id}/steps-models
// Path: {task_id: number}
// Body: TaskStepsModelRequestCreateDTO
// Response: TaskStepsModelDTO

// POST /api/v1/transactions
// Body: AdminTopUpDTO
// Response: TransactionResponseDTO

// POST /api/v1/users
// Body: UserCreateDTO
// Response: UserResponseDTO

// POST /api/v1/users/admin
// Body: UserCreateDTO
// Response: UserResponseDTO

// POST /api/v1/workspaces
// Body: WorkspaceCreateDTO
// Response: WorkspaceResponseDTO

// POST /api/v1/workspaces/{workspace_id}/custom-models
// Path: {workspace_id: number}
// Body: CustomModelRequestCreateDTO
// Response: CustomModelDTO

// POST /api/v1/workspaces/{workspace_id}/join_rules
// Path: {workspace_id: number}
// Body: WorkspaceJoinRuleRequestCreateDTO
// Response: WorkspaceJoinRuleResponseDTO

// POST /api/v1/workspaces/{workspace_id}/leave
// Path: {workspace_id: number}
// Response: SuccessOperationDTO

// PUT /api/v1/criteria/{criterion_id}
// Path: {criterion_id: number}
// Body: CriterionUpdateDTO
// Response: CriterionResponseDTO

// PUT /api/v1/custom-models/{model_id}
// Path: {model_id: number}
// Body: CustomModelRequestUpdateDTO
// Response: CustomModelDTO

// PUT /api/v1/tasks/{task_id}
// Path: {task_id: number}
// Body: TaskUpdateDTO
// Response: TaskResponseDTO

// PUT /api/v1/workspaces/{workspace_id}
// Path: {workspace_id: number}
// Body: WorkspaceUpdateDTO
// Response: WorkspaceResponseDTO

// PUT /api/v1/workspaces/{workspace_id}/join_rules/{rule_id}
// Path: {workspace_id: number, rule_id: number}
// Body: WorkspaceJoinRuleRequestUpdateDTO
// Response: WorkspaceJoinRuleResponseDTO

// Schemas

interface AdminTopUpDTO {
  user_id: number;
  amount: number;
}

interface AppSettingsResponseDTO {
  email_confirmation_enabled: boolean;
}

interface BalanceResponseDTO {
  balance: number;
}

interface Body_approve_project_doc_endpoint_api_v1_solutions__solution_id__approval_post {
  file: string;
}

interface Body_create_endpoint_api_v1_solutions_post {
  task_id: number;
  solution_format: string;
  github_repo_link?: (string | null);
  github_repo_branch?: (string | null);
  file?: (string | null);
}

interface Body_import_criteria_endpoint_api_v1_criteria_import_post {
  file: string;
  workspace_id?: (number | null);
  task_id?: (number | null);
}

interface CriteriaGradingReviewResponseDTO {
  solution: SolutionResponseDTO;
  task: TaskResponseDTO;
  criteria: GradingCriterionDTO[];
}

interface CriterionCreateDTO {
  description: string;
  tags?: string[];
  stage?: (string | null);
  prompt: string;
  workspace_id?: (number | null);
  task_id?: (number | null);
}

interface CriterionResponseDTO {
  id: number;
  description: string;
  prompt: string;
  tags: string[];
  stage: (string | null);
  workspace_id: (number | null);
  task_id: (number | null);
  created_by: number;
  created_at: string;
  is_public: boolean;
}

interface CriterionUpdateDTO {
  description: string;
  tags?: string[];
  stage?: (string | null);
  prompt: string;
  workspace_id?: (number | null);
  task_id?: (number | null);
}

interface CustomModelDTO {
  id: number;
  workspace_id: number;
  name: string;
  model: string;
  base_url: string;
  encrypted_api_key: string;
  created_by: number;
  created_at: string;
}

interface CustomModelRequestCreateDTO {
  name: string;
  model: string;
  base_url: string;
  api_key: string;
}

interface CustomModelRequestUpdateDTO {
  name: string;
  base_url: string;
  api_key: string;
  model: string;
}

interface CustomModelWithAPIKeyDTO {
  id: number;
  workspace_id: number;
  name: string;
  model: string;
  base_url: string;
  api_key: string;
  created_by: number;
  created_at: string;
}

interface EmailConfirmationRequestDTO {
  email: string;
  code: string;
}

interface EmailRegistrationRequestDTO {
  fullname: string;
  email: string;
  password: string;
}

interface GradingCriterionDTO {
  criterion: CriterionResponseDTO;
  task_criterion_id: number;
  weight: number;
  checks: SolutionCriteriaCheckResponseDTO[];
}

interface HTTPValidationError {
  detail?: ValidationError[];
}

interface JoinBySlugDTO {
  slug: string;
  password?: (string | null);
}

interface JoinResponseDTO {
  workspace_id: number;
}

interface PipelineInfoDTO {
  solution_id: number;
  solution_status: string;
  solution_steps: string[];
  pipeline_tasks: PipelineTaskDTO[];
}

interface PipelineTaskDTO {
  id: number;
  solution_id: number;
  step: string;
  status: string;
  error_text: (string | null);
  duration: (number | null);
  last_checked_at: (string | null);
  ran_at: (string | null);
  created_at: string;
}

interface ShortUserDTO {
  id: number;
  email: string;
  fullname: string;
  is_admin: boolean;
}

interface SlugCheckResponseDTO {
  slug: string;
  is_available: boolean;
}

interface SolutionCriteriaCheckCreateRequestDTO {
  task_criterion_id: number;
  is_passed: boolean;
  comment?: string;
}

interface SolutionCriteriaCheckResponseDTO {
  task_criterion_id: number;
  solution_id: number;
  comment?: string;
  stage: string;
  status: string;
  is_passed?: (boolean | null);
  id: number;
  created_at: string;
}

interface SolutionFinalReviewDTO {
  human_grade: number;
  human_feedback: string;
  ai_feedback?: (string | null);
}

interface SolutionLabelUpdateDTO {
  label: string;
}

interface SolutionResponseDTO {
  id: number;
  task_id: number;
  format: string;
  github_repo_link: (string | null);
  github_repo_branch: (string | null);
  artifact_path: string;
  status: string;
  steps: string[];
  human_grade: (number | null);
  human_feedback: (string | null);
  ai_feedback: (string | null);
  label?: string;
  created_by: number;
  created_at: string;
}

interface SolutionScoreDTO {
  score: number;
  total_criteria: number;
  passed_criteria: number;
}

interface SolutionShortResponseDTO {
  id: number;
  task_id: number;
  format: string;
  github_repo_link: (string | null);
  github_repo_branch: (string | null);
  status: string;
  steps: string[];
  human_grade: (number | null);
  human_feedback: (string | null);
  ai_feedback: (string | null);
  label?: string;
  created_at: string;
  created_by: number;
  author?: (ShortUserDTO | null);
}

interface StudentGradesDTO {
  user: ShortUserDTO;
  tasks: TaskGradeDTO[];
}

interface SuccessOperationDTO {
  message: string;
}

interface TaskCreateDTO {
  workspace_id: number;
  name: string;
  description?: string;
}

interface TaskCriteriaCreateBatchDTO {
  criterion_ids: number[];
}

interface TaskCriteriaCreateRequestDTO {
  criterion_id: number;
  weight: number;
}

interface TaskCriteriaFullResponseDTO {
  id: number;
  task_id: number;
  criterion_id: number;
  weight: number;
  criterion: CriterionResponseDTO;
}

interface TaskCriteriaResponseDTO {
  id: number;
  task_id: number;
  criterion_id: number;
  weight: number;
}

interface TaskCriteriaUpdateWeightDTO {
  weight: number;
}

interface TaskGradeDTO {
  task_id: number;
  task_name: string;
  best_solution_id: (number | null);
  grade: (number | null);
}

interface TaskResponseDTO {
  id: number;
  workspace_id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  use_exam: boolean;
}

interface TaskStepsModelDTO {
  task_id: number;
  steps: object;
  created_at: string;
}

interface TaskStepsModelRequestCreateDTO {
  steps: object;
}

interface TaskUpdateDTO {
  name: string;
  description?: string;
  is_active: boolean;
}

interface TokenDTO {
  access_token: string;
}

interface TransactionResponseDTO {
  id: number;
  user_id: number;
  amount: number;
  type: string;
  metadata?: (object | null);
  created_at: string;
}

interface TransferOwnershipDTO {
  member_id: number;
}

interface UserCreateDTO {
  fullname: string;
  email: string;
  password: string;
}

interface UserLoginDTO {
  email: string;
  password: string;
}

interface UserResponseDTO {
  id: number;
  email: string;
  fullname: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
  hashed_password: string;
}

interface UserWorkspaceResponseDTO {
  workspace: WorkspaceResponseDTO;
  role: string;
}

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: null;
  ctx?: object;
}

interface WindRosePointDTO {
  tag: string;
  value: number;
  count: number;
}

interface WorkspaceCreateDTO {
  name: string;
  description?: string;
}

interface WorkspaceJoinRuleRequestCreateDTO {
  slug: string;
  role: string;
  is_active?: boolean;
  expired_at?: (string | null);
  password?: (string | null);
}

interface WorkspaceJoinRuleRequestUpdateDTO {
  slug: string;
  role: string;
  is_active?: boolean;
  expired_at?: (string | null);
  password?: (string | null);
}

interface WorkspaceJoinRuleResponseDTO {
  id: number;
  workspace_id: number;
  slug: string;
  role: string;
  expired_at: (string | null);
  is_active: boolean;
  has_password: boolean;
  used_count: number;
}

interface WorkspaceMemberResponseDTO {
  user_id: number;
  workspace_id: number;
  role: string;
  id: number;
  fullname: string;
  email: string;
}

interface WorkspaceMemberUpdateDTO {
  role: string;
}

interface WorkspaceResponseDTO {
  id: number;
  name: string;
  description: string;
  is_archived: boolean;
  created_at: string;
}

interface WorkspaceUpdateDTO {
  name: string;
  description?: string;
}
