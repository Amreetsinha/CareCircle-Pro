package com.carecircle.matchingBookingService.booking.api.dto;

public class BookingStatusRequest {
    private String status; // ACCEPTED or REJECTED

    public BookingStatusRequest() {}

    public BookingStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
