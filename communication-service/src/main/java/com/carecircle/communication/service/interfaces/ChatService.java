package com.carecircle.communication.service.interfaces;

import java.util.UUID;

public interface ChatService {

    UUID createChatRoom(UUID bookingId);

    void addParticipant(UUID roomId, UUID userId);

    void sendMessage(UUID roomId, UUID senderId, String message);

}
