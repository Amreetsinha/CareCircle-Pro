package com.carecircle.matchingBookingService.booking.service;

import com.carecircle.matchingBookingService.booking.model.Booking;
import com.carecircle.matchingBookingService.booking.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingScheduler {

    private final BookingRepository bookingRepository;

    public BookingScheduler(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * Runs every 15 minutes to mark past bookings as COMPLETED.
     */
    @Scheduled(fixedRate = 900000) // 15 min
    @Transactional
    public void completePastBookings() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Find ACCEPTED bookings that ended in the past
        // Logic: End Date < Today OR (End Date == Today AND End Time < Now)
        // This is a bit complex in JPA derived queries, so we might need a custom query or fetch & filter.
        // For simplicity/performance in this MVP, we fetch active bookings and filter in memory or use a custom query.
        
        // Let's use filter in stream for readability now, optimize later if needed.
        // Actually, "ACCEPTED" is the status we care about.
        
        List<Booking> activeBookings = bookingRepository.findByStatus("ACCEPTED");
        
        for (Booking booking : activeBookings) {
            boolean isPast = false;
            if (booking.getEndDate().isBefore(today)) {
                isPast = true;
            } else if (booking.getEndDate().equals(today)) {
                if (booking.getEndTime() != null && booking.getEndTime().isBefore(now)) {
                    isPast = true;
                }
            }
            
            if (isPast) {
                booking.complete();
                bookingRepository.save(booking);
                System.out.println("Auto-completed booking: " + booking.getId());
            }
        }
    }
}
