package com.carecircle.user_profile_service.caregiver.exception;

/**
 * Thrown when a caregiver capability is not found or not owned by the caregiver.
 */
public class CaregiverCapabilityNotFoundException extends RuntimeException {

    public CaregiverCapabilityNotFoundException(Long capabilityId) {
        super("Caregiver capability not found for id: " + capabilityId);
    }
}