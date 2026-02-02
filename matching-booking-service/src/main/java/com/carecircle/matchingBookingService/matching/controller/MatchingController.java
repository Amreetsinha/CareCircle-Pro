package com.carecircle.matchingBookingService.matching.controller;

import com.carecircle.matchingBookingService.caregiver.model.CaregiverService;
import com.carecircle.matchingBookingService.caregiver.repository.CaregiverServiceRepository;
import com.carecircle.matchingBookingService.common.service.UserIntegrationService;
import com.carecircle.matchingBookingService.matching.dto.CaregiverServiceResponse;
import com.carecircle.matchingBookingService.availability.repository.CaregiverAvailabilityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/matching")
public class MatchingController {

    private final  CaregiverAvailabilityRepository availabilityRepository;
    private final  CaregiverServiceRepository caregiverServiceRepository;
    private final UserIntegrationService userService;	
    

    public MatchingController(
            CaregiverServiceRepository caregiverServiceRepository,
            UserIntegrationService userService,
            com.carecircle.matchingBookingService.availability.repository.CaregiverAvailabilityRepository availabilityRepository
    ) {
        this.caregiverServiceRepository = caregiverServiceRepository;
        this.userService = userService;
        this.availabilityRepository = availabilityRepository;
    }

    @PostMapping("/search")
    public ResponseEntity<Page<CaregiverServiceResponse>> searchServices(
            @RequestBody com.carecircle.matchingBookingService.matching.dto.SearchRequest request
    ) {
        String city = request.getCity();
        UUID serviceId = request.getServiceId();
        java.time.LocalDate date = request.getDate();
        java.time.LocalTime startTime = request.getStartTime();
        java.time.LocalTime endTime = request.getEndTime();
        Integer childAge = request.getChildAge();
        int page = request.getPage();
        int limit = request.getLimit();

        Pageable pageable = PageRequest.of(page, limit);

        // 1. Filter by Availability (if Date/Time provided)
        List<UUID> availableCaregiverIds = null;
        boolean filterByCaregivers = false;

        if (date != null && startTime != null && endTime != null) {
            availableCaregiverIds = availabilityRepository.findAvailableCaregiverIds(date, startTime, endTime);
            filterByCaregivers = true;
            
            // If filtering is requested but no one is available, return empty immediately
            if (availableCaregiverIds.isEmpty()) {
                return ResponseEntity.ok(Page.empty(pageable));
            }
        }

        // 2. Filter by Services (City, Service, Age, Caregiver List)
        Page<CaregiverService> entityPage = caregiverServiceRepository.searchServices(
                city, 
                serviceId, 
                childAge, 
                availableCaregiverIds, 
                filterByCaregivers, 
                pageable
        );

        // 3. Enrich with names
        List<UUID> caregiverIds = entityPage.getContent().stream()
                .map(CaregiverService::getCaregiverId)
                .distinct()
                .collect(Collectors.toList());

        Map<UUID, UserIntegrationService.UserSummary> userMap = userService.getUsersInfo(caregiverIds);

        Page<CaregiverServiceResponse> responsePage = entityPage.map(c -> new CaregiverServiceResponse(
                c.getId(),
                c.getCaregiverId(),
                userMap.containsKey(c.getCaregiverId()) ? userMap.get(c.getCaregiverId()).fullName() : "Unknown Caregiver",
                c.getCity(),
                c.getServiceId(),
                c.getExtraPrice(),
                c.getDescription(),
                c.getMinChildAge(),
                c.getMaxChildAge()
        ));

        return ResponseEntity.ok(responsePage);
    }
}
