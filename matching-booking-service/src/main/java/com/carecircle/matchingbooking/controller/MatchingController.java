package com.carecircle.matchingbooking.controller;

import com.carecircle.matchingbooking.dto.BookingRequestDTO;
import com.carecircle.matchingbooking.dto.CaretakerDTO;
import com.carecircle.matchingbooking.entity.Booking;
import com.carecircle.matchingbooking.entity.Caretaker;
import com.carecircle.matchingbooking.repository.CaretakerRepository;
import com.carecircle.matchingbooking.service.MatchingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MatchingController {

    private final MatchingService matchingService;
    private final CaretakerRepository caretakerRepository;

    public MatchingController(MatchingService matchingService, CaretakerRepository caretakerRepository) {
        this.matchingService = matchingService;
        this.caretakerRepository = caretakerRepository;
    }

    @GetMapping("/match")
    public ResponseEntity<List<CaretakerDTO>> match(
            @RequestParam String city,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime slotStart,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime slotEnd,
            @RequestParam(required = false) String skill
    ) {
        List<CaretakerDTO> results = matchingService.matchCaretakers(city, slotStart, slotEnd, skill);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/book")
    public ResponseEntity<Booking> book(@Valid @RequestBody BookingRequestDTO req) {
        // Basic validation of slot times
        if (req.getSlotStart() == null || req.getSlotEnd() == null || !req.getSlotEnd().isAfter(req.getSlotStart())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Booking saved = matchingService.createBooking(req);
            return ResponseEntity.ok(saved);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).build();
        }
    }

    @PostMapping("/caretakers")
    public ResponseEntity<Caretaker> createCaretaker(@RequestBody CaretakerCreateRequest req) {
        // simple create endpoint for seeding/testing
        Caretaker c = new Caretaker(req.getUserEmail(), req.getFullName(), req.getCity(), req.getSkills(), req.getAvailableFrom(), req.getAvailableTo());
        Caretaker saved = caretakerRepository.save(c);
        return ResponseEntity.ok(saved);
    }

    public static class CaretakerCreateRequest {
        private String userEmail;
        private String fullName;
        private String city;
        private String skills;
        @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
        private LocalTime availableFrom;
        @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
        private LocalTime availableTo;

        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getSkills() { return skills; }
        public void setSkills(String skills) { this.skills = skills; }
        public LocalTime getAvailableFrom() { return availableFrom; }
        public void setAvailableFrom(LocalTime availableFrom) { this.availableFrom = availableFrom; }
        public LocalTime getAvailableTo() { return availableTo; }
        public void setAvailableTo(LocalTime availableTo) { this.availableTo = availableTo; }
    }
}