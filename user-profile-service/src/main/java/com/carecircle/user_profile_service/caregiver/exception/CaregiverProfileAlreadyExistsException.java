package com.carecircle.user_profile_service.caregiver.exception;

/**
 * Thrown when a caregiver profile already exists for a user.
 */
public class CaregiverProfileAlreadyExistsException extends RuntimeException {

    public CaregiverProfileAlreadyExistsException(String userEmail) {
        super("Caregiver profile already exists for user: " + userEmail);
    }
}