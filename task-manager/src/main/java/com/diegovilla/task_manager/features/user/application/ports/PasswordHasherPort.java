package com.diegovilla.task_manager.features.user.application.ports;

public interface PasswordHasherPort {

  String hash(String rawPassword);

  boolean matches(String rawPassword, String hashedPassword);
}
