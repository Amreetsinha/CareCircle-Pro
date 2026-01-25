package com.carecircle.communication.dto.request;

import java.util.UUID;

public class CreateChatRoomRequest {

    private UUID bookingId;

    public UUID getBookingId() {
        return bookingId;
    }

    public void setBookingId(UUID bookingId) {
        this.bookingId = bookingId;
    }
}
