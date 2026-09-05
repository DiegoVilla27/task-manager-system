package com.diegovilla.task_manager.features.user.infrastructure.adapters;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class BCryptPasswordHasherAdapterTest {

    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private BCryptPasswordHasherAdapter hasherAdapter;

    @Test
    @DisplayName("Should encode raw password using PasswordEncoder")
    void shouldHashPassword() {
        when(passwordEncoder.encode("secret123")).thenReturn("hashed123");

        String result = hasherAdapter.hash("secret123");

        assertThat(result).isEqualTo("hashed123");
        verify(passwordEncoder).encode("secret123");
    }

    @Test
    @DisplayName("Should match raw and hashed password using PasswordEncoder")
    void shouldMatchPassword() {
        when(passwordEncoder.matches("secret123", "hashed123")).thenReturn(true);
        when(passwordEncoder.matches("wrong", "hashed123")).thenReturn(false);

        assertThat(hasherAdapter.matches("secret123", "hashed123")).isTrue();
        assertThat(hasherAdapter.matches("wrong", "hashed123")).isFalse();
    }
}
