package com.diegovilla.task_manager.utils.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.diegovilla.task_manager.core.errors.exceptions.DomainException;
import java.util.regex.Pattern;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DataUtilsTest {

    @Test
    @DisplayName("StringUtils: normalize trims and lowercases or returns null")
    void testStringUtilsNormalize() {
        assertThat(StringUtils.normalize(null)).isNull();
        assertThat(StringUtils.normalize("  HeLLo WoRLd  ")).isEqualTo("hello world");
        assertThat(StringUtils.normalize("TEST")).isEqualTo("test");
    }

    @Test
    @DisplayName("ValidateDataUtils: required(value, fieldName) validates properly")
    void testRequiredSimple() {
        assertThat(ValidateDataUtils.required("  valid  ", "name")).isEqualTo("valid");

        assertThatThrownBy(() -> ValidateDataUtils.required(null, "name"))
                .isInstanceOf(DomainException.class)
                .hasMessage("name is required");

        assertThatThrownBy(() -> ValidateDataUtils.required("   ", "name"))
                .isInstanceOf(DomainException.class)
                .hasMessage("name is required");
    }

    @Test
    @DisplayName("ValidateDataUtils: required with min/max length")
    void testRequiredWithLength() {
        assertThat(ValidateDataUtils.required("hello", 3, 10, "field")).isEqualTo("hello");

        assertThatThrownBy(() -> ValidateDataUtils.required("hi", 3, 10, "field"))
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("must be between 3 and 10 characters");

        assertThatThrownBy(() -> ValidateDataUtils.required("verylongstringhere", 3, 10, "field"))
                .isInstanceOf(DomainException.class)
                .hasMessageContaining("must be between 3 and 10 characters");
    }

    @Test
    @DisplayName("ValidateDataUtils: required with pattern")
    void testRequiredWithPattern() {
        Pattern numeric = Pattern.compile("^[0-9]+$");

        assertThat(ValidateDataUtils.required("12345", numeric, "code")).isEqualTo("12345");

        assertThatThrownBy(() -> ValidateDataUtils.required("abc", numeric, "code"))
                .isInstanceOf(DomainException.class)
                .hasMessage("code has an invalid format");

        assertThatThrownBy(() -> ValidateDataUtils.required("123", (Pattern) null, "code"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Validation pattern cannot be null");
    }

    @Test
    @DisplayName("ValidateDataUtils: required with length and pattern")
    void testRequiredWithLengthAndPattern() {
        Pattern alpha = Pattern.compile("^[a-zA-Z]+$");

        assertThat(ValidateDataUtils.required("abc", 2, 5, alpha, "code")).isEqualTo("abc");

        assertThatThrownBy(() -> ValidateDataUtils.required("a", 2, 5, alpha, "code"))
                .isInstanceOf(DomainException.class);
        assertThatThrownBy(() -> ValidateDataUtils.required("123", 2, 5, alpha, "code"))
                .isInstanceOf(DomainException.class);
    }

    @Test
    @DisplayName("ValidateDataUtils: updateIfPresent returns current when new value is null")
    void testUpdateIfPresentNull() {
        Pattern pattern = Pattern.compile("^[a-z]+$");

        assertThat(ValidateDataUtils.updateIfPresent(null, "current", "field"))
                .isEqualTo("current");
        assertThat(ValidateDataUtils.updateIfPresent(null, "current", 1, 10, "field"))
                .isEqualTo("current");
        assertThat(ValidateDataUtils.updateIfPresent(null, "current", pattern, "field"))
                .isEqualTo("current");
        assertThat(ValidateDataUtils.updateIfPresent(null, "current", 1, 10, pattern, "field"))
                .isEqualTo("current");
    }

    @Test
    @DisplayName("ValidateDataUtils: updateIfPresent updates and validates when value provided")
    void testUpdateIfPresentProvided() {
        Pattern pattern = Pattern.compile("^[a-z]+$");

        assertThat(ValidateDataUtils.updateIfPresent("new", "old", "field")).isEqualTo("new");
        assertThat(ValidateDataUtils.updateIfPresent("new", "old", 2, 5, "field")).isEqualTo("new");
        assertThat(ValidateDataUtils.updateIfPresent("new", "old", pattern, "field"))
                .isEqualTo("new");
        assertThat(ValidateDataUtils.updateIfPresent("new", "old", 2, 5, pattern, "field"))
                .isEqualTo("new");

        assertThatThrownBy(() -> ValidateDataUtils.updateIfPresent(" ", "old", "field"))
                .isInstanceOf(DomainException.class);
    }
}
