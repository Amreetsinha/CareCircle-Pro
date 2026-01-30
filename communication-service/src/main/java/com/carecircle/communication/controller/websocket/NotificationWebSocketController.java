package com.carecircle.communication.controller.websocket;

import com.carecircle.communication.dto.websocket.NotificationWSResponse;
import com.carecircle.communication.model.notification.Notification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationWebSocketController(SimpMessagingTemplate messagingTemplate) {
    	
        this.messagingTemplate = messagingTemplate;
    }

    public void sendNotificationToUser(String userId, Notification notification) {

        NotificationWSResponse response = new NotificationWSResponse();
        response.setId(notification.getId());
        response.setType(notification.getType().name());
        response.setMessage(notification.getContent());
        response.setCreatedAt(notification.getCreatedAt());

        messagingTemplate.convertAndSend(
            "/topic/notifications/" + userId,
            response
        );
    }
}
