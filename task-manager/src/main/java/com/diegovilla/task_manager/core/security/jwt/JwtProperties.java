package com.diegovilla.task_manager.core.security.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.jwt")
public record JwtProperties(
  String secret,
  long expSecret,
  String refresh,
  long expRefresh
) {
}
