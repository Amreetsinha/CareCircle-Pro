package com.carecircle.matchingBookingService.booking.repository;

import com.carecircle.matchingBookingService.booking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByCaregiverIdAndStatus(UUID caregiverId, String status);

    List<Booking> findByParentId(UUID parentId);

    List<Booking> findByCaregiverId(UUID caregiverId);
    
    List<Booking> findByStatus(String status);
    List<Booking> findByStatusIn(List<String> statuses);
    List<Booking> findByCaregiverIdAndStatusIn(UUID caregiverId, List<String> statuses);
    List<Booking> findByParentIdAndStatusIn(UUID parentId, List<String> statuses);
    
    boolean existsByCaregiverIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            UUID caregiverId,
            String status,
            java.time.LocalTime endTime,
            java.time.LocalTime startTime
    );
    
    boolean existsByCaregiverIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            UUID caregiverId,
            String status,
            java.time.LocalDate endDate,
            java.time.LocalDate startDate
    );
    
    // Paginated status filtering
    Page<Booking> findByParentIdAndStatusIn(UUID parentId, List<String> statuses, Pageable pageable);
    
    Page<Booking> findByCaregiverIdAndStatusIn(UUID caregiverId, List<String> statuses, Pageable pageable);
    
    Page<Booking> findByStatusIn(List<String> statuses, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.caregiverId = :caregiverId AND b.status = 'ACCEPTED' AND b.startDate = :date AND " +
            "((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findOverlappingBookings(UUID caregiverId, java.time.LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime);
}
