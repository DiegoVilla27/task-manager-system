package com.diegovilla.task_manager.core.annotations.atleastonefield;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class AtLeastOneFieldValidatorTest {

    private AtLeastOneFieldValidator validator;
    private ConstraintValidatorContext context;

    @Getter
    @AllArgsConstructor
    static class DummyTarget {
        private String name;
        private String email;
        private Integer age;
    }

    @BeforeEach
    void setUp() {
        validator = new AtLeastOneFieldValidator();
        context = mock(ConstraintValidatorContext.class);

        AtLeastOneField annotation = mock(AtLeastOneField.class);
        when(annotation.fields()).thenReturn(new String[] {"name", "email", "age"});
        validator.initialize(annotation);
    }

    @Test
    @DisplayName("Should return true when target object is null")
    void shouldReturnTrueWhenObjectIsNull() {
        assertThat(validator.isValid(null, context)).isTrue();
    }

    @Test
    @DisplayName("Should return true when at least one String field is non-blank")
    void shouldReturnTrueWhenStringFieldPresent() {
        DummyTarget target = new DummyTarget("John", "", null);
        assertThat(validator.isValid(target, context)).isTrue();
    }

    @Test
    @DisplayName("Should return true when at least one non-String field is non-null")
    void shouldReturnTrueWhenNonStringFieldPresent() {
        DummyTarget target = new DummyTarget("   ", null, 25);
        assertThat(validator.isValid(target, context)).isTrue();
    }

    @Test
    @DisplayName("Should return false when all configured fields are null or blank")
    void shouldReturnFalseWhenAllFieldsNullOrBlank() {
        DummyTarget target = new DummyTarget("   ", "", null);
        assertThat(validator.isValid(target, context)).isFalse();
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when field does not exist")
    void shouldThrowWhenFieldDoesNotExist() {
        AtLeastOneField invalidAnnotation = mock(AtLeastOneField.class);
        when(invalidAnnotation.fields()).thenReturn(new String[] {"nonExistentField"});
        validator.initialize(invalidAnnotation);

        DummyTarget target = new DummyTarget("John", "john@example.com", 30);

        assertThatThrownBy(() -> validator.isValid(target, context))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unknown field");
    }
}
