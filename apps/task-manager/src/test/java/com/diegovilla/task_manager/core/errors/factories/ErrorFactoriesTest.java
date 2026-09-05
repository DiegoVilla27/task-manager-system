package com.diegovilla.task_manager.core.errors.factories;

import static org.assertj.core.api.Assertions.assertThat;

import com.diegovilla.task_manager.core.errors.dtos.ErrorResponseDTO;
import com.diegovilla.task_manager.core.errors.dtos.FieldErrorDTO;
import com.diegovilla.task_manager.features.task.domain.valueobjects.TaskStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class ErrorFactoriesTest {

    @Test
    @DisplayName("ErrorResponseFactory: should build ResponseEntity<ErrorResponseDTO>")
    void testErrorResponseFactory() {
        ErrorResponseFactory factory = new ErrorResponseFactory();
        FieldErrorDTO fieldError = new FieldErrorDTO("email", "bad", "invalid email");

        ResponseEntity<ErrorResponseDTO> response =
                factory.build(HttpStatus.BAD_REQUEST, "Validation error", List.of(fieldError));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().message()).isEqualTo("Validation error");
        assertThat(response.getBody().status()).isEqualTo(400);
        assertThat(response.getBody().errors()).hasSize(1);

        ResponseEntity<ErrorResponseDTO> responseNullErrors =
                factory.build(HttpStatus.NOT_FOUND, "Not found", null);
        assertThat(responseNullErrors.getBody().errors()).isEmpty();
    }

    @Test
    @DisplayName("FieldErrorFactory: should build FieldErrorDTO")
    void testFieldErrorFactory() {
        FieldErrorFactory factory = new FieldErrorFactory();
        FieldErrorDTO dto = factory.build("title", null, "Title is required");

        assertThat(dto.field()).isEqualTo("title");
        assertThat(dto.value()).isNull();
        assertThat(dto.message()).isEqualTo("Title is required");
    }

    @Test
    @DisplayName(
            "InvalidFormatMessageResolver: should resolve messages for known types, enums and null")
    void testInvalidFormatMessageResolver() {
        assertThat(InvalidFormatMessageResolver.resolve(null))
                .isEqualTo("The provided value is invalid.");

        assertThat(InvalidFormatMessageResolver.resolve(Integer.class))
                .isEqualTo("Must be an integer.");

        assertThat(InvalidFormatMessageResolver.resolve(Boolean.class))
                .isEqualTo("Must be 'true' or 'false'.");

        assertThat(InvalidFormatMessageResolver.resolve(UUID.class))
                .isEqualTo("Must be a valid UUID.");

        assertThat(InvalidFormatMessageResolver.resolve(LocalDate.class))
                .isEqualTo("Date must be in yyyy-MM-dd format.");

        String enumMessage = InvalidFormatMessageResolver.resolve(TaskStatus.class);
        assertThat(enumMessage).contains("Allowed values:").contains("PENDING");

        assertThat(InvalidFormatMessageResolver.resolve(Object.class))
                .isEqualTo("The provided value is not compatible with the expected type.");
    }
}
