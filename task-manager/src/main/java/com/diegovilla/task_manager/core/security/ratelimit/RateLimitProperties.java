package com.diegovilla.task_manager.core.security.ratelimit;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rate-limiting")
public record RateLimitProperties(
  boolean enabled,
  int capacity,
  int refillTokens,
  int refillMinutes
) {
}
