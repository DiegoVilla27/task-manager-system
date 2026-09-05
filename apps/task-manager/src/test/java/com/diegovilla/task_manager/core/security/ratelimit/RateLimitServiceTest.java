package com.diegovilla.task_manager.core.security.ratelimit;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.bucket4j.ConsumptionProbe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RateLimitServiceTest {

    private RateLimitService rateLimitService;

    @BeforeEach
    void setUp() {
        RateLimitProperties properties = new RateLimitProperties(true, 2, 2, 1);
        rateLimitService = new RateLimitService(properties);
    }

    @Test
    @DisplayName("Should allow consumption within limit")
    void shouldAllowConsumptionWithinLimit() {
        ConsumptionProbe probe1 = rateLimitService.tryConsumeAndReturnProbe("client-1");
        assertThat(probe1.isConsumed()).isTrue();
        assertThat(probe1.getRemainingTokens()).isEqualTo(1);

        ConsumptionProbe probe2 = rateLimitService.tryConsumeAndReturnProbe("client-1");
        assertThat(probe2.isConsumed()).isTrue();
        assertThat(probe2.getRemainingTokens()).isZero();
    }

    @Test
    @DisplayName("Should reject consumption when rate limit exceeded")
    void shouldRejectWhenLimitExceeded() {
        rateLimitService.tryConsumeAndReturnProbe("client-2");
        rateLimitService.tryConsumeAndReturnProbe("client-2");

        ConsumptionProbe probe3 = rateLimitService.tryConsumeAndReturnProbe("client-2");
        assertThat(probe3.isConsumed()).isFalse();
        assertThat(probe3.getNanosToWaitForRefill()).isGreaterThan(0);
    }

    @Test
    @DisplayName("Should track different clients separately")
    void shouldTrackDifferentClientsSeparately() {
        ConsumptionProbe clientA = rateLimitService.tryConsumeAndReturnProbe("client-a");
        ConsumptionProbe clientB = rateLimitService.tryConsumeAndReturnProbe("client-b");

        assertThat(clientA.isConsumed()).isTrue();
        assertThat(clientB.isConsumed()).isTrue();
        assertThat(clientA.getRemainingTokens()).isEqualTo(1);
        assertThat(clientB.getRemainingTokens()).isEqualTo(1);
    }
}
