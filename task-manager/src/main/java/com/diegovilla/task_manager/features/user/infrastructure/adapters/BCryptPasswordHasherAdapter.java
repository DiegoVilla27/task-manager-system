package com.diegovilla.task_manager.features.user.infrastructure.adapters;

import com.diegovilla.task_manager.features.user.application.ports.PasswordHasherPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Infrastructure adapter implementing {@link PasswordHasherPort} using Spring Security's {@link PasswordEncoder}.
 *
 * @since 1.0.0
 */
@Component
@RequiredArgsConstructor
public class BCryptPasswordHasherAdapter implements PasswordHasherPort {

  private final PasswordEncoder passwordEncoder;

  /**
   * {@inheritDoc}
   */
  @Override
  public String hash(String rawPassword) {
    return passwordEncoder.encode(rawPassword);
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean matches(String rawPassword, String hashedPassword) {
    return passwordEncoder.matches(rawPassword, hashedPassword);
  }
}

