package com.carecircle.matchingBookingService.caregiver.api.dto;

import java.time.LocalDate;
import java.util.UUID;

public class CaregiverCertificationResponse {
    private UUID id;
    private UUID caregiverId;
    private UUID serviceId;
    private String serviceName;
    private String name;
    private String issuedBy;
    private LocalDate validTill;
    private String verificationStatus;
    private Boolean isActive;

    public CaregiverCertificationResponse(UUID id, UUID caregiverId, UUID serviceId, String serviceName, String name, String issuedBy, LocalDate validTill, String verificationStatus, Boolean isActive) {
        this.id = id;
        this.caregiverId = caregiverId;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.name = name;
        this.issuedBy = issuedBy;
        this.validTill = validTill;
        this.verificationStatus = verificationStatus;
        this.isActive = isActive;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getCaregiverId() { return caregiverId; }
    public UUID getServiceId() { return serviceId; }
    public String getServiceName() { return serviceName; }
    public String getName() { return name; }
    public String getIssuedBy() { return issuedBy; }
    public LocalDate getValidTill() { return validTill; }
    public String getVerificationStatus() { return verificationStatus; }
    public Boolean getIsActive() { return isActive; }
}
