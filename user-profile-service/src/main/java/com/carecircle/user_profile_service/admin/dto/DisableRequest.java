package com.carecircle.user_profile_service.admin.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO used by admins to disable or enable a caregiver profile.
 */
public class DisableRequest {

    @NotBlank
    private String reason;

    public DisableRequest() {
    }

    public String getReason() {
        return reason;
    }
}
