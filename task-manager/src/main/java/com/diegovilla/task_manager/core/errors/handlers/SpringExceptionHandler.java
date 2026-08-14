package com.diegovilla.task_manager.core.errors.handlers;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import com.diegovilla.task_manager.core.errors.dtos.FieldErrorDTO;
import com.diegovilla.task_manager.core.errors.factories.ErrorResponseFactory;
import com.diegovilla.task_manager.core.errors.factories.FieldErrorFactory;
import com.diegovilla.task_manager.core.errors.factories.InvalidFormatMessageResolver;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.exc.InvalidFormatException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Global exception handler responsible for translating Spring Framework
 * exceptions into a standardized API error response.
 *
 * <p>
 * This component centralizes the handling of exceptions thrown by
 * Spring MVC, Jackson and Bean Validation during the processing of HTTP
 * requests, ensuring that every error returned by the API follows the
 * same response contract.
 * </p>
 *
 * <p>
 * Business exceptions are intentionally excluded from this handler and
 * are processed by {@link ApiExceptionHandler}.
 * </p>
 *
 * <p>
 * Every handled exception is converted into an {@link ErrorResponseDTO}
 * through {@link ErrorResponseFactory}, providing a consistent and
 * predictable error format for API consumers.
 * </p>
 *
 * @since 1.0.0
 */
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class SpringExceptionHandler {

  private final ErrorResponseFactory errorResponseFactory;
  private final FieldErrorFactory fieldErrorFactory;

  /**
   * Handles validation errors occurring during binding and validation
   * of a {@code @RequestBody} annotated with {@code @Valid}.
   *
   * <p>
   * This exception is thrown when one or more DTO fields fail to meet
   * restrictions defined by Bean Validation
   * (for example: {@code @NotNull}, {@code @Email}, {@code @Size}).
   * </p>
   *
   * @param ex exception containing all DTO validation errors.
   * @return HTTP 400 response with details for each invalid field.
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponseDTO> handle(MethodArgumentNotValidException ex) {
    log.warn("DTO validation failed: {}", ex.getMessage());

    List<FieldErrorDTO> errors = new ArrayList<>();

    errors.addAll(
        ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> fieldErrorFactory.build(
                error.getField(),
                error.getRejectedValue(),
                error.getDefaultMessage()))
            .toList());

    errors.addAll(
        ex.getBindingResult()
            .getGlobalErrors()
            .stream()
            .map(error -> fieldErrorFactory.build(
                null,
                null,
                error.getDefaultMessage()))
            .toList());

    return errorResponseFactory.build(
        HttpStatus.BAD_REQUEST,
        "The request contains validation errors",
        errors);
  }

  /**
   * Handles validation errors occurring on individual parameters of an HTTP
   * request.
   *
   * <p>
   * Handles individual method parameter validation constraint violations.
   *
   * <p>
   * Requires the controller to be annotated with {@code @Validated}.
   * </p>
   *
   * @param e exception carrying constraint violation details.
   * @return HTTP 400 response containing field validation violation details.
   */
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponseDTO> handleConstraintViolationException(
      ConstraintViolationException e) {
    log.warn("Constraint validation failed: {}", e.getMessage());

    return errorResponseFactory.build(
        HttpStatus.BAD_REQUEST,
        "The request contains invalid parameters.",
        e.getConstraintViolations()
            .stream()
            .map(error -> {
              String field = error.getPropertyPath().toString();
              if (field.contains(".")) {
                field = field.substring(field.lastIndexOf('.') + 1);
              }
              return fieldErrorFactory.build(
                  field,
                  error.getInvalidValue(),
                  error.getMessage());
            }).toList());
  }

  /**
   * Handles errors occurring during deserialization of the HTTP request body.
   *
   * <p>
   * This exception is thrown when Jackson cannot convert the received JSON
   * content into the expected Java type.
   * </p>
   *
   * <p>
   * Common causes include:
   * </p>
   * <ul>
   * <li>Malformed JSON.</li>
   * <li>Incompatible data types.</li>
   * <li>Non-existent enum values.</li>
   * </ul>
   *
   * @param ex exception thrown by Spring while reading the request body.
   * @return HTTP 400 response with details of the detected error.
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponseDTO> handleReadable(HttpMessageNotReadableException ex) {
    log.warn("Invalid request body: {}", ex.getMessage());

    Throwable cause = ex.getMostSpecificCause();

    if (cause instanceof InvalidFormatException ife) {

      String field = ife.getPath()
          .stream()
          .map(JacksonException.Reference::getPropertyName)
          .filter(Objects::nonNull)
          .collect(Collectors.joining("."));

      return errorResponseFactory.build(
          HttpStatus.BAD_REQUEST,
          "The request body contains invalid values.",
          List.of(fieldErrorFactory.build(
              field,
              ife.getValue(),
              InvalidFormatMessageResolver.resolve(ife.getTargetType()))));
    }

    return errorResponseFactory.build(
        HttpStatus.BAD_REQUEST,
        "The request body contains invalid JSON.",
        List.of());
  }

  /**
   * Handles parameter type conversion errors in an HTTP request.
   *
   * <p>
   * Occurs when Spring cannot convert the received value in a
   * {@code @PathVariable}, {@code @RequestParam} or similar parameter to the
   * expected Java type.
   * </p>
   *
   * @param ex exception containing the parameter name, received value,
   *           and expected type.
   * @return HTTP 400 response with information about the invalid parameter.
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ErrorResponseDTO> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
    log.warn("Parameter type mismatch: {}", ex.getMessage());

    return errorResponseFactory.build(
        HttpStatus.BAD_REQUEST,
        "One or more parameters contain invalid values.",
        List.of(fieldErrorFactory.build(
            ex.getName(),
            ex.getValue(),
            InvalidFormatMessageResolver.resolve(ex.getRequiredType()))));
  }

  /**
   * Handles missing mandatory parameters sent via {@code @RequestParam}.
   *
   * @param ex exception identifying the missing required parameter.
   * @return HTTP 400 response specifying the required parameter.
   */
  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ErrorResponseDTO> handleMissingParameter(MissingServletRequestParameterException ex) {
    log.warn("Missing request parameter: {}", ex.getMessage());

    return errorResponseFactory.build(
        HttpStatus.BAD_REQUEST,
        "Required parameters are missing.",
        List.of(fieldErrorFactory.build(
            ex.getParameterName(),
            null,
            "The parameter is required.")));
  }

  /**
   * Handles requests made using an HTTP method not supported by the requested
   * endpoint.
   *
   * @param ex exception containing the HTTP method used.
   * @return HTTP 405 response indicating the method is not allowed.
   */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ErrorResponseDTO> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
    log.warn("HTTP method not supported: {}", ex.getMessage());

    return errorResponseFactory.build(
        HttpStatus.METHOD_NOT_ALLOWED,
        "The requested HTTP method is not allowed for this resource.",
        List.of(fieldErrorFactory.build(
            "method",
            ex.getMethod(),
            "HTTP method not supported.")));
  }

  /**
   * Handles requests targeted to non-existent endpoints within the application.
   *
   * @param ex exception containing the requested path.
   * @return HTTP 404 response indicating the resource does not exist.
   */
  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<ErrorResponseDTO> handleNoResource(NoResourceFoundException ex) {
    log.warn("No resource found for path: {}", ex.getResourcePath());

    return errorResponseFactory.build(
        HttpStatus.NOT_FOUND,
        "The requested resource was not found.",
        List.of(fieldErrorFactory.build(
            "path",
            ex.getResourcePath(),
            "The requested path does not exist.")));
  }

  /**
   * Handles errors caused by invalid arguments during the execution of business
   * logic.
   *
   * @param ex exception describing the reason for the error.
   * @return HTTP 400 response with the corresponding validation message.
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponseDTO> handleIllegal(IllegalArgumentException ex) {
    log.warn("Business validation failed: {}", ex.getMessage());

    return errorResponseFactory.build(
        HttpStatus.BAD_REQUEST,
        ex.getMessage(),
        List.of());
  }

  /**
   * Handles authentication failures caused by invalid username or password
   * credentials.
   *
   * @param e exception thrown during credential validation.
   * @return HTTP 401 response indicating authentication failed due to bad
   *         credentials.
   */
  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(BadCredentialsException e) {
    log.warn("Bad credentials: {}", e.getMessage());

    return errorResponseFactory.build(
        HttpStatus.UNAUTHORIZED,
        e.getMessage(), // o "Invalid email or password"
        List.of());
  }

  /**
   * Handles authentication failures occurring during request execution.
   *
   * <p>
   * This exception is thrown when an unauthenticated user attempts to access
   * a protected resource or provides an invalid or expired authentication token.
   * </p>
   *
   * @param e exception thrown during the authentication process.
   * @return HTTP 401 response indicating authentication is required or invalid.
   */
  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorResponseDTO> handleAuthenticationException(AuthenticationException e) {
    log.warn("Authentication failed: {}", e.getMessage());

    return errorResponseFactory.build(
        HttpStatus.UNAUTHORIZED,
        "Full authentication is required or token is invalid.",
        List.of());
  }

  /**
   * Handles authorization failures occurring during request execution.
   *
   * <p>
   * This exception is thrown when an authenticated user attempts to access
   * a resource or perform an action for which they lack the required permissions
   * or roles.
   * </p>
   *
   * @param e exception thrown when access to a resource is denied.
   * @return HTTP 403 response indicating insufficient permissions.
   */
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponseDTO> handleAccessDeniedException(AccessDeniedException e) {
    log.warn("Access denied: {}", e.getMessage());

    return errorResponseFactory.build(
        HttpStatus.FORBIDDEN,
        "You do not have permission to access this resource.",
        List.of());
  }

  /**
   * Handles any unhandled exceptions not caught by other registered handlers.
   *
   * <p>
   * This method acts as a safety net to prevent exposing internal application
   * implementation details to the client.
   * </p>
   *
   * @param ex unexpected exception occurring during request processing.
   * @return HTTP 500 response with a generic internal error message.
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponseDTO> handleException(Exception ex) {
    log.error("Unexpected error", ex);

    return errorResponseFactory.build(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An internal server error has occurred.",
        List.of());
  }
}
