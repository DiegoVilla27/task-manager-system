import type { components, paths } from './schema';

/**
 * Especificación completa de rutas y endpoints de la API (OpenAPI paths).
 */
export type { paths, components };

/**
 * Diccionario central de esquemas (DTOs y modelos) generados desde Spring Boot.
 */
export type Schemas = components['schemas'];

// ============================================================================
// TASKS DOMAIN
// ============================================================================

/**
 * Representa una tarea completa con la información de su usuario asignado.
 * @see {@link TaskUser} para los detalles del usuario embebido.
 */
export type TaskResponse = Schemas['TaskWithUserResponseDTO'];

/**
 * Información resumida del usuario asignado dentro del contexto de una tarea.
 */
export type TaskUser = Schemas['TaskUserResponseDTO'];

/**
 * Payload requerido para crear una nueva tarea en el sistema.
 */
export type TaskCreateRequest = Schemas['TaskCreateRequestDTO'];

/**
 * Payload para actualizar el estado o contenido de una tarea existente.
 */
export type TaskUpdateRequest = Schemas['TaskUpdateRequestDTO'];

/**
 * Estados del ciclo de vida de una tarea en el sistema.
 * - `PENDING`: Tarea creada pero aún no iniciada.
 * - `IN_PROGRESS`: Tarea actualmente en desarrollo.
 * - `COMPLETED`: Tarea finalizada con éxito.
 */
type JavaTaskStatus = NonNullable<Schemas['TaskWithUserResponseDTO']['status']>;

export const TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const satisfies Record<string, JavaTaskStatus>;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];


/**
 * Parámetros de filtrado y búsqueda para la consulta de tareas.
 */
export type TaskFilters = Schemas['TaskFiltersDTO'];
export interface TasksPaginationRequest {
  page: number;
  limit: number;
  filters: {
    userId?: TaskFilters['userId'];
    search?: TaskFilters['search'];
    status?: TaskFilters['status'] | '';
  };
}

/**
 * Respuesta paginada de Spring Boot (`Page<TaskWithUserResponseDTO>`) para listados de tareas.
 */
export type PageTaskResponse = Schemas['PageTaskWithUserResponseDTO'];

// ============================================================================
// USERS DOMAIN
// ============================================================================

/**
 * Representa un usuario junto con el conteo calculado de tareas asociadas.
 */
export type UserResponse = Schemas['UserWithTaskCountResponseDTO'];

/**
 * Información del perfil del usuario actualmente autenticado (`/auth/me` o `/users/me`).
 */
export type UserMeResponse = Schemas['UserMeResponseDTO'];

/**
 * Payload requerido para registrar o dar de alta un nuevo usuario por un administrador.
 */
export type UserCreateRequest = Schemas['UserCreateRequestDTO'];

/**
 * Payload para actualizar los datos de un usuario existente.
 */
export type UserUpdateRequest = Schemas['UserUpdateRequestDTO'];

/**
 * Parámetros de filtrado y búsqueda para la consulta de usuario.
 */
export type UserFilters = Schemas['UserFiltersDTO'];
export interface UsersPaginationRequest {
  page: number;
  limit: number;
  filters: UserFilters;
}

/**
 * Respuesta paginada de Spring Boot (`Page<UserWithTaskCountResponseDTO>`) para listados de usuarios.
 */
export type PageUserResponse = Schemas['PageUserWithTaskCountResponseDTO'];

// ============================================================================
// AUTH DOMAIN
// ============================================================================

/**
 * Credenciales requeridas para el inicio de sesión (`POST /auth/login`).
 */
export type AuthLoginRequest = Schemas['AuthLoginRequestDTO'];

/**
 * Payload de registro público de una nueva cuenta de usuario (`POST /auth/register`).
 */
export type AuthRegisterRequest = Schemas['AuthRegisterRequestDTO'];

/**
 * Respuesta emitida tras una autenticación exitosa, incluyendo los tokens JWT (`accessToken`, etc.).
 */
export type AuthResponse = Schemas['AuthResponseDTO'];

/**
 * Payload para renovar el Access Token mediante un Refresh Token (`POST /auth/refresh`).
 */
export type AuthRefreshRequest = Schemas['AuthRefreshRequestDTO'];

// ============================================================================
// ERRORS & HTTP DOMAIN
// ============================================================================

/**
 * Estructura estándar de error devuelta por el manejador global de excepciones de Spring Boot.
 */
export type ApiErrorResponse = Schemas['ErrorResponseDTO'];

/**
 * Detalle específico de un error de validación a nivel de campo (por ejemplo, anotaciones `@Valid`).
 */
export type ApiFieldError = Schemas['FieldErrorDTO'];
