package com.carecircle.matchingBookingService.booking.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(
        name = "booking_children",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_booking_child",
                        columnNames = {"booking_id", "child_id"}
                )
        }
)
public class BookingChild {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "booking_id", nullable = false)
    private UUID bookingId;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(name = "child_name", nullable = false)
    private String childName;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "special_needs")
    private String specialNeeds;

    protected BookingChild() {
        // JPA only
    }

    public BookingChild(
            UUID bookingId,
            UUID childId,
            String childName,
            Integer age,
            String specialNeeds
    ) {
        this.bookingId = bookingId;
        this.childId = childId;
        this.childName = childName;
        this.age = age;
        this.specialNeeds = specialNeeds;
    }

    public UUID getId() {
        return id;
    }

    public UUID getBookingId() {
        return bookingId;
    }

    public UUID getChildId() {
        return childId;
    }

    public String getChildName() {
        return childName;
    }

    public Integer getAge() {
        return age;
    }

    public String getSpecialNeeds() {
        return specialNeeds;
    }
}
