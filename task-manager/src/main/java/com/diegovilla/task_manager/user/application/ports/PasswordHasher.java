package com.diegovilla.task_manager.user.application.ports;

public interface PasswordHasher {

  String hash(String rawPassword);

  boolean matches(String rawPassword, String hashedPassword);
}
