package com.carecircle.matchingbooking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_email", nullable = false)
    private String parentEmail;

    @Column(name = "child_name", nullable = false)
    private String childName;

    @Column(name = "caretaker_email", nullable = false)
    private String caretakerEmail;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "slot_start", nullable = false)
    private LocalDateTime slotStart;

    @Column(name = "slot_end", nullable = false)
    private LocalDateTime slotEnd;

    @Column(name = "status", nullable = false)
    private String status; // PENDING / CONFIRMED / REJECTED / CANCELLED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Booking() {}

    public Booking(String parentEmail, String childName, String caretakerEmail, String city, LocalDateTime slotStart, LocalDateTime slotEnd) {
        this.parentEmail = parentEmail;
        this.childName = childName;
        this.caretakerEmail = caretakerEmail;
        this.city = city;
        this.slotStart = slotStart;
        this.slotEnd = slotEnd;
        this.status = "PENDING";
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
    public String getParentEmail() { return parentEmail; }
    public String getChildName() { return childName; }
    public String getCaretakerEmail() { return caretakerEmail; }
    public String getCity() { return city; }
    public LocalDateTime getSlotStart() { return slotStart; }
    public LocalDateTime getSlotEnd() { return slotEnd; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setStatus(String status) { this.status = status; }
}
