package com.carecircle.matchingBookingService.availability.repository;

import com.carecircle.matchingBookingService.availability.model.CaregiverAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CaregiverAvailabilityRepository extends JpaRepository<CaregiverAvailability, UUID> {

    List<CaregiverAvailability> findByCaregiverIdAndActiveTrue(UUID caregiverId);

    List<CaregiverAvailability> findByCaregiverIdAndDayOfWeekAndActiveTrue(
            UUID caregiverId,
            String dayOfWeek
    );
}
