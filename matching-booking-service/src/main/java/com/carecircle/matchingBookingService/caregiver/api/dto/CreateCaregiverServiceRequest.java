package com.carecircle.matchingBookingService.caregiver.api.dto;

import java.util.UUID;

public class CreateCaregiverServiceRequest {

    private UUID serviceId;
    private Double extraPrice;

    public UUID getServiceId() {
        return serviceId;
    }

    public Double getExtraPrice() {
        return extraPrice;
    }
}
