package com.diegovilla.task_manager.features.user.application.ports;

/**
 * Outbound port interface defining the contract for password hashing and verification.
 *
 * <p>Decouples domain and application layers from specific cryptographic hashing libraries.</p>
 *
 * @since 1.0.0
 */
public interface PasswordHasherPort {

  /**
   * Hashes a plain-text password securely.
   *
   * @param rawPassword plain-text password to hash.
   * @return the resulting secure password hash string.
   */
  String hash(String rawPassword);

  /**
   * Verifies whether a plain-text password matches an encoded hash.
   *
   * @param rawPassword    plain-text password to verify.
   * @param hashedPassword stored hash string to compare against.
   * @return {@code true} if passwords match; {@code false} otherwise.
   */
  boolean matches(String rawPassword, String hashedPassword);
}

