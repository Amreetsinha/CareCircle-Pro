package com.carecircle.matchingbooking.service;

import com.carecircle.matchingbooking.dto.CaretakerDTO;
import com.carecircle.matchingbooking.dto.BookingRequestDTO;
import com.carecircle.matchingbooking.entity.Booking;
import com.carecircle.matchingbooking.entity.Caretaker;
import com.carecircle.matchingbooking.repository.BookingRepository;
import com.carecircle.matchingbooking.repository.CaretakerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.transaction.Transactional;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final CaretakerRepository caretakerRepository;
    private final BookingRepository bookingRepository;
    private final RestTemplate restTemplate;
    private final String notificationUrl;

    public MatchingService(CaretakerRepository caretakerRepository, BookingRepository bookingRepository, RestTemplate restTemplate,
                           @Value("${notification.service.url:http://localhost:8081/notify}") String notificationUrl) {
        this.caretakerRepository = caretakerRepository;
        this.bookingRepository = bookingRepository;
        this.restTemplate = restTemplate;
        this.notificationUrl = notificationUrl;
    }

    public List<CaretakerDTO> matchCaretakers(String city, LocalTime slotStart, LocalTime slotEnd, String requiredSkill) {
        List<Caretaker> candidates = caretakerRepository.findAvailableInSlot(city, slotStart, slotEnd);
        return candidates.stream()
                .filter(c -> requiredSkill == null || requiredSkill.isBlank() || (c.getSkills() != null && c.getSkills().toLowerCase().contains(requiredSkill.toLowerCase())))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private CaretakerDTO toDto(Caretaker c) {
        CaretakerDTO d = new CaretakerDTO();
        d.setId(c.getId());
        d.setUserEmail(c.getUserEmail());
        d.setFullName(c.getFullName());
        d.setCity(c.getCity());
        d.setSkills(c.getSkills());
        d.setAvailableFrom(c.getAvailableFrom());
        d.setAvailableTo(c.getAvailableTo());
        return d;
    }

    @Transactional
    public Booking createBooking(BookingRequestDTO req) {
        // Basic validations (slot times, caretaker existence) left to controller
        // Check for overlapping bookings for the same caretaker
        List<Booking> existing = bookingRepository.findByCaretakerEmail(req.getCaretakerEmail());
        for (Booking b : existing) {
            if (b.getStatus() == null) continue;
            String st = b.getStatus();
            if ("CANCELLED".equals(st) || "REJECTED".equals(st)) continue;
            // overlap: req.start < b.end && req.end > b.start
            if (req.getSlotStart().isBefore(b.getSlotEnd()) && req.getSlotEnd().isAfter(b.getSlotStart())) {
                throw new IllegalStateException("Caretaker already booked for the requested slot");
            }
        }

        Booking booking = new Booking(req.getParentEmail(), req.getChildName(), req.getCaretakerEmail(), req.getCity(), req.getSlotStart(), req.getSlotEnd());
        Booking saved = bookingRepository.save(booking);

        // Notify notification service asynchronously (best effort)
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Booking> payload = new HttpEntity<>(saved, headers);
            restTemplate.postForEntity(notificationUrl, payload, Void.class);
        } catch (Exception e) {
            // swallow - notification failure shouldn't break booking creation
        }

        return saved;
    }
}