package com.carecircle.matchingBookingService.caregiver.repository;

import com.carecircle.matchingBookingService.caregiver.model.CaregiverService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CaregiverServiceRepository extends JpaRepository<CaregiverService, UUID> {

    List<CaregiverService> findByCaregiverIdAndActiveTrue(UUID caregiverId);

    List<CaregiverService> findByServiceIdAndActiveTrue(UUID serviceId);

    List<CaregiverService> findByCaregiverId(UUID caregiverId);

    java.util.Optional<CaregiverService> findByCaregiverIdAndServiceId(UUID caregiverId, UUID serviceId);

    // Unified Search Method
    @org.springframework.data.jpa.repository.Query("SELECT s FROM CaregiverService s WHERE " +
            "(:city IS NULL OR s.city = :city) AND " +
            "(:serviceId IS NULL OR s.serviceId = :serviceId) AND " +
            "(:age IS NULL OR (s.minChildAge <= :age AND s.maxChildAge >= :age)) AND " +
            "((:filterByCaregivers = false) OR s.caregiverId IN :caregiverIds) AND " +
            "s.active = true")
    org.springframework.data.domain.Page<CaregiverService> searchServices(
            @org.springframework.data.repository.query.Param("city") String city,
            @org.springframework.data.repository.query.Param("serviceId") UUID serviceId,
            @org.springframework.data.repository.query.Param("age") Integer age,
            @org.springframework.data.repository.query.Param("caregiverIds") List<UUID> caregiverIds,
            @org.springframework.data.repository.query.Param("filterByCaregivers") boolean filterByCaregivers,
            org.springframework.data.domain.Pageable pageable
    );
}
