package com.diegovilla.task_manager.features.auth.infrastructure.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Response payload returned upon successful user authentication, registration, or token refresh.
 *
 * @param access_token signed JWT access token string.
 * @param refresh_token signed JWT refresh token string.
 * @param expires_in token duration in seconds.
 * @since 1.0.0
 */
@Schema(description = "Response body returned upon successful authentication or token refresh")
public record AuthResponseDTO(
        @Schema(
                        description =
                                "JWT Bearer access token for authenticating protected API requests",
                        example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
                String access_token,
        @Schema(
                        description = "JWT refresh token for obtaining new access tokens",
                        example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
                String refresh_token,
        @Schema(description = "Access token lifetime duration in seconds", example = "3600")
                long expires_in) {}
