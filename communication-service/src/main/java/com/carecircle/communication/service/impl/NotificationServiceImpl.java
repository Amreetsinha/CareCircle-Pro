package com.carecircle.communication.service.impl;

import com.carecircle.communication.controller.websocket.NotificationWebSocketController;
import com.carecircle.communication.model.notification.Notification;
import com.carecircle.communication.model.notification.NotificationType;
import com.carecircle.communication.repository.notification.NotificationRepository;
import com.carecircle.communication.service.interfaces.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationWebSocketController notificationWebSocketController;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            NotificationWebSocketController notificationWebSocketController
    ) {
        this.notificationRepository = notificationRepository;
        this.notificationWebSocketController = notificationWebSocketController;
    }

    /**
     * Create a notification and push it in real-time via WebSocket
     */
    @Override
    public void createNotification(UUID userId, String type, String content) {

        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(NotificationType.valueOf(type));
        notification.setContent(content);

        // 1️⃣ Persist first (source of truth)
        Notification savedNotification = notificationRepository.save(notification);

        // 2️⃣ Push real-time notification
        notificationWebSocketController.sendNotificationToUser(
                userId.toString(),
                savedNotification
        );
    }

    /**
     * Fetch all notifications for a user (REST fallback)
     */
    @Override
    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Mark notification as read (NO WebSocket here)
     */
    @Override
    public void markAsRead(UUID notificationId, UUID userId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new IllegalStateException("Not allowed to modify this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
