package com.carecircle.matchingBookingService.availability.repository;

import com.carecircle.matchingBookingService.availability.model.CaregiverAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CaregiverAvailabilityRepository extends JpaRepository<CaregiverAvailability, UUID> {

    List<CaregiverAvailability> findByCaregiverIdAndActiveTrue(UUID caregiverId);

    List<CaregiverAvailability> findByCaregiverIdAndAvailableDateAndActiveTrue(
            UUID caregiverId,
            java.time.LocalDate availableDate
    );

    List<CaregiverAvailability> findByCaregiverIdAndAvailableDateGreaterThanEqualAndActiveTrue(
            UUID caregiverId,
            java.time.LocalDate date
    );

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByCaregiverIdAndAvailableDateBefore(UUID caregiverId, java.time.LocalDate date);

    @org.springframework.data.jpa.repository.Query("SELECT c.caregiverId FROM CaregiverAvailability c WHERE c.availableDate = :date AND c.startTime <= :startTime AND c.endTime >= :endTime AND c.active = true")
    List<UUID> findAvailableCaregiverIds(java.time.LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime);
}
