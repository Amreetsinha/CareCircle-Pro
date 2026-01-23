package com.carecircle.user_profile_service.parent.exception;

/**
 * Thrown when attempting to create a parent profile that already exists.
 */
public class ParentProfileAlreadyExistsException extends RuntimeException {

	public ParentProfileAlreadyExistsException(String userEmail) {
        super("Parent profile already exists for user: " + userEmail);
    }
}
