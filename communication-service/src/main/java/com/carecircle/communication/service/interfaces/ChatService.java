package com.carecircle.communication.service.interfaces;

import java.util.List;
import java.util.UUID;

import com.carecircle.communication.dto.response.ChatMessageResponse;

public interface ChatService {

    UUID createChatRoom(UUID bookingId);

    void addParticipant(UUID roomId, UUID userId);

    void sendMessage(UUID roomId, UUID senderId, String message);
    
    List<ChatMessageResponse> getRoomMessages(UUID roomId, UUID userId);

}
