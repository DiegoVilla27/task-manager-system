package com.diegovilla.task_manager.core.errors.handlers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import com.diegovilla.task_manager.core.errors.dtos.FieldErrorDTO;
import com.diegovilla.task_manager.core.errors.factories.ErrorResponseFactory;
import com.diegovilla.task_manager.core.errors.factories.FieldErrorFactory;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import tools.jackson.databind.exc.InvalidFormatException;

@ExtendWith(MockitoExtension.class)
class SpringExceptionHandlerTest {

    @Mock private ErrorResponseFactory errorResponseFactory;
    @Mock private FieldErrorFactory fieldErrorFactory;

    @InjectMocks private SpringExceptionHandler handler;

    private ResponseEntity<ErrorResponseDTO> dummyResponse;

    @BeforeEach
    void setUp() {
        ErrorResponseDTO dto =
                new ErrorResponseDTO(Instant.now(), 400, "Bad Request", "Error", List.of());
        dummyResponse = ResponseEntity.badRequest().body(dto);
    }

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException with field and global errors")
    void shouldHandleMethodArgumentNotValid() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError =
                new FieldError("object", "email", "invalid", false, null, null, "Invalid email");
        ObjectError globalError = new ObjectError("object", "Global error message");

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));
        when(bindingResult.getGlobalErrors()).thenReturn(List.of(globalError));
        when(fieldErrorFactory.build("email", "invalid", "Invalid email"))
                .thenReturn(new FieldErrorDTO("email", "invalid", "Invalid email"));
        when(fieldErrorFactory.build(null, null, "Global error message"))
                .thenReturn(new FieldErrorDTO(null, null, "Global error message"));
        when(errorResponseFactory.build(eq(HttpStatus.BAD_REQUEST), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handle(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle ConstraintViolationException")
    @SuppressWarnings("unchecked")
    void shouldHandleConstraintViolation() {
        ConstraintViolation<?> violation = mock(ConstraintViolation.class);
        Path path = mock(Path.class);
        when(path.toString()).thenReturn("user.email");
        when(violation.getPropertyPath()).thenReturn(path);
        when(violation.getInvalidValue()).thenReturn("bad");
        when(violation.getMessage()).thenReturn("must be valid");

        ConstraintViolationException ex =
                new ConstraintViolationException("Validation error", Set.of(violation));
        when(fieldErrorFactory.build("email", "bad", "must be valid"))
                .thenReturn(new FieldErrorDTO("email", "bad", "must be valid"));
        when(errorResponseFactory.build(eq(HttpStatus.BAD_REQUEST), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleConstraintViolationException(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle HttpMessageNotReadableException with InvalidFormatException")
    void shouldHandleHttpMessageNotReadableWithInvalidFormat() {
        HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);
        InvalidFormatException ife = mock(InvalidFormatException.class);
        when(ex.getMostSpecificCause()).thenReturn(ife);
        when(ife.getPath()).thenReturn(Collections.emptyList());
        when(ife.getValue()).thenReturn("invalid");
        doReturn(Integer.class).when(ife).getTargetType();

        when(fieldErrorFactory.build(any(), any(), any()))
                .thenReturn(new FieldErrorDTO("field", "invalid", "Error"));
        when(errorResponseFactory.build(eq(HttpStatus.BAD_REQUEST), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleReadable(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle HttpMessageNotReadableException with generic cause")
    void shouldHandleHttpMessageNotReadableGeneric() {
        HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);
        when(ex.getMostSpecificCause()).thenReturn(new RuntimeException("malformed"));
        when(errorResponseFactory.build(eq(HttpStatus.BAD_REQUEST), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleReadable(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle MethodArgumentTypeMismatchException")
    @SuppressWarnings("unchecked")
    void shouldHandleTypeMismatch() {
        MethodArgumentTypeMismatchException ex = mock(MethodArgumentTypeMismatchException.class);
        when(ex.getName()).thenReturn("id");
        when(ex.getValue()).thenReturn("abc");
        doReturn(Integer.class).when(ex).getRequiredType();

        when(fieldErrorFactory.build(any(), any(), any()))
                .thenReturn(new FieldErrorDTO("id", "abc", "Type mismatch"));
        when(errorResponseFactory.build(eq(HttpStatus.BAD_REQUEST), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleTypeMismatch(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle MissingServletRequestParameterException")
    void shouldHandleMissingParameter() {
        MissingServletRequestParameterException ex =
                new MissingServletRequestParameterException("page", "int");
        when(fieldErrorFactory.build("page", null, "The parameter is required."))
                .thenReturn(new FieldErrorDTO("page", null, "The parameter is required."));
        when(errorResponseFactory.build(eq(HttpStatus.BAD_REQUEST), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleMissingParameter(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle HttpRequestMethodNotSupportedException")
    void shouldHandleMethodNotSupported() {
        HttpRequestMethodNotSupportedException ex =
                new HttpRequestMethodNotSupportedException("POST");
        when(fieldErrorFactory.build("method", "POST", "HTTP method not supported."))
                .thenReturn(new FieldErrorDTO("method", "POST", "HTTP method not supported."));
        when(errorResponseFactory.build(eq(HttpStatus.METHOD_NOT_ALLOWED), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleMethodNotSupported(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle NoResourceFoundException")
    void shouldHandleNoResource() {
        NoResourceFoundException ex = mock(NoResourceFoundException.class);
        when(ex.getResourcePath()).thenReturn("/not-found");
        when(fieldErrorFactory.build("path", "/not-found", "The requested path does not exist."))
                .thenReturn(
                        new FieldErrorDTO(
                                "path", "/not-found", "The requested path does not exist."));
        when(errorResponseFactory.build(eq(HttpStatus.NOT_FOUND), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleNoResource(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle IllegalArgumentException")
    void shouldHandleIllegalArgument() {
        IllegalArgumentException ex = new IllegalArgumentException("Invalid state");
        when(errorResponseFactory.build(eq(HttpStatus.BAD_REQUEST), eq("Invalid state"), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleIllegal(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle BadCredentialsException")
    void shouldHandleBadCredentials() {
        BadCredentialsException ex = new BadCredentialsException("Bad credentials");
        when(errorResponseFactory.build(eq(HttpStatus.UNAUTHORIZED), eq("Bad credentials"), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleBadCredentialsException(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle AuthenticationException")
    void shouldHandleAuthenticationException() {
        AuthenticationException ex = mock(AuthenticationException.class);
        when(errorResponseFactory.build(eq(HttpStatus.UNAUTHORIZED), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleAuthenticationException(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle AccessDeniedException")
    void shouldHandleAccessDeniedException() {
        AccessDeniedException ex = new AccessDeniedException("Forbidden");
        when(errorResponseFactory.build(eq(HttpStatus.FORBIDDEN), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleAccessDeniedException(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }

    @Test
    @DisplayName("Should handle generic Exception")
    void shouldHandleGenericException() {
        Exception ex = new RuntimeException("Unexpected error");
        when(errorResponseFactory.build(eq(HttpStatus.INTERNAL_SERVER_ERROR), any(), any()))
                .thenReturn(dummyResponse);

        ResponseEntity<ErrorResponseDTO> res = handler.handleException(ex);
        assertThat(res).isEqualTo(dummyResponse);
    }
}
