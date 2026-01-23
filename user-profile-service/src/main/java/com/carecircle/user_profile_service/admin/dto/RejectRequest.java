package com.carecircle.user_profile_service.admin.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO used by admins to reject an entity.
 */
public class RejectRequest {

    @NotBlank
    private String reason;

    public RejectRequest() {
    }

    public String getReason() {
        return reason;
    }
}

