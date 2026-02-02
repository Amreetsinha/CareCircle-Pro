package com.carecircle.matchingBookingService.booking.api;

import com.carecircle.matchingBookingService.booking.api.dto.BookingDetailResponse;
import com.carecircle.matchingBookingService.booking.api.dto.CreateBookingRequest;
import com.carecircle.matchingBookingService.booking.model.Booking;
import com.carecircle.matchingBookingService.booking.model.BookingChild;
import com.carecircle.matchingBookingService.booking.repository.BookingChildRepository;
import com.carecircle.matchingBookingService.booking.repository.BookingRepository;
import com.carecircle.matchingBookingService.caregiver.repository.CaregiverServiceRepository;
import com.carecircle.matchingBookingService.service.repository.ServiceRepository;
import com.carecircle.matchingBookingService.common.service.UserIntegrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final BookingChildRepository bookingChildRepository;
    private final CaregiverServiceRepository caregiverServiceRepository;
    private final ServiceRepository serviceRepository;
    private final UserIntegrationService userService;
    private final com.carecircle.matchingBookingService.availability.repository.CaregiverAvailabilityRepository availabilityRepository;

    public BookingController(
            BookingRepository bookingRepository,
            BookingChildRepository bookingChildRepository,
            CaregiverServiceRepository caregiverServiceRepository,
            ServiceRepository serviceRepository,
            UserIntegrationService userService,
            com.carecircle.matchingBookingService.availability.repository.CaregiverAvailabilityRepository availabilityRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.bookingChildRepository = bookingChildRepository;
        this.caregiverServiceRepository = caregiverServiceRepository;
        this.serviceRepository = serviceRepository;
        this.userService = userService;
        this.availabilityRepository = availabilityRepository;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<? extends Object> createBooking(
            @RequestHeader("X-User-Id") String userIdStr,
            @RequestHeader("X-User-Role") String userRole,
            @RequestBody CreateBookingRequest request
    ) {
        if (!"PARENT".equalsIgnoreCase(userRole) && !"ROLE_PARENT".equalsIgnoreCase(userRole)) {
            System.out.println("Role mismatch. Expected PARENT/ROLE_PARENT, got: " + userRole);
            return ResponseEntity.status(403).body("Only PARENTS can make bookings");
        }
        UUID parentId = UUID.fromString(userIdStr);
        
        System.out.println("Creating booking for Parent: " + parentId);
        System.out.println("Processing children: " + (request.getChildren() != null ? request.getChildren().size() : "null"));

        var caregiverService =
                caregiverServiceRepository
                        .findByCaregiverIdAndActiveTrue(request.getCaregiverId())
                        .stream()
                        .filter(cs -> cs.getServiceId().equals(request.getServiceId()))
                        .findFirst()
                        .orElseThrow();

        var service =
                serviceRepository.findById(request.getServiceId()).orElseThrow();

        double pricePerUnit =
                service.getBasePrice() + caregiverService.getExtraPrice();

        int totalUnits;

        if ("HOURLY".equals(request.getBookingType())) {
            totalUnits =
                    (int) ChronoUnit.HOURS.between(
                            request.getStartTime(),
                            request.getEndTime()
                    );
            
            // Validation: Check Availability
            if (request.getStartDate() == null) {
                throw new RuntimeException("Start date is required for hourly bookings");
            }
            
            java.time.LocalDate bookingDate = request.getStartDate();
            List<com.carecircle.matchingBookingService.availability.model.CaregiverAvailability> availabilities = 
                availabilityRepository.findByCaregiverIdAndAvailableDateAndActiveTrue(request.getCaregiverId(), bookingDate);
            
            boolean isAvailable = availabilities.stream().anyMatch(a -> 
                !request.getStartTime().isBefore(a.getStartTime()) && 
                !request.getEndTime().isAfter(a.getEndTime())
            );
            
            if (!isAvailable) {
                throw new RuntimeException("Caregiver is not available during the requested time slot on " + bookingDate);
            }

        } else {
            totalUnits =
                    (int) ChronoUnit.DAYS.between(
                            request.getStartDate(),
                            request.getEndDate()
                    ) + 1;
        }



        Booking booking = bookingRepository.save(new Booking(
                parentId,
                request.getCaregiverId(),
                request.getServiceId(),
                request.getBookingType(),
                pricePerUnit,
                totalUnits,
                pricePerUnit * totalUnits
        ));
        
        // Set time/date based on booking type
        if ("HOURLY".equals(request.getBookingType())) {
            booking.setStartTime(request.getStartTime());
            booking.setEndTime(request.getEndTime());
            booking.setStartDate(request.getStartDate());
            booking.setEndDate(request.getStartDate()); // Same day
        } else {
            booking.setStartDate(request.getStartDate());
            booking.setEndDate(request.getEndDate());
        }
        
        bookingRepository.save(booking);

        request.getChildren().forEach(child ->
                bookingChildRepository.save(
                        new BookingChild(
                                booking.getId(),
                                child.getChildId(),
                                child.getChildName(),
                                child.getAge(),
                                child.getSpecialNeeds()
                        )
                )
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }
    
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable UUID bookingId,
            @RequestBody com.carecircle.matchingBookingService.booking.api.dto.BookingStatusRequest request,
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole
    ) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Basic authorization validation
        if (userId != null && "CAREGIVER".equalsIgnoreCase(userRole)) {
            if (!booking.getCaregiverId().equals(userId)) {
                 throw new RuntimeException("Unauthorized: You can only update your own bookings");
            }
        }

        String newStatus = request.getStatus().toUpperCase();
        
        // Simple state machine
        if ("ACCEPTED".equals(newStatus)) {
            // 1. Check Double Booking
            if ("HOURLY".equals(booking.getBookingType())) {
                 List<Booking> collisions = bookingRepository.findOverlappingBookings(
                         booking.getCaregiverId(), 
                         booking.getStartDate(), 
                         booking.getStartTime(), 
                         booking.getEndTime()
                 );
                 if (!collisions.isEmpty()) {
                      throw new RuntimeException("Double Booking Error: You already have an accepted booking at this time.");
                 }
                 
                 // 2. Adjust Availability
                 updateAvailabilityAfterBooking(booking);
            }
            booking.accept();
        } else if ("REJECTED".equals(newStatus)) {
            booking.reject();
        } else if ("CANCELLED".equals(newStatus)) {
            booking.cancel();
        } else if ("COMPLETED".equals(newStatus)) {
            booking.complete();
        } else {
             throw new RuntimeException("Invalid status: " + newStatus);
        }
        
        Booking updated = bookingRepository.save(booking);
        return ResponseEntity.ok(updated);
    }

    private void updateAvailabilityAfterBooking(Booking booking) {
        // Find availability for this day
        List<com.carecircle.matchingBookingService.availability.model.CaregiverAvailability> slots = 
             availabilityRepository.findByCaregiverIdAndAvailableDateAndActiveTrue(booking.getCaregiverId(), booking.getStartDate());
        
        // Find the slot that contains this booking
        var targetSlotOpt = slots.stream().filter(s -> 
             !booking.getStartTime().isBefore(s.getStartTime()) && 
             !booking.getEndTime().isAfter(s.getEndTime())
        ).findFirst();
        
        if (targetSlotOpt.isPresent()) {
             var slot = targetSlotOpt.get();
             // Calculate time before
             long minutesBefore = java.time.Duration.between(slot.getStartTime(), booking.getStartTime()).toMinutes();
             // Calculate time after
             long minutesAfter = java.time.Duration.between(booking.getEndTime(), slot.getEndTime()).toMinutes();
             
             // Keep the largest chunk
             if (minutesBefore >= minutesAfter) {
                 // Keep the 'before' part -> End time changes to booking start time
                 // Only if it is not 0
                 if (minutesBefore > 0) {
                      slot.setEndTime(booking.getStartTime());
                      availabilityRepository.save(slot);
                 } else {
                      // Whole slot consumed or only 'after' part was smaller (and also 0?)
                      // If minutesBefore is 0, we can't keep it.
                      // If minutesAfter is also small?
                      // Basically if minutesBefore > minutesAfter, we prefer 'before'.
                      // If its 0, then minutesAfter must be negative? No.
                      // If both are 0 (exact match), remove slot.
                      slot.deactivate();
                      availabilityRepository.save(slot);
                 }
             } else {
                 // Keep 'after' part -> Start time changes to booking end time
                 if (minutesAfter > 0) {
                      slot.setStartTime(booking.getEndTime());
                      availabilityRepository.save(slot);
                 } else {
                      slot.deactivate();
                      availabilityRepository.save(slot);
                 }
             }
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingDetailResponse>> getBookings(
            @RequestParam(required = false) UUID caregiverId,
            @RequestParam(required = false) UUID parentId,
            @RequestParam(required = false) List<String> status
    ) {
        List<Booking> bookings;

        // Filter by role/id
        System.out.println("getBookings Request - CaregiverId: " + caregiverId + ", ParentId: " + parentId + ", Status: " + status);
        
        if (caregiverId != null && status != null && !status.isEmpty()) {
            bookings = bookingRepository.findByCaregiverIdAndStatusIn(caregiverId, status);
            System.out.println("Found " + bookings.size() + " bookings for Caregiver + Status");
        } else if (caregiverId != null) {
            bookings = bookingRepository.findByCaregiverId(caregiverId);
             System.out.println("Found " + bookings.size() + " bookings for Caregiver");
        } else if (parentId != null && status != null && !status.isEmpty()) {
             bookings = bookingRepository.findByParentIdAndStatusIn(parentId, status);
             System.out.println("Found " + bookings.size() + " bookings for Parent + Status");
        } else if (parentId != null) {
             bookings = bookingRepository.findByParentId(parentId);
             System.out.println("Found " + bookings.size() + " bookings for Parent");
        } else if (status != null && !status.isEmpty()) {
             // Admin filter by status only
             bookings = bookingRepository.findByStatusIn(status);
             System.out.println("Found " + bookings.size() + " bookings for Admin (Status only)");
        } else {
             // Admin case: Return all bookings if no filter
             bookings = bookingRepository.findAll();
             System.out.println("Found " + bookings.size() + " bookings for Admin (All)");
        }
        
        // Enrich
        var userIds = bookings.stream()
            .flatMap(b -> java.util.stream.Stream.of(b.getParentId(), b.getCaregiverId()))
            .distinct()
            .collect(Collectors.toList());
            
        var userMap = userService.getUsersInfo(userIds);

        List<BookingDetailResponse> response = bookings.stream().map(booking -> {
             var children = bookingChildRepository.findByBookingId(booking.getId())
                .stream()
                .map(child -> new BookingDetailResponse.ChildDetail(
                        child.getChildId(),
                        child.getChildName(),
                        child.getAge(),
                        child.getSpecialNeeds()
                ))
                .collect(Collectors.toList());

            String pName = userMap.containsKey(booking.getParentId()) ? userMap.get(booking.getParentId()).fullName() : "Unknown Parent";
            String cName = userMap.containsKey(booking.getCaregiverId()) ? userMap.get(booking.getCaregiverId()).fullName() : "Unknown Caregiver";
            
            return new BookingDetailResponse(
                    booking.getId(),
                    booking.getParentId(),
                    pName,
                    booking.getCaregiverId(),
                    cName,
                    booking.getServiceId(),
                    booking.getBookingType(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    booking.getStartDate(),
                    booking.getEndDate(),
                    booking.getPricePerUnit(),
                    booking.getTotalUnits(),
                    booking.getFinalPrice(),
                    booking.getStatus(),
                    children,
                    booking.getCreatedAt(),
                    booking.getUpdatedAt()
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDetailResponse> getBooking(
            @PathVariable UUID bookingId
    ) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        var children = bookingChildRepository.findByBookingId(bookingId)
                .stream()
                .map(child -> new BookingDetailResponse.ChildDetail(
                        child.getChildId(),
                        child.getChildName(),
                        child.getAge(),
                        child.getSpecialNeeds()
                ))
                .collect(Collectors.toList());
        
        var userInfo = userService.getUsersInfo(List.of(booking.getParentId(), booking.getCaregiverId()));
        String parentName = userInfo.containsKey(booking.getParentId()) ? userInfo.get(booking.getParentId()).fullName() : "Unknown Parent";
        String caregiverName = userInfo.containsKey(booking.getCaregiverId()) ? userInfo.get(booking.getCaregiverId()).fullName() : "Unknown Caregiver";

        BookingDetailResponse response = new BookingDetailResponse(
                booking.getId(),
                booking.getParentId(),
                parentName,
                booking.getCaregiverId(),
                caregiverName,
                booking.getServiceId(),
                booking.getBookingType(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getPricePerUnit(),
                booking.getTotalUnits(),
                booking.getFinalPrice(),
                booking.getStatus(),
                children,
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
        return ResponseEntity.ok(response);
    }
}
