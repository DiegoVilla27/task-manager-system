package com.diegovilla.task_manager.core.errors.handlers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import com.diegovilla.task_manager.core.errors.factories.ErrorResponseFactory;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class ApiExceptionHandlerTest {

    @Mock private ErrorResponseFactory errorResponseFactory;

    @InjectMocks private ApiExceptionHandler apiExceptionHandler;

    @Test
    @DisplayName("Should handle ApiException and return ResponseEntity<ErrorResponseDTO>")
    void shouldHandleApiException() {
        DomainException exception = new DomainException("Domain validation failed");
        ErrorResponseDTO errorDTO =
                new ErrorResponseDTO(
                        Instant.now(),
                        HttpStatus.UNPROCESSABLE_CONTENT.value(),
                        HttpStatus.UNPROCESSABLE_CONTENT.getReasonPhrase(),
                        "Domain validation failed",
                        List.of());
        ResponseEntity<ErrorResponseDTO> expectedResponse =
                ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(errorDTO);

        when(errorResponseFactory.build(
                        HttpStatus.UNPROCESSABLE_CONTENT, "Domain validation failed", List.of()))
                .thenReturn(expectedResponse);

        ResponseEntity<ErrorResponseDTO> response = apiExceptionHandler.handle(exception);

        assertThat(response).isEqualTo(expectedResponse);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_CONTENT);
    }
}
