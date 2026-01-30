package com.carecircle.matchingBookingService.booking.repository;

import com.carecircle.matchingBookingService.booking.model.BookingChild;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingChildRepository extends JpaRepository<BookingChild, UUID> {

    List<BookingChild> findByBookingId(UUID bookingId);
}
