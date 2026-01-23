package com.carecircle.user_profile_service.caregiver.exception;

/**
 * Thrown when a caregiver profile is not found.
 */
public class CaregiverProfileNotFoundException extends RuntimeException {

    public CaregiverProfileNotFoundException(String userEmail) {
        super("Caregiver profile not found for user: " + userEmail);
    }
}