package com.carecircle.matchingbooking.repository;

import com.carecircle.matchingbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByParentEmail(String parentEmail);
    List<Booking> findByCaretakerEmail(String caretakerEmail);
}
