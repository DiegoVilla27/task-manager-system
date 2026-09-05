package com.diegovilla.task_manager.core.security.jwt.adapters;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

class SpringSecurityUserProviderTest {

    private SpringSecurityUserProvider userProvider;
    private SecurityContext securityContext;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        userProvider = new SpringSecurityUserProvider();
        securityContext = mock(SecurityContext.class);
        authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Should return current user UUID when authenticated")
    void shouldReturnCurrentUserIdWhenAuthenticated() {
        UUID expectedId = UUID.randomUUID();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(expectedId.toString());

        UUID actualId = userProvider.getCurrentUserId();

        assertThat(actualId).isEqualTo(expectedId);
    }

    @Test
    @DisplayName("Should throw AccessDeniedException when authentication is null")
    void shouldThrowWhenAuthenticationIsNull() {
        when(securityContext.getAuthentication()).thenReturn(null);

        assertThatThrownBy(() -> userProvider.getCurrentUserId())
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("No authenticated user found");
    }

    @Test
    @DisplayName("Should throw AccessDeniedException when authentication is not authenticated")
    void shouldThrowWhenNotAuthenticated() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> userProvider.getCurrentUserId())
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    @DisplayName("Should throw AccessDeniedException when principal name is not a valid UUID")
    void shouldThrowWhenPrincipalNameInvalidUuid() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("not-a-uuid");

        assertThatThrownBy(() -> userProvider.getCurrentUserId())
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("Invalid user ID format");
    }

    @Test
    @DisplayName("Should return role when authorities present")
    @SuppressWarnings({"rawtypes", "unchecked"})
    void shouldReturnRoleWhenAuthoritiesPresent() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getAuthorities())
                .thenReturn((List) List.of(new SimpleGrantedAuthority("ROLE_USER")));

        String role = userProvider.getCurrentUserRole();

        assertThat(role).isEqualTo("ROLE_USER");
    }

    @Test
    @DisplayName("Should throw AccessDeniedException when authorities empty")
    @SuppressWarnings({"rawtypes", "unchecked"})
    void shouldThrowWhenAuthoritiesEmpty() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getAuthorities()).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> userProvider.getCurrentUserRole())
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("No authorities found");
    }
}
