package com.carecircle.user_profile_service.parent.exception;

/**
 * Thrown when parent profile is not found for a user.
 */
public class ParentProfileNotFoundException extends RuntimeException {

    public ParentProfileNotFoundException(String userEmail) {
        super("Parent profile not found for user: " + userEmail);
    }
}
