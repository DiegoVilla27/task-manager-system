package com.diegovilla.task_manager.core.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JwtSecurityTest {

  @Mock
  private JwtProperties jwtProperties;

  @InjectMocks
  private JwtService jwtService;

  @BeforeEach
  void setUp() {
    when(jwtProperties.secret()).thenReturn("489a8fc6474b786c6792377cbe4a30e8a719c8fbc4c3e7f4c4aef523a1005b63");
    when(jwtProperties.expiration()).thenReturn(3600L);
  }

  @Test
  @DisplayName("Should generate token successfully")
  void shouldGenerateTokenSuccessfully() {
    String email = "id_1234";

    String token = jwtService.generateToken(email);

    assertThat(token).isNotNull();
    assertThat(jwtService.isValid(token)).isTrue();
  }

  @Test
  @DisplayName("Should get subject to token")
  void shouldGetSubjectToToken() {
    String email = "id_1234";

    String token = jwtService.generateToken(email);

    String subject = jwtService.extractSubject(token);

    assertThat(subject).isEqualTo(email);
    assertThat(jwtService.isValid(token)).isTrue();
  }
}
