export interface UserLoginDTO {
	email: string;
	password: string;
}

export interface EmailRegistrationRequestDTO {
	fullname: string;
	email: string;
	password: string;
}

export interface EmailConfirmationRequestDTO {
	email: string;
	code: string;
}

export interface TokenDTO {
	access_token: string;
}

export interface SuccessOperationDTO {
	message: string;
}

export interface JWTPayload {
	sub: number;
	email: string;
	fullname: string;
	is_admin: boolean;
	exp: number;
}

export interface WorkspaceCreateDTO {
	name: string;
	description?: string;
}

export interface WorkspaceUpdateDTO {
	name?: string;
	description?: string;
}

export interface WorkspaceResponseDTO {
	id: number;
	name: string;
	description: string;
	is_archived: boolean;
	created_at: string;
}

export type WorkspaceMemberRole = 'OWNER' | 'TEACHER' | 'STUDENT';

export interface WorkspaceMemberUpdateDTO {
	role: WorkspaceMemberRole;
}

export interface WorkspaceMemberResponseDTO {
	id: number;
	user_id: number;
	workspace_id: number;
	role: WorkspaceMemberRole;
	fullname: string;
	email: string;
}

export interface UserWorkspaceResponseDTO {
	workspace: WorkspaceResponseDTO;
	role: WorkspaceMemberRole;
}

export interface JoinRuleDTO {
	id: number;
	slug: string;
	role: WorkspaceMemberRole;
	is_active: boolean;
	has_password: boolean;
	expired_at: string | null;
	created_at: string;
	used_count: number;
}

export interface JoinRuleCreateDTO {
	slug: string;
	role: 'TEACHER' | 'STUDENT';
	password?: string;
	expired_at?: string;
	is_active?: boolean;
}

export interface JoinRequestDTO {
	slug: string;
	password?: string;
}

export interface JoinResponseDTO {
	workspace_id: number;
}

export interface SlugAvailabilityDTO {
	slug: string;
}

export interface SlugAvailabilityResponseDTO {
	slug: string;
	is_available: boolean;
}

export interface ErrorResponseDTO {
	message: string;
	code: string;
}

export type CriterionStage = 'PROJECT_DOC' | 'CODEBASE' | 'MANUAL' | null;

export interface CriterionCreateDTO {
	description: string;
	tags?: string[];
	stage?: CriterionStage;
	workspace_id?: number;
	task_id?: number;
}

export interface CriterionUpdateDTO {
	description?: string;
	tags?: string[];
	stage?: CriterionStage;
	workspace_id?: number;
	task_id?: number;
}

export interface CriterionResponseDTO {
	id: number;
	description: string;
	tags: string[];
	stage: CriterionStage;
	is_public: boolean;
	workspace_id: number | null;
	task_id: number | null;
	created_by: number;
	created_at: string;
}

export interface TaskCreateDTO {
	workspace_id: number;
	name: string;
	description?: string;
}

export interface TaskUpdateDTO {
	name: string;
	description?: string;
	is_active: boolean;
}

export interface TaskResponseDTO {
	id: number;
	workspace_id: number;
	name: string;
	description: string;
	is_active: boolean;
	created_by: number;
	created_at: string;
	use_exam: boolean;
}

export interface TaskCriteriaCreateBatchDTO {
	criterion_ids: number[];
}

export interface TaskCriteriaCreateDTO {
	criterion_id: number;
	weight: number;
}

export interface TaskCriteriaUpdateWeightDTO {
	weight: number;
}

export interface TaskCriteriaResponseDTO {
	id: number;
	task_id: number;
	criterion_id: number;
	weight: number;
	criterion: CriterionResponseDTO;
}

export type SolutionFormatEnum = 'ZIP' | 'GITHUB';

export type SolutionStatusEnum =
	| 'CREATED'
	| 'CANCELLED'
	| 'ERROR'
	| 'AI_REVIEW'
	| 'WAITING_EXAM'
	| 'EXAMINATION'
	| 'HUMAN_REVIEW'
	| 'REVIEWED';

export type PipelineStepEnum =
	| 'prepare_project_tree'
	| 'prepare_project_content'
	| 'create_project_doc'
	| 'critic'
	| 'resolve_gaps'
	| 'improve_doc'
	| 'grade_by_codebase'
	| 'grade_by_project_doc';

export type PipelineTaskStatusEnum = 'pending' | 'running' | 'completed' | 'failed';

export interface SolutionAuthorDTO {
	id: number;
	email: string;
	fullname: string;
	is_admin: boolean;
}

export interface SolutionShortResponseDTO {
	id: number;
	task_id: number;
	format: SolutionFormatEnum;
	github_repo_link: string | null;
	github_repo_branch: string | null;
	status: SolutionStatusEnum;
	steps: PipelineStepEnum[];
	human_grade: number | null;
	human_feedback: string | null;
	ai_feedback: string | null;
	created_at: string;
	created_by: number;
	author: SolutionAuthorDTO | null;
}

export interface PipelineTaskDTO {
	id: number;
	solution_id: number;
	step: PipelineStepEnum;
	status: PipelineTaskStatusEnum;
	error_text: string | null;
	duration: number | null;
	last_checked_at: string | null;
	ran_at: string | null;
	created_at: string;
}

export interface PipelineInfoDTO {
	solution_id: number;
	solution_status: SolutionStatusEnum;
	solution_steps: PipelineStepEnum[];
	pipeline_tasks: PipelineTaskDTO[];
}

export interface BalanceResponseDTO {
	balance: number;
}

export type TransactionTypeEnum = 'WELCOME_BONUS' | 'ADMIN_TOP_UP' | 'LLM_CALL';

export interface TransactionResponseDTO {
	id: number;
	user_id: number;
	amount: number;
	type: TransactionTypeEnum;
	metadata: Record<string, unknown> | null;
	created_at: string;
}

export interface AdminTopUpDTO {
	user_id: number;
	amount: number;
}

export type SolutionResponseDTO = SolutionShortResponseDTO;

export type CriterionCheckStatusEnum =
	| 'SUFFICIENT'
	| 'NEEDS_CODE'
	| 'NEEDS_STUDENT'
	| 'NEEDS_MANUAL'
	| 'NOT_APPLICABLE';

export interface SolutionCriteriaCheckResponseDTO {
	id: number;
	task_criterion_id: number;
	solution_id: number;
	comment: string;
	stage: CriterionStage;
	status: CriterionCheckStatusEnum;
	is_passed: boolean | null;
	created_at: string;
}

export interface GradingCriterionDTO {
	criterion: CriterionResponseDTO;
	task_criterion_id: number;
	weight: number;
	checks: SolutionCriteriaCheckResponseDTO[];
}

export interface CriteriaGradingReviewResponseDTO {
	solution: SolutionShortResponseDTO;
	task: TaskResponseDTO;
	criteria: GradingCriterionDTO[];
}

export interface ShortUserDTO {
	id: number;
	email: string;
	fullname: string;
	is_admin: boolean;
}

export interface TaskGradeDTO {
	task_id: number;
	task_name: string;
	grade: number | null;
	best_solution_id: number | null;
}

export interface StudentGradesDTO {
	user: ShortUserDTO;
	tasks: TaskGradeDTO[];
}
