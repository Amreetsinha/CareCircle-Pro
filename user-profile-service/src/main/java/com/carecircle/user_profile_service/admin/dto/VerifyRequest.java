package com.carecircle.user_profile_service.admin.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO used by admins to verify an entity.
 */
public class VerifyRequest {

    @NotBlank
    private String reason;

    public VerifyRequest() {
    }

    public String getReason() {
        return reason;
    }
}

