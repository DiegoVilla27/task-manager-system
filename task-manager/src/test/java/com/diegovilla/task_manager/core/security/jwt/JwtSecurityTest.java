package com.diegovilla.task_manager.core.security.jwt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class JwtSecurityTest {

    @Mock private JwtProperties jwtProperties;

    @InjectMocks private JwtService jwtService;

    @BeforeEach
    void setUp() {
        when(jwtProperties.secret()).thenReturn("4zx8BmgguZyFKmspfzMvL084GB7550AE");
        when(jwtProperties.expSecret()).thenReturn(3600L);
        when(jwtProperties.refresh()).thenReturn("yZWg3ahaIHPLHvqFwbdLbZP58vxTcmfb");
        when(jwtProperties.expRefresh()).thenReturn(604800L);
    }

    @Test
    @DisplayName("Should generate token successfully")
    void shouldGenerateTokenSuccessfully() {
        UUID userId = UUID.randomUUID();
        UserRole userRole = UserRole.USER;

        JwtModel tokens = jwtService.generateToken(userId.toString(), userRole);

        assertThat(tokens).isNotNull();
        assertThat(jwtService.isValid(tokens.access_token(), true)).isTrue();
        assertThat(jwtService.isValid(tokens.refresh_token(), false)).isTrue();
    }

    @Test
    @DisplayName("Should get subject to token")
    void shouldGetSubjectToToken() {
        UUID userId = UUID.randomUUID();
        UserRole userRole = UserRole.USER;

        JwtModel tokens = jwtService.generateToken(userId.toString(), userRole);

        String subject = jwtService.extractSubject(tokens.access_token(), true);

        assertThat(UUID.fromString(subject)).isEqualTo(userId);
    }
}
