package com.diegovilla.task_manager.utils.data;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import java.util.regex.Pattern;

/**
 * Utility class for validating and updating domain data.
 *
 * <p>Provides reusable validation methods for String values used by domain models during creation
 * and partial update operations.
 *
 * <p>The utility is intentionally independent from DTOs, controllers, persistence, and
 * framework-specific validation mechanisms.
 */
public final class ValidateDataUtils {

    /** Utility class; instantiation is not allowed. */
    private ValidateDataUtils() {
        throw new UnsupportedOperationException(
                "ValidateDataUtils is a utility class and cannot be instantiated.");
    }

    /*
     * ============================================================
     * CREATE - REQUIRED
     * ============================================================
     */

    /**
     * Validates a required String value.
     *
     * <p>The value must not be {@code null} or blank.
     *
     * @param value value to validate.
     * @param fieldName field name used in the error message.
     * @return the trimmed value.
     * @throws DomainException if the value is null or blank.
     */
    public static String required(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new DomainException(String.format("%s is required", fieldName));
        }

        return value.trim();
    }

    /**
     * Validates a required String value and its length.
     *
     * <p>The value must not be {@code null} or blank and must have a length between {@code
     * minLength} and {@code maxLength}.
     *
     * @param value value to validate.
     * @param minLength minimum allowed length.
     * @param maxLength maximum allowed length.
     * @param fieldName field name used in error messages.
     * @return the trimmed and validated value.
     * @throws DomainException if the value is invalid.
     */
    public static String required(String value, int minLength, int maxLength, String fieldName) {
        String trimmed = required(value, fieldName);

        validateLength(trimmed, minLength, maxLength, fieldName);

        return trimmed;
    }

    /**
     * Validates a required String value against a regular expression.
     *
     * <p>The value must not be {@code null} or blank and must match the provided pattern.
     *
     * @param value value to validate.
     * @param pattern regular expression used for validation.
     * @param fieldName field name used in error messages.
     * @return the trimmed and validated value.
     * @throws DomainException if the value is invalid.
     */
    public static String required(String value, Pattern pattern, String fieldName) {
        String trimmed = required(value, fieldName);

        validatePattern(trimmed, pattern, fieldName);

        return trimmed;
    }

    /**
     * Validates a required String value, its length, and its format.
     *
     * <p>The value must not be {@code null} or blank, must satisfy the specified length range, and
     * must match the provided pattern.
     *
     * @param value value to validate.
     * @param minLength minimum allowed length.
     * @param maxLength maximum allowed length.
     * @param pattern regular expression used for validation.
     * @param fieldName field name used in error messages.
     * @return the trimmed and validated value.
     * @throws DomainException if the value is invalid.
     */
    public static String required(
            String value, int minLength, int maxLength, Pattern pattern, String fieldName) {
        String trimmed = required(value, minLength, maxLength, fieldName);

        validatePattern(trimmed, pattern, fieldName);

        return trimmed;
    }

    /*
     * ============================================================
     * PATCH - OPTIONAL
     * ============================================================
     */

    /**
     * Updates a String value only when a new value is provided.
     *
     * <p>A {@code null} value preserves the current value. When a value is provided, it must not be
     * blank.
     *
     * @param value new value supplied by the caller.
     * @param currentValue current value.
     * @param fieldName field name used in error messages.
     * @return the validated new value or the current value when the new value is null.
     * @throws DomainException if the provided value is blank.
     */
    public static String updateIfPresent(String value, String currentValue, String fieldName) {
        if (value == null) {
            return currentValue;
        }

        return required(value, fieldName);
    }

    /**
     * Updates a String value with length validation.
     *
     * <p>A {@code null} value preserves the current value. When a value is provided, it must
     * satisfy the specified length range.
     *
     * @param value new value supplied by the caller.
     * @param currentValue current value.
     * @param minLength minimum allowed length.
     * @param maxLength maximum allowed length.
     * @param fieldName field name used in error messages.
     * @return the validated new value or the current value when the new value is null.
     * @throws DomainException if the provided value is invalid.
     */
    public static String updateIfPresent(
            String value, String currentValue, int minLength, int maxLength, String fieldName) {
        if (value == null) {
            return currentValue;
        }

        return required(value, minLength, maxLength, fieldName);
    }

    /**
     * Updates a String value with pattern validation.
     *
     * <p>A {@code null} value preserves the current value. When a value is provided, it must
     * satisfy the specified pattern.
     *
     * @param value new value supplied by the caller.
     * @param currentValue current value.
     * @param pattern regular expression used for validation.
     * @param fieldName field name used in error messages.
     * @return the validated new value or the current value when the new value is null.
     * @throws DomainException if the provided value is invalid.
     */
    public static String updateIfPresent(
            String value, String currentValue, Pattern pattern, String fieldName) {
        if (value == null) {
            return currentValue;
        }

        return required(value, pattern, fieldName);
    }

    /**
     * Updates a String value with length and pattern validation.
     *
     * <p>A {@code null} value preserves the current value. When a value is provided, it must
     * satisfy both the specified length range and regular expression.
     *
     * @param value new value supplied by the caller.
     * @param currentValue current value.
     * @param minLength minimum allowed length.
     * @param maxLength maximum allowed length.
     * @param pattern regular expression used for validation.
     * @param fieldName field name used in error messages.
     * @return the validated new value or the current value when the new value is null.
     * @throws DomainException if the provided value is invalid.
     */
    public static String updateIfPresent(
            String value,
            String currentValue,
            int minLength,
            int maxLength,
            Pattern pattern,
            String fieldName) {
        if (value == null) {
            return currentValue;
        }

        return required(value, minLength, maxLength, pattern, fieldName);
    }

    /*
     * ============================================================
     * INTERNAL VALIDATION
     * ============================================================
     */

    /**
     * Validates String length.
     *
     * @param value value to validate.
     * @param minLength minimum allowed length.
     * @param maxLength maximum allowed length.
     * @param fieldName field name used in the error message.
     * @throws DomainException if the value is outside the allowed range.
     */
    private static void validateLength(
            String value, int minLength, int maxLength, String fieldName) {
        if (value.length() < minLength || value.length() > maxLength) {
            throw new DomainException(
                    String.format(
                            "%s must be between %d and %d characters",
                            fieldName, minLength, maxLength));
        }
    }

    /**
     * Validates a String against a regular expression.
     *
     * @param value value to validate.
     * @param pattern regular expression.
     * @param fieldName field name used in the error message.
     * @throws DomainException if the value does not match the pattern.
     */
    private static void validatePattern(String value, Pattern pattern, String fieldName) {
        if (pattern == null) {
            throw new IllegalArgumentException("Validation pattern cannot be null");
        }

        if (!pattern.matcher(value).matches()) {
            throw new DomainException(String.format("%s has an invalid format", fieldName));
        }
    }
}
