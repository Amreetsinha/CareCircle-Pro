package com.carecircle.communication.controller.socket;

import com.carecircle.communication.config.WebSocketAuthInterceptor;
import com.carecircle.communication.dto.socket.ChatMessageSocketResponse;
import com.carecircle.communication.dto.socket.SendChatMessageSocketRequest;
import com.carecircle.communication.service.interfaces.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(
            ChatService chatService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(
            SendChatMessageSocketRequest request,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        UUID senderId = (UUID) headerAccessor
                .getSessionAttributes()
                .get(WebSocketAuthInterceptor.USER_ID_ATTR);

        if (senderId == null) {
            throw new IllegalStateException("Unauthenticated WebSocket session");
        }

        // Persist message & trigger notifications
        chatService.sendMessage(
                request.getRoomId(),
                senderId,
                request.getMessage()
        );

        // Broadcast message to room subscribers
        ChatMessageSocketResponse response = new ChatMessageSocketResponse();
        response.setRoomId(request.getRoomId());
        response.setSenderId(senderId);
        response.setContent(request.getMessage());
        response.setCreatedAt(LocalDateTime.now());

        messagingTemplate.convertAndSend(
                "/topic/rooms/" + request.getRoomId(),
                response
        );
    }
}
