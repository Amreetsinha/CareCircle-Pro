package com.carecircle.user_profile_service.caregiver.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Represents a caregiver offering childcare-related services.
 *
 * A caregiver can provide multiple services (capabilities) and hold
 * multiple certifications. Visibility to parents depends on verification
 * status and active flag.
 *
 * Rating fields are aggregated and read-only, updated by the system.
 */
@Entity
@Table(name = "caregiver_profiles")
public class CaregiverProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== Identity (linked logically to auth-service) =====

    @Column(name = "user_email", nullable = false, unique = true, updatable = false)
    private String userEmail;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "gender", nullable = false)
    private String gender; // MALE / FEMALE / OTHER / PREFER_NOT_TO_SAY

    // ===== Address (mandatory) =====

    @Column(name = "address_line1", nullable = false)
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "pincode", nullable = false)
    private String pincode;

    @Column(name = "country", nullable = false)
    private String country;

    // ===== Professional Info =====

    @Column(name = "bio", length = 1000)
    private String bio;

    @Column(name = "experience_years")
    private Integer experienceYears;

    // ===== Verification & Control =====

    @Column(name = "verification_status", nullable = false)
    private String verificationStatus; // PENDING / VERIFIED / REJECTED

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    // ===== Rating Aggregates (READ-ONLY) =====

    @Column(name = "overall_rating", nullable = false)
    private Double overallRating = 0.0;

    @Column(name = "total_reviews", nullable = false)
    private Integer totalReviews = 0;

    @Column(name = "rating_last_updated")
    private LocalDateTime ratingLastUpdated;

    // ===== Audit =====

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected CaregiverProfile() {
        // JPA only
    }

    public CaregiverProfile(
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
    ) {
        this.userEmail = userEmail;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.age = age;
        this.gender = gender;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.country = country;
        this.bio = bio;
        this.experienceYears = experienceYears;
        this.verificationStatus = "PENDING";
        this.isActive = true;
        this.overallRating = 0.0;
        this.totalReviews = 0;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ===== Getters only (mutations controlled via service) =====

    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Integer getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPincode() {
        return pincode;
    }

    public String getCountry() {
        return country;
    }

    public String getBio() {
        return bio;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public Double getOverallRating() {
        return overallRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public LocalDateTime getRatingLastUpdated() {
        return ratingLastUpdated;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

