package com.diegovilla.task_manager.utils.data;

public final class StringUtils {

  private StringUtils() {
    throw new UnsupportedOperationException("StringUtils is a utility class and cannot be instantiated.");
  }

  public static String normalize(String value) {
    if (value == null) {
      return null;
    }
    return value.trim().toLowerCase();
  }
}
