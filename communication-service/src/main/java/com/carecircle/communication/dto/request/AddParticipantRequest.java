package com.carecircle.communication.dto.request;

import java.util.UUID;

public class AddParticipantRequest {

    private UUID userId;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
