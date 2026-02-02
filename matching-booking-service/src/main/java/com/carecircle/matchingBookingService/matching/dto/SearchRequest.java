package com.carecircle.matchingBookingService.matching.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class SearchRequest {
    private String city;
    private UUID serviceId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer childAge;
    
    // Pagination (default to 1st page, 10 items)
    private int page = 0;
    private int limit = 10;

    public SearchRequest() {}

    public SearchRequest(String city, UUID serviceId, LocalDate date, LocalTime startTime, LocalTime endTime, Integer childAge, int page, int limit) {
        this.city = city;
        this.serviceId = serviceId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.childAge = childAge;
        this.page = page;
        this.limit = limit;
    }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public UUID getServiceId() { return serviceId; }
    public void setServiceId(UUID serviceId) { this.serviceId = serviceId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getChildAge() { return childAge; }
    public void setChildAge(Integer childAge) { this.childAge = childAge; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getLimit() { return limit; }
    public void setLimit(int limit) { this.limit = limit; }
}
