package com.carecircle.communication.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    public static final String USER_ID_HEADER = "X-User-Id";
    public static final String USER_ID_ATTR = "USER_ID";

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String userIdHeader = accessor.getFirstNativeHeader(USER_ID_HEADER);
            if (userIdHeader == null) {
                userIdHeader = accessor.getFirstNativeHeader(USER_ID_HEADER.toLowerCase());
            }

            System.out.println("WebSocket Connect Headers: " + accessor.toNativeHeaderMap());

            if (userIdHeader == null || userIdHeader.isBlank()) {
                throw new IllegalStateException("Missing X-User-Id header in WebSocket CONNECT. Headers: " + accessor.toNativeHeaderMap());
            }

            UUID userId;
            try {
                userId = UUID.fromString(userIdHeader);
            } catch (IllegalArgumentException e) {
                throw new IllegalStateException("Invalid X-User-Id format: " + userIdHeader);
            }

            // Attach user identity to WebSocket session
            accessor.getSessionAttributes().put(USER_ID_ATTR, userId);
            
            // Set the User Principal for Spring Security / WebSocket Context
            final String principalId = userId.toString();
            accessor.setUser(new java.security.Principal() {
                @Override
                public String getName() {
                    return principalId;
                }
            });
        }

        return message;
    }
}
