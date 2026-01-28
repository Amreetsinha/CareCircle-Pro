package com.carecircle.matchingBookingService.caregiver.api;

import com.carecircle.matchingBookingService.caregiver.api.dto.CreateCaregiverServiceRequest;
import com.carecircle.matchingBookingService.caregiver.model.CaregiverService;
import com.carecircle.matchingBookingService.caregiver.repository.CaregiverServiceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/caregiver/services")
public class CaregiverServiceController {

    private final CaregiverServiceRepository caregiverServiceRepository;

    public CaregiverServiceController(CaregiverServiceRepository caregiverServiceRepository) {
        this.caregiverServiceRepository = caregiverServiceRepository;
    }

    // CAREGIVER ONLY
    @PostMapping
    public CaregiverService addService(
            @RequestHeader("X-User-Id") UUID caregiverId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody CreateCaregiverServiceRequest request
    ) {
        if (!"ROLE_CARETAKER".equals(role)) {
            throw new RuntimeException("Only caregiver can add services");
        }

        CaregiverService caregiverService =
                new CaregiverService(
                        caregiverId,
                        request.getServiceId(),
                        request.getExtraPrice()
                );

        return caregiverServiceRepository.save(caregiverService);
    }

    // CAREGIVER VIEW
    @GetMapping
    public List<CaregiverService> getMyServices(
            @RequestHeader("X-User-Id") UUID caregiverId,
            @RequestHeader("X-User-Role") String role
    ) {
        if (!"ROLE_CARETAKER".equals(role)) {
            throw new RuntimeException("Only caregiver can view services");
        }

        return caregiverServiceRepository.findByCaregiverIdAndActiveTrue(caregiverId);
    }
}
