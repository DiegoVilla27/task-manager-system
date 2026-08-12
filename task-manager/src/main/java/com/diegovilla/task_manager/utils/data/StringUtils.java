package com.diegovilla.task_manager.utils.data;

public final class StringUtils {

  private StringUtils() {
    throw new UnsupportedOperationException("StringUtils is a utility class and cannot be instantiated.");
  }

  /**
   * Normalizes a string by trimming whitespace and converting it to lowercase.
   *
   * @param value the string to normalize, may be null
   * @return the normalized string, or null if input was null
   */
  public static String normalize(String value) {
    if (value == null) {
      return null;
    }
    return value.strip().toLowerCase(); // 💡 Note: 'strip()' en Java 11+ es superior a 'trim()' porque maneja Unicode correctamente
  }
}
