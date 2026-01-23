package com.carecircle.user_profile_service.caregiver.exception;

/**
 * Thrown when a caregiver certification is not found or not owned by the caregiver.
 */
public class CaregiverCertificationNotFoundException extends RuntimeException {

    public CaregiverCertificationNotFoundException(Long certificationId) {
        super("Caregiver certification not found for id: " + certificationId);
    }
}