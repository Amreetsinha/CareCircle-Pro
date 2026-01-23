package com.carecircle.user_profile_service.caregiver.service;


import com.carecircle.user_profile_service.caregiver.model.CaregiverCapability;
import com.carecircle.user_profile_service.caregiver.model.CaregiverCertification;
import com.carecircle.user_profile_service.caregiver.model.CaregiverProfile;

import java.util.List;

/**
 * Service interface for caregiver self-management operations.
 */
public interface CaregiverService {

    // ===== Caregiver Profile =====

    CaregiverProfile createProfile(
            String userEmail,
            String fullName,
            String phoneNumber,
            Integer age,
            String gender,
            String addressLine1,
            String addressLine2,
            String city,
            String state,
            String pincode,
            String country,
            String bio,
            Integer experienceYears
    );

    CaregiverProfile getMyProfile(String userEmail);

    CaregiverProfile updateMyProfile(
            String userEmail,
            String fullName,
            String phoneNumber,
            String addressLine1,
            String addressLine2,
            String city,
            String state,
            String pincode,
            String country,
            String bio,
            Integer experienceYears
    );

    // ===== Capabilities =====

    CaregiverCapability addCapability(
            String userEmail,
            String serviceType,
            String description,
            Integer minChildAge,
            Integer maxChildAge,
            Boolean requiresCertification
    );

    List<CaregiverCapability> getMyCapabilities(String userEmail);

    // ===== Certifications =====

    CaregiverCertification addCertification(
            String userEmail,
            String certificationName,
            String issuedBy,
            java.time.LocalDate validTill
    );

    List<CaregiverCertification> getMyCertifications(String userEmail);
}
