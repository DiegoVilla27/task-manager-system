package com.diegovilla.task_manager.core.security.ratelimit;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@EnableConfigurationProperties(RateLimitProperties.class)
public class RateLimitService {

  private final RateLimitProperties properties;
  private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

  /**
   * Intenta consumir 1 token y devuelve el ConsumptionProbe con el resultado y el tiempo de recarga.
   */
  public ConsumptionProbe tryConsumeAndReturnProbe(String key) {
    Bucket bucket = cache.computeIfAbsent(key, k -> createNewBucket());
    return bucket.tryConsumeAndReturnRemaining(1);
  }

  /**
   * Crea un nuevo cubo configurado con el builder fluido moderno de Bucket4j.
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
