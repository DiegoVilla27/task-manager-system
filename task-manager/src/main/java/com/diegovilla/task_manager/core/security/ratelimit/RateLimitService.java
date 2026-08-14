package com.diegovilla.task_manager.core.security.ratelimit;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service managing client token buckets for rate limiting using Bucket4j.
 *
 * <p>Maintains an in-memory concurrent map of client buckets configured according to
 * {@link RateLimitProperties} and tracks probe consumption state.</p>
 *
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@EnableConfigurationProperties(RateLimitProperties.class)
public class RateLimitService {

  private final RateLimitProperties properties;
  private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

  /**
   * Attempts to consume 1 token for the specified client key and returns consumption probe metrics.
   *
   * @param key unique identifier representing the client (e.g. user ID or remote IP).
   * @return a {@link ConsumptionProbe} containing token consumption status and nanos until refill.
   */
  public ConsumptionProbe tryConsumeAndReturnProbe(String key) {
    Bucket bucket = cache.computeIfAbsent(key, k -> createNewBucket());
    return bucket.tryConsumeAndReturnRemaining(1);
  }

  /**
   * Creates a new Bucket configured with bandwidth capacity and refill interval.
   *
   * @return a newly initialized {@link Bucket} instance.
   */
  private Bucket createNewBucket() {
    return Bucket.builder()
      .addLimit(limit -> limit
        .capacity(properties.capacity())
        .refillIntervally(properties.refillTokens(), Duration.ofMinutes(properties.refillMinutes()))
      )
      .build();
  }
}

