package com.diegovilla.task_manager.core.security.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties binding for JSON Web Token parameters.
 *
 * <p>Binds properties mapped under the {@code security.jwt} prefix in application configuration files.</p>
 *
 * @param secret     secret signing key string used for signing Access Tokens.
 * @param expSecret  Access Token validity duration in seconds.
 * @param refresh    secret signing key string used for signing Refresh Tokens.
 * @param expRefresh Refresh Token validity duration in seconds.
 * @since 1.0.0
 */
@ConfigurationProperties(prefix = "security.jwt")
public record JwtProperties(
  String secret,
  long expSecret,
  String refresh,
  long expRefresh
) {
}

