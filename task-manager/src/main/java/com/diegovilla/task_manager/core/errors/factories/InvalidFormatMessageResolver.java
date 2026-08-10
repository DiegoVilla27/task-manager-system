package com.diegovilla.task_manager.core.errors.factories;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.net.URI;
import java.net.URL;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Utility class responsible for resolving user-friendly validation messages
 * according to the expected Java type.
 *
 * <p>It is primarily used by Spring exception handlers when a request value
 * cannot be converted to the required target type.</p>
 *
 * @since 1.0.0
 */
public final class InvalidFormatMessageResolver {

  private InvalidFormatMessageResolver() {
    throw new AssertionError("Utility class");
  }

  private static final String INTEGER = "Must be an integer.";
  private static final String DECIMAL = "Must be a decimal number.";
  private static final String BOOLEAN = "Must be 'true' or 'false'.";

  private static final Map<Class<?>, String> MESSAGES = Map.ofEntries(
    Map.entry(Byte.class, INTEGER),
    Map.entry(byte.class, INTEGER),
    Map.entry(Short.class, INTEGER),
    Map.entry(short.class, INTEGER),
    Map.entry(Integer.class, INTEGER),
    Map.entry(int.class, INTEGER),
    Map.entry(Long.class, INTEGER),
    Map.entry(long.class, INTEGER),
    Map.entry(BigInteger.class, INTEGER),
    Map.entry(Double.class, DECIMAL),
    Map.entry(double.class, DECIMAL),
    Map.entry(Float.class, DECIMAL),
    Map.entry(float.class, DECIMAL),
    Map.entry(BigDecimal.class, DECIMAL),
    Map.entry(Boolean.class, BOOLEAN),
    Map.entry(boolean.class, BOOLEAN),
    Map.entry(Character.class, "Must be a single character."),
    Map.entry(char.class, "Must be a single character."),
    Map.entry(String.class, "Must be text."),
    Map.entry(LocalDate.class, "Date must be in yyyy-MM-dd format."),
    Map.entry(LocalDateTime.class, "Date and time must be in yyyy-MM-dd'T'HH:mm:ss format."),
    Map.entry(LocalTime.class, "Time must be in HH:mm:ss format."),
    Map.entry(OffsetDateTime.class, "Date must include a valid time zone."),
    Map.entry(ZonedDateTime.class, "Date must include a valid time zone."),
    Map.entry(Instant.class, "Must be a valid ISO-8601 date."),
    Map.entry(Date.class, "Must be a valid date."),
    Map.entry(UUID.class, "Must be a valid UUID."),
    Map.entry(URI.class, "Must be a valid URI."),
    Map.entry(URL.class, "Must be a valid URL."),
    Map.entry(Currency.class, "Must be a valid ISO currency code."),
    Map.entry(Locale.class, "Must be a valid locale.")
  );

  /**
   * Resolves a validation message for the specified Java type.
   *
   * <p>If the target type is an {@code Enum}, the returned message includes
   * all allowed values.</p>
   *
   * @param targetType expected Java type.
   * @return a user-friendly validation message.
   */
  public static String resolve(Class<?> targetType) {

    if (targetType == null) {
      return "The provided value is invalid.";
    }

    if (targetType.isEnum()) {
      String allowedValues = Arrays.stream(targetType.getEnumConstants())
        .map(Object::toString)
        .collect(Collectors.joining(", "));

      return "Invalid value. Allowed values: [" + allowedValues + "]";
    }

    return MESSAGES.getOrDefault(
      targetType,
      "The provided value is not compatible with the expected type."
    );
  }
}
