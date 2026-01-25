package com.carecircle.matchingbooking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "caretakers")
public class Caretaker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "skills")
    private String skills; // comma separated

    @Column(name = "available_from")
    private LocalTime availableFrom;

    @Column(name = "available_to")
    private LocalTime availableTo;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Caretaker() {
    }

    public Caretaker(String userEmail, String fullName, String city, String skills, LocalTime availableFrom, LocalTime availableTo) {
        this.userEmail = userEmail;
        this.fullName = fullName;
        this.city = city;
        this.skills = skills;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
        this.isActive = true;
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

    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public String getFullName() { return fullName; }
    public String getCity() { return city; }
    public String getSkills() { return skills; }
    public LocalTime getAvailableFrom() { return availableFrom; }
    public LocalTime getAvailableTo() { return availableTo; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void deactivate() { this.isActive = false; }
    public void activate() { this.isActive = true; }
}
