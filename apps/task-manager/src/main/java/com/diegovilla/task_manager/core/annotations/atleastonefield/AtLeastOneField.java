package com.diegovilla.task_manager.core.annotations.atleastonefield;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Bean Validation constraint that verifies at least one of the specified fields contains a
 * non-{@code null}, non-blank value.
 *
 * <p>This annotation must be applied at the type level and is validated by {@link
 * AtLeastOneFieldValidator}. It is typically used on partial update DTOs where at least one field
 * must be provided by the client.
 *
 * <p>Example usage:
 *
 * <pre>{@code
 * @AtLeastOneField(
 *   fields = {"title", "description"},
 *   message = "At least one field must be provided"
 * )
 * public record UpdateDTO(String title, String description) { }
 * }</pre>
 *
 * @since 1.0.0
 */
@Documented
@Constraint(validatedBy = AtLeastOneFieldValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface AtLeastOneField {

    /**
     * Default validation error message when none of the specified fields are provided.
     *
     * @return error message template.
     */
    String message() default "At least one field must be provided";

    /**
     * Validation groups targeting constraint evaluation.
     *
     * @return target group classes.
     */
    Class<?>[] groups() default {};

    /**
     * Custom payload objects assigned to validation constraint failures.
     *
     * @return payload class array.
     */
    Class<? extends Payload>[] payload() default {};

    /**
     * Array of property names to check for presence.
     *
     * @return array of string field names.
     */
    String[] fields();
}
