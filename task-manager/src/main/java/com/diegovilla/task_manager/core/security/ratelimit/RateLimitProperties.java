package com.diegovilla.task_manager.core.security.ratelimit;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties binding for API rate limiting settings.
 *
 * <p>Binds configuration values declared under the {@code rate-limiting} prefix.</p>
 *
 * @param enabled       whether rate limiting is actively enforced.
 * @param capacity      maximum token bucket capacity (burst size).
 * @param refillTokens  number of tokens added to bucket per refill period.
 * @param refillMinutes duration in minutes between bucket refill intervals.
 * @since 1.0.0
 */
@ConfigurationProperties(prefix = "rate-limiting")
public record RateLimitProperties(
  boolean enabled,
  int capacity,
  int refillTokens,
  int refillMinutes
) {
}

