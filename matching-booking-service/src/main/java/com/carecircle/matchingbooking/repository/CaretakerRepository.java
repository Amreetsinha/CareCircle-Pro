package com.carecircle.matchingbooking.repository;

import com.carecircle.matchingbooking.entity.Caretaker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface CaretakerRepository extends JpaRepository<Caretaker, Long> {

    List<Caretaker> findByCityAndIsActiveTrue(String city);

    @Query("select c from Caretaker c where c.city = :city and c.isActive = true and c.availableFrom <= :start and c.availableTo >= :end")
    List<Caretaker> findAvailableInSlot(@Param("city") String city, @Param("start") LocalTime start, @Param("end") LocalTime end);
}
